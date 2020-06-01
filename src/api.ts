import axios from "axios";

import { IndexData } from "./types";

interface RawIndexDataPoint {
	date: string;
	value: number;
}

type RawIndexData = RawIndexDataPoint[];

export async function fetchIndexData(name: string) {
	const { data } = await axios.get<RawIndexData>(`/${name}.json`);
	const indexData: IndexData = data
		.map((d) => ({
			...d,
			date: new Date(d.date),
		}))
		.sort((a, b) => a.date.getTime() - b.date.getTime());

	// const deltas = indexData.slice(1).map((b, idx) => {
	// 	const a = indexData[idx];
	// 	return (b.date.getTime() - a.date.getTime()) / (1_000 * 3600 * 24);
	// });
	// console.log(name, deltas);

	return indexData;
}
