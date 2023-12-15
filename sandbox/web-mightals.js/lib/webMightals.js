import { combineLatest, debounceTime, share, startWith } from "rxjs";
import inp from "./inp";
import cls from "./cls";
import lcp from "./lcp";
import loafs from "./loafs";
import interactions from "./interactions";

function assignInitialValueToAll(mapWithObservables, initialValue) {
	// So silly to have to do this Object->entries->fromEntries->Object
	// Alternative of just for-each-key is cleaner but modifies
	return Object.fromEntries(
		Object.entries(mapWithObservables).map(
			([k,v]) => [
				k,
				v.pipe(
					startWith(initialValue)
				)
			]
		)
	);
}

function mergeMightals(mightals) {
	return combineLatest(
		assignInitialValueToAll(mightals, { score: 0, entries: [] })
	).pipe(
		debounceTime(0),
		share() // TODO: should this be the default here?
	);
}

// TODO: Selectively enable based on supported features (feature detection)
export const webMightals$ = mergeMightals({
		"inp": inp(),
		"cls": cls(),
		"lcp": lcp(),
		
		// "interactions": interactions(),
		"loafs": loafs(),
	});

export default webMightals$;