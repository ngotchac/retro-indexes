import axios from "axios";

import { IndexData } from "./types";

interface RawIndexDataPoint {
	date: string;
	value: number;
}

type RawIndexData = RawIndexDataPoint[];

export async function fetchIndexData(name: string) {
	const { data } = await axios.get<RawIndexData>(`/${name}.json`);
	const indexData: IndexData = data.map((d) => ({
		...d,
		date: new Date(d.date),
	}));

	return indexData;
}
