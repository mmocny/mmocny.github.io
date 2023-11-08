import pageSlicer from "./lib/pageSlicer";
import webMightals from "./lib/webMightals";

function block(ms) {
	const target = performance.now() + ms;
	while (target > performance.now());
}

myButton.addEventListener('click', (event) => {
	const el = event.target;
	setTimeout(() => el.style.top = `${el.offsetTop+100}px`, 1000);
	block(Math.random() * 400);
});

const pages = pageSlicer().subscribe((url) => {
	console.log('Navigate', url);

});

const obs = webMightals().subscribe({
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