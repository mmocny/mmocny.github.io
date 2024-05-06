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


function addMutationObserverAndModifyDOMToTriggerIt(cb) {
	const targetNode = document.createElement('div');
	const observer = new MutationObserver(cb);
	observer.observe(targetNode, { childList: true });

	const dummyNode = document.createElement('span');
	targetNode.appendChild(dummyNode);
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
	addMutationObserverAndModifyDOMToTriggerIt(function afterMutation() { block(BLOCK); });
}

async function dontAwaitFirstDoAwaitBetween() { a(); await 0; block(BLOCK); a(); }
async function doAwaitFirstDoAwaitBetween() { a(); await 0; block(BLOCK); a(); }
async function dontAwaitFirstDontAwaitBetween() { a(); block(BLOCK); a(); }
async function doAwaitFirstDontAwaitBetween() { await 0; a(); block(BLOCK); a(); }

// scheduler.postTask(dontAwaitFirstDoAwaitBetween);
// scheduler.postTask(doAwaitFirstDoAwaitBetween);
// scheduler.postTask(dontAwaitFirstDontAwaitBetween);
// scheduler.postTask(doAwaitFirstDontAwaitBetween);

async function testFetch() {
	block(BLOCK);
	triggerSyncFetch(function afterFetch() { block(BLOCK); });
}

// scheduler.postTask(testFetch);


async function testPrefetch() {
	await prefetch();
	block(BLOCK);

	scheduler.postTask(async function afterPrefetch() {
		block(BLOCK);
		await prefetch();
		block(BLOCK);
	});
}

// scheduler.postTask(testPrefetch);




function updateColorTo(color) {
	console.log(color);
	document.body.style.backgroundColor = color;
	block(BLOCK);
}


async function testMutationObserverAndYield() {
	updateColorTo('red');

	requestAnimationFrame(() => {
		updateColorTo('green');
	});

	addMutationObserverAndModifyDOMToTriggerIt((mutationList) => {
		for (const mutation of mutationList) {
			// console.log('Mutation detected:', mutation.type);
		}
		updateColorTo('blue');
	});

	await scheduler.yield();
}

document.body.addEventListener('click', () => {
	testMutationObserverAndYield();
});