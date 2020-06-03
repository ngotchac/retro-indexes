import React from "react";
import { AppProps } from "next/app";
import { Layout, Menu, Typography } from "antd";
import Head from "next/head";
import styled from "styled-components";

import "antd/dist/antd.css";
// import "antd/dist/antd.dark.css";
// import "antd/dist/antd.compact.css";

import "./styles.css";
import GithubCorner from "../components/github-corner";

const HeaderTitleContainer = styled.div`
	display: inline-flex;
	align-items: center;
	height: 100%;
	float: left;
	margin-right: 2em;
`;

const HeaderTitle = styled(Typography.Title)`
	background: rgba(255, 255, 255, 0.2);
	padding: 0.35em 0.75em;
	float: left;

	&.ant-typography {
		font-size: 1.25em;
		font-weight: 400;
		color: white;
		margin: 0;
	}
`;

const LayoutContainer = styled(Layout)`
	min-height: 100vh;
`;

const Header = styled(Layout.Header)`
	position: fixed;
	z-index: 1;
	width: 100%;
`;

const Content = styled(Layout.Content)`
	padding: 0 50px;
	margin-top: 64px;
`;

const Footer = styled(Layout.Footer)`
	text-align: center;
`;

const InnerContent = styled.div`
	background: #fff;
	/* background: #141414; */
	padding: 24px;
	min-height: 380px;
	max-width: 1024px;
	margin: 3em auto;
`;

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<LayoutContainer>
			<Head>
				<title>Retro Indexes</title>
			</Head>
			<GithubCorner />
			<Header>
				<HeaderTitleContainer>
					<HeaderTitle>Retro Indexes</HeaderTitle>
				</HeaderTitleContainer>
				<Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
					<Menu.Item key="1">Home</Menu.Item>
				</Menu>
			</Header>
			<Content className="site-layout">
				<InnerContent>
					<Component {...pageProps} />
				</InnerContent>
			</Content>
			<Footer>Retro Indexes (v0.1.0)</Footer>
		</LayoutContainer>
	);
}

export default MyApp;
