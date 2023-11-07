function inline(callback) {
	callback();
}

async function microtask(callback) {
	await 0;
	callback();
}

function schedulerYield(callback) {
	// await yield() doesn't work because this function resumes, and then is inline() effectively again.
	scheduler.yield().then(callback);
}

function timeout(callback) {
	setTimeout(callback, 0);
}

function postTask(callback) {
	scheduler.postTask(callback);
}




const et = new EventTarget();
function createEventTarget(callback) {
	et.addEventListener('custom', callback);
}
function fireEventTarget() {
	et.dispatchEvent(new Event('custom'));
}

const button = document.createElement('button');
function createButton(callback) {
	button.addEventListener('click', callback);
}
function fireButton() {
	button.dispatchEvent();
}


const p = Promise.withResolvers();
function createPromise(callback) {
	p.promise.then(callback);
}
function firePromise() {
	p.resolve();
}




export function wrapper(callback) {
	// createEventTarget(callback);
	// createButton(callback);
	// createPromise(callback);

	return () => {
		// inline(callback);

		// microtask(callback);
		// queueMicrotask(callback);
		schedulerYield(callback);
		// timeout(callback);
		// postTask(callback);

		// fireEventTarget();
		// fireButton();
		// firePromise();
	};
}

export default wrapper;