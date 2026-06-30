export interface InstrumentItem {
  // Basic Information
  instrumentId: number;
  symbol: string;
  displayName: string;
  assetClass: string;
  exchangeName: string;
  countryCode: string;
  industryName: string;
  sectorName: string;
  umbrellaSector: string;

  // Valuation Metrics
  currentRate: number;
  marketCap: number;
  peRatio: number;
  beta: number;
  dividendYieldFiscal: number;

  // Company Information
  ceo: string;
  numberOfEmployees: number;
  companyFoundedDate: string;

  // ETF Specific Fields
  isETFLeveraged: boolean;
  etfLeverage: number;
  netExpenseRatio: number;
  prospectusLink: string;
  inceptionDate: string;

  // Cryptocurrency Specific Fields
  cryptoMarketCap: number;
  cryptoMarketCapRank: number;
  percentOfCryptoMarketCap: number;
  cryptoCirculatingSupply: number;
  cryptoMaxSupply: number;
  cryptoTotalSupply: number;
  cryptoWebsite: string;
  cryptoWhitePaper: string;

  // Financial Performance Metrics
  salesOrRevenue: number;
  consolidatedNetIncome: number;
  epsTTM: number;
  epsAnnual: number;
  quarterlyEpsValue: number;
  quarterlySalesValue: number;
  ebitda: number;

  // Dividend Information
  dividendRate: number;
  dividendsPerShare: number;

  // Profitability Margins
  grossIncomeMargin: number;
  operatingMargin: number;
  netProfitMargin: number;
  fiveYearAverageNetProfitMargin: number;

  // Share & Equity Metrics
  sharesOutstanding: number;
  totalEnterpriseValue: number;

  // Debt & Liquidity Ratios
  longTermDebtToEquityRatio: number;
  totalDebtToEquityRatio: number;
  quickRatio: number;
  currentRatio: number;

  // Cash Flow Metrics
  netOperatingCashFlow: number;
  cashFlowPerShare: number;
  cashFlowFromOperPerShareNet: number;

  // Growth & Efficiency Metrics
  revenuePerShare: number;
  oneYearAnnualRevenueGrowthRate: number;
  fiveYearAverageReturnOnInvestedCapital: number;

  // Valuation Ratios
  enterpriseValueToEbitda: number;
  enterpriseValueToSales: number;
  enterpriseValueToOperCashFlow: number;

  // Earnings Information
  nextEarningDate: string;
  nextEarningsDateQuarter: string;
}

export interface InstrumentsData {
  page: number;
  pageSize: number;
  totalItems: number;
  lastUpdateTime: string;
  items: InstrumentItem[];
}
