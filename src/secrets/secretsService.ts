import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

export class SecretsService {

    static #instance: SecretsService;
    readonly _keyVaultClient: SecretClient;
    readonly _allowedKeys = ['etoro-api-key', 'etoro-user-key'];
    _keys: { [key: string]: string | undefined } = {};

    private constructor() {
        if (!process.env.KEY_VAULT_URL) {
            throw new Error("Missing KEY_VAULT_URL environment variable.");
        }
        this._keyVaultClient = new SecretClient(process.env.KEY_VAULT_URL, new DefaultAzureCredential());
    }

    public static get instance(): SecretsService {
        if (!SecretsService.#instance) {
            SecretsService.#instance = new SecretsService();
        }

        return SecretsService.#instance;
    }

    public async getSecret(secretName: string): Promise<string> {
        if (!this._allowedKeys.includes(secretName)) {
            throw new Error(`Access to secret '${secretName}' is not allowed.`);
        }

        if (!this._keys[secretName]) {
            let secret = await this._keyVaultClient.getSecret(secretName);
            if (!secret.value) {
                throw new Error(`Secret '${secretName}' was found in Key Vault but has no value.`);
            }
            this._keys[secretName] = secret.value;
        }

        return this._keys[secretName];
    }

}