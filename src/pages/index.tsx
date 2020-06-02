import React, { useState } from "react";
import { Tabs, Divider, Typography } from "antd";

import BacktestDrift from "../components/backtest-drift";
import BacktestRolling from "../components/backtest-rolling";
import BacktestStats from "../components/backtest-stats";
import BacktestValuation from "../components/backtest-valuation";
import PortfolioForm from "../components/portfolio-form";

import { Portfolio, Backtest } from "../types";
import { runBacktest } from "../backtest";

export default function Home() {
	const [backtest, setBacktest] = useState<null | Backtest>(null);
	const [portfolio, setPortfolio] = useState<null | Portfolio>(null);

	const handleSetPortfolio = (portfolio: Portfolio | null) => {
		if (portfolio) {
			setPortfolio(portfolio);
			const startedAt = Date.now();
			const backtest = runBacktest(portfolio);
			console.log("Ran backtest in", Date.now() - startedAt, "ms");
			setBacktest(backtest);
		} else {
			setPortfolio(null);
			setBacktest(null);
		}
	};

	return (
		<div>
			<Typography.Title level={3}>Portfolio Backtest</Typography.Title>
			<p>
				This tool allows you to create a portfolio of indexes, bonds or cash, from different country, and
				analyse the result of such an investment over the available data period.
			</p>
			<p>
				For example, we have data for the S&P 500 index going back to 1927 and for the <i>Livret A</i> (French
				safe-cash account) back to 1818!
			</p>
			<p>By default, this backtests a monthly allocation in the given portfolio, with a rebalancing option.</p>
			<p>
				It can also backtest the average return over a fixed investment period, to see what would have been the
				return of such an investment.
			</p>
			<PortfolioForm onSetPortfolio={handleSetPortfolio} />

			{backtest && portfolio && (
				<>
					<BacktestStats backtest={backtest} />
					<Divider />
					<Tabs animated={false}>
						<Tabs.TabPane tab="Portfolio Evolution" key="evolution">
							<BacktestValuation backtest={backtest} />
						</Tabs.TabPane>
						{backtest.dataPoints[0].assetValues.length > 1 && (
							<Tabs.TabPane tab="Portfolio Drift" key="drift">
								<BacktestDrift backtest={backtest} />
							</Tabs.TabPane>
						)}
						{backtest.rollingData && (
							<Tabs.TabPane tab="Portfolio Rolling Returns" key="rolling">
								<BacktestRolling
									backtest={backtest}
									rolling={backtest.rollingData}
									portfolio={portfolio}
								/>
							</Tabs.TabPane>
						)}
					</Tabs>
				</>
			)}
		</div>
	);
}
