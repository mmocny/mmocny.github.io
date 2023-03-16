import { TransitionFunction, TransitionStartFunction, useCallback, useRef, useState, useTransition } from "react";

export default function useAbortSignallingTransition() : [boolean, TransitionStartFunction, AbortSignal] {
	const [isPending, startTransition] = useTransition();
	const cleanTransition = useRef<() => void>();
	const [abortController, setAbortController] = useState(new AbortController);

	// TODO: should we useCallback?
	const wrappedStartTransition = useCallback((callback: TransitionFunction) => {
		startTransition(() => {
			cleanTransition.current?.();
			const newAbortController = new AbortController();

			callback();

			setAbortController(newAbortController);
			cleanTransition.current = () => {
				newAbortController.abort();
			};
		});
	}, [startTransition, cleanTransition, setAbortController]);

	return [isPending, wrappedStartTransition, abortController.signal];
};