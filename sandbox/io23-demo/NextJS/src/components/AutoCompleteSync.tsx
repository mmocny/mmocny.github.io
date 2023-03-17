'use client';

import useSailBoatData from "@/hooks/app/useSailboatData";
import SailboatPreview from "./SailboatPreview";
import useFilteredResults from "@/hooks/app/useFilteredResultsSync";

export default function AutoComplete({ searchTerm }: { searchTerm: string }) {
	const sailData = useSailBoatData();

	// This can be expensive!
	const results = useFilteredResults(sailData, searchTerm);

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