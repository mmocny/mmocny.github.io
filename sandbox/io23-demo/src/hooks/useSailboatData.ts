import { use, useEffect, useState } from "react";

async function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function getSailData() {
	// use() + fetch() doesn't work in Next (yet), and useMemo() isn't persistent enough
	// So, create our own caching.
	// TODO: use React cache(), or switch to using SWR, React-Query, or other lib?

	const contents = await fetch('http://localhost:3000/api/sailboatData/');
	const data = await contents.json();
	await delay(1000);
	return data;
}

let cachedSailData: any = null;
async function getCachedSailData() {
	if (!cachedSailData) {
		cachedSailData = getSailData();
	}
	return cachedSailData;
}

export default function useSailBoatData() {
	// const sailData = use(getCachedSailData());

	const [sailData, setSailData] = useState([]);
	useEffect(() => {
		(async () => {
			const data = await getSailData();
			setSailData(data);
		})();
	}, []);
	return sailData;
}