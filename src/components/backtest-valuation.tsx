import React from "react";
import Highcharts from "react-highcharts";
import Highstock from "react-highcharts/ReactHighstock";

import { Backtest } from "../types";

interface BacktestValuationProps {
	backtest: Backtest;
}

function BacktestValuation(props: BacktestValuationProps) {
	const { backtest } = props;

	const chartOptions: Highcharts.Options = {
		series: [
			{
				name: "Portfolio Valuation",
				type: "line",
				data: backtest.dataPoints.map(({ date, value }) => [date.getTime(), value]),
			},
		],
		tooltip: {
			valueDecimals: 2,
		},
		credits: {
			enabled: false,
		},
	};

	return <Highstock config={chartOptions} />;
}

export default BacktestValuation;
