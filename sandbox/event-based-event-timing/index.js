const eventsForTiming = [
	'keydown',
	'keypress',
	'keyup',
	'pointerdown',
	'pointerup',
	'click',
];

// Add this as early as possible in order to measure events which stop propagation.
eventsForTiming.forEach(eventType => {
	document.documentElement.addEventListener(eventType, function event_timing_polyfill(event) {
		const processingStart = performance.now();
		// event.timeStamp can be innacurate, so clamp it.
		const startTime = Math.min(event.timeStamp, processingStart);

		const eventTimingEntry = {
			event, // extra, for polyfill

			name: event.type,
			startTime,
			processingStart,
			processingEnd: 0,
			endTime: 0,
			duration: 0,
			interactionId: 0,
		};
		function updateDuration(ts) { eventTimingEntry.duration = ts - eventTimingEntry.startTime; };
		
		// TODO: Share a "state machine" for assigning interactionId.  Async process.
		// assignInteractionId(eventTimingEntry).then(...);
		
		nextTaskStart().then(() => {
			eventTimingEntry.processingEnd = performance.now();
			updateDuration(eventTimingEntry.processingEnd);
		});

		afterNextPaint().then(() => {
			eventTimingEntry.endTime = performance.now();
			updateDuration(eventTimingEntry.endTime);

		    performance.measure(eventType, { start: startTime, end: eventTimingEntry.endTime });
		});

		// Note: This object will update over time
		console.log('Event:', eventType, eventTimingEntry);
	}, { capture: true });
});

/***********************/

const eventsForScheduling = [
	...eventsForTiming,
	'compositionstart',
	'compositionupdate',
	'compositionend',
	'beforeinput',
	'input',
	//... add more as needed
];

const anyEvent = new EventTarget();
eventsForScheduling.forEach(eventType => {
	document.documentElement.addEventListener(eventType, () => {
		anyEvent.dispatchEvent(new Event("event"));
	}, { capture: true });
});

function nextEvent() {
	return new Promise(resolve => {
		anyEvent.addEventListener("event", resolve, { once: true });
	});
}

function tick() {
	return new Promise((resolve) => {
		const channel = new MessageChannel();
		channel.port1.onmessage = resolve;
		channel.port2.postMessage(undefined);
	  });
}

function raf() {
	return new Promise(resolve => requestAnimationFrame(resolve));
}

async function nextTaskStart() {
	await Promise.race([tick(), nextEvent(), raf()]);
}

async function afterNextPaint() {
	await raf();
	await nextTaskStart();
}

