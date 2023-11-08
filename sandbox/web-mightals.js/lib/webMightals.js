
/**
 * - Slices based on timestamps.  After timestamp is inclusive to the new route.
 * - Each new entry added to correct slice first
 */

import { combineLatest, debounceTime, startWith } from "rxjs";
import inp from "./inp";
import cls from "./cls";
import lcp from "./lcp";
import loafs from "./loafs";
import interactions from "./interactions";

// TODO: subscribe with next: and complete: to take all vs only final scores?
// TODO: can complete() handler take the last value?
export function webMightals() {
	const mightals = {
		"inp": inp(),
		"cls": cls(),
		"lcp": lcp(),
		
		// "interactions": interactions(),
		"loafs": loafs(),
	};


	return combineLatest(
			Object.fromEntries(
				Object.entries(mightals).map(
					([k,v]) => [
						k,
						v.pipe(
							startWith({ score: 0, entries: [] })
						)
					]
				)
			)
		).pipe(
			debounceTime(0)
		);

}

export default webMightals;