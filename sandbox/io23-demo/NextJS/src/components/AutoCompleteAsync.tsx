'use client';

import Fuse from "fuse.js";
import { use, useMemo } from "react";
import { SailData } from "@/common/getSailData";
import createSearchTasks, { SearchResult } from "@/common/createSearchTasks";
import filterResultsAsync from "@/common/filterResultsAsync";
import SailboatPreview from "@/common/components/SailboatPreview";

export default function AutoCompleteAsync({ searchTerm, sailData, abortSignal }: { searchTerm: string, sailData: SailData, abortSignal: AbortSignal }) {
	// This can be expensive!
	const searchers = useMemo(() => createSearchTasks(Fuse, sailData), [sailData]);
	const results = use(useMemo(() => filterResultsAsync(searchers, searchTerm, abortSignal), [searchers, searchTerm, abortSignal]));
	const slicedResults = results.slice(0, 10);

	if (results.length == 0) {
		return <></>;
	}

	return (
		<>
			<div>Results ({results.length}):</div>
			{ slicedResults.map((result: SearchResult) =>
				<SailboatPreview key={result.item.id} result={result}></SailboatPreview>
			)}
		</>
	);
};