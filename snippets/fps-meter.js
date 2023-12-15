import { FpsTracker } from "../fps-meter/FpsTracker";

function createStickyDiv() {
	const div = document.createElement('div');
	div.style.position = 'fixed';
	div.style.width = "100%";
	div.style.top = '50%';
	div.style.left = '0';
	div.style.transform = 'translateY(-50%)';
	div.style.backgroundColor = 'lightgray';
	div.style.padding = '10px';
	div.style.borderRadius = '5px';
	div.style.textAlign = 'center';
	div.style.fontFamily = 'monospace';
	div.innerText = 'Floating Div';
	document.body.appendChild(div);

	return div;
}

function updateDivText(div, fps) {
	const now = performance.now().toFixed(0);
	div.innerText = JSON.stringify({
		fps,
		now,
	});
}

function main() {
	const fpsTracker = new FpsTracker;

	const div = createStickyDiv();

	setInterval(() => {
		updateDivText(div, fpsTracker.computeFps());
	}, 10);

	fpsTracker.addEventListener('fps', (e) => {
		const fps = e.detail.fps;
		updateDivText(div, fps);
	});
}

main();