'use client';

import createSearchTasks, { SearchResult, SearchTask } from "~/common/createSearchTasks";
import SailboatPreview from "./SailboatPreview";
import { Accessor, For, createResource } from 'solid-js';
import filterResultsAsync from "~/common/filterResultsAsync";
import { SailData } from "~/common/getSailData";
import Fuse from "fuse.js";

export default function AutoComplete({ searchTerm, sailData, abortSignal }: { searchTerm: Accessor<string>, sailData: SailData, abortSignal: Accessor<AbortSignal> }) {
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