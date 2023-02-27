let DONE = false;

// Within Rendering, the order of steps should always be:
// - Animation Frame Callback
// - Layout Shift calculations
// - Resize Observer
// - Commit
// 
// We cannot measure Commit directly, but we can deduce it as following the others.
//
// Some problems:
// - Layout Shift calculations can be too eager sometimes
// - ResizeObserver can be too lazy/async sometimes
// ...so its not guarenteed to be correct.

let previousFrameTime = 0;
let previousShiftTime = 0;
let previousResizeTime = 0;
let previousCommitTime = 0;

// TODO: Inject this instead.
const shifter = document.getElementById('shifter');
const shiftObserver = new PerformanceObserver(list => {
	onShifts(list.getEntries());
});
const elementObserver = new PerformanceObserver(list => {
	onElement(list.getEntries());
});

function updatesTimes({ frameTime, shiftTime, resizeTime, presentationTime }) {
	if (frameTime) {
		const commitTime = previousResizeTime || previousShiftTime;
		if (commitTime > previousFrameTime) {
			if (previousCommitTime) {
				performance.measure('Commit2Commit', { start: previousCommitTime, end: commitTime });
			}
			previousCommitTime = commitTime;
		} else {
			// This happens if we didn't get a resize or shift event between two frame times
			previousCommitTime = 0;
		}
	}

	if (frameTime) {
		if (previousFrameTime) {
			performance.measure('Frame2Frame', { start: previousFrameTime, end: frameTime });
		}
		previousFrameTime = frameTime;
	}
	if (shiftTime) {
		if (previousShiftTime) {
			performance.measure('Shift2Shift', { start: previousShiftTime, end: shiftTime });
		}
		previousShiftTime = shiftTime;
	}
	if (resizeTime) {
		if (previousResizeTime) {
			performance.measure('Resize2Resize', { start: previousResizeTime, end: resizeTime });
		}
		previousResizeTime = resizeTime;
	}

}

function measureAnimationFrames() {
	requestAnimationFrame((frameTime) => {
		// Hack: PerformanceObserver callbacks are very async
		// We can force them out with takeRecords()
		flushLayoutShifts();
		flushElement();
		updatesTimes({ frameTime: performance.now() }); // Overwrite frametime
		if (!DONE) { measureAnimationFrames(); }
	});
}

function measureLongTasks() {
	new PerformanceObserver(list => {
		for (const entry of list.getEntries()) {
			performance.measure('Long Task', { start: entry.startTime, duration: entry.duration });
		}
	}).observe({ type: 'longtask', buffered: true });
}

function measureLayoutShifts() {
	let value = 0;
	function keepShifting() {
		requestAnimationFrame(() => {
			value = (value + 10) % 100;
			shifter.style.top = `${value}px`;
			if (!DONE) { keepShifting(); }
		});
	}
	keepShifting();

	shiftObserver.observe({ type: 'layout-shift' });
}

function onShifts(entries) {
	for (let entry of entries) {
		updatesTimes({ shiftTime: entry.startTime });
	}
}

function flushLayoutShifts() {
	onShifts(shiftObserver.takeRecords());
}

function measureResize() {
	let value = 0;
	function keepResizing() {
		requestAnimationFrame(() => {
			value = (value + 10) % 100;
			shifter.style.fontSize = `${100 + value}%`;
			if (!DONE) { keepResizing(); }
		});
	}
	keepResizing();

	const resizeObserver = new ResizeObserver(() => {
		updatesTimes({ resizeTime: performance.now() });
	});
	resizeObserver.observe(shifter);

	window.addEventListener('error', (e) => {
		// "ResizeObserver loop completed with undelivered notifications.""
		console.error(e.message);
	});
}

function measureElement() {
	// TODO: drop a new text node onto page every time
	elementObserver.observe({ type: 'element' });
}

function onElement(entries) {
	for (let entry of entries) {
		updatesTimes({ presentationTime: entry.renderTime });
	}
}

function flushElement() {
	onElement(elementObserver.takeRecords());
}

 function injectElement() {
	//<div id="shifter" elementtiming="shifter" style="position: absolute; top:100px; right: 0px;">Shifter</div>
 }

export function measureFrames() {
	document.crtea
	measureAnimationFrames();
	measureLongTasks();
	measureLayoutShifts();
	measureResize();
	measureElement();
}

/***** */
/***** */
/***** */
/***** */

function getInteractions() {
	return new Promise(resolve => {
		let observer = new PerformanceObserver(list => {
			// Don't bother to group as per INP
			const interactions = list.getEntries()
				.filter(entry => !!entry.interactionId);
			observer.disconnect();
			resolve(interactions);
		});
		observer.observe({ type: 'event', buffered: true });
	});
}

function getLongTasks() {
	return new Promise(resolve => {
		let observer = new PerformanceObserver(list => {
			const tasks = list.getEntries();
			observer.disconnect();
			resolve(tasks);
		});
		observer.observe({ type: 'longtask', buffered: true });
	});
}

function getFrames() {
	return performance.getEntriesByName('Commit2Commit','measure');
}

function *splitLongTasksByFrame(tasks, frames) {
	// Walk both lists
	let t = 0;
	for (let f = 0; f < frames.length; f++) {
		const frame = frames[f];
		const taskList = [];
		
		// Nested loop through tasks.
		// Alternatively use iterator, but the interface is unpleasant
		while (t < tasks.length) {
			const task = tasks[t];

			if (task.startTime > frame.startTime + frame.duration)
				break;
			if (task.startTime >= frame.startTime)
				taskList.push(task);
			t++;
		}
			
		yield { frame, taskList };
	}
}

export async function reportFindings() {
	DONE = true;

	const interations = await getInteractions();
	const longTasks = await getLongTasks();
	const frames = await getFrames();

	const tasksByFrame = Array.from(splitLongTasksByFrame(longTasks, frames));

	if (!frames || !interations) {
		return;
	}

	const longestInteraction = interations
		.sort((a,b) => b.duration - a.duration)[0];
	const longestFrame = Array.from(tasksByFrame)
		.sort((a,b) => b.frame.duration - a.frame.duration)[0];
	const mostLongTasks = Array.from(tasksByFrame)
		.sort((a,b) => b.taskList.length - a.taskList.length)[0];

	console.log('Longest Interaction:', longestInteraction?.duration, longestInteraction);
	console.log('Longest Frame:', longestFrame?.frame.duration, 'tasks:', longestFrame?.taskList.length, longestFrame);
	console.log('Total Long Tasks:', longTasks.length, longTasks);
	console.log('Most Long Tasks in one frame:', mostLongTasks?.taskList.length, mostLongTasks)
}
