'use client';

import SailboatPreview from "./SailboatPreview";
import useFilteredResultsSync from "../hooks/app/useFilteredResultsSync";
import { SailData } from "@/common/getSailData";

export default function AutoComplete({ searchTerm, sailData }: { searchTerm: string, sailData: SailData }) {
	// This can be expensive!
	const results = useFilteredResultsSync(sailData, searchTerm);

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