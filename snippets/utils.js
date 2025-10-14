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

function perf$(types, options = { buffered: true, durationThreshold: 0 }) {
    if (typeof types === 'string') {
        types = [types];
    }

    return new Observable(subscriber => {
        const observer = new PerformanceObserver(list => {
            for (const entry of list.getEntries()) {
                subscriber.next(entry);
            }
        });

        for (let type of types) {
            observer.observe({ type, ...options });
        }

        return () => observer.disconnect();
    })
}

function intersect$(elements, options = { threshold: 1.0 }) {
    if (typeof elements === 'string') {
        elements = [elements];
    }

    return new Observable(subscriber => {
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                subscriber.next(entry);
            }
        }, options);

        for (let element of elements) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    });
}

// Experiment: Observables as async iterators instead

function when(target, type) {
    return {
        async *[Symbol.asyncIterator]() {
            for (; ;) {
                yield await new Promise(resolve => target.addEventListener(type, resolve, { once: true }));
            }
        }
    };
}

// Wouldn't need this if we had "async iterator helpers"
async function forEach(stream, callback) {
    for await (let event of stream) {
        callback(event);
    }
}
