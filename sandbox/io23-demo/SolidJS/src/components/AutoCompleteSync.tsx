'use client';

import createSearchTasks, { SearchResult, SearchTask } from "~/common/createSearchTasks";
import SailboatPreview from "./SailboatPreview";
import { Accessor, For, createMemo, createResource } from 'solid-js';
import filterResultsSync from "~/common/filterResultsSync";
import { SailData } from "~/common/getSailData";
import Fuse from "fuse.js";

export default function AutoCompleteSync({ searchTerm, sailData }: { searchTerm: Accessor<string>, sailData: SailData }) {
	const [searchers] = createResource(() => createSearchTasks(Fuse, sailData));
	// Not sure why I should need to memo this-- but seems I get 2x computations per update.  Perhaps the 2x access of signals?
	const results =  createMemo(() => filterResultsSync(searchers()!, searchTerm()));
	const slicedResults = () => results()?.slice(0, 10);

	return (
		<>
			<div>Results ({results()?.length}):</div>
			<For each={slicedResults()}>{(result: SearchResult) =>
				<SailboatPreview result={result}></SailboatPreview>
			}</For>
		</>
	);
};