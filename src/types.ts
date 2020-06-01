export interface IndexDataPoint {
	date: Date;
	value: number;
}

export type IndexData = IndexDataPoint[];

export interface PortfolioAsset {
	allocation: number;
	data: IndexData;
}

export interface Portfolio {
	assets: PortfolioAsset[];
	rebalancing: number | null;
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

export interface Backtest {
	dataPoints: PortfolioDataPoint[];
	analysis: PortfolioAnalysis;
}
