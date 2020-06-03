import React, { useState } from "react";
import { Typography, Form, Button, Row, Col, Cascader, Input, Slider, InputNumber, DatePicker } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Store } from "antd/lib/form/interface";
import { ShowSearchType, CascaderOptionType } from "antd/lib/cascader";
import { Moment } from "moment";

import { fetchIndexData } from "../api";
import { PortfolioAsset, Portfolio } from "../types";

export interface PortfolioFormProps {
	onSetPortfolio: (portfolio: Portfolio | null) => void;
}

const assetsOptions: CascaderOptionType[] = [
	{
		value: "msci",
		label: "MSCI Indexes",
		children: [
			{
				value: "msci.world",
				label: "MSCI World",
			},
			{
				value: "msci.em",
				label: "MSCI Emerging Market",
			},
			{
				value: "msci.world-small-cap",
				label: "MSCI World Small Cap",
			},
			{
				value: "msci.eu-small-cap",
				label: "MSCI EU Small Cap",
			},
			{
				value: "msci.us-small-cap",
				label: "MSCI US Small Cap",
			},
		],
	},
	{
		value: "stocks",
		label: "Stocks",
		children: [
			{
				value: "sp500",
				label: "S&P 500",
			},
			{
				value: "nasdaq",
				label: "NASDAQ Composite",
			},
			{
				value: "NAESX",
				label: "Vanguard Small Cap Index (NAESX)",
			},
		],
	},
	{
		value: "bonds",
		label: "Bonds Indexes",
		children: [
			{
				value: "VBMFX",
				label: "Vanguard Total Bond Market (VBMFX)",
			},
		],
	},
	{
		value: "cash",
		label: "Cash",
		children: [
			{
				value: "livret-a",
				label: "Livret A (FR)",
			},
			{
				value: "fonds-euros",
				label: "Fonds Euros (FR)",
			},
			{
				value: "TB3MS",
				label: "90-days T-Bills (US)",
			},
		],
	},
];

