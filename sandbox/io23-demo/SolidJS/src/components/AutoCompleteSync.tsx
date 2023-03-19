'use client';

import { Accessor, For, Show, createMemo, createResource } from 'solid-js';
import { SailData } from "~/common/getSailData";
import createSearchTasks, { SearchResult } from "~/common/createSearchTasks";
import filterResultsSync from "~/common/filterResultsSync";
import SailboatPreview from "./SailboatPreview";
import Fuse from "fuse.js";

export default function AutoCompleteSync({ searchTerm, sailData }: { searchTerm: Accessor<string>, sailData: SailData }) {
	const [searchers] = createResource(() => createSearchTasks(Fuse, sailData));
	const results =  createMemo(() => filterResultsSync(searchers()!, searchTerm()));
	const slicedResults = () => results()?.slice(0, 10);

	return (
		<>
			<Show when={results().length > 0}>
				<div>Results ({results()?.length}):</div>
				<For each={slicedResults()}>{(result: SearchResult) =>
					<SailboatPreview result={result}></SailboatPreview>
				}</For>
			</Show>
		</>
	);
};