import { SailData } from "../../common/getSailData";
import useSearchers from "./useSearchers";
import { useMemo } from "react";
import filterResultsSync from "../../common/filterResultsSync";

export default function useFilteredResultsSync(sailData: SailData, searchTerm: string) {
	const searchers = useSearchers(sailData);
	const results = useMemo(() => filterResultsSync(searchers, searchTerm), [searchers, searchTerm]);
	return results;
}