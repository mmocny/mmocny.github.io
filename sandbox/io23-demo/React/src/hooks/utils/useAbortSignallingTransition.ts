import { TransitionFunction, TransitionStartFunction, useCallback, useRef, useState, useTransition } from "react";
import useAwaitableTransition from "./useAwaitableTransition";

export default function useAbortSignallingTransition() : [boolean, TransitionStartFunction, AbortSignal] {
	const [isPending, startTransition] = useAwaitableTransition();
	const [abortController, setAbortController] = useState(new AbortController);

	const wrappedStartTransition = useCallback(async (callback: TransitionFunction) => {
		const newAbortController = new AbortController();

		try {
			await startTransition(() => {
				callback();
				setAbortController(newAbortController);
			});
		} catch {
			newAbortController.abort();
		}
	}, [startTransition, setAbortController]);

	return [isPending, wrappedStartTransition, abortController.signal];
};