import { PortfolioDataPoint, PortfolioAnalysis, Portfolio, Backtest } from "../types";

function getCagr(dataPoints: PortfolioDataPoint[]) {
	const first = dataPoints[0];
	const last = dataPoints[dataPoints.length - 1];

	const duration = (last.date.getTime() - first.date.getTime()) / (1_000 * 3600 * 24 * 365.25);

	return (last.value / first.value) ** (1 / duration) - 1;
}

/// Time-Weighted Rate of Return
/// @see https://en.wikipedia.org/wiki/Time-weighted_return
function getTwrr(dataPoints: PortfolioDataPoint[]) {
	const first = dataPoints[0];
	const last = dataPoints[dataPoints.length - 1];

	const duration = (last.date.getTime() - first.date.getTime()) / (1_000 * 3600 * 24 * 365.25);

	let twrr = 1;
	for (let idx = 1; idx < dataPoints.length; idx += 1) {
		const prevPoint = dataPoints[idx - 1];
		const curPoint = dataPoints[idx];
		const hp = (curPoint.value - (prevPoint.value + prevPoint.cashFlow)) / prevPoint.value;

		twrr = twrr * (1 + hp);
	}

	return twrr ** (1 / duration) - 1;
}

/// Modified Dietz method
/// @see https://en.wikipedia.org/wiki/Modified_Dietz_method
function getMdm(dataPoints: PortfolioDataPoint[]) {
	const first = dataPoints[0];
	const last = dataPoints[dataPoints.length - 1];
	const years = (last.date.getTime() - first.date.getTime()) / (1_000 * 3600 * 24 * 365.25);

	const days = (last.date.getTime() - first.date.getTime()) / (1_000 * 3600 * 24);
	const fi = dataPoints.map((p) => p.cashFlow);
	const wi = dataPoints.map(({ date }) => {
		return (last.date.getTime() - date.getTime()) / (1_000 * 3600 * 24) / days;
	});

	const f = fi.reduce((sum, val) => sum + val, 0);
	const w = wi.reduce((sum, val, idx) => sum + val * fi[idx], 0);

	const result = (last.value - first.value - f) / (first.value + w);

	return (result + 1) ** (1 / years) - 1;
}

/// @see https://en.wikipedia.org/wiki/Internal_rate_of_return
function getMwrr(dataPoints: PortfolioDataPoint[]) {
	const N = dataPoints.length - 1;
	const npv = dataPoints[dataPoints.length - 1].value;

	const getNpv = (r: number) => {
		const rVal = dataPoints.reduce((sum, dataPoint, idx) => {
			return sum + dataPoint.cashFlow / (1 + r) ** (idx / 12);
		}, 0);

		return npv / (1 + r) ** (N / 12) - rVal;
	};

	const rs = [0.01, 0];
	const npvs = rs.map((r) => getNpv(r));
	for (let i = 2; i < 200; i += 1) {
		const ri = rs[i - 1] - (npvs[i - 1] * (rs[i - 1] - rs[i - 2])) / (npvs[i - 1] - npvs[i - 2]);
		const npvi = getNpv(ri);

		rs.push(ri);
		npvs.push(npvi);

		if (Math.abs(npvi) < 10 ** -3) {
			break;
		}
	}

	return rs.slice(-1)[0];
}

function getStdev(dataPoints: PortfolioDataPoint[]) {
	const returns = dataPoints.slice(0, -1).map((point, i) => dataPoints[i + 1].value / point.value);
	const avg = returns.reduce((sum, point) => sum + point, 0) / returns.length;
	const stdev =
		Math.sqrt(returns.reduce((sum, point) => sum + (point - avg) ** 2, 0) / (returns.length - 1)) * 12 ** 0.5;
	return stdev;
}

