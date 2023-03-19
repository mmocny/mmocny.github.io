
import { Show, createResource, createSignal } from 'solid-js';

import getSailData from '~/common/getSailData';
import SearchBar from '~/components/SearchBar';
import AutoCompleteSync from '~/components/AutoCompleteSync';

export default function SolidSearchBad() {
	const [sailData] = createResource(getSailData);
	const [searchTerm, setSearchTerm] = createSignal("");

	const onInput = async (e: any) => {
		const searchTerm = e.target.value;
		setSearchTerm(searchTerm);
	};

	return (
		<Show when={!sailData.loading}>
			<SearchBar searchTerm={searchTerm} onInput={onInput}></SearchBar>
			<AutoCompleteSync searchTerm={searchTerm} sailData={sailData()!}></AutoCompleteSync>
		</Show>
	);
}