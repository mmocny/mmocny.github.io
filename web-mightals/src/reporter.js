const THRESHOLDS = { INP: { g: 200, n: 500 }, LCP: { g: 2500, n: 4000 }, CLS: { g: 0.1, n: 0.25 }, TBT: { g: 200, n: 600 } };
const COLORS = { g: "#0CCE6A", n: "#FFA400", p: "#FF4E42", i: "#FFC0CB" };

export function logActivity(record) {
    const { type, data, nav } = record;

    if (type === "navigation-finalized") return;

    if (type === "hard-navigation" || type === "soft-navigation") {
        const title = `${type === "hard-navigation" ? "Initial" : "Soft"} Navigation: ${data.url}`;
        const entry = data.softEntry || data.navEntry;
        if (entry) {
            console.groupCollapsed(`%c${title}`, "font-weight: bold; color: #2196F3;");
            console.log("Entry:", entry);
            console.groupEnd();
        } else {
            console.log(`%c${title}`, "font-weight: bold; color: #2196F3;");
        }
        return;
    }

    const metrics = [];
    const details = {};

    const interactionMetrics = new Map(); // id -> { type, val, label, entry, attributedLoafs }

    data.entries.forEach(e => {
        if (e.interactionId) {
            if (e.entryType === "event") {
                const getProc = (evt) => evt.processingEnd - evt.processingStart;
                const existing = interactionMetrics.get(`INP-${e.interactionId}`);
                if (!existing || e.duration > existing.val || (e.duration === existing.val && getProc(e) > getProc(existing.entry))) {
                    const overlaps = nav.loafs.filter(l =>
                        l.scripts.some(s => s.startTime < e.startTime + e.duration && s.startTime + s.duration > e.startTime)
                    );
                    interactionMetrics.set(`INP-${e.interactionId}`, {
                        type: "INP", val: e.duration, label: "INP", entry: e, attributedLoafs: overlaps
                    });
                }
            } else if (e.entryType === "interaction-contentful-paint") {
                const label = (nav.type === "Soft" && e.interactionId === nav.interactionId) ? "LCP" : "ICP";
                const existing = interactionMetrics.get(`${label}-${e.interactionId}`);
                if (!existing || e.duration > existing.val) {
                    interactionMetrics.set(`${label}-${e.interactionId}`, {
                        type: "LCP", val: e.duration, label, entry: e
                    });
                }
            }
        } else {
            (details[e.entryType] ??= []).push(e);
        }
    });

    interactionMetrics.forEach((m, key) => {
        metrics.push(m);
        const [type, id] = key.split('-');
        details[`${type} (${id})`] = m.entry;
        if (m.attributedLoafs?.length) {
            details[`${type} (${id}) Attributed LoAFs`] = m.attributedLoafs;
        }
    });

    data.metrics.forEach(m => {
        const dStr = m.label === "CLS" ? m.delta.toFixed(3) : `${Math.round(m.delta)}ms`;
        metrics.push({ type: m.label, val: m.total, label: `${m.label} +${dStr}` });
    });

    if (metrics.length === 0) return;

    renderPrettyLog("Update", metrics, details);
}

export function logFinalNav(nav) {
    const interactionCount = (performance.interactionCount || 0) - nav.baseInteractionCount;
    const metrics = [
        { type: "INP", val: nav.inp, label: `${interactionCount} INP` },
        { type: "CLS", val: nav.cls },
        { type: "LCP", val: nav.lcp },
        { type: "TBT", val: nav.tbt }
    ];
    renderPrettyLog(`[Final] ${nav.type} Nav`, metrics, {
        "URL": nav.url,
        "LCP Element": nav.softEntry?.largestPaintedElement || nav.softEntry?.firstPaintedElement,
        "State": nav
    });
}

function renderPrettyLog(title, metrics, details) {
    const styles = [];
    const header = metrics.map(m => {
        const t = THRESHOLDS[m.type] || THRESHOLDS.LCP;
        const r = m.val < 0 ? "i" : m.val <= t.g ? "g" : m.val <= t.n ? "n" : "p";
        const score = m.type === "CLS" ? m.val.toFixed(3) : `${Math.round(m.val)}ms`;
        styles.push(`color: ${COLORS[r]}; font-weight: bold;`, "color: inherit; font-weight: normal;");
        return `${m.label || m.type}: %c${score}%c`;
    }).join(" | ");

    console.groupCollapsed(`${title}: ${header}`, ...styles);
    Object.entries(details).forEach(([k, v]) => v && console.log(`${k}:`, v));
    console.groupEnd();
}
