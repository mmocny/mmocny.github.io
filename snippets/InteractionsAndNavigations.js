/**
 * --- Performance Metrics Configuration ---
 * Thresholds based on Core Web Vitals standards.
 */
const THRESHOLDS = {
    INP: { good: 200, needsImprovement: 500 },
    LCP: { good: 2500, needsImprovement: 4000 },
    CLS: { good: 0.1,   needsImprovement: 0.25 },
    TBT: { good: 200,   needsImprovement: 600 }
};

/**
 * --- Global Tracking State ---
 * We track performance in "slices" per navigation (URL).
 */
let currentNav = null;
const pendingInteractions = new Map(); // id -> { event, paint, softNav }
let hasPendingNavUpdate = false;

/**
 * --- Core Logic: Processing Performance Entries ---
 */
function processEntry(entry) {
    switch (entry.entryType) {
        case "long-animation-frame":
            currentNav.tbt += entry.blockingDuration;
            currentNav.loafs.push(entry);
            hasPendingNavUpdate = true;
            break;

        case "layout-shift":
            if (!entry.hadRecentInput) {
                currentNav.cls += entry.value;
                currentNav.layoutShiftCount++;
                hasPendingNavUpdate = true;
            }
            break;

        case "largest-contentful-paint":
            // Only track standard LCP for initial "Hard" navigations
            if (currentNav.type === "Hard") {
                currentNav.lcp = entry.startTime;
                hasPendingNavUpdate = true;
            }
            break;

        case "soft-navigation":
            // A Soft Navigation creates a new URL slice
            const softLcpValue = entry.duration; // Chromium: duration is the paint offset
            startNewNavigation(entry.name, entry.startTime, entry.interactionId);
            currentNav.lcp = softLcpValue;

            const state = getPendingInteraction(entry.interactionId);
            state.softNav = entry;
            hasPendingNavUpdate = true;
            break;

        case "event":
        case "interaction-contentful-paint":
            if (!entry.interactionId) break;
            
            currentNav.interactionIds.add(entry.interactionId);
            const interaction = getPendingInteraction(entry.interactionId);

            if (entry.entryType === "event") {
                // Track the longest event for the overall Navigation INP
                if (entry.duration > currentNav.inp) {
                    currentNav.inp = entry.duration;
                    currentNav.longestEvent = entry;
                }
                // Track the longest event for this specific Interaction log
                if (!interaction.event || entry.duration > interaction.event.duration) {
                    interaction.event = entry;
                }
            } else {
                interaction.paint = entry;
            }
            hasPendingNavUpdate = true;
            break;
    }
}

/**
 * --- Navigation & Lifecycle ---
 */
function startNewNavigation(url, startTime = 0, interactionId = null) {
    if (currentNav) {
        logNavigationSummary(currentNav, { isFinal: true });
    }

    currentNav = {
        url,
        startTime,
        interactionId,
        type: interactionId ? "Soft" : "Hard",
        inp: 0,
        cls: 0,
        lcp: 0,
        tbt: 0,
        interactionIds: new Set(),
        layoutShiftCount: 0,
        loafs: [],
        longestEvent: null
    };
}

function flushPendingLogs() {
    // 1. Log detailed interactions processed in this callback
    pendingInteractions.forEach((data, id) => {
        logInteractionDetail(id, data);
    });
    pendingInteractions.clear();

    // 2. Log the navigation summary if it changed
    if (hasPendingNavUpdate) {
        logNavigationSummary(currentNav);
        hasPendingNavUpdate = false;
    }
}

// Helper to access interaction grouping
function getPendingInteraction(id) {
    if (!pendingInteractions.has(id)) {
        pendingInteractions.set(id, { event: null, paint: null, softNav: null });
    }
    return pendingInteractions.get(id);
}

/**
 * --- Observer Setup ---
 */
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        processEntry(entry);
    }
    // Process everything from this callback atomically
    flushPendingLogs();
});

const entryTypes = [
    "event", 
    "largest-contentful-paint", 
    "interaction-contentful-paint", 
    "soft-navigation", 
    "layout-shift", 
    "long-animation-frame"
];

entryTypes.forEach(type => observer.observe({ type, buffered: true }));

// Initial State
startNewNavigation(location.href);

// Finalize on exit
window.addEventListener("pagehide", () => {
    if (currentNav) {
        logNavigationSummary(currentNav, { isFinal: true });
    }
}, { capture: true });


/**
 * --- Logging Implementation Details ---
 * Hiding the formatting complexity down here.
 */

const RATING_COLORS = { "good": "#0CCE6A", "needs-improvement": "#FFA400", "poor": "#FF4E42", "invalid": "#FFC0CB" };

function getRating(value, type) {
    const t = THRESHOLDS[type];
    if (value < 0) return "invalid";
    if (value <= t.good) return "good";
    if (value <= t.needsImprovement) return "needs-improvement";
    return "poor";
}

function logNavigationSummary(nav, { isFinal = false } = {}) {
    const lcpLabel = nav.type === "Soft" ? "Soft-LCP" : "LCP";
    const metrics = [
        { type: "INP", val: nav.inp, label: `${nav.interactionIds.size} INP` },
        { type: "CLS", val: nav.cls, label: `${nav.layoutShiftCount} CLS` },
        { type: "LCP", val: nav.lcp, label: lcpLabel },
        { type: "TBT", val: nav.tbt }
    ];

    const title = `${isFinal ? "[Final] " : ""}${nav.type} Navigation: ${nav.url}`;
    renderPrettyLog(title, metrics, {
        "URL": nav.url,
        "Total Interactions": nav.interactionIds.size,
        "Layout Shifts": nav.layoutShiftCount,
        "Longest Event (INP)": nav.longestEvent,
        "All LoAFs": nav.loafs,
        "Raw State": nav
    });
}

function logInteractionDetail(id, data) {
    const metrics = [];
    if (data.event)   metrics.push({ type: "INP", val: data.event.duration });
    if (data.paint)   metrics.push({ type: "LCP", val: data.paint.startTime - (data.paint.interactionStartTime || data.paint.startTime), label: "ICP" });
    if (data.softNav) metrics.push({ type: "LCP", val: data.softNav.duration, label: "Soft Nav" });

    // Link LoAF scripts that happened during this interaction's longest event
    const attributedLoafs = [];
    if (data.event) {
        currentNav.loafs.forEach(loaf => {
            const isOverlap = loaf.scripts.some(s => 
                (s.startTime < data.event.startTime + data.event.duration) && 
                (s.startTime + s.duration > data.event.startTime)
            );
            if (isOverlap) attributedLoafs.push(loaf);
        });
    }

    renderPrettyLog(`Interaction (${id}):`, metrics, {
        "Attributed LoAFs": attributedLoafs,
        "Event Entry": data.event,
        "Paint Entry": data.paint,
        "Soft Nav Entry": data.softNav
    });
}

function renderPrettyLog(title, metrics, details) {
    const styles = [];
    const header = metrics.map(m => {
        const r = getRating(m.val, m.type);
        const score = m.type === "CLS" ? m.val.toFixed(3) : `${Math.round(m.val)}ms`;
        styles.push(`color: ${RATING_COLORS[r]}; font-weight: bold;`, "color: inherit; font-weight: normal;");
        return `${m.label || m.type}: %c${score} (${r})%c`;
    }).join(" | ");

    console.groupCollapsed(`${title}\n${header}`, ...styles);
    Object.entries(details).forEach(([key, val]) => {
        if (val && (Array.isArray(val) ? val.length > 0 : true)) {
            console.log(`${key}:`, val);
        }
    });
    console.groupEnd();
}
