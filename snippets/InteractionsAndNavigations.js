const RATING_COLORS = {
    "good": "#0CCE6A",
    "needs-improvement": "#FFA400",
    "poor": "#FF4E42",
    "invalid": "#FFC0CB",
    "default": "inherit",
};

const LCP_THRESHOLDS = { good: 2500, needsImprovement: 4000 };
const INP_THRESHOLDS = { good: 200, needsImprovement: 500 };
const CLS_THRESHOLDS = { good: 0.1, needsImprovement: 0.25 };

const valueToRating = (value, thresholds) => {
    if (value < 0) return "invalid";
    if (value <= thresholds.good) return "good";
    if (value <= thresholds.needsImprovement) return "needs-improvement";
    return "poor";
};

/**
 * Helper to log metrics in a consistent "pretty" format.
 */
function logMetric({ metrics, prefix = "", suffix = "", details = {} }) {
    let logStr = prefix;
    const logStyles = [];

    metrics.forEach((m, i) => {
        if (i > 0) logStr += " | ";
        if (m.value === null || m.value === undefined) {
            logStr += m.name;
            return;
        }

        const rating = valueToRating(m.value, m.thresholds);
        const isMs = m.thresholds !== CLS_THRESHOLDS;
        const prettyScore = isMs 
            ? `${m.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}ms`
            : m.value.toFixed(3);
            
        logStr += `${m.name} %c${prettyScore} (${rating})%c`;
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

// --- Navigation Tracking ---

let navigationSlices = [];
let currentNav = null;

function startNavigation(url, startTime = 0, interactionId = null) {
    const nav = {
        url,
        startTime,
        interactionId, // The interaction that triggered this soft nav
        type: interactionId ? "Soft" : "Hard",
        inp: 0,
        cls: 0,
        lcp: 0,
        lcpType: "LCP",
        interactions: new Map(),
        interactionCount: 0,
        layoutShiftCount: 0,
        lastLogKey: null,
        timerId: null,
    };
    navigationSlices.push(nav);
    currentNav = nav;
    return nav;
}

// Start initial navigation
startNavigation(location.href);

function flushNavigationLog(nav) {
    const metrics = [
        { name: `${nav.interactionCount} INP`, value: nav.inp, thresholds: INP_THRESHOLDS },
        { name: `${nav.layoutShiftCount} CLS`, value: nav.cls, thresholds: CLS_THRESHOLDS },
        { name: nav.lcpType, value: nav.lcp, thresholds: LCP_THRESHOLDS }
    ];

    const logKey = JSON.stringify(metrics);
    if (nav.lastLogKey === logKey) return;
    nav.lastLogKey = logKey;

    const navInfo = `${nav.type} Navigation: ${nav.url}${nav.interactionId ? ` (Interaction: ${nav.interactionId})` : ""}`;

    logMetric({
        prefix: `${navInfo}\nScores: `,
        metrics,
        details: {
            "URL": nav.url,
            "Start Time": nav.startTime,
            "Total Interactions": nav.interactionCount,
            "Layout Shifts": nav.layoutShiftCount,
            "Navigation State": nav
        }
    });
}

function debounceNavLog(nav) {
    clearTimeout(nav.timerId);
    nav.timerId = setTimeout(() => flushNavigationLog(nav), 100);
}

// --- Interaction Tracking ---

const interactionsMap = new Map();

function getInteractionState(id) {
    if (!interactionsMap.has(id)) {
        const nav = currentNav;
        interactionsMap.set(id, {
            id,
            events: [],
            icps: [],
            softNav: null,
            navigation: nav, // The nav active when interaction started
            timerId: null
        });
        nav.interactions.set(id, interactionsMap.get(id));
        nav.interactionCount++;
    }
    return interactionsMap.get(id);
}

function calculateInteractionMetrics(state) {
    const metrics = [];
    const lastEvent = state.events[state.events.length - 1];
    const baselineTime = lastEvent ? lastEvent.startTime : 0;

    if (state.events.length > 0) {
        const inpValue = Math.max(...state.events.map(e => e.duration));
        metrics.push({ name: "INP", value: inpValue, thresholds: INP_THRESHOLDS });
        
        // Update Navigation INP
        if (inpValue > state.navigation.inp) {
            state.navigation.inp = inpValue;
            debounceNavLog(state.navigation);
        }
    }

    if (state.softNav) {
        if (state.icps.length > 0) {
            const latestIcpEnd = Math.max(...state.icps.map(i => i.startTime));
            const softLcp = latestIcpEnd - baselineTime;
            metrics.push({ name: "Soft Nav", value: softLcp, thresholds: LCP_THRESHOLDS });
            
            // Soft Nav interactions update the *new* navigation's LCP
            // (Note: state.softNav was used to trigger a new nav, see processEntry)
            const targetNav = navigationSlices.find(n => n.interactionId === state.id);
            if (targetNav) {
                targetNav.lcp = latestIcpEnd - targetNav.startTime;
                targetNav.lcpType = "Soft-LCP";
                debounceNavLog(targetNav);
            }
        } else {
            metrics.push({ name: "Pending Soft Nav", value: null, thresholds: LCP_THRESHOLDS });
        }
    } else if (state.icps.length > 0) {
        const latestIcpEnd = Math.max(...state.icps.map(i => i.startTime));
        const icpDuration = latestIcpEnd - baselineTime;
        metrics.push({ name: "ICP", value: icpDuration, thresholds: LCP_THRESHOLDS });
    }

    return metrics;
}

function flushInteractionLog(id) {
    const state = interactionsMap.get(id);
    if (!state) return;

    const metrics = calculateInteractionMetrics(state);
    logMetric({
        prefix: `Interaction (${id}): `,
        metrics,
        details: {
            "Soft Navigation": state.softNav,
            "Contentful Paints": state.icps,
            "Event Timings": state.events,
            "Belongs to Nav": state.navigation.url
        }
    });
}

function processEntry(entry) {
    if (entry.entryType === "layout-shift") {
        if (!entry.hadRecentInput) {
            currentNav.cls += entry.value;
            currentNav.layoutShiftCount++;
            debounceNavLog(currentNav);
        }
        return;
    }

    if (entry.entryType === "largest-contentful-paint") {
        if (currentNav && !currentNav.interactionId) { // Only for initial load
            currentNav.lcp = entry.startTime;
            debounceNavLog(currentNav);
        }
        return;
    }

    if (entry.entryType === "soft-navigation") {
        const state = getInteractionState(entry.interactionId);
        state.softNav = entry;
        
        // Start new navigation slice
        const newNav = startNavigation(entry.name, entry.startTime, entry.interactionId);
        
        // Upgrade any existing ICPs for this interaction to the new navigation's LCP
        if (state.icps.length > 0) {
            const latestIcpEnd = Math.max(...state.icps.map(i => i.startTime));
            newNav.lcp = latestIcpEnd - newNav.startTime;
            newNav.lcpType = "Soft-LCP";
            debounceNavLog(newNav);
        }
        
        clearTimeout(state.timerId);
        state.timerId = setTimeout(() => flushInteractionLog(entry.interactionId), 100);
        return;
    }

    if (entry.interactionId) {
        const state = getInteractionState(entry.interactionId);
        
        if (entry.entryType === "event") {
            state.events.push(entry);
        } else if (entry.entryType === "interaction-contentful-paint") {
            state.icps.push(entry);
            
            // If this is already known as a soft-nav interaction, update the soft-nav's navigation LCP
            const targetNav = navigationSlices.find(n => n.interactionId === entry.interactionId);
            if (targetNav) {
                targetNav.lcp = entry.startTime - targetNav.startTime;
                targetNav.lcpType = "Soft-LCP";
                debounceNavLog(targetNav);
            }
        }

        clearTimeout(state.timerId);
        state.timerId = setTimeout(() => flushInteractionLog(entry.interactionId), 100);
    }
}

const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        processEntry(entry);
    }
});

observer.observe({ type: "event", durationThreshold: 0, buffered: true });
observer.observe({ type: "largest-contentful-paint", buffered: true });
observer.observe({ type: "interaction-contentful-paint", buffered: true });
observer.observe({ type: "soft-navigation", buffered: true });
observer.observe({ type: "layout-shift", buffered: true });
