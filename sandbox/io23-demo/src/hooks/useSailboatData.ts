import { use, cache } from "react";

const getSailData = cache(async function () {
	const contents = await fetch('/all_sailboats.json');
	const data = await contents.json();
	return {
		data,
		keys: getSailDataKeys(),
	};
});

export type SailData = Awaited<ReturnType<typeof getSailData>>;

function getSailDataKeys() {
	return [
		'builder',
		'designer',
		'disp', 
		'disp-len', 
		'draft-max', 
		'first-built', 
		'last-built',
		'hull-type', 
		'id', 
		'loa', 
		'lwl', 
		'name',
	];
}

export default function useSailBoatData() {
	return use(getSailData());
}