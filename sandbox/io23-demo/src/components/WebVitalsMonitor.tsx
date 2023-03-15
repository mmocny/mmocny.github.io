'use client';

import { useEffect } from "react";

// TODO: expose type information about new Event Timing APIs

function startLoggingInteractions() {
	let worst_inp = 0;
	
	const observer = new PerformanceObserver(list => {
		for (let entry of list.getEntries()) {
			// @ts-ignore
			if (!entry.interactionId) continue;
		
			// Event Timing entries do not have a renderTime (yet), but its useful to expose one
			// @ts-ignore
			entry.renderTime = entry.startTime + entry.duration;
		
			// Worst INP is typically ~= real INP since most page loads the p98 thing isn't important
			worst_inp = Math.max(entry.duration, worst_inp);
		
			// Don't need to performance.measure() since DevTools already shows Interactions
			const score = entry.duration;
			const label = score <= 200 ? 'GOOD' : score <= 500 ? 'NeedsImprovement' : 'POOR';
		
			console.log(`[Interaction.${entry.name}] Score:`, entry.duration, `<-- ${label}, (worst: ${worst_inp})`);
		}
	});
	
	observer.observe({
		type: "event",
		// @ts-ignore
		durationThreshold: 0,
		buffered: true
	});
	
	return observer;
}
	
	
function startMarkingLoAF() {
	if (!PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')) {
		return console.warn(
			'LoAF Entry type not supported.  Type launching Canary with --enable-blink-featutres=LongAnimationFrameTiming'
		);
	}
	
	const observer = new PerformanceObserver((list) => {
		for (let entry of list.getEntries()) {
			performance.measure('LoAF', {
				start: entry.startTime,
				duration: entry.duration,
			});
		
			// console.log('[LoAF]', entry.duration, entry);
		}
	});
	observer.observe({ type: 'long-animation-frame', buffered: true });

	return observer;
}

export default function WebVitalsMonitor() {
	// TODO: Consider moving to a useHook that return the latest vitals.
	useEffect(() => {
		console.log('Recording Interaction to Next Paint (INP).');

		const observers = [
			startLoggingInteractions(),
			startMarkingLoAF(),
		];
		return () => observers.forEach(observer => observer?.disconnect());
	}, []);

	// TODO:
	// consider a UI overlay
	return <></>;
}