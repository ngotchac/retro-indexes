import React from "react";
import Highcharts from "react-highcharts";

import { Backtest } from "../types";

interface BacktestDriftProps {
	backtest: Backtest;
}

function BacktestDrift(props: BacktestDriftProps) {
	const { backtest } = props;

	const chartOptions: Highcharts.Options = {
		chart: {
			type: "area",
		},
		xAxis: {
			categories: backtest.dataPoints.map(({ date }) => date.toISOString().slice(0, 7)),
			tickmarkPlacement: "on",
			title: {
				// enabled: false,
			},
		},

		yAxis: {
			labels: {
				format: "{value}%",
			},
			title: {
				// enabled: false,
			},
		},

		tooltip: {
			pointFormat:
				'<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> (${point.y:,.2f})<br/>',
			split: true,
		},

		plotOptions: {
			area: {
				stacking: "percent",
				lineColor: "#ffffff",
				lineWidth: 1,
				marker: {
					lineWidth: 1,
					lineColor: "#ffffff",
				},
				accessibility: {
					pointDescriptionFormatter: function (point) {
						function round(x: number) {
							return Math.round(x * 100) / 100;
						}
						return (
							point.index +
							1 +
							", " +
							point.category +
							", " +
							point.y +
							" millions, " +
							round(point.percentage || 0) +
							"%, " +
							point.series.name
						);
					},
				},
			},
		},
		series: backtest.dataPoints[0].assetValues.map((_, idx) => ({
			name: `Asset ${idx + 1}`,
			data: backtest.dataPoints.map(({ assetValues }) => assetValues[idx]),
			type: "area",
		})),
		credits: {
			enabled: false,
		},
	};

	return <Highcharts config={chartOptions} />;
}

export default BacktestDrift;
