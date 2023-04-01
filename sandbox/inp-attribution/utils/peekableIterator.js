export default function iter(iterable) {
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

	// ret.peek = () => state.value;
	// ret.done = () => state.done;
	Object.defineProperty(it, "peek", { get() { return state.value; } });
	Object.defineProperty(it, "done", { get() { return state.done; }  });
	
	return it;
}