import { Observable, filter, map, mergeAll, mergeMap } from "rxjs";
import fromPerformanceObserver from "./fromPerformanceObserver";

// TODO: Should this perhaps group interaction events together?
export function interactions() {
	return fromPerformanceObserver({
		type: 'event',
		// buffered: true,
		durationThreshold: 0,
	}).pipe(
		mergeMap(
			list => list.getEntries()
				.filter(entry => entry.interactionId != 0)
				.map(entry => ({
					score: entry.duration,
					entries: [entry],
				}))
		)
	);
}

export default interactions;