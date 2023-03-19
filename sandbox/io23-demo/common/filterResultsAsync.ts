import { SearchTask, SearchResult } from "./createSearchTasks";
import { yieldToMain } from "./delay";

export default async function filterResultsAsync(searchers: SearchTask[], searchTerm: string, signal: AbortSignal) {
	const ret: SearchResult[] = [];

	if (searchTerm == "")
		return ret;

	const start = performance.now();

	try {
		for (let searcher of searchers) {
			await yieldToMain();
			signal?.throwIfAborted();

			const results = searcher(searchTerm);
			ret.push(...results);
		}
		
		performance.measure('Computed: filterResults for: ' + searchTerm, { start });
		return ret.sort((a,b) => a!.score! - b!.score!);
	} catch {
		performance.measure('Aborted: filterResults for: ' + searchTerm, { start });
		return [];
	}
}