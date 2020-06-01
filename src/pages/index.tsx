import React, { useState } from "react";
import { Tabs, Divider } from "antd";

import BacktestDrift from "../components/backtest-drift";
import BacktestRolling from "../components/backtest-rolling";
import BacktestStats from "../components/backtest-stats";
import BacktestValuation from "../components/backtest-valuation";
import PortfolioForm from "../components/portfolio-form";

import { Portfolio, Backtest } from "../types";
import { runBacktest } from "../backtest";

export default function Home() {
	const [backtest, setBacktest] = useState<null | Backtest>();

	const handleSetPortfolio = (portfolio: Portfolio | null) => {
		if (portfolio) {
			const startedAt = Date.now();
			const backtest = runBacktest(portfolio);
			console.log("Ran backtest in", Date.now() - startedAt, "ms");
			setBacktest(backtest);
		} else {
			setBacktest(null);
		}
	};

	return (
		<div>
			<p>Build a portfolio of indexes, and backtest it</p>
			<PortfolioForm onSetPortfolio={handleSetPortfolio} />

			{backtest && (
				<>
					<BacktestStats backtest={backtest} />
					<Divider />
					<Tabs animated={false}>
						<Tabs.TabPane tab="Portfolio Evolution" key="evolution">
							<BacktestValuation backtest={backtest} />
						</Tabs.TabPane>
						<Tabs.TabPane tab="Portfolio Drift" key="drift">
							<BacktestDrift backtest={backtest} />
						</Tabs.TabPane>
						{backtest.rollingData && (
							<Tabs.TabPane tab="Portfolio Rolling Returns" key="rolling">
								<BacktestRolling backtest={backtest} rolling={backtest.rollingData} />
							</Tabs.TabPane>
						)}
					</Tabs>
				</>
			)}
		</div>
	);
}
