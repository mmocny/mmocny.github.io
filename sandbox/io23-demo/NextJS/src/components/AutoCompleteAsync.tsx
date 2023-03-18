'use client';

import useFilteredResultsAsync from "../hooks/app/useFilteredResultsAsync";
import SailboatPreview from "./SailboatPreview";
import useSailBoatData from "../hooks/app/useSailboatData";
import { SailData } from "@/common/getSailData";

export default function AutoComplete({ searchTerm, sailData, abortSignal }: { searchTerm: string, sailData: SailData, abortSignal: AbortSignal }) {
	// This can be expensive!
	const results = useFilteredResultsAsync(sailData, searchTerm, abortSignal);

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