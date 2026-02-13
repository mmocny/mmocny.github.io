const RATING_COLORS = {
    "good": "#0CCE6A",
    "needs-improvement": "#FFA400",
    "poor": "#FF4E42",
    "invalid": "#FFC0CB",
    "default": "inherit",
};

const LCP_THRESHOLDS = { good: 2500, needsImprovement: 4000 };
const INP_THRESHOLDS = { good: 200, needsImprovement: 500 };

const valueToRating = (value, thresholds) => {
    if (value < 0) return "invalid";
    if (value <= thresholds.good) return "good";
    if (value <= thresholds.needsImprovement) return "needs-improvement";
    return "poor";
};

/**
 * Helper to log metrics in a consistent "pretty" format.
 * Supports multiple metrics in a single group.
 */
function logMetric({ metrics, name, value, thresholds, details = {}, prefix = "", suffix = "" }) {
    const metricsToLog = metrics || [{ name, value, thresholds }];

    let logStr = prefix;
    const logStyles = [];

    metricsToLog.forEach((m, i) => {
        if (i > 0) logStr += " | ";
        if (m.value === null || m.value === undefined) {
            logStr += m.name;
            return;
        }

        const rating = valueToRating(m.value, m.thresholds);
        const prettyScore = m.value.toLocaleString(undefined, { maximumFractionDigits: 0 });
        logStr += `${m.name} %c${prettyScore}ms (${rating})%c`;
        logStyles.push(`color: ${RATING_COLORS[rating] || RATING_COLORS.default}; font-weight: bold;`);
        logStyles.push("color: inherit; font-weight: normal;");
    });

    const logArgs = [logStr, ...logStyles];
    if (suffix) logArgs.push(suffix);

    console.groupCollapsed(...logArgs);
    for (const [label, data] of Object.entries(details)) {
        if (data && (Array.isArray(data) ? data.length > 0 : true)) {
            console.log(`${label}:`, data);
        }
    }
    console.groupEnd();
}

// Map to hold the state of each interaction over time
const interactionsMap = new Map();
const LOG_DEBOUNCE_MS = 100; // Wait 100ms for related entries to bundle

/**
 * Returns the relevant metrics for the current interaction state.
 */
function getInteractionMetrics(state) {
    const metrics = [];
    const lastEvent = state.events[state.events.length - 1];
    const baselineTime = lastEvent ? lastEvent.startTime : 0;

    if (state.events.length > 0) {
        metrics.push({
            name: "INP",
            value: Math.max(...state.events.map(e => e.duration)),
            thresholds: INP_THRESHOLDS
        });
    }

    if (state.softNav) {
        if (state.icps.length > 0) {
            const latestIcpEnd = Math.max(...state.icps.map(i => i.presentationTime || i.renderTime || i.startTime));
            metrics.push({
                name: "Soft Nav",
                value: latestIcpEnd - baselineTime,
                thresholds: LCP_THRESHOLDS
            });
        } else {
            metrics.push({
                name: "Pending Soft Nav",
                value: null,
                thresholds: LCP_THRESHOLDS
            });
        }
    } else if (state.icps.length > 0) {
        const latestIcpEnd = Math.max(...state.icps.map(i => i.presentationTime || i.renderTime || i.startTime));
        metrics.push({
            name: "ICP",
            value: latestIcpEnd - baselineTime,
            thresholds: LCP_THRESHOLDS
        });
    }

    return metrics;
}

/**
 * Evaluates the current state of an interaction and logs the formatted output.
 */
function flushInteractionLog(interactionId) {
    const state = interactionsMap.get(interactionId);
    if (!state) return;

    state.logCount++;
    const updatePrefix = state.logCount > 1 ? "[Updated] " : "";
    const prefix = `${updatePrefix}Interaction (${interactionId}): `;
    const metrics = getInteractionMetrics(state);

    logMetric({
        metrics,
        prefix,
        details: {
            "Soft Navigation": state.softNav,
            "Contentful Paints": state.icps,
            "Event Timings": state.events
        }
    });
}

/**
 * Routes incoming entries into the appropriate interaction bucket.
 */
function processEntry(entry) {
    // If it doesn't have an interactionId, we can't group it under this new flow
    if (!entry.interactionId) return;

    const id = entry.interactionId;

    if (!interactionsMap.has(id)) {
        interactionsMap.set(id, {
            id,
            events: [],
            icps: [],
            softNav: null,
            timerId: null,
            logCount: 0
        });
    }

    const state = interactionsMap.get(id);

    // Categorize the entry
    switch (entry.entryType) {
        case "event":
            state.events.push(entry);
            break;
        case "interaction-contentful-paint":
            state.icps.push(entry);
            break;
        case "soft-navigation":
            state.softNav = entry;
            break;
    }

    // Clear existing timer and set a new one to debounce the log
    clearTimeout(state.timerId);
    state.timerId = setTimeout(() => {
        flushInteractionLog(id);
    }, LOG_DEBOUNCE_MS);
}

const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        // We send everything with an interactionId to our state machine
        if (entry.interactionId) {
            processEntry(entry);
        } else if (entry.entryType === "largest-contentful-paint") {
            logMetric({
                name: "Largest Contentful Paint",
                value: entry.startTime,
                thresholds: LCP_THRESHOLDS,
                details: { "Standard LCP (No Interaction)": entry }
            });
        }
    }
});

// --- Start Observing ---
observer.observe({ type: "event", durationThreshold: 0, buffered: true });
observer.observe({ type: "largest-contentful-paint", buffered: true });
observer.observe({ type: "interaction-contentful-paint", buffered: true });
observer.observe({ type: "soft-navigation", buffered: true });