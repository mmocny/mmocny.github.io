import { concatMap, delay, filter, first, fromEvent, range, share } from "rxjs";
import pageSlicer$ from "../../lib/pageSlicer";
import webMightals$ from "../../lib/webMightals";

function block(ms) {
	const target = performance.now() + ms;
	while (target > performance.now());
}

const clicks$ = fromEvent(myButton, 'click')
	.pipe(
		share()
	);

clicks$
	.pipe(
		delay(1000)
	)
	.subscribe((event) => {
		// console.log(performance.now() - event.timeStamp);
		const el = event.target;
		el.style.top = `${el.offsetTop + 100}px`;
	});
clicks$.subscribe(() => {
	block(Math.random() * 400);
});

pageSlicer$.subscribe((value) => {
	console.log('PageSlice:', value);
});

webMightals$.subscribe({
	next: (value) => {
		console.group('webMightals');
		for (let [k, v] of Object.entries(value)) {
			console.log(k, +v.score.toFixed(5), { entries: v.entries });
		}
		console.groupEnd();
	},
	complete: () => {
		console.log('done');
	},
});

function pNumbers(source$) {
	return source$.pipe(
		first(),
		concatMap(pn => pNumbers(
			source$.pipe(
				filter(n => n % pn !== 0)
			)
		))
	);
}

const source$ = range(2, 1000);
const primes$ = pNumbers(source$);

primes$.subscribe((value) => {
	console.log(value);
});


// setTimeout(() => obs.unsubscribe(), 5000); 