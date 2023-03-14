export async function rAF() {
	return new Promise(resolve => requestAnimationFrame(resolve));
}

export async function rPAF() {
	await rAF();
	await Promise.race([rAF(), yieldToMain()]);
}

export async function yieldToMain() {
	return new Promise(resolve => {
		const channel = new MessageChannel();
		channel.port1.onmessage = function() {
			resolve(void 0);
		};
		channel.port2.postMessage(null);
	});
}

export function yieldToMainEvery(ms: number) {
	let initial = performance.now();
	return async () => {		
		const now = performance.now();
		if (now - initial > ms) {
			await yieldToMain();
			initial = now;
		}
	};
}

export async function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function block(ms: number) {
	const target = performance.now() + ms;
	while (performance.now() < target);
}

export function abortable(signal: AbortSignal) {
	return new Promise(resolve => {
		signal.addEventListener('abort', () => {
			resolve(void 0);
		}, { once: true });
	});
}

export async function alternative(promise: Promise<any>, alternative: any, signal: AbortSignal) {
	const alt = async () => {
		await abortable(signal);
		return alternative;
	};
	return await Promise.race([promise, alt()]);
}

export async function abortableDelay(ms: number, signal: AbortSignal) {
	return new Promise((resolve, reject) => {
		let timerId = setTimeout(() => {
			resolve(void 0);
		}, ms);

		signal.addEventListener('abort', () => {
			clearTimeout(timerId);
			reject();
		});
	});
}