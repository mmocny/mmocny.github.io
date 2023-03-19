import { createResource, createSignal, Show, JSX, Suspense, startTransition } from 'solid-js';
import { Title } from "solid-start";
import getSailData from '~/common/getSailData';
import AutoCompleteSync from '~/components/AutoCompleteSync';
import SearchBar from '~/components/SearchBar';
import useDebouncedEffect from '~/hooks/utils/useDebouncedEffect';


export default function() {
	const [sailData] = createResource(getSailData);
	const isReady = () => !!sailData();
	const [searchTerm, setSearchTerm] = createSignal("");
	const [autocompleteTerm, setAutocompleteTerm] = createSignal("");
	const isPending = () => searchTerm() != autocompleteTerm();

	useDebouncedEffect(searchTerm, (searchTerm: string) => {
		startTransition(() => {
			setAutocompleteTerm(searchTerm);
		});
	}, 1000);

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
					<div class={isPending() ? "blur-sm" : ""}>
						<Suspense>
							<AutoCompleteSync searchTerm={autocompleteTerm} sailData={sailData()!}></AutoCompleteSync>
						</Suspense>
					</div>
				</Show>
			</main>
		</>
	);
}