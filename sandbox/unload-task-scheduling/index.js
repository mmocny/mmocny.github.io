// Let's test how long we have to run tasks while racing unload
//
// First of all, unload will be either same-origin or cross-origin.
// On initiating the navigation, we will queue up some fixed number of tasks, which take a fixed amount of time.
// and we will measure how many actually execute before unload.
//
// We will try this with various strategies:
// 1. setTimeout
// 2. scheduler.postTask()
// 3. scheduler.yield()
//
// We will also try:
// 4. Move work into beforeunload event
// 5. Delay navigation (via click.preventDefault()) then navigate async
//
// Finally, we can adjust how things fare with various amounts of pre-existing main-thread contention.


async function afterNextPaint() {
	// Usually, we just advise raf + setTimeout(0) here...
	// But I'm using yield() for highest odds to get scheduled.
	// The first "real" requestPostAnimationFrame() polyfill? :)
	return new Promise(resolve => requestAnimationFrame(async () => {
		await scheduler.yield();
		resolve();
	}));
}

function doWork() {
	// Hard code 5ms of work.
	const target = performance.now() + 5;
	while (performance.now() < target);
}

async function timeout(fn) {
	return new Promise(resolve => setTimeout(() => {
		fn();
		resolve();
	}, 0));
}

async function postTaskBlocking(fn) {
	return scheduler.postTask(doWork, { priority: 'user-blocking' });
}

async function yieldy(fn) {
	fn();
	await scheduler.yield();
}

// You have options here!  Toggle the commented lines
async function measureDelayedWork() {
	const start = performance.now();
	for (let i = 0; i < 100; i++) {
		// Option 1:
		await timeout(doWork);

		// Option 2:
		// await postTaskBlocking(doWork);

		// Option 3:
		// await yieldy(doWork);

		console.log('delayed work', i, performance.now() - start);
	}
}

async function registerBeforeUnloadWork() {
	const start = performance.now();
	window.addEventListener('beforeunload', () => {
		for (let i = 0; i < 100; i++) {
			doWork();
			console.log('beforeunload work', i, performance.now() - start);
		}
	});
}

document
	.querySelectorAll(':is(a, form > input[type="submit"])')
	.forEach((a) => {
		a.addEventListener("click", async (e) => {
			// Update DOM with time it took to run this click handler.
			window.timer.innerText = performance.now() - e.timeStamp;
			// And then again the time we could actually render.
			requestAnimationFrame(() => {
				window.timer.innerText += '\n' + (performance.now() - e.timeStamp);
			})

			// Capture the target href
			const href = e.target.closest("a")?.getAttribute('href') ?? e.target.closest("form")?.getAttribute('action');

			// Optional: prevent the navigation, will need to manually run it later
			// e.preventDefault();

			// You have to register beforeunload work before we do any yielding, or it may not fire.
			registerBeforeUnloadWork();

			// RACE RACE RACE:
			// Let's explicitly wait for next paint before doing more work.
			// We risk page unloading here.  Especially if we don't get BMF task scheduled quickly.
			// It appears that beforeunload event is very likely to fire before next paint anyway... even when tasks may still schedule after it returns.
			await afterNextPaint();

			// Actually do deferred measurement work here.
			await measureDelayedWork();

			// Do this only if you prevented navigation earlier.
			// console.log("navigating now");
			// window.location.href = href;
		});
	});