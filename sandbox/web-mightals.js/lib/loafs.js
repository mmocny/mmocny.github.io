import { Observable, mergeMap } from "rxjs";
import fromPerformanceObserver from "./fromPerformanceObserver";

export function loafs() {
	return new Observable(subscriber => {
		const obs = fromPerformanceObserver({
			type: 'long-animation-frame',
			buffered: true,
		}).pipe(
			mergeMap(
				list => list.getEntries()
			)
		);

		obs.subscribe((entry) => {
			subscriber.next({
				score: entry.duration,
				entries: [entry],
			});
		});

		// TODO: test this
		return obs.unsubscribe;
	});
}

export default loafs;