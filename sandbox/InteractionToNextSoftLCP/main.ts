import { afterNextPaint, delay } from "./utils";
import { wrapper } from "./interaction_to_next_soft_lcp";

function initialRenderUpdate() {
	const div = document.createElement('div');
	div.textContent = 'Starting Update...';
	document.body.appendChild(div);
	return div;
}

function updateRender(div) {
	const div2 = document.createElement('div');
	div2.textContent = 'Finished Update.';
	document.body.replaceChild(div2, div);
	return div2;
}

async function reportMeasures(el, nextINP, nextRender, nextFCP, nextLCP) {
	// INP (should already be resolved)
	const { startTime, processingStart, processingEnd, renderTime, duration: inpDuration } = await nextINP;
	console.log('Just Measured [nextINP]:', inpDuration);
	el.textContent += ", [INP]: " + inpDuration.toFixed(2) + "ms";

	const domRenderTime = await nextRender - startTime;
	el.textContent += ", [Render]: " + domRenderTime.toFixed(2) + "ms";

	// FCP
	try {
		const fcpDuration = await nextFCP - startTime;
		console.log('Just Measured [nextFCP]:', fcpDuration);
		el.textContent += ", [FCP]: " + fcpDuration.toFixed(2) + "ms";
	} catch (e) {
		console.warn('Next FCP was cancelled by new interaction.');
	}

	// LCP
	try {
		const lcpDuration = await nextLCP - startTime;
		console.log('Just Measured [nextLCP]:', lcpDuration);
		el.textContent += ", [LCP]: " + lcpDuration.toFixed(2) + "ms";
	} catch (e) {
		console.warn('Next LCP was cancelled by new interaction.');
	}
}

document.addEventListener("click", wrapper(async (event, nextINP, startMeasureNextFCPLCP) => {
	// Initial feedback... will affect INP
	let el = initialRenderUpdate();

	// Start fetching async resources... will not affect INP
	const resources = await delay(500);

	// Call this before final DOM update
	const [nextFCP, nextLCP] = await startMeasureNextFCPLCP();

	// Apply Async updates!... will affect next FCP, LCP
	el = updateRender(el);

	// Measure nextRender time using JavaScript... this is the best you can do using vanilla JS for async operations.
	const nextRender = (async () => {
		await afterNextPaint();
		return performance.now();
	})();

	console.log('dom updated');

	reportMeasures(el, nextINP, nextRender, nextFCP, nextLCP);
}));