import {
	concatMap,
	switchMap,
	delay,
	filter,
	first,
	fromEvent,
	range,
	share,
	map,
	take,
	of,
	scan,
	tap,
	withLatestFrom,
	switchScan,
	mergeScan,
	EMPTY,
	NEVER,
	interval,
	startWith,
	concat,
	asyncScheduler,
	Observable,
	operate,
} from "rxjs";
import pageSlicer$ from "../../lib/pageSlicer";
import webMightals$ from "../../lib/webMightals";

function block(ms) {
	const target = performance.now() + ms;
	while (target > performance.now());
}

function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const clicks$ = fromEvent(myButton, "click").pipe(share());

// Add Layout Shifts
clicks$.pipe(delay(1000)).subscribe((event) => {
	const el = event.target;
	el.style.top = `${el.offsetTop + 100}px`;
});
// Add Long Interaction
clicks$.subscribe(() => {
	block(Math.random() * 400);
});

pageSlicer$.subscribe((value) => {
	console.log("PageSlice:", value);
});

webMightals$.subscribe({
	next: (value) => {
		console.groupCollapsed("webMightals");
		for (let [k, v] of Object.entries(value)) {
			console.log(k, +v.score.toFixed(5), { entries: v.entries });
		}
		console.groupEnd();
	},
	complete: () => { },
});

// ***************************

function primes_sol1() {
	const filterFns = [];
	return range(2, Infinity).pipe(
		filter((n) => filterFns.every((fn) => fn(n))),
		tap((pn) => filterFns.push((n) => n % pn !== 0))
	);
}

function primes_sol2() {
	return range(2, Infinity).pipe(
		switchScan(
			({ filterFns }, prime) => {
				return of(prime).pipe(
					filter((n) => filterFns.every((fn) => fn(n))),
					// Optionally, move this tap() to map() where filterFns is expanded
					// This feels imperative, but also cleaner.
					tap((prime) => filterFns.push((n) => n % prime !== 0)),
					// This is only needed because RxJS requires you return the "accumulator" as the value
					// Some other Observable/Functional libraries have a version of scan/accumulate where State/Return is segmented, like:
					// return [state, value]
					// TODO: write a helper for this
					map((prime) => ({ filterFns, prime }))
				);
			},
			{ filterFns: [], prime: undefined }
		),
		// ...and now remove the needless state
		map((state) => state.prime)
	);
}

function primes_sol3() {
	return range(2, Infinity)
		.pipe(
			share(),
			function filterPrimes(source$) {
				return source$.pipe(
					first(),
					concatMap((pn) =>
						source$.pipe(
							tap(n => console.log('pipeMap', 'n =', n, 'pn =', pn)),
							filter((n) => n % pn !== 0),
							filterPrimes,
							startWith(pn),
						)
					),
				);
			}
		);
}


// pipeMap is a RxJS operator that is meant to help chain a series of RxJS operators together, based on the input stream.
// Similar to how mergeMap() will add new observable streams to the output stream... pipeMap will add new operators to the current streams' pipe.
// 
// pipeMap() is a function that:
// - Accepts a Callback (will be called with each value in the stream, similar to what RxJS filter() or map() operator might accept)
// - This callback will return a new RxJS operator, every time it is called with a new value from the input stream.
// - That operator which is returned gets piped() on to the end of the current stream.
// - The value that was used to produce this new operator should also be produced by the output stream.
//
// For example, if an input stream emits the values: 1, 2, 3, 4, 5
// pipeMap() should call the callback 5 times, each time receiving a new a new operator,
// and the final output stream should have 5 operators attached to it.

// Called one per Observable creation
// function pipeMap(cb) {
// 	// Started once per Observable subscription, which includes recursively calling itself
// 	return source$ => source$.pipe(
// 		first(), // Use this to stop the stream... we want to switchMap exactly once in this stream.
// 		switchMap(value => source$.pipe( // TODO: this re-subscribes to the source$ stream, which is not ideal if that stream is COLD.  Besides forcing HOT, is there some way to avoid complete+resubscribe?  How does switchMap() do it internally?
// 			// tap(value2 => console.log('pipeMap', 'pn=', value, 'n=', value2)),
// 			cb(value),
// 			pipeMap(cb),
// 			startWith(value),
// 		)),
// 	);
// }

// Called one per Observable creation
function pipeMap(cb) {
	// Started once per Observable subscription, which includes recursively calling itself
	return source$ => {

		let piped$ = source$
			.pipe(
				share(),
			);

		const results$ = new Observable(destination => {
			function recurse() {
				piped$.subscribe(
					operate({
						destination,
						next(value) {
							// TODO: alternative: .pipe(first()) ?
							piped$.unsubscribe();

							// TODO: needed?
							destination.next(value);

							const operator = cb(value);
							piped$ = piped$.pipe(operator);

							// recurse();
						}
					})
				)
			}
			recurse();
		});

		return results$;
	};
}

function primes_sol4() {
	return range(2, Infinity)
		.pipe(
			share(), // TODO: Any alternatives to this?  Idea: maybe instead of switchMap we need a new Observer() which keeps listening to the source stream, but replacing the wrapped Observable??.
			pipeMap(
				pn => filter((n) => n % pn !== 0)
			),
		);
}

primes_sol4()
	.pipe(
		take(10),
	).subscribe(
		console.log
	);
