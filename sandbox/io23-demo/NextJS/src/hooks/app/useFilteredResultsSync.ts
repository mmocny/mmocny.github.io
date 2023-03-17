import { SailData } from "@/common/getSailData";
import useSearchers from "./useSearchers";
import { useMemo } from "react";
import filterResults from "@/common/filterResultsSync";

export default function useFilteredResults(sailData: SailData, searchTerm: string) {
	const searchers = useSearchers(sailData);
	const results = useMemo(() => filterResults(searchers, searchTerm), [searchers, searchTerm]);
	return results;
}