import { webMightals$ } from '../web-mightals.js';
import oncePerPageload from "./lib/once-per-pageload.js";

function main() {
	window.vitals = {};
	webMightals$.subscribe((value) => {
		for (let [k, v] of Object.entries(value)) {
			window.vitals[k] = +v.score.toFixed(5);
		}
	});
}

oncePerPageload(main);