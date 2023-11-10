import loafs from '../web-mightals.js/lib/loafs.js';

function block(ms) {
	const target = performance.now() + ms;
	while (performance.now() < target) {}
}

myButton.addEventListener('click',	() => {
	block(100);
});

loafs().subscribe((loaf) => {
	const start = loaf.entries[0].startTime;
	const drs = loaf.entries[0].desiredRenderStart;
	const end = start + loaf.entries[0].duration;
	console.log(start-drs, { start, drs, end });

	performance.measure('Event', { start, end });
	performance.measure('Frame', { start: drs, end });
});

setTimeout(() => {
	document.body.style.backgroundColor = 'red';
	block(100);
}, 1000);