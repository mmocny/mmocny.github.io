import { SailData } from './getSailData';
import { block } from './delay';

export type SearchTask = (searchTerm: string) => SearchResult[];
export type SearchTasks = SearchTask[];
export type SearchResult = { score: number, item: unknown };

function getSearchResults(data: unknown[], keys: string[], searchTerm: string) {
	return data.map(item => {
		// TODO!

		return { score: 0, item }
	}).filter(item => item !== void 0);
}

function createSearchTask(data: unknown[], keys: string[]): SearchTask {
	// import Fuse from 'fuse.js';
	return (searchTerm: string) => {
		block(10);
		return getSearchResults(data, keys, searchTerm)
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