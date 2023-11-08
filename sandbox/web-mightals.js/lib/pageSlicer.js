import { Observable } from 'rxjs';

/**
 * - activation start
 * - bfcache restore
 * - softnavs
 * 
 * - visibility change?
 * - custom marks?
 * 
 * - Warning: timeStamps on main vs timeStamps of paint?
 */

export function pageSlicer() {
	return new Observable(subscriber => {
		navigation.addEventListener("navigate", e => {
			console.log(e);
			
			if (!e.canIntercept || e.hashChange) {
			  return;
			}

			subscriber.next(e.destination.url);
		});

		// TODO: remove event listener?
		const cleanup = () => {};
		return cleanup;
	});
}

export default pageSlicer;