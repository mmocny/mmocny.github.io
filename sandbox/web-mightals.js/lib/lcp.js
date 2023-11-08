import { mergeMap } from "rxjs";
import fromPerformanceObserver from "./fromPerformanceObserver";

export function lcp() {
	return fromPerformanceObserver({
		type: 'largest-contentful-paint',
		buffered: true,
	}).pipe(
		mergeMap(
			list => list.getEntries().map(entry => ({
				score: entry.startTime,
				entries: [entry],
			}))
		)
	);
}

export default lcp;