export interface IndexDataPoint {
	date: Date;
	value: number;
}

export type IndexData = IndexDataPoint[];

export interface PortfolioAsset {
	allocation: number;
	fee: number;
	data: IndexData;
}

export interface Portfolio {
	assets: PortfolioAsset[];
	rebalancing: number | null;
	investmentDuration: number | null;
	initialCash: number;
	monthlyCash: number;
}

export interface PortfolioDataPoint {
	date: Date;
	value: number;
	assetValues: number[];
	cashFlow: number;
}

export interface PortfolioAnalysis {
	cagr: number;
	twrr: number;
	mdm: number;
	mwrr: number;
	stdev: number;
}

export interface RollingBacktestDataPoint {
	startDate: Date;
	endDate: Date;
	mwrr: number;
}

export type RollingBacktestData = RollingBacktestDataPoint[];

export interface Backtest {
	dataPoints: PortfolioDataPoint[];
	analysis: PortfolioAnalysis;
	rollingData?: RollingBacktestData;
}
