declare module "react-highcharts/ReactHighstock" {
	import * as Highcharts from "highcharts";
	import * as React from "react";

	/**
	 * Props for ReactHighcharts component.
	 */
	interface ReactHighstockProps {
		/**
		 * Highcharts configuration options.
		 */
		config: Highcharts.Options;
		/**
		 *
		 * @param after-render callback.
		 */
		callback?(chart: Highcharts.ChartObject): void;

		/**
		 * Chart will not rerender if the config is referentially equal to previous and this property is true
		 */
		isPureConfig?: boolean;
	}

	/**
	 * React interface for highcharts.
	 */
	declare class ReactHighstock extends React.Component<ReactHighstockProps> {
		static Highcharts: Highcharts.Static;
	}

	export default ReactHighstock;
}
