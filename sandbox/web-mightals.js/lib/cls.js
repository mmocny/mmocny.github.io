import { Observable, mergeMap } from "rxjs";
import fromPerformanceObserver from "./fromPerformanceObserver";

export function cls() {
	return new Observable(subscriber => {
		let totalCls = 0;
		const entries = [];

		const obs = fromPerformanceObserver({
			type: 'layout-shift',
			buffered: true,
		}).pipe(
			mergeMap(
				list => list.getEntries()
			)
		);

		obs.subscribe((entry) => {
			if (!entry.hadRecentInput) {
				entries.push(entry);
				totalCls += entry.value;
				subscriber.next({
					score: totalCls,
					entries,
				});
			}
		});

		// TODO: test this
		return obs.unsubscribe;
	});
}

export default cls;