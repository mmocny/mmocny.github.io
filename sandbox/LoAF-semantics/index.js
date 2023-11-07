import loafs from '../web-mightals.js/lib/loafs.js';
import wrapper from './wrapper.js';

function block(ms) {
	const target = performance.now() + ms;
	while (performance.now() < target) {}
}

function callee() {
	console.log('start');
	block(100);
	console.log('end');
}

myButton.addEventListener('click',	wrapper(callee));

loafs().subscribe((loaf) => {
	console.log(loaf.score, ...loaf.entries[0].scripts.map(s => s.sourceLocation));
});