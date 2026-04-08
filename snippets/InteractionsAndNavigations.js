(function () {
    const THRESHOLDS = {
        INP: [200, 500],
        LCP: [2500, 4000],
        FCP: [1800, 3000]
    };

    function getColor(entry) {
        const val = entry.duration || entry.startTime;
        const type = entry.entryType;
        const metric = type === "event" ? "INP" : (type === "soft-navigation" ? "FCP" : "LCP");
        const [good, ni] = THRESHOLDS[metric];
        return val <= good ? "#0CCE6A" : val <= ni ? "#FFA400" : "#FF4E42";
    }

    function getMetricName(entry) {
        return {
            "soft-navigation": "FCP*",
            "event": " INP",
            "largest-contentful-paint": " LCP",
            "interaction-contentful-paint": entry.interactionId === activeNav?.interactionId ? "LCP*" : " ICP"
        }[entry.entryType];
    }

    // These two variables are used to track the active navigation and the last ICP, just to help
    // make logs cleaner.  We could use 100% local knowledge.
    let activeNav = null, lastICP = null;
    function log(entry) {
        const metricName = getMetricName(entry);
        // If entry has `duration` use that, otherwise just use `startTime`.
        // Note: LCP `startTime` might be inflated in case of e.g. prerendering or background tabs.
        const score = entry.duration || entry.startTime;
        const text = `${String(Math.round(score)).padStart(4, ' ')}ms`;
        // Log interactionID + URL, when available
        const idPart = entry.interactionId ? ` [id: ${String(entry.interactionId).padStart(4, ' ')}]` : " ".repeat(11);
        const suffix = idPart + (entry.entryType === "soft-navigation" ? ` ${entry.name}` : "");

        const element = entry.element || entry.target || entry.largestContentfulPaint?.element;

        console.groupCollapsed(`${metricName}: %c${text}%c${suffix}`,
            `color: ${getColor(entry)}; font-weight: bold;`, "color: inherit; font-weight: normal;",
            element || "");
        console.log("Entry:", entry);
        if (element) console.log("Element:", element);
        console.groupEnd();
    }

    const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntriesByType("largest-contentful-paint")) {
            log(entry);
        }
        for (const entry of list.getEntriesByType("event")) {
            if (entry.interactionId) log(entry);
        }
        for (const entry of list.getEntriesByType("soft-navigation")) {
            log(activeNav = entry);
            const icp = typeof entry.getLargestInteractionContentfulPaint === 'function'
                ? entry.getLargestInteractionContentfulPaint()
                : entry.largestInteractionContentfulPaint;
            if (icp) log(lastICP = icp);
        }
        for (const entry of list.getEntriesByType("interaction-contentful-paint")) {
            if (entry !== lastICP) log(lastICP = entry);
        }
    });

    [
        "largest-contentful-paint",
        "event",
        "soft-navigation",
        "interaction-contentful-paint",
    ].forEach(type => observer.observe({ type, buffered: true, durationThreshold: 0 }));
})();