import { useCallback, useRef } from "react";
import useAwaitableTransition from "./useAwaitableTransition";

export default function useAbortSignallingTransition() {
	const [isPending, startAwaitableTransition] = useAwaitableTransition();
	const abortController = useRef();

	const startAbortSignallingTransition = useCallback(async (callback) => {
		abortController.current = new AbortController;

		try {
			await startAwaitableTransition(callback);
		} catch(ex) {
			abortController.current.abort();
			// throw ex;
		}
	}, [startAwaitableTransition]);

	return [isPending, startAbortSignallingTransition, abortController.signal];
};