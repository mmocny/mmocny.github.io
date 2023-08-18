import { Deferred } from "./deferred";
import { afterNextPaint } from "./utils";

async function measureNextINP(timeStamp, type) {
	let timer;
	const nextINP = new Deferred<{ [key: string]: number }>();

	new PerformanceObserver((entryList, observer) => {
		for (let entry of entryList.getEntries()) {
			if (entry.name != type) continue;
			if (entry.startTime != timeStamp) continue;
			if (entry.startTime > timeStamp) nextINP.reject();

			nextINP.resolve({
				startTime: entry.startTime,
				// @ts-ignore
				processingStart: entry.processingStart,
				// @ts-ignore
				processingEnd: entry.processingEnd,
				renderTime: entry.startTime + entry.duration,
				duration: entry.duration,
			});
			observer.disconnect();
			clearTimeout(timer);
			return;
		}
		// @ts-ignore
	}).observe({ type: 'event', durationThreshold: 0 });

	// Measure the time on main thread for this event, and if it is <16ms we may not meet the 16ms threshold.
	await 0;
	if (performance.now() - timeStamp < 16) {
		timer = setTimeout(() => nextINP.resolve({
			startTime: timeStamp,
			processingStart: 0,
			processingEnd: 0,
			renderTime: 0,
			duration: 0,
		}), 500);
	}

	return nextINP.promise;
}

async function measureNextFCPLCP(connectToDeferredSoftNav, abortSignal) {
	if (abortSignal.aborted) {
		return [Promise.reject(), Promise.reject()];
	}

	await connectToDeferredSoftNav();

	const nextFCP = new Deferred<number>();
	const nextLCP = new Deferred<number>();

	const fcpObserver = new PerformanceObserver((entryList, observer) => {
		for (let entry of entryList.getEntries()) {
			if (entry.name != 'first-contentful-paint') continue;
			nextFCP.resolve(entry.startTime);
			observer.disconnect();
		}
	});

	// TODO: Keep listening to new LCP entries for this navigationID
	// ...resolve() after next navigation or unload or interaction
	const lcpObserver = new PerformanceObserver((entryList, observer) => {
		console.assert(entryList.getEntries().length === 1, "Expected only one soft-nav entry.");
		const entry = entryList.getEntries()[0];
		nextLCP.resolve(entry.startTime);
		observer.disconnect();
	});

	abortSignal.addEventListener('abort', () => {
		console.log('aborted');
		fcpObserver.disconnect();
		lcpObserver.disconnect();
		nextFCP.reject();
		nextLCP.reject();
	});

	// @ts-ignore
	fcpObserver.observe({ type: 'paint', includeSoftNavigationObservations: true });
	// @ts-ignore
	lcpObserver.observe({ type: 'largest-contentful-paint', includeSoftNavigationObservations: true });

	return [nextFCP.promise, nextLCP.promise];
}


// Only one stored interaction seems to work at a time.
// If there is an "async" operation after interaction and a new event arrives, the previous
// can no longer kick off a navigation.
// This may not be a flaw in soft-nav reporting?  TODO: Test this.
function createDeferredSoftNav() {
	// 1. Pre-requisite: Must be called from the context of an interaction (trusted "click" event)
	// ...wrapper() helper ensures this.

	// 2. Create a "connection" to a future soft nav (via task attribution)
	const promise = Promise.resolve();

	// Call this when you are ready to start a soft nav...
	return async () => {
		// 3. "Connect" to the a previous interaction via task attribution.
		await promise;
		
		// 4. Update history
		const url = document.URL;
		history.replaceState(history.state, "", "fake");
		history.replaceState(history.state, "", url);
		// Alternative:
		// history.pushState({ fake: true }, "");
		// await 0;
		// history.back();

		// 5. Post-requisite: Update the DOM.

		console.log('ready for dom update');
	};
}

let abortController;

export function wrapper(callback) {
	return (event) => {
		const nextINP = measureNextINP(event.timeStamp, event.type);
		const deferredSoftNav = createDeferredSoftNav();

		if (abortController) abortController.abort();
		abortController = new AbortController();

		const startMeasureNextFCPLCP = async () => await measureNextFCPLCP(deferredSoftNav, abortController.signal);

		callback(event, nextINP, startMeasureNextFCPLCP);
	}
}
