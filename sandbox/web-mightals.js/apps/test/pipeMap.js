import {
	Observable,
	operate
} from "rxjs";

// pipeMap is a RxJS operator that is meant to help chain a series of RxJS operators together, based on the input stream.
// Similar to how mergeMap() will add new observable streams to the output stream... pipeMap will add new operators to the current streams' pipe.
// 
// pipeMap() is a function that:
// - Accepts a Callback (will be called with each value in the stream, similar to what RxJS filter() or map() operator might accept)
// - This callback will return a new RxJS operator, every time it is called with a new value from the input stream.
// - That operator which is returned gets piped() on to the end of the current stream.
// - The value that was used to produce this new operator should also be produced by the output stream.
// Called one per Observable creation
export function pipeMap(fn) {
	return source$ => new Observable(destination => {
		function recurse(stream$) {
			stream$.subscribe(
				operate({
					destination,
					next(value) {
						destination.next(value);

						const operator = fn(value);
						stream$.pipe(
							operator,
							recurse
						);
					}
				})
			);
		}
		recurse(source$);
	});
}


import { switchMap, startWith } from "rxjs";

// Uses switchMap to switch this source stream to a new stream, which merely adds a new pipe() operator to the current stream
export function pipeMap2(fn) {
	return source$ => source$.pipe(
		switchMap(value => {
			const operator = fn(value);
			return source$.pipe(
				operator,
				pipeMap2(fn),
				startWith(value)
			);
		})
	);
}
