(function () {
    const THRESHOLDS = {
        INP: [200, 500],
        LCP: [2500, 4000],
        FCP: [1800, 3000]
    };

    function getColor(entry) {
        // Hack. See: https://github.com/w3c/largest-contentful-paint/issues/159
        const val = entry.duration || entry.startTime;
        const type = entry.entryType;
        const metric = type === "event" ? "INP" : (type === "soft-navigation" ? "FCP" : "LCP");
        const [good, ni] = THRESHOLDS[metric];
        return val <= good ? "#0CCE6A" : val <= ni ? "#FFA400" : "#FF4E42";
    }

    function log(entry) {
        const eType = entry.entryType;
        const type = {
            "soft-navigation": "FCP*", "event": " INP", "largest-contentful-paint": " LCP",
            "interaction-contentful-paint": entry.interactionId === activeNav?.interactionId ? "LCP*" : " ICP"
        }[eType];

        // Hack. See: https://github.com/w3c/largest-contentful-paint/issues/159
        const val = entry.duration || entry.startTime;
        const text = `${String(Math.round(val)).padStart(4, ' ')}ms`;
        const idPart = entry.interactionId ? ` [id: ${String(entry.interactionId).padStart(4, ' ')}]` : " ".repeat(11);
        const suffix = idPart + (eType === "soft-navigation" ? ` ${entry.name}` : "");

        console.groupCollapsed(`${type}: %c${text}%c${suffix}`,
            `color: ${getColor(entry)}; font-weight: bold;`, "color: inherit; font-weight: normal;",
            entry.element || entry.target || "");
        console.log("Entry:", entry);
        if (entry.element || entry.target) console.log("Element:", entry.element || entry.target);
        console.groupEnd();
    }

    let activeNav = null, lastICP = null;
    const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntriesByType("largest-contentful-paint")) {
            log(entry);
        }
        for (const entry of list.getEntriesByType("event")) {
            if (entry.interactionId) log(entry);
        }
        for (const entry of list.getEntriesByType("soft-navigation")) {
            log(activeNav = entry);
            if (entry.largestPaintedElement) log(lastICP = entry.largestPaintedElement);
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