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

export default async function getSailData() {
	const contents = await fetch('./all_sailboats.json');
	const data = await contents.json();
	return {
		data,
		keys: getSailDataKeys(),
	};
}
