import { SailData } from './getSailData';
import { block } from './delay';
import Fuse from 'fuse.js';

export type SearchTask = (searchTerm: string) => SearchResult[];
export type SearchTasks = SearchTask[];
export type SearchResult = { score?: number | undefined, item: unknown };

const defaultOptions = {
	isCaseSensitive: false,
	includeScore: true,
	shouldSort: true,
	includeMatches: false,
	// findAllMatches: true,
	minMatchCharLength: 0,
	// location: 0,
	threshold: 0.3,
	// distance: 100,
	// useExtendedSearch: false,
	// ignoreLocation: false,
	// ignoreFieldNorm: false,
	// fieldNormWeight: 1,
	keys: [],
};

// function getSearchResults(data: unknown[], keys: string[], searchTerm: string) {
// 	return data.map(item => {
// 		for (let key of keys) {
// 			// TODO: fix types here-- its JSON with known set of keys
// 			// @ts-ignore
// 			const value = item[key] as string;
// 			if (value && value.startsWith(searchTerm)) {
// 				return {
// 					score: (value.length - searchTerm.length),
// 					item,
// 				};
// 			}
// 		}
// 	}).filter(item => item !== void 0);
// }

function createSearchTask(data: unknown[], keys: string[]): SearchTask {
	const fuse = new Fuse(data, {
		...defaultOptions,
		keys,
	});
	return (searchTerm: string): SearchResult[] => {
		block(10);
		return fuse.search(searchTerm);
		// return getSearchResults(data, keys, searchTerm);
	};
}

export default function createSearchTasks({ data, keys }: SailData) {
	const sliceSize = Math.ceil(data.length / 100);

	// Create 100 callback functions, which will each search a subset of results.
	// Alternative is to create one callback for each search item, and then yield less frequently
	// ... but this is a reasonable tradeoff for throughput/latency for this use case.
	return [...new Array(100)].map((_,i) => {
		const start = i*sliceSize;
		const end = start + sliceSize;
		return createSearchTask(data.slice(start, end), keys);
	});
}