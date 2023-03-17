import useSearchers, { Searchers } from "./useSearchers";
import { SailData } from "./useSailboatData";
import { useMemo } from "react";

function filterResults(searchers: Searchers, searchTerm: string) {
	if (searchTerm == "") return [];

	const start = performance.now();
	// console.log('Starting:', searchTerm);

	const ret = [];
	
	for (let searcher of searchers) {
		const results = searcher(searchTerm);
		ret.push(...results);
	}

	// console.log("Completed:", searchTerm);
	performance.measure('Complete: filterResults for: ' + searchTerm, { start });
	return ret.sort((a,b) => a!.score! - b!.score!);
}

export default function useFilteredResults(sailData: SailData, searchTerm: string) {
	const searchers = useSearchers(sailData);
	const results = useMemo(() => filterResults(searchers, searchTerm), [searchers, searchTerm]);
	return results;
}