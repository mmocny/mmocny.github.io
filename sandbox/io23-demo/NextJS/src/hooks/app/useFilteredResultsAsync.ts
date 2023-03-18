import { cache, use } from "react";
import useSearchers from "./useSearchers";
import filterResultsAsync from "../../common/filterResultsAsync";
import { SailData } from "../../common/getSailData";

const cachedFilterResultsAsync = cache(filterResultsAsync);

export default function useFilteredResultsAsync(sailData: SailData, searchTerm: string, signal: AbortSignal) {
	const searchers = useSearchers(sailData);
	const results = cachedFilterResultsAsync(searchers, searchTerm, signal);
	return use(results);
}