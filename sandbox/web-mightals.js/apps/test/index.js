import {
	concatMap,
	switchMap,
	mergeMap,
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
	takeWhile,
	expand,
	rx,
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

const clicks$ = fromEvent(myButton, "click");

// Add Layout Shifts
rx(clicks$, delay(1000)).subscribe((event) => {
	const el = event.target;
	el.style.top = `${el.offsetTop + 100}px`;
});
// Add Long Interaction
clicks$.subscribe((event) => {
	block(Math.random() * 400);
});

pageSlicer$.subscribe((value) => {
	console.log("PageSlice:", value);
});

webMightals$.subscribe((value) => {
	console.groupCollapsed("webMightals");
	for (let [k, v] of Object.entries(value)) {
		console.log(k, +v.score.toFixed(5), { entries: v.entries });
	}
	console.groupEnd();
});



// ***************************

// This is a *very* imperative implementation, as baseline
function primes_sol0() {
	const filterFns = [];
	return rx(
		range(2, Infinity),
		mergeMap((n) => {
			const is_prime = filterFns.every((fn) => fn(n));
			if (is_prime) {
				filterFns.push((n) => n % n !== 0);
				return from(n);
			}
			return EMPTY;
		})
	);
}

// This is also very imperative, but uses some operators
function primes_sol1() {
	const filterFns = [];
	return range(2, Infinity).pipe(
		filter((n) => filterFns.every((fn) => fn(n))),
		tap((pn) => filterFns.push((n) => n % pn !== 0))
	);
}

function withState(fn, state) {
	return source$ => rx(
		source$,
		map(value => {
			[state, value] = fn(state, value);
			return value;
		})
	);
}

function primes_sol2b() {
	return rx(
		range(2, Infinity),
		withState((filterFns, pn) => {
			const is_prime = filterFns.every((fn) => fn(n));
			if (is_prime) {
				filterFns.push((n) => n % n !== 0);
				return n;
			}
			return EMPTY;
		}, [])
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
							// tap(n => console.log('pipeMap', 'n =', n, 'pn =', pn)),
							filter((n) => n % pn !== 0),
							filterPrimes,
							startWith(pn),
						)
					),
				);
			}
		);
}

function debug(operatorFunction, name) {
	return function (source) {
		console.log(`Applying operator: ${name}`);
		return operatorFunction(source);
	};
}


// pipeMap is a RxJS operator that is meant to help chain a series of RxJS operators together, based on the input stream.
// Similar to how mergeMap() will add new observable streams to the output stream... pipeMap will add new operators to the current streams' pipe.
// 
// pipeMap() is a function that:
// - Accepts a Callback (will be called with each value in the stream, similar to what RxJS filter() or map() operator might accept)
// - This callback will return a new RxJS operator, every time it is called with a new value from the input stream.
// - That operator which is returned gets piped() on to the end of the current stream.
// - The value that was used to produce this new operator should also be produced by the output stream.

// Called one per Observable creation
function pipeMap(fn) {
	return source$ => new Observable(destination => {
		function recurse(stream$) {
			stream$.subscribe(
				operate({
					destination,
					next(value) {
						// TODO: needed?
						destination.next(value);

						const operator = fn(value);
						stream$.pipe(
							operator,
							recurse
						);
					}
				})
			)
		}
		recurse(source$);
	});
}

// Uses switchMap to switch this source stream to a new stream, which merely adds a new pipe() operator to the current stream
function pipeMap2(fn) {
	return source$ => source$.pipe(
		switchMap(value => {
			const operator = fn(value);
			return source$.pipe(
				operator,
				pipeMap2(fn),
				startWith(value)
			);
		}),
	);
}

function primes_sol4() {
	return rx(
		range(2, Infinity),
		pipeMap(pn => filter((n) => n % pn !== 0)),
	);
}

function primes_sol5() {
	return rx(
		range(2, Infinity),
		pipeMap2(pn => filter((n) => n % pn !== 0)),
	);
}


[primes_sol0, primes_sol1, primes_sol2, primes_sol3, primes_sol4, primes_sol5].forEach((fn) => {
	const primes$ = fn();

	console.time(fn.name);
	primes$.pipe(
		take(10),
	).subscribe(
		console.log
	);
	console.timeEnd(fn.name);
})