function analyseData(monthlyBuy: PortfolioDataPoint[], singleBuy: PortfolioDataPoint[]): PortfolioAnalysis {
	return {
		cagr: getCagr(monthlyBuy),
		twrr: getTwrr(monthlyBuy),
		mdm: getMdm(monthlyBuy),
		mwrr: getMwrr(monthlyBuy),
		stdev: getStdev(singleBuy),
	};
}

function isSameDay(dateA: Date, dateB: Date) {
	return Math.abs(dateA.getTime() - dateB.getTime()) < 1_000 * 3600 * 24 * 7;
}

function getPortfolioData(portfolio: Portfolio, monthlyIn: number, initialIn: number) {
	const rebalancingMonths = portfolio.rebalancing;
	const startDate = new Date(Math.max(...portfolio.assets.map((a) => a.data[0].date.getTime())));
	const endDate = new Date(Math.min(...portfolio.assets.map((a) => a.data.slice(-1)[0].date.getTime())));

	const assetsPoints = portfolio.assets.map((a) => {
		const startIndex = a.data.findIndex(({ date }) => isSameDay(date, startDate));
		const endIndex = a.data.findIndex(({ date }) => isSameDay(date, endDate));

		// console.log({ startIndex, endIndex, startDate, endDate });

		return a.data.slice(startIndex, endIndex + 1);
	});

	// console.log(portfolio);

	const pointsNum = new Set(assetsPoints.map((v) => v.length));
	if (pointsNum.size !== 1) {
		throw new Error(
			`Failed to run backtest. Assets don't have the same number of points: ${[...pointsNum.values()].join(
				" ; ",
			)}.`,
		);
	}

	console.log(`Running backtest on ${assetsPoints[0].length} points`);

	const wallet = assetsPoints.map(() => 0);
	let monthsUntilRebalancing = rebalancingMonths ? rebalancingMonths : null;
	const dataPoints = assetsPoints[0].map((_, pointIdx) => {
		const cashIn = pointIdx > 0 ? monthlyIn : initialIn;
		// Monthly buy-in
		for (let assetIdx = 0; assetIdx < wallet.length; assetIdx += 1) {
			const assetPrice = assetsPoints[assetIdx][pointIdx].value;
			const assetAlloc = portfolio.assets[assetIdx].allocation;
			const buyinShares = (assetAlloc * cashIn) / assetPrice;

			wallet[assetIdx] += buyinShares;
		}

		// Re-balancing if necessary
		if (monthsUntilRebalancing !== null && rebalancingMonths !== null) {
			if (monthsUntilRebalancing === 0) {
				const totalValue = wallet
					.map((assetShare, assetIdx) => {
						return assetShare * assetsPoints[assetIdx][pointIdx].value;
					})
					.reduce((sum, val) => sum + val, 0);

				for (let assetIdx = 0; assetIdx < wallet.length; assetIdx += 1) {
					const assetPrice = assetsPoints[assetIdx][pointIdx].value;

					const targetAssetRatio = portfolio.assets[assetIdx].allocation;
					const targetAssetShare = (targetAssetRatio * totalValue) / assetPrice;
					wallet[assetIdx] = targetAssetShare;
				}
				monthsUntilRebalancing = rebalancingMonths;
			}
			monthsUntilRebalancing -= 1;
		}

		// Get total value
		const assetValues = wallet.map((assetShare, assetIdx) => {
			return assetShare * assetsPoints[assetIdx][pointIdx].value;
		});
		const value = assetValues.reduce((sum, val) => sum + val, 0);

		const dataPoint: PortfolioDataPoint = {
			date: assetsPoints[0][pointIdx].date,
			assetValues,
			value,
			cashFlow: cashIn,
		};

		return dataPoint;
	});

	return dataPoints;
}

export function runBacktest(portfolio: Portfolio): Backtest {
	const monthlyBuy = getPortfolioData(portfolio, 100, 100);
	const singleBuy = getPortfolioData(portfolio, 0, 100);

	const analysis = analyseData(monthlyBuy, singleBuy);
	return {
		dataPoints: monthlyBuy,
		analysis,
	};
}
