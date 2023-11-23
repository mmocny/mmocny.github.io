import { useCallback, useLayoutEffect, useRef, useTransition } from "react";

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
		}, [startTransition]);

	// We need to skip this next step if we are rendering inside a transition.
	// I don't know of any way to detect rendering inside vs outside of a transition.
	// Except to use an effect (which don't run from transitions).
	// The downside of this is that now the promise resolves in the middle of layout effect,
	// And so get scheduled in the microtask queue of the same task (i.e. after layout effects fire).
	// It would possibly be better to run before, as part of the rendering step itself.  Not usre.

	// Wont work:
	// if ( !isPending && resolveRef.current ) ...

	// Will work:
	useLayoutEffect(() => {
		if (isPending) return;

		resolveRef.current?.();

		resolveRef.current = undefined;
		rejectRef.current = undefined;
	}, [isPending]);

	return [isPending, startAwaitableTransition];
};