import { Suspense, createResource, createSignal, Show, Accessor, JSX, useTransition, createEffect } from 'solid-js';
import { Title } from "solid-start";
import getSailData from '~/common/getSailData';
import AutoCompleteAsync from '~/components/AutoCompleteAsync';
import SearchBar from '~/components/SearchBar';
import WebVitalsMonitor from '~/components/WebVitalsMonitor';
import useAbortSignallingTransition from '~/hooks/utils/useAbortSignallingTransition';

export default function Home() {
	const [sailData] = createResource(getSailData);
	const isReady = () => !!sailData();

	const [isPending, startAbortSignallingTransition, abortSignal] = useAbortSignallingTransition();

	const [searchTerm, setSearchTerm] = createSignal("");
	const [autocompleteTerm, setAutocompleteTerm] = createSignal("");

	const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = async (e: any) => {
		const searchTerm = e.target.value;
		console.log('Event Called', searchTerm);
		setSearchTerm(searchTerm);
		try {
			await startAbortSignallingTransition(() => {
				setAutocompleteTerm(searchTerm);
			});
		} catch { }
	};

	return (
		<>
			<Title>Hello World</Title>

			<main>
				<WebVitalsMonitor></WebVitalsMonitor>
				<Show when={isReady()} fallback={<p>"Loading Data..."</p>}>

					<SearchBar searchTerm={searchTerm} onInput={onInput}></SearchBar>

					<div class={isPending() ? "blur-sm" : ""}>
					<Suspense>
						<AutoCompleteAsync searchTerm={autocompleteTerm} sailData={sailData()!} abortSignal={abortSignal}></AutoCompleteAsync>
					</Suspense>
					</div>

				</Show>
			</main>
		</>
	);
}