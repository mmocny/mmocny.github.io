const EVENT_TYPES = [
    'keydown',
    'keypress',
    'keyup',
    'beforeinput',
    'input',
    'change',
	'focus',
	'blur',
];

function busy(ms) {
    const target = performance.now() + ms;
    while (performance.now() < target);
}

const el = document.querySelector('textarea');
EVENT_TYPES.forEach(type => el.addEventListener(type, () => busy(20)));

new PerformanceObserver(list => {
	const entries = list.getEntries().filter(entry =>EVENT_TYPES.includes(entry.name));
    for (let entry of entries) {
        console.log(entry);
        performance.measure(`${entry.name}.processing`, { start: entry.processingStart, end: entry.processingEnd });
        performance.measure(`${entry.name}.duration`, { start: entry.startTime, end: entry.startTime + entry.duration });
    }
}).observe({ type: 'event', durationThreshold: 0 });