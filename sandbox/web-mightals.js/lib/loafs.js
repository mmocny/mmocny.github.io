import { Observable, mergeMap } from "rxjs";
import fromPerformanceObserver from "./fromPerformanceObserver";

export function loafs() {
	return fromPerformanceObserver({
		type: 'long-animation-frame',
		// buffered: true,
	}).pipe(
		mergeMap(
			list => list.getEntries().map(entry => ({
				score: entry.duration,
				entries: [entry],
			}))
		)
	);
}

export default loafs;