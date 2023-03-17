import SearchAsyncYieldy from "./components/SearchAsyncYieldy";
import SearchSyncBlocky from "./components/SearchSyncBlocky";
import SearchSyncDebounced from "./components/SearchSyncDebounced";
import WebVitalsMonitor from "./components/WebVitalsMonitor"



function App() {
  return (
  	<>
    	<WebVitalsMonitor></WebVitalsMonitor>
		<main>
			<ul>
				<li><a href="/bad/">Naive: Synchronous and unresponsive.</a></li>
				<li><a href="/better/">Better: Transition, Delayed+Debounced.</a></li>
				<li><a href="/best/">Best: Asynchronous, yieldy, and abortable.</a></li>
			</ul>
		</main>

		<SearchSyncBlocky></SearchSyncBlocky>
		<SearchSyncDebounced></SearchSyncDebounced>
		<SearchAsyncYieldy></SearchAsyncYieldy>
      </>
  )
}

export default App;