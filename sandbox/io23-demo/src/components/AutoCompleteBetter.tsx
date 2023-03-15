'use client';

import useSailBoatData from "@/hooks/useSailboatData";
import useFilteredResults from "@/hooks/useFilteredResultsBetter";
import { memo, useRef } from "react";
import SailboatPreview from "./SailboatPreview";

// Wrap this component in memo() so we need to re-render list needlessly
export default memo(function AutoComplete({ searchTerm }: { searchTerm: string }) {
	const sailData = useSailBoatData();

	const previousSearchTerm = useRef<string | null>(null);
	const abortController = useRef<AbortController | null>(null);

	if (searchTerm !== previousSearchTerm.current) {
		abortController.current?.abort();
		abortController.current = new AbortController();
		previousSearchTerm.current = searchTerm;
	}

	// This can be expensive!
	const results = useFilteredResults(sailData, searchTerm, abortController.current!.signal);

	if (results.length == 0) {
		return <></>;
	}

	return (
		<>
			<div>Results ({results.length}):</div>
			{ results.slice(0, 10).map((result: any) =>
				<SailboatPreview key={result.item.id} result={result}></SailboatPreview>
			)}
		</>
	);
});