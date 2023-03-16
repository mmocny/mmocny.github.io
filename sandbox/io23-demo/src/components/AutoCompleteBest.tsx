'use client';

import useSailBoatData from "@/hooks/useSailboatData";
import useFilteredResults from "@/hooks/useFilteredResultsBest";
import { memo } from "react";
import SailboatPreview from "./SailboatPreview";
import objectId from "../../utils/objectId";


// TODO: should I wrap this in a memo()
export default function AutoComplete({ searchTerm, abortSignal }: { searchTerm: string, abortSignal: AbortSignal }) {
	const sailData = useSailBoatData();
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