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
	// TODO: update these to be nested.
	return [
		// 'aux-power',
		// 'hp',
		// 'make',
		// 'model',
		// 'type',
		// 'bal-disp',
		// 'bal-type',
		// 'ballast',
		// 'beam',
		// 'builder',
		// 'builders',
		// 'built-by',
		// 'link',
		// 'text',
		// 'construct',
		// 'designer',
		// 'designers', 
		// 'designed-by', 
		// 'disp', 
		// 'disp-len', 
		// 'draft-max', 
		// 'first-built', 
		// 'hull-type', 
		// 'id', 
		// 'imgs', 
		// 'listed-sa', 
		// 'loa', 
		// 'lwl', 
		'name',
		// 'notes', 
		// 'related-links', 
		// 'cc-yachts-photo-album', 
		// 'rig-dimensions', 
		// 'mast-height-from-dwl', 
		// 'rig-type', 
		// 'sa-disp', 
		// 'tanks', 
		// 'fuel', 
		// 'water', 
		// 'updated',
	];
}

export default function useSailBoatData() {
	return use(getSailData());
}