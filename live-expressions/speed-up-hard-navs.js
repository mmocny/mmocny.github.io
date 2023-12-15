import oncePerPageload from "./lib/once-per-pageload";

function main() {
	document.addEventListener('click', (event) => {
		// TODO: forms with submit as well?
		const a = event.target.closest('a');
		if (!a) return;

		event.preventDefault();
		location = a.href;
	}, { capture: true });
}

oncePerPageload(main);