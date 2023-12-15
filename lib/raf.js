export async function raf() {
	return new Promise(resolve => {
		requestAnimationFrame(resolve);
	});
}

export async function afterNextPaint() {
	// TODO: experiment with scheduler.render() when available
	await raf();
	// TODO: polyfill as needed
	await scheduler.yield();

}