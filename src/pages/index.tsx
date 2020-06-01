import React, { useState } from "react";
import { Tabs, Divider } from "antd";

import PortfolioForm from "../components/portfolio-form";
import BacktestStats from "../components/backtest-stats";
import BacktestValuation from "../components/backtest-valuation";
import BacktestDrift from "../components/backtest-drift";

import { Portfolio, Backtest } from "../types";
import { runBacktest } from "../backtest";

export default function Home() {
	const [backtest, setBacktest] = useState<null | Backtest>();

	const handleSetPortfolio = (portfolio: Portfolio | null) => {
		if (portfolio) {
			const startedAt = Date.now();
			const backtest = runBacktest(portfolio);
			console.log("Ran backtest in", (Date.now() - startedAt), "ms");
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
					</Tabs>
				</>
			)}

			{/* {backtest && (
				<Table
					columns={[
						{ title: "Year", dataIndex: "year", key: "year" },
						{ title: "Month", dataIndex: "month", key: "month" },
						{ title: "Value", dataIndex: "value", key: "value" },
						{ title: "Cash Flow", dataIndex: "cashFlow", key: "cashFlow" },
					]}
					dataSource={backtest.dataPoints.map((point) => ({
						key: point.date.getTime().toString(),
						year: point.date.getFullYear(),
						month: point.date.getMonth() + 1,
						value: Math.round(point.value * 100) / 100,
						cashFlow: point.cashFlow,
					}))}
				/>
			)} */}
		</div>
	);
}
