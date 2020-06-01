import React, { useState } from "react";
import { Typography, Form, Button, Row, Col, Cascader, Input, Switch, Slider } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Store } from "antd/lib/form/interface";
import { ShowSearchType, CascaderOptionType } from "antd/lib/cascader";

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
				label: "Livret A",
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
				asset?: string[];
			}[];
			rebalancing: number;
		};

		const portfolioAssets = (data.assets || [])
			.map((asset) => {
				if (!asset.asset || !isNumber(asset.allocation)) {
					return null;
				}

				return {
					index: asset.asset.slice(-1)[0],
					allocation: parseInt(asset.allocation) / 100,
				};
			})
			.filter((v) => v !== null) as { index: string; allocation: number }[];

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
					portfolioAssets.map(async ({ index, allocation }) => {
						const indexData = await fetchIndexData(index);
						const asset: PortfolioAsset = {
							allocation,
							data: indexData,
						};

						return asset;
					}),
				);

				const portfolio: Portfolio = {
					assets,
					rebalancing: data.rebalancing > 0 ? data.rebalancing : null,
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
			<Form onFinish={onFinish}>
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
											<Col span={12}>
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
											<Col flex={"none"}>
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
														// defaultValue={100}
														min={0}
														max={100}
														type="number"
														style={{ width: "8em" }}
														addonAfter="%"
													/>
												</Form.Item>
											</Col>
											<Col span={6}>
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
				<Row gutter={8}>
					<Col span={12}>
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
							/>
						</Form.Item>
					</Col>
				</Row>

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
