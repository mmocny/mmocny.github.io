import { delay } from "./utils";
import { wrapper } from "./interaction_to_next_soft_lcp";

document.addEventListener("click", wrapper(async (event, nextINP, startMeasureNextFCPLCP) => {
	const startTime = event.timeStamp;

	const div = document.createElement('div');
	div.textContent = 'Starting Update...';
	document.body.appendChild(div);

	// Start fetching async resources
	const resources = await delay(500);

	// Do not `await nextINP` until after other work is started.
	// Alternatively, use nextINP.then() at the start of callback.
	const { processingStart, processingEnd, renderTime, duration: inpDuration } = await nextINP;
	console.log('Just Measured [nextINP]:', inpDuration);

	const [nextFCP, nextLCP] = await startMeasureNextFCPLCP();

	const div2 = document.createElement('div');
	div2.textContent = 'Finished Update. [INP]: ' + inpDuration.toFixed(2) + 'ms';
	document.body.replaceChild(div2, div);

	try {
		const fcpDuration = await nextFCP - startTime;
		console.log('Just Measured [nextFCP]:', fcpDuration);

		div2.textContent += ", [FCP]: " + fcpDuration.toFixed(2) + "ms";
	} catch (e) {
		console.warn('Next FCP was cancelled by new interaction.');
	}

	try {
		const lcpDuration = await nextLCP - startTime;
		console.log('Just Measured [nextLCP]:', lcpDuration);

		div2.textContent += ", [LCP]: " + lcpDuration.toFixed(2) + "ms";
	} catch (e) {
		console.warn('Next LCP was cancelled by new interaction.');
	}
}));