const BLOCK = 50;

function block(ms) {
	const target = performance.now() + ms;
	while (target > performance.now());
}

async function triggerSyncFetch(cb) {
	const dataURI = "data:application/json,{}";
	const response = await fetch(dataURI);
	const result = await response.json();
	cb(result);
}

async function prefetch() {
	const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
	const data = await response.json();
	return data;
}


function triggerMutationObserver(cb) {
	const targetNode = document.createElement('div');
	const observer = new MutationObserver(cb);
	// for (const mutation of mutationList) {
	//     console.log('Mutation detected:', mutation.type);
	// }
	observer.observe(targetNode, { childList: true });

	const dummyNode = document.createElement('span');
	targetNode.appendChild(dummyNode);
	// targetNode.removeChild(dummyNode);
}

function a() {
	block(BLOCK);
	b();
}
function b() {
	block(BLOCK);
	c();
}
function c() {
	block(BLOCK);
	triggerMutationObserver(function afterMutation() { block(BLOCK); });
}

async function dontAwaitFirstDoAwaitBetween() { a(); await 0; block(BLOCK); a(); }
async function doAwaitFirstDoAwaitBetween() { a(); await 0; block(BLOCK); a(); }
async function dontAwaitFirstDontAwaitBetween() { a(); block(BLOCK); a(); }
async function doAwaitFirstDontAwaitBetween() { await 0; a(); block(BLOCK); a(); }

scheduler.postTask(dontAwaitFirstDoAwaitBetween);
scheduler.postTask(doAwaitFirstDoAwaitBetween);
scheduler.postTask(dontAwaitFirstDontAwaitBetween);
scheduler.postTask(doAwaitFirstDontAwaitBetween);

async function testFetch() {
	block(BLOCK);
	triggerSyncFetch(function afterFetch() { block(BLOCK); });
}

scheduler.postTask(testFetch);


async function testPrefetch() {
	await prefetch();
	block(BLOCK);

	scheduler.postTask(async function afterPrefetch() {
		block(BLOCK);
		await prefetch();
		block(BLOCK);
	});
}

scheduler.postTask(testPrefetch);