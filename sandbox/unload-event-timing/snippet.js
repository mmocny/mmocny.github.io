/*
 * Add this snippet to any page.
 */

// Because unload freezes console.log, rely on a net-log tunnel
async function log(...messages) {
	// Also log the messages to the console
	console.log(...messages);

	try {
		const response = await fetch('http://localhost:8080/log', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ messages })
		});
	} catch (error) {
		console.error('log fetch() error:', error);
	}
}

function block(ms) {
	const target = performance.now() + ms;
	while (performance.now() < target);
}
function openNewTab() {
	let newWindow = window.open('https://en.wikipedia.org', '_blank');
}
function syncNavigate() {
	window.location.href = 'https://en.wikipedia.org';
}
function measureNextPaint() {
	// The first rAF represents rendering start (BMF).
	// BMF in Chrome will be prioritized after input, and so may get scheduled before visibilitychange event
	// But, the visibilitychange event might get "flushed" before rAF.  Let's see...
	requestAnimationFrame(() => {
		log('rAF1');
		// The second rAF represents a time which might correspond to the next vsync, which
		// might be aligned with presentation time.  It's not innacurate.
		requestAnimationFrame(() => {
			log('rAF2');
		});
	});
	// Alternatively, leverage element timing...
}
document.documentElement.addEventListener('pointerup', () => {
	log('pointerup start');
	block(1000);
	log('pointerup end');

	// Run these after pointerup is done blocking, so you have time to add more input
	measureNextPaint();
	for (let i = 0; i < 10; i++) {
		setTimeout(() => {
			log('timeout first?');
			block(50);
		}, 0);
		scheduler.postTask(() => {
			log('user-blocking first?');
			block(50);
		}, { priority: 'user-blocking' });
	}

	// openNewTab();
	syncNavigate();
});
document.documentElement.addEventListener('click', () => {
	log('click start');
	block(1000);
	log('click end');
});
window.addEventListener('visibilitychange', event => {
	log('visibilitychange', performance.now() - event.timeStamp, 'ago')
	block(1000);
});
