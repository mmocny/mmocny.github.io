export default function prettyTime(ms = performance.now()) {
	return ms.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

// Useful to have timestamps comparable even across navigations
// TODO: Maybe just use Date.now() or Date.toLocaleString()?
export default function prettyWallTime() {
	return prettyTime(performance.timeOrigin + performance.now());
}