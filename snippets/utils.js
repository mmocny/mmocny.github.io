function block(ms) {
    const target = performance.now() + ms;
    while (performance.now() < target);
}

function html(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.firstChild;
}

function injectCSS(cssString) {
  const styleElement = document.createElement('style');
  styleElement.textContent = cssString;
  document.head.appendChild(styleElement);
}

function perf$(options) {
    return new Observable(subscriber => {
        const obs = new PerformanceObserver(list => {
            list.getEntries().forEach(entry => subscriber.next(entry));
        });
        obs.observe(options);
    })
}

// Experiment: Observables as async iterators instead

function when(target, type) {
    return {
        async *[Symbol.asyncIterator]() {
            for (;;) {
                yield await new Promise( resolve => target.addEventListener(type, resolve, { once: true }));
            }
        }
    };
}

async function forEach(stream, callback) {
    for await (let event of stream) {
        callback(event);
    }
}
