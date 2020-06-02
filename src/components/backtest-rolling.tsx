import React from "react";
import Highstock from "react-highcharts/ReactHighstock";
import moment from "moment";

import { Backtest, RollingBacktestData, Portfolio } from "../types";
import { Statistic } from "antd";

interface BacktestRollingProps {
	backtest: Backtest;
	rolling: RollingBacktestData;
	portfolio: Portfolio;
}

function BacktestRolling(props: BacktestRollingProps) {
	const duration = props.portfolio.investmentDuration || 0;
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
			split: true,
			formatter: function () {
				const startDate = moment(this.x as number);
				const endDate = startDate.clone().year(startDate.year() + duration);

				const points = this.points || [];
				const tooltipArray = [`From ${startDate.format("MMM YYYY")} to ${endDate.format("MMM YYYY")}`];

				points.forEach((point) => {
					tooltipArray.push("MWRR: <b>" + Math.round(100 * point.y) / 100 + "%</b>");
				});

				return tooltipArray;
			},
		},
		credits: {
			enabled: false,
		},
	};

	return (
		<>
			<p>
				This shows what would have been the returns of a monthly contribution to the given portfolio, over{" "}
				{props.portfolio.rebalancing || 0} years.
			</p>
			<p>The x-axis on the following graph is the invesestment start-date.</p>
			<Statistic title="Average MWRR" precision={2} suffix="%" value={avgMwrr * 100} />
			<Highstock config={chartOptions} />
		</>
	);
}

export default BacktestRolling;
