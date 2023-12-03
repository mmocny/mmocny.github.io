import eventNames from './eventNames.js';
import reportEventTiming from './stateMachine.js';

function block(ms) {
	const target = performance.now() + ms;
	while (performance.now() < target);
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function raf() {
	return new Promise(resolve => requestAnimationFrame(resolve));
}

async function after_next_paint() {
	await raf();
	await Promise.race(delay(0), raf()); // TODO: AbortController
}

eventNames.forEach(eventName => {
	// Add this as early as possible and use `capture` in order to measure events which stop propagation.
	document.addEventListener(eventName, async function report_capture(event) {
		// console.log('Event:', eventName, event.keyCode, event.key, event.code, performance.now() - event.timeStamp);
		reportEventTiming(event);
	}, { capture: true });

	// Best effort measure of main thread duration.
	document.addEventListener(eventName, async function report_bubbles(event) {
		await raf();
		performance.measure(eventName, { start: event.timeStamp, end: performance.now() });
	}, { capture: false });
});


eventNames.forEach(eventName => {
	Array.from({ length: 1 }).forEach(() => {

		document.addEventListener(eventName, async function add_delay_capture() {
			block(10);
		}, { capture: true });

		document.addEventListener(eventName, async function add_delay_bubbles() {
			block(10);
		}, { capture: false });

	});
});