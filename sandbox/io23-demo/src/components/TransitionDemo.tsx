'use client';

import useAbortableTransition from "@/hooks/useAbortSignallingTransition";
import {
	useState,
	use,
	cache,
	Suspense
  } from "react";
  
  // An async function
  async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  async function computeDouble(count: number, abortSignal: AbortSignal) {
	console.log("Computing", count);
	try {
	  for (let i = 0; i < 1000; i++) {
		await delay(1);
		abortSignal.throwIfAborted();
	  }
  
	  console.log("Done", count);
	  return count * 2;
	} catch {
	  console.warn("Aborting", count);
	  return 0;
	}
  }
  
  // cache() to wrap
  const cachedCompute = cache(computeDouble);
  
  // use() to wrap
  function useDoubled(count: number, abortSignal: AbortSignal) {
	return use(cachedCompute(count, abortSignal));
  }
  
  // Must not pass different props to this component, or we will not
  // re-use cache()d values.
  // That includes the signal object, by reference.
  function DefferredCount({ count, abortSignal }: { count: number, abortSignal: AbortSignal}) {
	console.log("Rendering DC:", count);
  
	// Simulate some async api
	const coubled = useDoubled(count, abortSignal);
  
	return <li>Deferred Count: {coubled}</li>;
  }
  
  export default function App() {
	const [isPending, startAbortableTransition, abortSignal] = useAbortableTransition();

	const [count, setCount] = useState(0);
	const [deferredCount, setDC] = useState(count);
  
	console.log("Rendering App:", count);
  
	const increment = () => {
	  const newCount = count + 1;
	  setCount(newCount);
	  startAbortableTransition(() => {
		setDC(newCount);
	  });
	};
  
	return (
	  <div>
		<input type="button" value="increment" onClick={increment}></input>
		<li>Count: {count}</li>
		<div style={isPending ? { backgroundColor: "red" } : {}}>
		  <Suspense>
			<DefferredCount
			  count={deferredCount}
			  abortSignal={abortSignal}
			></DefferredCount>
		  </Suspense>
		</div>
	  </div>
	);
  }
  