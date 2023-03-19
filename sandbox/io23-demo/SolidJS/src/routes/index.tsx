import { Suspense, createResource, createSignal, Show, Accessor, JSX, useTransition } from 'solid-js';
import { Title } from "solid-start";
import getSailData from '~/common/getSailData';
import AutoCompleteAsync from '~/components/AutoCompleteAsync';
import SearchBar from '~/components/SearchBar';

// function useAbortSignallingTransition() : [boolean, TransitionStartFunction, AbortSignal] {
// 	const [isPending, startTransition] = useAwaitableTransition();
// 	const [abortController, setAbortController] = useState(new AbortController);

// 	const wrappedStartTransition = useCallback(async (callback: TransitionFunction) => {
// 		const newAbortController = new AbortController();

// 		try {
// 			await startTransition(() => {
// 				callback();
// 				setAbortController(newAbortController);
// 			});
// 		} catch {
// 			newAbortController.abort();
// 		}
// 	}, [startTransition, setAbortController]);

// 	return [isPending, wrappedStartTransition, abortController.signal];
// };

export default function Home() {
  const [sailData] = createResource(getSailData);
  const isReady = () => !!sailData();

	// const [isPending, startAbortingTransition, abortSignal] = useAbortSignallingTransition();
  const [isPending, startTransition] = useTransition();
  const [abortController, setAbortController] = createSignal(new AbortController);
  const abortSignal = () => abortController().signal;

  const [searchTerm, setSearchTerm] = createSignal("");
  const [autocompleteTerm, setAutocompleteTerm] = createSignal("");

  const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e: any) => {
    const searchTerm = e.target.value;
    console.log('Event Called', searchTerm);
    setSearchTerm(searchTerm);
    startTransition(() => {
      setAutocompleteTerm(searchTerm);
    })
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