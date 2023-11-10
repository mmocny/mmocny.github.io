import { distinctUntilChanged, groupBy, mergeMap, scan } from "rxjs";
import interactions from "./interactions";

export function inp() {
	return interactions()
		.pipe(
			// TODO: groupBy creates an obs for each... should we complete() streams eventually?
			// Idea: auto-complete the previous n-th stream?
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