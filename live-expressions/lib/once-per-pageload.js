import sha256 from "../../lib/str-to-hash";

// This is mostly useful for DevTools live expressions
export default function oncePerPageload(callback) {
	const rv = sha256(callback.toString());
	const id = `__init_${rv}`;
	if (window[id]) return;
	window[id] = true;
	callback();
}