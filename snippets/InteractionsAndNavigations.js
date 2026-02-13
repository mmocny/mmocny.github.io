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
    if (value <= 0) return "invalid";
    if (value <= thresholds.good) return "good";
    if (value <= thresholds.needsImprovement) return "needs-improvement";
    return "poor";
};

// Map to hold the state of each interaction over time
const interactionsMap = new Map();
const LOG_DEBOUNCE_MS = 100; // Wait 100ms for related entries to bundle

/**
 * Calculates the total duration based on the earliest event and the latest paint/nav.
 */
function calculateInteractionValue(state) {
    // The earliest event is our baseline start time
    const earliestEvent = state.events.reduce((earliest, current) =>
        (!earliest || current.startTime < earliest.startTime) ? current : earliest
        , null);

    const baselineTime = earliestEvent ? earliestEvent.startTime : 0;

    // If we have a Soft Nav, we measure from the first event to the Soft Nav completion
    if (state.softNav) {
        return state.softNav.startTime + state.softNav.duration - baselineTime;
    }

    // If we have an ICP, measure from the first event to the ICP
    if (state.icps.length > 0) {
        const latestIcp = state.icps.reduce((latest, current) =>
            (!latest || current.startTime > latest.startTime) ? current : latest
        );
        return latestIcp.startTime - baselineTime;
    }

    // If only events, use the maximum duration (Standard INP)
    if (state.events.length > 0) {
        return Math.max(...state.events.map(e => e.duration));
    }

    return 0;
}

/**
 * Evaluates the current state of an interaction and logs the formatted output.
 */
function flushInteractionLog(interactionId) {
    const state = interactionsMap.get(interactionId);
    if (!state) return;

    state.logCount++;
    const isUpdate = state.logCount > 1;
    const updatePrefix = isUpdate ? "[Updated] " : "";

    let metricName = "";
    let metricValue = calculateInteractionValue(state);
    let rating = "default";

    // Determine the highest tier of interaction we currently have
    if (state.softNav) {
        metricName = "Soft Navigation";
        // Soft Navs don't have a strict threshold in this snippet, defaulting to LCP for demo
        rating = valueToRating(metricValue, LCP_THRESHOLDS);
    } else if (state.icps.length > 0) {
        metricName = "Interaction to Next Paint + Contentful Paint";
        rating = valueToRating(metricValue, LCP_THRESHOLDS);
    } else if (state.events.length > 0) {
        metricName = "Interaction to Next Paint";
        rating = valueToRating(metricValue, INP_THRESHOLDS);
    }

    const prettyScore = metricValue.toLocaleString(undefined, { maximumFractionDigits: 0 });
    const logArgs = [
        `${updatePrefix}${metricName} %c${prettyScore}ms (${rating})`,
        `color: ${RATING_COLORS[rating] || RATING_COLORS.default}; font-weight: bold;`,
        `InteractionId: ${interactionId}`
    ];

    console.groupCollapsed(...logArgs);

    if (state.softNav) console.log("Soft Navigation:", state.softNav);
    if (state.icps.length > 0) console.log("Contentful Paints:", state.icps);
    if (state.events.length > 0) console.log("Event Timings:", state.events);

    console.groupEnd();
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
            // Handle standard LCP separately if needed, as it lacks interactionId
            console.log("Standard LCP (No Interaction):", entry);
        }
    }
});

// --- Start Observing ---
if (PerformanceObserver.supportedEntryTypes.includes('interaction-contentful-paint')) {
    observer.observe({ type: "interaction-contentful-paint", buffered: true });
}
observer.observe({ type: "largest-contentful-paint", buffered: true });
observer.observe({ type: "soft-navigation", buffered: true });
observer.observe({ type: "event", durationThreshold: 0, buffered: true });