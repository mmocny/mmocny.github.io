import { Observable, distinctUntilChanged, filter, groupBy, map, mergeAll, mergeMap, scan } from "rxjs";
import fromPerformanceObserver from "./fromPerformanceObserver";
import interactions from "./interactions";

export function inp() {
	let maxInp = 0;

	return interactions()
		.pipe(
			groupBy((value) => value.entries[0].interactionId),
			mergeMap((group$) => {
				return group$.pipe(
					scan((acc, curr) => ({
						score: Math.max(acc.score, curr.score),
						entries: acc.entries.concat(curr.entries),
					}), { score: 0, entries: [] })
				);
			}),
			distinctUntilChanged((prev, curr) => {
				// Return true if the current INP is "same" as existing
				return curr.score <= prev.score;
			})
		);
}

export default inp;