
import { Suspense, createResource, createSignal, Show } from 'solid-js';

import getSailData from '~/common/getSailData';
import useAbortSignallingTransition from '~/hooks/useAbortSignallingTransition';
import SearchBar from '~/components/SearchBar';
import AutoCompleteAsync from '~/components/AutoCompleteAsync';

export default function SolidSearchBest() {
	const [sailData] = createResource(getSailData);

	const [isPending, startAbortSignallingTransition, abortSignal] = useAbortSignallingTransition();

	const [searchTerm, setSearchTerm] = createSignal("");
	const [autocompleteTerm, setAutocompleteTerm] = createSignal("");

	const onInput = async (e: any) => {
		const searchTerm = e.target.value;
		setSearchTerm(searchTerm);
		try {
			await startAbortSignallingTransition(() => {
				setAutocompleteTerm(searchTerm);
			});
		} catch { }
	};

	return (
		<Show when={!sailData.loading}>
			<SearchBar searchTerm={searchTerm} onInput={onInput}></SearchBar>

			<div class={isPending() ? "blur-sm" : ""}>
				<Suspense>
					<AutoCompleteAsync searchTerm={autocompleteTerm} sailData={sailData()!} abortSignal={abortSignal}></AutoCompleteAsync>
				</Suspense>
			</div>
		</Show>
	);
}