const assetFilter: ShowSearchType["filter"] = (inputValue, path) => {
	const lcValue = inputValue.toLowerCase();
	return path.some((option) => {
		return (option.label as string).toLowerCase().indexOf(lcValue) > -1;
	});
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNumber(val: any): val is number {
	return Number.isFinite(parseInt(val));
}

function PortfolioForm(props: PortfolioFormProps) {
	const [formError, setFormError] = useState<null | string>(null);
	const [isLoading, setIsLoading] = useState(false);

	const onFinish = async (values: Store) => {
		const data = values as {
			assets?: {
				allocation?: string;
				fee?: string;
				asset?: string[];
			}[];
			rebalancing: number;
			investmentDuration: number;
			monthlyCash: number;
			dateRange?: [Moment, Moment];
		};

		console.log("Form data", data);
		console.log(data.dateRange);

		const portfolioAssets = (data.assets || [])
			.map((asset) => {
				if (!asset.asset || !isNumber(asset.allocation)) {
					return null;
				}

				return {
					index: asset.asset.slice(-1)[0],
					allocation: parseInt(asset.allocation) / 100,
					fee: isNumber(asset.fee) ? parseFloat(asset.fee) / 100 : 0,
				};
			})
			.filter((v) => v !== null) as { index: string; allocation: number; fee: number }[];

		const sumAllocations = portfolioAssets.reduce((sum, { allocation }) => sum + allocation, 0);

		if (sumAllocations !== 1) {
			setFormError("The sum of allocations should be 100%");
		} else {
			setFormError(null);
			setIsLoading(true);
			props.onSetPortfolio(null);

			try {
				console.log("Fetching portfolio", portfolioAssets);
				const assets = await Promise.all(
					portfolioAssets.map(async ({ index, allocation, fee }) => {
						const indexData = await fetchIndexData(index);
						const asset: PortfolioAsset = {
							allocation,
							fee,
							data: indexData,
						};

						return asset;
					}),
				);

				const portfolio: Portfolio = {
					assets,
					rebalancing: data.rebalancing > 0 ? data.rebalancing : null,
					investmentDuration: data.investmentDuration > 0 ? data.investmentDuration : null,
					initialCash: data.monthlyCash || 100,
					monthlyCash: data.monthlyCash,

					startDate: data.dateRange ? data.dateRange[0].month(0).toDate() : undefined,
					endDate: data.dateRange ? data.dateRange[1].month(11).toDate() : undefined,
				};

				props.onSetPortfolio(portfolio);
			} catch (error) {
				console.error(error);
				setFormError(error.message);
			}

			setIsLoading(false);
		}
	};

	return (
		<div>
			<Form onFinish={onFinish} layout="vertical">
				<Typography.Title level={4}>Assets</Typography.Title>
				<Form.List name="assets">
					{(fields, { add, remove }) => {
						return (
							<div>
								{fields.map((field, index) => (
									<Form.Item
										label={`Asset ${index + 1}`}
										required={true}
										key={field.key}
										validateStatus={formError !== null ? "error" : undefined}
										help={formError}
									>
										<Row gutter={8}>
											<Col flex={1}>
												<Form.Item
													{...field}
													name={[field.name, "asset"]}
													fieldKey={([field.fieldKey, "asset"] as unknown) as number}
													noStyle
													rules={[{ required: true, message: "Select a valid index" }]}
													validateTrigger={["onChange", "onBlur"]}
												>
													<Cascader
														options={assetsOptions}
														// onChange={onChange}
														placeholder="Please select an asset"
														showSearch={{ filter: assetFilter }}
													/>
												</Form.Item>
											</Col>
											<Col>
												<Form.Item
													{...field}
													name={[field.name, "allocation"]}
													fieldKey={([field.fieldKey, "allocation"] as unknown) as number}
													noStyle
													rules={[
														{
															required: true,
															message: "Select a valid allocation",
														},
													]}
													validateTrigger={["onChange", "onBlur"]}
												>
													<Input
														min={0}
														max={100}
														type="number"
														style={{ width: "8em" }}
														addonAfter="%"
													/>
												</Form.Item>
											</Col>
											<Col>
												<Form.Item
													{...field}
													name={[field.name, "fee"]}
													fieldKey={([field.fieldKey, "fee"] as unknown) as number}
													noStyle
												>
													<Input
														min={0}
														max={100}
														type="number"
														style={{ width: "12em" }}
														addonBefore="Fee"
														addonAfter="%"
														step={0.01}
													/>
												</Form.Item>
											</Col>
											<Col style={{ display: "flex", alignItems: "center" }}>
												{fields.length > 1 ? (
													<MinusCircleOutlined
														style={{ margin: "0 8px" }}
														onClick={() => {
															remove(field.name);
														}}
													/>
												) : null}
											</Col>
										</Row>
									</Form.Item>
								))}

								<Form.Item>
									<Button
										type="dashed"
										onClick={() => {
											add({
												allocation: 100,
												fee: 0.3,
											});
										}}
									>
										<PlusOutlined /> Add asset
									</Button>
								</Form.Item>
							</div>
						);
					}}
				</Form.List>

				<Typography.Title level={4}>Options</Typography.Title>

				<Form.Item name="dateRange" label="Start and end date">
					<DatePicker.RangePicker picker="year" />
				</Form.Item>

				<Form.Item
					name="monthlyCash"
					label="Monthly contribution"
					initialValue={1_000}
					rules={[
						{
							required: true,
							message: "Select a motnhly contribution",
						},
					]}
				>
					<InputNumber
						formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						parser={(value) => (value || "").replace(/\$\s?|(,*)/g, "")}
					/>
				</Form.Item>

				<Form.Item name="rebalancing" label="Rebalancing (in months)">
					<Slider
						min={0}
						max={12}
						marks={{
							0: "Never",
							1: "Monthly",
							3: "Quarterly",
							6: "Semi-Annually",
							12: "Annually",
						}}
						style={{ maxWidth: "min(90%, 50em)", marginLeft: "3em" }}
					/>
				</Form.Item>
				<Form.Item name="investmentDuration" label="Investment duration">
					<Slider
						min={0}
						max={20}
						marks={{
							0: "Disabled",
							3: "3 years",
							5: "5 years",
							10: "10 years",
							20: "20 years",
						}}
						style={{ maxWidth: "min(90%, 50em)", marginLeft: "3em" }}
					/>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" loading={isLoading}>
						Run
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}

export default PortfolioForm;
