import { Accessor, createEffect, createRenderEffect, useTransition } from "solid-js";

export default function useAwaitableTransition() : [Accessor<boolean>, (fn: () => void) => Promise<void>] {
	const [isPending, startTransition] = useTransition();
	let resolveRef: (((value?: any) => void) | undefined);
	let rejectRef: (((reason?: any) => void) | undefined);

	const startAwaitableTransition = async (callback: () => void): Promise<void> => {
		rejectRef?.();

		return new Promise((resolve, reject) => {
			resolveRef = resolve;
			rejectRef = reject;

			startTransition(() => {
				callback();
			});
		});
	};
	
	// TODO: Try render effect?
	createRenderEffect(() => {
		if (!isPending()) {
			resolveRef?.();

			resolveRef = undefined;
			rejectRef = undefined;
		}
	});

	return [isPending, startAwaitableTransition];
}