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

const obs = webMightals().subscribe({
	next: (value) => {
		console.log(value);
	},
	complete: () => {
		console.log('done');
	},
});


// setTimeout(() => obs.unsubscribe(), 5000);