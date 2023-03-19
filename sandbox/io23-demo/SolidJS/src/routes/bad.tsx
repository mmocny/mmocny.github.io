import { createResource, createSignal, Show, JSX } from 'solid-js';
import { Title } from "solid-start";
import getSailData from '~/common/getSailData';
import AutoCompleteSync from '~/components/AutoCompleteSync';
import SearchBar from '~/components/SearchBar';

export default function() {
	const [sailData] = createResource(getSailData);
	const isReady = () => !!sailData();
	const [searchTerm, setSearchTerm] = createSignal("");

	const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = async (e: any) => {
		const searchTerm = e.target.value;
		setSearchTerm(searchTerm);
	};

	return (
		<>
			<Title>Hello World</Title>

			<main>
				<Show when={isReady()} fallback={<p>"Loading Data..."</p>}>
					<SearchBar searchTerm={searchTerm} onInput={onInput}></SearchBar>
					<AutoCompleteSync searchTerm={searchTerm} sailData={sailData()!}></AutoCompleteSync>
				</Show>
			</main>
		</>
	);
}