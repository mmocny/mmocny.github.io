export default function measureInteractions() {
	let worst_inp = 0;
	
	const observer = new PerformanceObserver(list => {
		for (let entry of list.getEntries()) {
			if (!entry.interactionId) continue;
		
			// Event Timing entries do not have a renderTime (yet), but its useful to expose one
			entry.renderTime = entry.startTime + entry.duration;
		
			// Worst INP is typically ~= real INP since most page loads the p98 thing isn't important
			worst_inp = Math.max(entry.duration, worst_inp);
		
			// Don't need to performance.measure() since DevTools already shows Interactions
			const score = entry.duration;
			const label = score <= 200 ? 'GOOD' : score <= 500 ? 'NeedsImprovement' : 'POOR';
		
			const monoStyle = "color: grey; font-family: Consolas,monospace";
			const resetStyle = "";
			const scoreToStyle = (score) => {
				if (score <= 200) return 'color: green';
				if (score <= 500) return 'color: yellow';
				return 'color: red';
			}
			console.log(
				`%c[Interaction: ${entry.name.padEnd(12)}] %cDuration: %c${entry.duration}`,
				monoStyle,
				resetStyle,
				scoreToStyle(entry.duration));
		}
	});
	
	observer.observe({
		type: "event",
		durationThreshold: 0,
		buffered: true
	});
	
	return observer;
}