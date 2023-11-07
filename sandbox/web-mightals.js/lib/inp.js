import { Observable, filter, mergeAll, mergeMap } from "rxjs";
import fromPerformanceObserver from "./fromPerformanceObserver";

export function inp() {
	return new Observable(subscriber => {
		const idToEventMap = {};
		let maxInp = 0;

		const obs = fromPerformanceObserver({
			type: 'event',
			buffered: true,
			durationThreshold: 0,
		}).pipe(
			mergeMap(
				list => list.getEntries()
			),
			filter(
				et => !!et.interactionId
			)
		);

		obs.subscribe((entry) => {
			const interactionEntries = (idToEventMap[entry.interactionId] ??= []);
			interactionEntries.push(entry);
			if (entry.duration > maxInp) {
				maxInp = entry.duration;
				subscriber.next({
					score: entry.duration,
					entries: interactionEntries,
				});
			}
		});

		// TODO: test this
		return () => {
			console.log('here');
			obs.unsubscribe();
		};
	});
}

export default inp;