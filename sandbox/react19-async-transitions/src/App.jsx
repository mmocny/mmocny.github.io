import { useState, useTransition, useReducer  } from 'react';
import { ErrorBoundary } from "react-error-boundary";
import './App.css';

async function delay(ms) {
    await scheduler.postTask(() => {}, { delay: ms });
    return performance.now();
}


function NestedComponent() {

}

function Component() {
  const [state1, setState1] = useState("");
  const [state2, setState2] = useState("");
  const [isPending, startTransition] = useTransition();

  // https://react.dev/reference/react/useTransition#starttransition-caveats
  // A state update marked as a Transition will be interrupted by other state updates.
  const handleSubmit = async () => {
    startTransition(async () => {
      setState1("1");
      setState2("2");

      await delay(1000);

      // startTransition(() => {
      //   setState2("3")
      // });

      if (true) {
        setState2("4");
        // TODO: unresolve.
        return Promise.reject(1);
      }

      await delay(1000);
    });

    // setState2("action.sync.2");
    // await delay(1000);
    // setState2("action.async.2");
  };

  return (
    <div>
      <input value={state1} onChange={(event) => setState1(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      <div>{state2}</div>
    </div>
  );
}

function MyComponent() {
  const handleClick = () => {
    try {
      throw new Error("Error from event listener!");
    } catch (error) {
      console.error("Error caught in component", error);
      // Re-throw the error so ErrorBoundary can catch it
      throw error;
    }
  };

  const handleClickAsync = async () => {
      try {
        await Promise.reject(new Error("Async error from event listener!"));
      } catch (error) {
        console.error("Async error caught in component", error)
        throw error;
      }
  }

  return (
    <div>
      <button onClick={handleClick}>Throw Error</button>
      <button onClick={handleClickAsync}>Throw Async Error</button>
    </div>
  );
}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <h2>Something went wrong:</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // optional reset logic
          console.log("ErrorBoundary reset");
        }}
        onError={(error, errorInfo) => {
          console.error("ErrorBoundary caught an error:", error, errorInfo);
          // You can also log the error to an error reporting service
        }}
      >
        <Component />
        {/* <MyComponent /> */}
      </ErrorBoundary>
  );
}

export default App
