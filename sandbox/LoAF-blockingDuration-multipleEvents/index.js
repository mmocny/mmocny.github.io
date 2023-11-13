import loafs from '../web-mightals.js/lib/loafs.js';

function block(ms) {
	const target = performance.now() + ms;
	while (performance.now() < target) {}
}

myButton.addEventListener('click',	() => {
	console.log('click');
	block(100);
	requestAnimationFrame(() => {
		block(100);
		console.log('frame');
	});
	document.body.style.backgroundColor = 'red';
});

loafs().subscribe((loaf) => {
	const start = loaf.entries[0].startTime;
	const drs = loaf.entries[0].desiredRenderStart;
	const end = start + loaf.entries[0].duration;
	console.log(loaf.entries[0], { start, drs, end });

	performance.measure('Event', { start, end });
	performance.measure('Frame', { start: drs, end });

	// TODO: Scripts?
});