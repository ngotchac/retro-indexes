import React from "react";
import Highcharts from "react-highcharts";
import Highstock from "react-highcharts/ReactHighstock";

import { Backtest, RollingBacktestData } from "../types";
import { Statistic } from "antd";

interface BacktestRollingProps {
	backtest: Backtest;
	rolling: RollingBacktestData;
}

function BacktestRolling(props: BacktestRollingProps) {
	const { backtest } = props;

	const avgMwrr = props.rolling.reduce((sum, val) => sum + val.mwrr, 0) / props.rolling.length;

	const chartOptions: Highcharts.Options = {
		series: [
			{
				name: "Portfolio Returns",
				type: "line",
				data: props.rolling.map(({ startDate, mwrr }) => [startDate.getTime(), mwrr * 100]),
			},
		],
		tooltip: {
			valueDecimals: 2,
		},
		credits: {
			enabled: false,
		},
	};

	return (
		<>
			<Statistic title="Average MWRR" precision={2} suffix="%" value={avgMwrr * 100} />
			<Highstock config={chartOptions} />
		</>
	);
}

export default BacktestRolling;
