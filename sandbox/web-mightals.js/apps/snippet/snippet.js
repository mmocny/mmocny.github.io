import webMightals$ from "../../lib/webMightals";

webMightals$.subscribe((value) => {
	console.group('webMightals');
	for (let [k,v] of Object.entries(value)) {
		console.log(k, +v.score.toFixed(5), { entries: v.entries });
	}
	console.groupEnd();
});