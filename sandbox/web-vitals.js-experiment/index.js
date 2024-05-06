import { onLCP, onINP, onCLS } from 'https://unpkg.com/web-vitals@next/attribution?module';

function reportWebVitals(url, result) {
  console.log(url, result);
}

let currentNavigationId = 0;

function startMetricsCollection(event) {
	const url = document.URL;
	const navigationId = ++currentNavigationId;

	console.log("starMetricsCollection", url, navigationId, event);

	// web-vitals doesn't support stopping metrics collection
	const wrapper = (...args) => {
		if (navigationId !== currentNavigationId) return;
		reportWebVitals(url, ...args);
	}

	[onLCP, onINP, onCLS].forEach((fn) => {
		fn(wrapper, {
			reportAllChanges: true,
			buffered: false,
		});
	});
}

function stopMetricsCollection(event) {
	console.log("stopMetricsCollection", event);

	// web-vitals doesn't support forcing takeAll()
	currentNavigationId++;
}

function resetMetricsCollection(event) {
	stopMetricsCollection(event);
	startMetricsCollection(event);
}

['popstate', 'pageshow'].forEach(type => window.addEventListener(type, startMetricsCollection));
window.addEventListener('pagehide', stopMetricsCollection);
navigation.addEventListener('navigate', resetMetricsCollection);

function block(ms) {
	const target = performance.now() + ms;
	while (performance.now() < target) {}
}

myButton.addEventListener('click', () => {
	// Trigger CLS
	setTimeout(() => {
		myDiv.style.top = `${parseInt(myDiv.style.top) + 100}px`;
	}, 1000);

	// Trigger INP
	block(50);
});

mySoftNav.addEventListener('click', () => {
	history.pushState({}, '', '?soft-nav' + Math.random());
});