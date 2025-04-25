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

async function beforeunload(signal) {
	return new Promise((resolve, reject) => {
		// Pass signal to listener so we unregister automatically.
		window.addEventListener("beforeunload", resolve, { signal, once: true });
		// Also reject() the promise itself when that happens.
		signal.addEventListener("abort", reject);
	});
}

async function afterNextPaint() {
	// raf + yield guarentees afterNextPaint
	// However, rAF might not fire if you are already backgrounded.  Might want to fallback to timer, or listen to visibilitychange events.
	await new Promise(resolve => requestAnimationFrame(resolve));
	await scheduler.yield();
}

async function afterNextPaintOrBeforeUnload() {
	const ac = new AbortController();

	// yield() will queue a new macro-task, almost always run first
	// beforeunload will queue a microtask, sometimes first
	await Promise.race([afterNextPaint(), beforeunload(ac.signal)]);

	// For cases where yield() wins, clean up the beforeunload
	ac.abort();
}


function block(ms = 5) {
	// Hard code 5ms of work.
	const target = performance.now() + ms;
	while (performance.now() < target);
}

async function timeout(fn) {
	return new Promise(resolve => setTimeout(() => {
		fn();
		resolve();
	}, 0));
}

async function postTaskBlocking(fn) {
	return scheduler.postTask(block, { priority: 'user-blocking' });
}

async function yieldy(fn) {
	fn();
	await scheduler.yield();
}

async function doLongRunningAnalytics() {
	const start = performance.now();
	console.log('starting: long running analytics', performance.now() - start);
	block(1000);
	console.log('done: long running analytics', performance.now() - start);
}

// You have options here!  Toggle the commented lines
async function measureDelayedWork() {
	const start = performance.now();
	for (let i = 0; i < 100; i++) {
		// Option 1:
		await timeout(block);

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
			block();
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
			// registerBeforeUnloadWork();

			// RACE RACE RACE:
			// Let's explicitly wait for next paint before doing more work.
			// We risk page unloading here.  Especially if we don't get BMF task scheduled quickly.
			// It appears that beforeunload event is very likely to fire before next paint anyway... even when tasks may still schedule after it returns.
			// await afterNextPaint();

			await afterNextPaintOrBeforeUnload();

			doLongRunningAnalytics();

			// Actually do deferred measurement work here.
			// await measureDelayedWork();

			// Do this only if you prevented navigation earlier.
			// console.log("navigating now");
			// window.location.href = href;
		});
	});