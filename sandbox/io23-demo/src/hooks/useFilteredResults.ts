import { use, useMemo } from "react";
import Fuse from 'fuse.js';

const options = {
	isCaseSensitive: false,
	includeScore: false,
	shouldSort: true,
	includeMatches: false,
	findAllMatches: true,
	minMatchCharLength: 0,
	// location: 0,
	// threshold: 0.6,
	// distance: 100,
	// useExtendedSearch: false,
	// ignoreLocation: false,
	// ignoreFieldNorm: false,
	// fieldNormWeight: 1,
	keys: [
		'aux-power', 'hp', 'make', 'model', 'type', 'bal-disp', 'bal-type', 'ballast', 'beam', 'builder', 'builders', 'built-by', 'link', 'text', 'construct', 'designer', 'designers', 'designed-by', 'link', 'text', 'disp', 'disp-len', 'draft-max', 'first-built', 'hull-type', 'id', 'imgs', '0', 'link', 'text', 'listed-sa', 'loa', 'lwl', { name: 'name', weight: 100 }, 'notes', 'related-links', 'cc-yachts-photo-album', 'link', 'text', 'rig-dimensions', 'mast-height-from-dwl', 'rig-type', 'sa-disp', 'tanks', 'fuel', 'water', 'updated']
};

function useSearchers(searchData: any[]): any[] {
	// Fuse can index the whole array of objects in one go, but,
	// then it cannot be interrupted as it progresses.
	// So, lets split it up into parts.

	return useMemo(() => {
		const searchers = searchData.map(item => {
			const fuse = new Fuse([item], options);

			// Each item maps to a callback, which accepts a search term
			return function *(searchTerm: string) {
				const results = fuse.search(searchTerm);
				yield* results.map(result => result.item);
			};
		});

		return searchers;
	}, [searchData]);
}

function *filteredResultsIter(sailboatData: any, searchTerm: string) {
	for (let searcher of useSearchers(sailboatData)) {
		const results = searcher(searchTerm);
		yield* results;
	}
}

async function filteredResultsAsync(sailboatData: any[], searchTerm: string) {
	const results = [];
	for (let result of filteredResultsIter(sailboatData, searchTerm)) {
		// TODO: yield here.
		results.push(result)
	}
	return results;
}

function filteredResultsSync(sailboatData: any, searchTerm: string) {
	const results = [];
	for (let result of filteredResultsIter(sailboatData, searchTerm)) {
		// TODO: yield here.
		results.push(result)
	}
	return results;
}


export default function useFilteredResults(sailboatData: any, searchTerm: string) {
	const results = filteredResultsSync(sailboatData, searchTerm);

	// const results = use(filteredResultsAsync(sailboatData, searchTerm));

	// TODO: return a callback for cancelling the search?
	return results;
}