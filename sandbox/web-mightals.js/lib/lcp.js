import { Observable, mergeMap } from "rxjs";
import fromPerformanceObserver from "./fromPerformanceObserver";

export function lcp() {
	return new Observable(subscriber => {
		const obs = fromPerformanceObserver({
			type: 'largest-contentful-paint',
			buffered: true,
		}).pipe(
			mergeMap(
				list => list.getEntries()
			)
		);

		obs.subscribe((entry) => {
			subscriber.next({
				score: entry.startTime,
				entries: [entry],
			});
		});

		// TODO: test this
		return obs.unsubscribe;
	});
}

export default lcp;