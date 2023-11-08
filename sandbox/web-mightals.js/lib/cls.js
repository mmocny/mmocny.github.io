import { Observable, mergeMap, scan } from "rxjs";
import fromPerformanceObserver from "./fromPerformanceObserver";

// TODO: refactor to expose all shifts first, then convert to CLS
export function cls() {
	return fromPerformanceObserver({
		type: 'layout-shift',
		// buffered: true,
	}).pipe(
		mergeMap(
			list => list.getEntries()
				.filter(entry => !entry.hadRecentInput)
				.map(entry => ({
					score: entry.value,
					entries: [entry],
				}))
		),
		scan((acc, curr) => ({
			score: acc.score + curr.score,
			entries: acc.entries.concat(curr.entries),
		}), { score: 0, entries: [] })
	);
}

export default cls;