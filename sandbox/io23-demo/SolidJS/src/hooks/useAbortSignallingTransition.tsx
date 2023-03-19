import { Accessor, createSignal } from "solid-js";
import useAwaitableTransition from "./useAwaitableTransition";

export default function useAbortSignallingTransition() : [Accessor<boolean>, (fn: () => void) => Promise<void>, Accessor<AbortSignal>] {
	const [isPending, startAwaitableTransition] = useAwaitableTransition();
	const [abortController, setAbortController] = createSignal(new AbortController);
  
	  const startAbortSignallingTransition = async (callback: () => void) => {
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
  
	  return [isPending, startAbortSignallingTransition, () => abortController().signal];
  }