'use client';

import useSailBoatData from "@/hooks/useSailboatData";
import useFilteredResults from "@/hooks/useFilteredResultsBad";
import { memo, useMemo } from "react";
import SailboatPreview from "./SailboatPreview";

// Wrap this component in memo() so we need to re-render list needlessly
export default memo(function AutoComplete({ searchTerm }: { searchTerm: string }) {
	const sailData = useSailBoatData();

	// This can be expensive!
	// useMemo() helps with re-renders but still expensive the first time.
	const results = useMemo(() => useFilteredResults(sailData, searchTerm), [sailData, searchTerm]);

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