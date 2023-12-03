import oncePerPageload from "./lib/once-per-pageload.js";

function block(ms) {
	const target = performance.now() + ms;
	while (performance.now() < target);
}

function log(name, { timeStamp, processingStart, processingEnd }) {
	if (processingStart === processingEnd) processingEnd += 50;

	// May want to add timeOrigin for logging.  May want to store in localStorage.
	console.log(name);

	performance.measure('[mmocny]' + name + '.inputDelay', {
		start: timeStamp,
		end: processingStart,
	});
	performance.measure('[mmocny]' + name, {
		start: processingStart,
		end: processingEnd,
	});
}



// Note: console doesn't work from page lifecycle events.
function logEvent(event) {
	const eventName = event.type;
	const processingStart = performance.now();

	// Minimal blockage just to visualize the event better
	// block(5);
	// const processingEnd = performance.now();
	const processingEnd = processingStart;

	log(eventName, {
		timeStamp: event.timeStamp,
		processingStart,
		processingEnd,
	})
}

function addEvents(target, types, handler) {
	types.forEach((type) => {
		target.addEventListener(type, handler);
	});
}

function main() {
	addEvents(document, ["click", "visibilitychange"], logEvent);
	addEvents(navigation, ["navigate"], logEvent);
	addEvents(window, ["beforeunload", "pagehide", "pageshow", "popstate", "pushstate"], logEvent);

	log('Hard.timeOrigin', { processingStart: 0 });
}

oncePerPageload(main);