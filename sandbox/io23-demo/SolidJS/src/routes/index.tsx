import { Suspense, createResource, createSignal, Show, Accessor, JSX, useTransition, createEffect } from 'solid-js';
import { Title } from "solid-start";
import getSailData from '~/common/getSailData';
import AutoCompleteAsync from '~/components/AutoCompleteAsync';
import SearchBar from '~/components/SearchBar';

function useAwaitableTransition() : [Accessor<boolean>, (fn: () => void) => Promise<void>] {
	const [isPending, startTransition] = useTransition();
	let resolveRef: (((value?: any) => void) | undefined);
	let rejectRef: (((reason?: any) => void) | undefined);

	const wrappedStartTransition = async (callback: () => void): Promise<void> => {
		rejectRef?.();

		return new Promise((resolve, reject) => {
			resolveRef = resolve;
			rejectRef = reject;

			startTransition(() => {
				callback();
			});
		});
	};
	
	createEffect(() => {
		if (!isPending()) {
			resolveRef?.();

			resolveRef = undefined;
			rejectRef = undefined;
		}
	});

	return [isPending, wrappedStartTransition];
};

function useAbortSignallingTransition() : [Accessor<boolean>, (fn: () => void) => Promise<void>, Accessor<AbortSignal>] {
  const [isPending, startAwaitableTransition] = useAwaitableTransition();
  const [abortController, setAbortController] = createSignal(new AbortController);

	const wrappedStartTransition = async (callback: () => void) => {
		const newAbortController = new AbortController();

		try {
			await startAwaitableTransition(() => {
				callback();
				setAbortController(newAbortController);
			});
		} catch (ex) {
			newAbortController.abort();
			throw ex;
		}
  }

	return [isPending, wrappedStartTransition, () => abortController().signal];
};

export default function Home() {
	const [sailData] = createResource(getSailData);
	const isReady = () => !!sailData();

	const [isPending, startAbortingTransition, abortSignal] = useAbortSignallingTransition();

	const [searchTerm, setSearchTerm] = createSignal("");
	const [autocompleteTerm, setAutocompleteTerm] = createSignal("");

	const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = async (e: any) => {
		const searchTerm = e.target.value;
		console.log('Event Called', searchTerm);
		setSearchTerm(searchTerm);
		try {
			await startAbortingTransition(() => {
				setAutocompleteTerm(searchTerm);
			});
		} catch {
			// abortSignal is automatically signalled
		}
	};

	return (
		<>
			<Title>Hello World</Title>

			<main>
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