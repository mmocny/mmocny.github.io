import { delay, fromEvent, share } from "rxjs";
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
		el.style.top = `${el.offsetTop+100}px`;
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
		for (let [k,v] of Object.entries(value)) {
			console.log(k, +v.score.toFixed(5), { entries: v.entries });
		}
		console.groupEnd();
	},
	complete: () => {
		console.log('done');
	},
});


// setTimeout(() => obs.unsubscribe(), 5000); 