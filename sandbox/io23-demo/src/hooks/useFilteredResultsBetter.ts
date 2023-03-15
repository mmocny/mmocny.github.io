import { cache, use } from "react";
import useSearchers, { Searchers } from "./useSearchers";
import { delay, yieldToMain, yieldToMainEvery } from "../../utils/delay";
import { SailData } from "./useSailboatData";

const filterResults = cache(async function(searchers: Searchers, searchTerm: string, signal: AbortSignal) {
	await yieldToMain();
	const start = performance.now();
	// console.log('Starting:', searchTerm);

	try {
		const ret = [];
		await delay(2000);

		signal?.throwIfAborted();
		
		for (let searcher of searchers) {
			const results = searcher(searchTerm);
			ret.push(...results);
		}

		// console.log("Completed:", searchTerm);
		performance.measure('Complete: filterResults for: ' + searchTerm, { start });
		return ret.sort((a,b) => a!.score! - b!.score!);
	} catch {
		// console.log("Aborted:", searchTerm);
		performance.measure('Aborted: filterResults for: ' + searchTerm, { start });
		return [];
	}
})

export default function useFilteredResults(sailData: SailData, searchTerm: string, signal: AbortSignal) {
	const searchers = useSearchers(sailData);
	const results = filterResults(searchers, searchTerm, signal);
	return use(results);
}