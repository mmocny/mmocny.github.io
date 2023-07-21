export function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function raf() {
	return new Promise(resolve => requestAnimationFrame(resolve));
}

// In order to ensure this runs after next paint, need to raf() + macrotask hop.
// In order to ensure it runs before the next-next paint, need to double-raf().
// However, double-raf() can be fairly late, often a timeout runs earlier.
// So: Race both.
// The simple Promise.race() variant is usually fine, but lets be cleaner and abort the slower.
export async function afterNextPaint() {
	await raf();

	// await Promise.race([delay(0), raf()]);

	await new Promise<void>(resolve => {
		let a, b;
		a = setTimeout(() => {
			cancelAnimationFrame(b);
			resolve();
		}, 0);
		b = requestAnimationFrame(() => {
			clearTimeout(a);
			resolve();
		});
	});
}