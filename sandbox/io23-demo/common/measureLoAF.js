export default function measureLoAF() {
	if (!PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')) {
		// LoAF Entry type not supported.  Type launching Canary with --enable-blink-featutres=LongAnimationFrameTiming
		return;
	}
	
	const observer = new PerformanceObserver((list) => {
		for (let entry of list.getEntries()) {
			// console.log('[LoAF]', entry.duration, entry);

			performance.measure('LoAF', {
				start: entry.startTime,
				duration: entry.duration,
			});
		}
	});
	observer.observe({ type: 'long-animation-frame', buffered: true });

	return observer;
}