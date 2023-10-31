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
		const value = undefined;
		subscriber.next(value);

		const cleanup = () => { };
		return cleanup;
	});

}

export default pageSlicer;