
// rafPoll forces eager frame scheduling (and allows for setTimeout to run before next raf)
export function rafPoll() {
	requestAnimationFrame(rafPoll);
}

// This will block the main thread, preventing other tasks from running
export function block(ms, why) {
	console.log(why, 'start blocking for', ms);
	const target = ms + performance.now();
	while (performance.now() < target);
	console.log(why, 'end blocking for', ms);
}

export function observerEventTiming() {
	const po = new PerformanceObserver((list) => {
		for (let entry of list.getEntries()) {
			if (!entry.interactionId) continue;

			console.log(entry.entryType, entry.duration, entry);
		}
	});
	po.observe({ type: 'event', durationThreshold: 0, buffered: true });
}