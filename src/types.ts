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
	startDate?: Date;
	endDate?: Date;
}

export interface PortfolioDataPoint {
	date: Date;
	value: number;
	assetValues: number[];
	cashFlow: number;
}

export interface PortfolioAnalysis {
	cagr: number;
	// mdm: number;
	// Only set on monthly contributions
	twrr?: number;
	// Only set on monthly contributions
	mwrr?: number;
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
