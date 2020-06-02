import React from "react";
import { Row, Col, Card, Statistic, Tooltip, Popover } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import { Backtest } from "../types";

interface BacktestStatsProps {
	backtest: Backtest;
}

interface MoreInfoProps {
	title: string;
	summary: string;
	link: string;
}

function MoreInfo(props: MoreInfoProps) {
	return (
		<Popover
			title={props.title}
			trigger="hover"
			content={
				<div style={{ maxWidth: "20em" }}>
					<p>{props.summary}</p>
					<p>
						See{" "}
						<a target="_blank" rel="noreferrer" href={props.link}>
							here
						</a>{" "}
						for more details
					</p>
				</div>
			}
		>
			<QuestionCircleOutlined />
		</Popover>
	);
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
						title={
							<>
								<MoreInfo
									title="Compound Annual Growth Rate"
									summary="Compound annual growth rate (CAGR) is the rate of return that would be required for an investment to grow from its beginning balance to its ending balance, assuming the profits were reinvested at the end of each year of the investment’s lifespan."
									link="https://www.investopedia.com/terms/c/cagr.asp"
								/>
								{"  "}CAGR
							</>
						}
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
						title={
							<>
								<MoreInfo
									title="Time-Weighted Rate of Return"
									summary="The time-weighted rate of return (TWR) is a measure of the compound rate of growth in a portfolio."
									link="https://www.investopedia.com/terms/t/time-weightedror.asp"
								/>
								{"  "}TWR
							</>
						}
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
						title={
							<>
								<MoreInfo
									title="Money-Weighted Rate of Return"
									summary="Money-weighted rate of return is a measure of the performance of an investment."
									link="https://www.investopedia.com/terms/m/money-weighted-return.asp"
								/>
								{"  "}MWRR
							</>
						}
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
						title={
							<>
								<MoreInfo
									title="Standard Deviation"
									summary="Standard deviation is a statistical measurement in finance that sheds light on the historical volatility of that investment."
									link="https://www.investopedia.com/terms/s/standarddeviation.asp"
								/>
								{"  "}Stdev
							</>
						}
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
