import { cache, use } from "react";
import useSearchers from "./useSearchers";
import filterResults from "../../common/filterResultsAsync";
import { SailData } from "../../common/getSailData";

const cachedFilterResults = cache(filterResults);

export default function useFilteredResults(sailData: SailData, searchTerm: string, signal: AbortSignal) {
	const searchers = useSearchers(sailData);
	const results = cachedFilterResults(searchers, searchTerm, signal);
	return use(results);
}