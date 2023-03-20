

import Fuse from "fuse.js";
import { Accessor, For, Show, createResource } from 'solid-js';
import { SailData } from "~/common/getSailData";
import createSearchTasks, { SearchResult, SearchTask } from "~/common/createSearchTasks";
import filterResultsAsync from "~/common/filterResultsAsync";
import SailboatResults from "~/common/components/SailboatResults";
import SailboatPreview from "~/common/components/SailboatPreview";

export default function AutoCompleteAsync({ searchTerm, sailData, abortSignal }: { searchTerm: Accessor<string>, sailData: SailData, abortSignal: Accessor<AbortSignal> }) {
	const [searchers] = createResource(() => createSearchTasks(Fuse, sailData));
	const [results] =  createResource(() => [searchTerm(), abortSignal()], ([searchTerm, abortSignal]) => filterResultsAsync(searchers()!, searchTerm as string, abortSignal as AbortSignal));
	const slicedResults = () => results()?.slice(0, 10);

	return (
		<Show when={!results.loading && results()!.length > 0}>
			<SailboatResults results={results()!}></SailboatResults>
			<For each={slicedResults()}>{(result: SearchResult) =>
				<SailboatPreview result={result}></SailboatPreview>
			}</For>
		</Show>
	);
};