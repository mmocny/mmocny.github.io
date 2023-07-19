export default function peekableIterator(iterable) {
	const iterator = iterable[Symbol.iterator]();

	// TODO: Check this. Should be able to do iter(iter(...)) and get back the same iterator
	if (iterable === iterator && typeof iterable.peek === "function") {
		return iterable;
	}

	let state = iterator.next();

	function* generate() {
		while (!state.done) {
			const current = state.value;
			state = iterator.next();
			yield current;
		}
		return state.value;
	};

	const it = generate();

	// it.peek = () => state.value;
	Object.defineProperty(it, "value", { get() { return state.value; } });
	// it.done = () => state.done;
	Object.defineProperty(it, "done", { get() { return state.done; }  });
	
	return it;
}

// function main() {
// 	const arr = [1,2,3,4,5];
// 	const it = peekableIterator(arr);

// 	for (; !it.done && it.value < 4; it.next()) {
// 		console.log(it.value);
// 	}
// }

// import * as url from 'node:url';

// if (import.meta.url.startsWith('file:')) {
//   const modulePath = url.fileURLToPath(import.meta.url);
//   if (process.argv[1] === modulePath) {
//     main();
//   }
// }