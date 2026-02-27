export const THRESHOLDS = {
    INP: [200, 500],
    LCP: [2500, 4000]
};

export function getColor(val, metric) {
    const [good, ni] = THRESHOLDS[metric];
    if (val <= good) return "#0CCE6A";
    if (val <= ni) return "#FFA400";
    return "#FF4E42";
}

export function getEl(entry) {
    const el = entry.element || entry.target;
    if (!el) return "";
    const id = el.id ? `#${el.id}` : "";
    const name = el.nodeName.toLowerCase();
    let extra = "";
    if (el.src) {
        const parts = el.src.split('/');
        const file = parts.pop() || parts.pop() || "";
        const truncated = file.length > 20 ? '...' + file.slice(-17) : file;
        extra = ` src="${truncated}"`;
    }
    return ` <${name}${id}${extra}>`;
}

export function log({ type, text, suffix, color, entry }) {
    console.groupCollapsed(
        `${type}: %c${text}%c${suffix || ""}`,
        `color: ${color || "#2196F3"}; font-weight: bold;`,
        "color: inherit; font-weight: normal;"
    );
    console.log("Entry:", entry);
    const el = entry.element || entry.target;
    if (el) console.log("Element:", el);
    console.groupEnd();
}

let activeNav = null;
let lastICP = null;

export function processEntry(entry) {
    if (!entry) return;

    if (entry.entryType === "soft-navigation") {
        activeNav = entry;
        (window.log || log)({ type: "Nav*", text: entry.name, suffix: ` (id: ${entry.interactionId})`, entry });
        // TODO: This should be labeled FCP* not LCP*
        // processEntry(entry.largestPaintedElement);
        (window.processEntry || processEntry)(entry.largestPaintedElement);
        return;
    }

    if (entry.entryType === "event") {
        if (!entry.interactionId) return;
        (window.log || log)({
            type: "INP",
            text: `${Math.round(entry.duration)}ms`,
            suffix: `${getEl(entry)} (id: ${entry.interactionId})`,
            color: getColor(entry.duration, "INP"),
            entry
        });
        return;
    }

    if (entry.entryType === "interaction-contentful-paint") {
        if (entry === lastICP) return;
        lastICP = entry;

        const type = entry.interactionId === activeNav?.interactionId ? "LCP*" : "ICP";
        const text = `${Math.round(entry.duration)}ms${getEl(entry)}`;
        (window.log || log)({
            type,
            text,
            suffix: getEl(entry),
            color: getColor(entry.duration, "LCP"),
            entry
        });
        return;
    }


    if (entry.entryType === "largest-contentful-paint") {
        (window.log || log)({
            type: "LCP",
            text: `${Math.round(entry.startTime)}ms`,
            suffix: getEl(entry),
            color: getColor(entry.startTime, "LCP"),
            entry
        });
        return;
    }
}

// Attach to window for non-module usage (like copy-paste into DevTools console)
if (typeof window !== 'undefined') {
    window.log = window.log || log;
    window.processEntry = window.processEntry || processEntry;
    window.getColor = getColor;
    window.getEl = getEl;
    window.THRESHOLDS = THRESHOLDS;
}

const observer = new PerformanceObserver(list => {
    for (const e of list.getEntries()) {
        (window.processEntry || processEntry)(e);
    }
});

observer.observe({ type: "event", buffered: true, durationThreshold: 0 });
observer.observe({ type: "interaction-contentful-paint", buffered: true });
observer.observe({ type: "soft-navigation", buffered: true });
observer.observe({ type: "largest-contentful-paint", buffered: true });
