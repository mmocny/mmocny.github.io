import { Accessor, createEffect, onCleanup } from "solid-js";

// This is a very trivial version of this hook.
// There are several libraries that provide more robust versions.
export default function useDefferredEffect<T>(deps: Accessor<T>, callback: (val: T) => void, delay: number) {
	// TODO: perhaps using the promise based version of setTimeout and createResource() is better
	createEffect(() => {
		const val = deps();
		const timerid = setTimeout(() => callback(val), delay);
		onCleanup(() => {
			clearTimeout(timerid);
		});
	});
  };