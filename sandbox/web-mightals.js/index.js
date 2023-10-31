import webMightals from "./lib/webMightals";

function block(ms) {
	const target = performance.now() + ms;
	while (target > performance.now());
}

myButton.addEventListener('click', () => {
	block(Math.random() * 400);
});

webMightals().subscribe({
	next: (value) => {
		console.log(value);
	},
	complete: () => {
		console.log('done');
	},
});
