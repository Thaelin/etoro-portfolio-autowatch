import { app, HttpRequest, HttpResponse, InvocationContext } from "@azure/functions";
import * as df from "durable-functions";
import { OrchestrationContext, OrchestrationHandler } from "durable-functions";
import { randomUUID } from "crypto";

import { PortfolioData } from "../model/portfolioData";
import { InstrumentsData } from "../model/instrumentsData";
import { SecretsService } from "../secrets/secretsService";



const keyVaultUrl = process.env.KEY_VAULT_URL;
const etoroApiKeySecretName = process.env.ETORO_API_KEY_SECRET_NAME ?? "etoro-api-key";
const etoroUserKeySecretName = process.env.ETORO_USER_KEY_SECRET_NAME ?? "etoro-user-key";

if (!keyVaultUrl) {
    throw new Error("Missing KEY_VAULT_URL environment variable.");
}

df.app.activity("fetchPortfolioData", {
    handler: async (): Promise<PortfolioData> => {
        const secretsService = SecretsService.instance;
        const apiKey = await secretsService.getSecret(etoroApiKeySecretName);
        const userKey = await secretsService.getSecret(etoroUserKeySecretName);

        const response = await fetch("https://public-api.etoro.com/api/v1/trading/info/portfolio", {
            method: "GET",
            headers: {
                "x-request-id": randomUUID(),
                "x-api-key": apiKey,
                "x-user-key": userKey
            }
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to fetch portfolio data: ${response.status} ${response.statusText}. Body: ${errorBody}`);
        }

        return (await response.json()) as PortfolioData;
    }
});

df.app.activity("fetchInstrumentsData", {
    handler: async (instrumentIds: number[]): Promise<InstrumentsData> => {
        const secretsService = SecretsService.instance;
        const apiKey = await secretsService.getSecret(etoroApiKeySecretName);
        const userKey = await secretsService.getSecret(etoroUserKeySecretName);

        const instrumentIdParam = instrumentIds.join(",");
        const url = `https://public-api.etoro.com/api/v1/instruments/discover?page=1&pageSize=${instrumentIds.length}&instrumentId=123`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-request-id": randomUUID(),
                "x-api-key": apiKey,
                "x-user-key": userKey
            }
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to fetch instruments data: ${response.status} ${response.statusText}. Body: ${errorBody}`);
        }

        return (await response.json()) as InstrumentsData;
    }
});

const chainingOrchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
  const portfolioData: PortfolioData = yield context.df.callActivity("fetchPortfolioData");
  const uniqueInstruments = Array.from(new Set(portfolioData.clientPortfolio.positions.map(position => position.instrumentID)));
  
  const instrumentsData: InstrumentsData = yield context.df.callActivity("fetchInstrumentsData", uniqueInstruments);

  console.log(instrumentsData, portfolioData);
  
  return null;
};
df.app.orchestration("chainingOrchestration", chainingOrchestrator);

app.http("triggerOrchestration", {
    methods: ["POST"],
    authLevel: "anonymous",
    extraInputs: [df.input.durableClient()],
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponse> => {
        const client = df.getClient(context);
        const instanceId = await client.startNew("chainingOrchestration");
        context.log(`Started chaining orchestration with ID = '${instanceId}'.`);
        return client.createCheckStatusResponse(request, instanceId);
    },
});

