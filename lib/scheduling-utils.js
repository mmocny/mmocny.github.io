export async function raf(signal) {
	return new Promise((resolve, reject) => {
		// TODO: Alternative: if signal.aborted reject(signal.reason)
		signal?.throwIfAborted();

		// TODO: is it needed to remove abort eventlistener after successful resolve?
		const rafid = requestAnimationFrame(resolve);

		signal?.addEventListener('abort', (ev) => {
			cancelAnimationFrame(rafid);
			// TODO: Is this useful?
			reject(signal.reason);
		}, { once: true });
	});
}

export async function afterNextPaint() {
	// TODO: experiment with scheduler.render() when available
	await raf();
	// TODO: polyfill as needed
	await scheduler.yield();
}

export async function delay(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

export function block(ms) {
	const taget = performance.now() + ms;
	while (performance.now() < taget);
}

export async function waitForEvent(target, eventName) {
	return new Promise(resolve => {
		target.addEventListener(eventName, resolve, { once: true });
	});
}

export async function idleUntilBeforeRender(opts = {}) {
	// Default to highest priority, but you may want to use background
	opts = {
		priority: 'user-blocking',
		...opts,
	};
	return new Promise(resolve => {
		const contoller = new AbortController();

		const rafid = requestAnimationFrame(() => {
			contoller.abort();
			resolve();
		});

		const taskid = scheduler.postTask(() => {
			cancelAnimationFrame(rafid);
			resolve();
		}, {
			priority: 'user-blocking',
			signal: contoller.signal,
		});
	});
}

