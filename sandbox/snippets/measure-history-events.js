function block(ms) {
	const target = performance.now() + ms;
	while (performance.now() < target);
}

function cleanTime(ms) {
	return ms;
	// return ms.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

// Note: console doesn't work from page lifecycle events.
function logEvent(event) {
	const eventName = event.type;

	const start = performance.now();
	console.log(eventName, "start", cleanTime(start + performance.timeOrigin));
	// localStorage[eventName + ".start"] = cleanTime(start + performance.timeOrigin);

	performance.measure(eventName + ".inputDelay", { start: event.timeStamp, end: start });

	block(200);

	const end = performance.now();
	console.log(eventName, "end", cleanTime(end + performance.timeOrigin));
	// localStorage[eventName + ".end"] = cleanTime(end + performance.timeOrigin);

	performance.measure(eventName + ".processing", { start, end });
}

function oncePerPageLoad() {
	if (window.init_cguhvbj) return;
	window.init_cguhvbj = true;

	document.addEventListener("click", logEvent);
	document.addEventListener('visibilitychange', logEvent);

	navigation.addEventListener('navigate', logEvent);

	window.addEventListener('pagehide', logEvent);
	window.addEventListener('pageshow', logEvent);
	window.addEventListener("popstate", logEvent);
	window.addEventListener("pushstate", logEvent);

	// Inject this script once per page, even after a new navigation
	console.log('Hard.timeOrigin', cleanTime(performance.timeOrigin));
	performance.mark('Hard.timeOrigin', { startTime: 0 }); // Relative to timeOrigin
}

oncePerPageLoad();