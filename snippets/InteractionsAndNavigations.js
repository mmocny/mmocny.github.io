const COLORS = { "good": "#0CCE6A", "needs-improvement": "#FFA400", "poor": "#FF4E42" };
const THRESHOLDS = {
    INP: { good: 200, ni: 500 },
    LCP: { good: 2500, ni: 4000 }
};

let activeNav = null;

const getRating = (val, t) => val <= t.good ? "good" : val <= t.ni ? "needs-improvement" : "poor";

function log(type, val, entry) {
    if (type === "SoftNav") {
        const fcp = entry.paintTime ? Math.round(entry.paintTime - entry.startTime) : 0;
        const lcp = Math.round(entry.duration);
        let info = `${entry.name}`;
        if (fcp > 0 || lcp > 0) {
            const parts = [];
            if (fcp > 0) parts.push(`FCP: ${fcp}ms`);
            if (lcp > 0 && lcp !== fcp) parts.push(`LCP: ${lcp}ms`);
            info += ` (${parts.join(", ")})`;
        }
        console.log(`SoftNav: %c${info}`, "font-weight: bold; color: #2196F3;", entry);
        return;
    }
    const r = getRating(val, THRESHOLDS[type === "INP" ? "INP" : "LCP"]);
    console.log(
        `${type}: %c${Math.round(val)}ms`,
        `color: ${COLORS[r]}; font-weight: bold;`,
        entry
    );
}

const observer = new PerformanceObserver(list => {
    for (const e of list.getEntries()) {
        if (e.entryType === "soft-navigation") {
            activeNav = e;
            log("SoftNav", 0, e);
        } else if (e.entryType === "event" && e.interactionId) {
            log("INP", e.duration, e);
        } else if (e.entryType === "interaction-contentful-paint") {
            log(e.interactionId === activeNav?.interactionId ? "LCP" : "ICP", e.duration, e);
        } else if (e.entryType === "largest-contentful-paint") {
            log("LCP", e.startTime, e);
        }
    }
});

observer.observe({ type: "event", buffered: true, durationThreshold: 0 });
observer.observe({ type: "interaction-contentful-paint", buffered: true });
observer.observe({ type: "soft-navigation", buffered: true });
observer.observe({ type: "largest-contentful-paint", buffered: true });
