"use client";

import React, { cache, use, useDeferredValue, Suspense, useState, useTransition, useEffect } from "react";




function block(ms: number) {
  const target = performance.now() + ms;
  while (performance.now() < target) {}
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function raf() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}



const Random =
  React.memo(
    function Random(props: any) {
      // const deferredState = useDeferredValue(props.state);
      const deferredState = props.deferredState;

      // block(5);
      block(50);
      // use(delay(5));
    
      return <li>DeferredState: {deferredState} Random: {Math.random()}</li>;
    }
  );



export default function Home() {
  const [state, setState] = useState(0);

  // const deferredState = state;
  // const [deferredState, setDeferredState] = useState(0);
  const deferredState = useDeferredValue(state);

  const [isPending, startTransition] = useTransition();

  const shouldRafPoll = false;
  if (shouldRafPoll) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      // Cannot pass async to useEffect so need to wrap.
      (async () => {
        for (;;) {
          await raf();
        }
      })();
    }, []);
  }

  const click = async (event: any) => {
    setState(state + 1);

    // startTransition(() => {
    //   setDeferredState(state + 1);
    // });
  };

  // block(10);

  return (
    <>
      <div>React Version: {React.version}</div>

      <div>State: {state}</div>
      
      <div><input type="button" onClick={click} value="Click Me"/></div>

      {/* <Suspense> */}
        <ul>
          { /* eslint-disable-next-line react/jsx-key  */ }
          {Array.from({ length: 10 }).map((_, i) => <Random key={i} deferredState={deferredState} />)}
        </ul>
      {/* </Suspense> */}
    </>
  );
}
