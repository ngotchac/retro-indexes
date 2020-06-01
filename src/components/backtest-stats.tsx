import React from "react";
import { Row, Col, Card, Statistic } from "antd";

import { Backtest } from "../types";

interface BacktestStatsProps {
	backtest: Backtest;
}

function BacktestStats(props: BacktestStatsProps) {
	const { backtest } = props;

	return (
		<Row gutter={16}>
			<Col>
				<Card>
					<Statistic title="Start Date" value={backtest.dataPoints[0].date.toISOString().slice(0, 7)} />
				</Card>
			</Col>
			<Col>
				<Card>
					<Statistic
						title="End Date"
						value={backtest.dataPoints.slice(-1)[0].date.toISOString().slice(0, 7)}
					/>
				</Card>
			</Col>
			<Col>
				<Card>
					<Statistic
						title="CAGR"
						value={backtest.analysis.cagr * 100}
						precision={2}
						// valueStyle={{ color: "#cf1322" }}
						// prefix={<ArrowDownOutlined />}
						suffix="%"
					/>
				</Card>
			</Col>
			<Col>
				<Card>
					<Statistic
						title="TWRR"
						value={backtest.analysis.twrr * 100}
						precision={2}
						// valueStyle={{ color: "#cf1322" }}
						// prefix={<ArrowDownOutlined />}
						suffix="%"
					/>
				</Card>
			</Col>
			<Col>
				<Card>
					<Statistic
						title="MWRR"
						value={backtest.analysis.mwrr * 100}
						precision={2}
						// valueStyle={{ color: "#cf1322" }}
						// prefix={<ArrowDownOutlined />}
						suffix="%"
					/>
				</Card>
			</Col>
			<Col>
				<Card>
					<Statistic
						title="Stdev"
						value={backtest.analysis.stdev * 100}
						precision={2}
						// valueStyle={{ color: "#cf1322" }}
						// prefix={<ArrowDownOutlined />}
						suffix="%"
					/>
				</Card>
			</Col>
		</Row>
	);
}

export default BacktestStats;
