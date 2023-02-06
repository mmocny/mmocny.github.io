import { measureFrames, reportFindings } from './measure-frames.js';

const button = document.querySelector('input[type="button"]');

function block(ms) {
	const target = performance.now() + ms;
	while (performance.now() < target);
}

function simulateLongTask() {
	block(51); // <-- I found that using 50 wasn't always enough
}

function resizeABit() {
	const scale = 100 + Math.floor(Math.random() * 100);
	button.style.fontSize = `${scale}%`;
}

function longClickHandler(event) {
	resizeABit();
	simulateLongTask();
	requestAnimationFrame(simulateLongTask);
}

function spamPageWithManyLongTasks() {
	// Rather than a setTimeout loop, add these all to the queue upfront
	const keepPageJankyFor = 5; // seconds
	const count = keepPageJankyFor * 1000 / 50;
	for (let i = 0; i < count; i++) {
		setTimeout(simulateLongTask, 0);
	}
}

function addSlowObservers() {
	button.addEventListener('click', longClickHandler);

	// TODO: Disable for now.  It adds Interaction delay, but doesn't affect Long Tasks, and complicates frame measurement
	// new ResizeObserver(simulateLongTask).observe(button);

	// TODO: any more?
	['mousemove', 'scroll']
		.forEach(type => document.addEventListener(type, simulateLongTask));
}


function main() {
	measureFrames();

	addSlowObservers();
	spamPageWithManyLongTasks();

	// TODO: Replace this with await()
	// queue one last task to report findings
	setTimeout(reportFindings, 0);
}

main();