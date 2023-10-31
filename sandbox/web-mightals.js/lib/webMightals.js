
/**
 * - Slices based on timestamps.  After timestamp is inclusive to the new route.
 * - Each new entry added to correct slice first
 */

import { combineLatest, startWith } from "rxjs";
import inp from "./inp";
import cls from "./cls";
import lcp from "./lcp";

// TODO: subscribe with next: and complete: to take all vs only final scores?
// TODO: can complete() handler take the last value?
export function webMightals() {
	const mightals = {
		"inp": inp().pipe(startWith({ score: 0, entries: [] })),
		"cls": cls().pipe(startWith({ score: 0, entries: [] })),
		"lcp": lcp().pipe(startWith({ score: 0, entries: [] })),
	};

	return combineLatest(mightals);
}

export default webMightals;