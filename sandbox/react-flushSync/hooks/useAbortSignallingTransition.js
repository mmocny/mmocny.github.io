import { useCallback, useRef } from "react";
import useAwaitableTransition from "./useAwaitableTransition";

export default function useAbortSignallingTransition() {
	const [isPending, startAwaitableTransition] = useAwaitableTransition();
	const abortController = useRef(new AbortController);

	const startAbortSignallingTransition = useCallback(async (callback) => {
		let prevAC = abortController.current;
		let nextAC = new AbortController();
		abortController.current = nextAC;

		try {
			await startAwaitableTransition(callback);
		} catch(ex) {
			// abortController.current has already been updated by the time we catch,
			// so use the previously saved `prevAC` value
			prevAC.abort();
			// throw ex;
		}
	}, [startAwaitableTransition]);

	return [isPending, startAbortSignallingTransition, abortController.current.signal];
};