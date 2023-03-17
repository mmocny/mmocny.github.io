'use client';

import useFilteredResults from "@/hooks/app/useFilteredResultsAsync";
import SailboatPreview from "./SailboatPreview";
import useSailBoatData from "@/hooks/app/useSailboatData";

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