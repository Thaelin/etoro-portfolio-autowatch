
export interface PortfolioPosition {
    positionID: number;
    CID: number;
    instrumentID: number;
    openDateTime: string;

    isBuy: boolean;
    leverage: number;
    orderType: number;

    openRate: number;
    openConversionRate: number;

    amount: number;
    initialAmountInDollars: number;
    units: number;
    initialUnits: number;
    lotCount: number;
    unitsBaseValueDollars: number;

    takeProfitRate: number;
    stopLossRate: number;
    isNoTakeProfit: boolean;
    isNoStopLoss: boolean;
    isTslEnabled: boolean;
    stopLossVersion: number;

    totalFees: number;
    totalExternalFees: number;
    totalExternalTaxes: number;

    orderID: number;
    mirrorID: number;
    parentPositionID: number;

    isSettled: boolean;
    settlementTypeID: number;
    redeemStatusID: number;
    pnlVersion: number;
    openPositionActionType: number;

    isPartiallyAltered: boolean;
    isDiscounted: boolean;
    isDetached: boolean;

    [key: string]: unknown;
}

export interface ClientPortfolio {
    positions: PortfolioPosition[];
    mirrors: unknown[];
    orders: unknown[];
    stockOrders: unknown[];
    entryOrders: unknown[];
    exitOrders: unknown[];
    ordersForOpen: unknown[];
    ordersForClose: unknown[];
    ordersForCloseMultiple: unknown[];
    credit: number;
    bonusCredit: number;
    [key: string]: unknown;
}

export interface PortfolioData {
    clientPortfolio: ClientPortfolio;
    [key: string]: unknown;
}