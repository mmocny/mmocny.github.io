
import { createResource, createSignal, Show, Suspense, startTransition } from 'solid-js';

import getSailData from '~/common/getSailData';
import useDebouncedEffect from '~/hooks/useDebouncedEffect';
import SearchBar from '~/components/SearchBar';
import AutoCompleteSync from '~/components/AutoCompleteSync';

export default function SolidSearchBetter() {
	const [sailData] = createResource(getSailData);
	const [searchTerm, setSearchTerm] = createSignal("");
	const [autocompleteTerm, setAutocompleteTerm] = createSignal("");

	// Because we debounce the effect, we don't use the transition isPending
	const isPending = () => searchTerm() != autocompleteTerm();

	useDebouncedEffect(searchTerm, (searchTerm: string) => {
		startTransition(() => {
			setAutocompleteTerm(searchTerm);
		});
	}, 1000);

	const onInput = async (e: any) => {
		const searchTerm = e.target.value;
		setSearchTerm(searchTerm);
	};

	return (
		<Show when={!sailData.loading}>
			<SearchBar searchTerm={searchTerm} onInput={onInput}></SearchBar>

			<div class={isPending() ? "blur-sm" : ""}>
				<Suspense>
					<AutoCompleteSync searchTerm={autocompleteTerm} sailData={sailData()!}></AutoCompleteSync>
				</Suspense>
			</div>
		</Show>
	);
}