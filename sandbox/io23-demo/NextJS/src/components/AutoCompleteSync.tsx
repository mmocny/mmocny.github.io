'use client';

import Fuse from "fuse.js";
import { useMemo } from "react";
import { SailData } from "@/common/getSailData";
import createSearchTasks, { SearchResult } from "@/common/createSearchTasks";
import filterResultsSync from "@/common/filterResultsSync";
import SailboatResults from "@/common/components/SailboatResults";
import SailboatPreview from "@/common/components/SailboatPreview";

export default function AutoComplete({ searchTerm, sailData }: { searchTerm: string, sailData: SailData }) {
	const searchers = useMemo(() => createSearchTasks(Fuse, sailData), [sailData]);
	const results = useMemo(() => filterResultsSync(searchers, searchTerm), [searchers, searchTerm]);
	const slicedResults = results.slice(0, 10);

	if (results.length == 0) {
		return <></>;
	}

	return (
		<>
			<SailboatResults results={results}></SailboatResults>
			{ slicedResults.map((result: SearchResult) =>
				<SailboatPreview key={result.item.id} result={result}></SailboatPreview>
			)}
		</>
	);
};