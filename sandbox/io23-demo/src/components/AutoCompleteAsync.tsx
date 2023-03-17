'use client';

import useSailBoatData from "@/hooks/useSailboatData";
import useFilteredResults from "@/hooks/useFilteredResultsAsync";
import SailboatPreview from "./SailboatPreview";

export default function AutoComplete({ searchTerm, abortSignal }: { searchTerm: string, abortSignal: AbortSignal }) {
	const sailData = useSailBoatData();

	// This can be expensive!
	const results = useFilteredResults(sailData, searchTerm, abortSignal);

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
};