const COLORS = { "good": "#0CCE6A", "needs-improvement": "#FFA400", "poor": "#FF4E42" };
const THRESHOLDS = {
    INP: { good: 200, ni: 500 },
    LCP: { good: 2500, ni: 4000 }
};

const getRating = (val, t) => val <= t.good ? "good" : val <= t.ni ? "needs-improvement" : "poor";

function log({ type, text, color, entry }) {
    console.log(
        `${type}: %c${text}`,
        `color: ${color || "#2196F3"}; font-weight: bold;`,
        entry
    );
}

let activeNav = null;
let lastICP = null;

function processEntry(entry) {
    if (!entry) return;

    if (entry.entryType === "soft-navigation") {
        activeNav = entry;
        log({ type: "Nav*", text: entry.name, entry });
        processEntry(entry.firstPaintedElement);
        processEntry(entry.largestPaintedElement);
        return;
    }

    if (entry.entryType === "event" && entry.interactionId) {
        const r = getRating(entry.duration, THRESHOLDS.INP);
        log({ type: "INP", text: `${Math.round(entry.duration)}ms`, color: COLORS[r], entry });
        return;
    }

    if (entry.entryType === "interaction-contentful-paint") {
        if (entry === lastICP) return;
        lastICP = entry;

        const type = entry.interactionId === activeNav?.interactionId ? "LCP*" : "ICP";
        const r = getRating(entry.duration, THRESHOLDS.LCP);
        log({ type, text: `${Math.round(entry.duration)}ms`, color: COLORS[r], entry });
        return;
    }

    if (entry.entryType === "largest-contentful-paint") {
        const r = getRating(entry.startTime, THRESHOLDS.LCP);
        log({ type: "LCP", text: `${Math.round(entry.startTime)}ms`, color: COLORS[r], entry });
        return;
    }
}

const observer = new PerformanceObserver(list => {
    for (const e of list.getEntries()) {
        processEntry(e);
    }
});

observer.observe({ type: "event", buffered: true, durationThreshold: 0 });
observer.observe({ type: "interaction-contentful-paint", buffered: true });
observer.observe({ type: "soft-navigation", buffered: true });
observer.observe({ type: "largest-contentful-paint", buffered: true });
