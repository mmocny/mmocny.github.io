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
	const eventName = 'Soft.' + event.type;

	const start = performance.now();
	console.log(eventName, ".start", cleanTime(start + performance.timeOrigin));
	// localStorage[eventName + ".start"] = cleanTime(start + performance.timeOrigin);

	performance.mark(eventName + ".start", { startTime: start });

	block(200);

	const end = performance.now();
	console.log(eventName, ".end", cleanTime(end + performance.timeOrigin));
	// localStorage[eventName + ".end"] = cleanTime(end + performance.timeOrigin);

	performance.measure(eventName, { start, end });
}

function oncePerPageLoad() {
	if (window.init) return;
	window.init = true;

	navigation.addEventListener('navigate', logEvent);
	document.addEventListener('visibilitychange', logEvent);
	window.addEventListener('pagehide', logEvent);
	window.addEventListener('pageshow', logEvent);
	window.addEventListener("popstate", logEvent);
	window.addEventListener("pushstate", logEvent);

	// Inject this script once per page, even after a new navigation
	console.log('Hard.timeOrigin', cleanTime(performance.timeOrigin));
	performance.mark('Hard.timeOrigin', { startTime: 0 }); // Relative to timeOrigin
}

oncePerPageLoad();