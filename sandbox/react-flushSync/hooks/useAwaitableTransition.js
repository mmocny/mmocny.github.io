import { useCallback, useRef, useTransition } from "react";

export default function useAwaitableTransition() {
	const [isPending, startTransition] = useTransition();
	const resolveRef = useRef();
	const rejectRef = useRef();

	const startAwaitableTransition = useCallback(
		(callback) => {
			// Starting new transitions will cancel previous ones, so reject() the previous promise
			rejectRef.current?.();

			return new Promise((resolve, reject) => {
				resolveRef.current = resolve;
				rejectRef.current = reject;
				startTransition(callback);
			});
		}, [startTransition, rejectRef]);

	if (!isPending && resolveRef.current) {
		resolveRef.current?.();

		resolveRef.current = undefined;
		rejectRef.current = undefined;
	}

	return [isPending, startAwaitableTransition];
};