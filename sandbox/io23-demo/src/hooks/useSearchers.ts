import Fuse from 'fuse.js';
import { useMemo } from 'react';
import { SailData } from './useSailboatData';

const defaultOptions = {
	isCaseSensitive: false,
	includeScore: false,
	shouldSort: true,
	includeMatches: false,
	findAllMatches: true,
	minMatchCharLength: 0,
	// location: 0,
	threshold: 0.6,
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

		const searchers = data.map((item: any) => {
			const fuse = new Fuse([item], options);

			// Each item maps to a callback, which accepts a search term
			return function *(searchTerm: string) {
				const results = fuse.search(searchTerm);
				yield* results.map(result => result.item);
			};
		});

		return searchers;
	}, [data, keys]);
}

export type Searchers = ReturnType<typeof useSearchers>;