import Fuse from 'fuse.js';
import { useMemo } from 'react';
import { SailData } from './useSailboatData';
import { block } from '../../utils/delay';

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

export default function useSearchers({ data, keys }: SailData) {
	// Fuse can index the whole array of objects in one go, but,
	// then it cannot be interrupted as it progresses.
	// So, lets split it up into parts.

	return useMemo(() => {
		const options = {
			...defaultOptions,
			keys: [...defaultOptions.keys, ...keys]
		};

		const sliceSize = Math.ceil(data.length / 100);
		const searchers = [...new Array(100)].map((_,i) => {
			const start = i*sliceSize;
			const end = start + sliceSize;
			const fuse = new Fuse(data.slice(start, end), options);

			// Each item maps to a callback, which accepts a search term
			return function *(searchTerm: string) {
				const results = fuse.search(searchTerm);
				
				// Fuse is fast, lets add some delay.
				block(10);

				yield* results;
			};
		});

		return searchers;
	}, [data, keys]);
}

export type Searchers = ReturnType<typeof useSearchers>;