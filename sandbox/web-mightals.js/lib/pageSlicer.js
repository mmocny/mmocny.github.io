import { Observable, combineLatest, share } from 'rxjs';

/**
 * - Treat show/hide as distinct navigation types.
 * - A hidden page is a separate slice, and metrics will stillg get reported.  You can ignore the data, if you like.
 *   - e.g. Prerendering, visibility hidden, bfcache stored, etc.
 * 
 * - activation start
 * - bfcache restore
 * - softnavs
 * 
 * - visibility change?
 * - custom marks?
 * 
 * - Warning: timeStamps on main vs timeStamps of paint?
 */

function navigations() {
	// TODO: Consider replacing this with a Subject and listening to all navigation types only once,
	// creating a HOT observable for them.
	return new Observable(subscriber => {
		navigation.addEventListener("navigate", e => {
			if (!e.canIntercept || e.hashChange) {
			  return;
			}

			subscriber.next({
				timestamp: e.timeStamp,
				type: 'navigation',
				url: e.destination.url,
			});
		});

		// TODO: remove event listener?
		const cleanup = () => {};
		return cleanup;
	});
}

export const pageSlicer$ = combineLatest([
		navigations()
	]).pipe(
		share()
	);

export default pageSlicer$;