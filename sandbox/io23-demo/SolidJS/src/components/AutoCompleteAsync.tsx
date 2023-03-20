'use client';

import Fuse from "fuse.js";
import { Accessor, For, createResource } from 'solid-js';
import { SailData } from "~/common/getSailData";
import createSearchTasks, { SearchResult, SearchTask } from "~/common/createSearchTasks";
import filterResultsAsync from "~/common/filterResultsAsync";
import SailboatPreview from "~/common/components/SailboatPreview";

export default function AutoCompleteAsync({ searchTerm, sailData, abortSignal }: { searchTerm: Accessor<string>, sailData: SailData, abortSignal: Accessor<AbortSignal> }) {
	const [searchers] = createResource(() => createSearchTasks(Fuse, sailData));
	const [results] =  createResource(() => [searchTerm(), abortSignal()], ([searchTerm, abortSignal]) => filterResultsAsync(searchers()!, searchTerm as string, abortSignal as AbortSignal));
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