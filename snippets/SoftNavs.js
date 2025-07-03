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


/**
 * Finds the corresponding navigation entry (hard or soft) for a given navigationId.
 * @param {string} navigationId
 * @returns {{isSoft: boolean, navEntry: PerformanceNavigationTiming | PerformanceSoftNavigationTiming}}
 */
function getNavigationInfo(navigationId) {
  const hardNavEntry = performance.getEntriesByType("navigation")[0];
  if (hardNavEntry?.navigationId === navigationId) {
    return { isSoft: false, navEntry: hardNavEntry };
  }
  // Search soft navigations for the matching ID
  const softNavEntry = performance
    .getEntriesByType("soft-navigation")
    .find((nav) => nav.navigationId === navigationId);
  return { isSoft: true, navEntry: softNavEntry };
}

/**
 * Logs a formatted performance metric to the developer console.
 * @param {object} metric The metric object to log.
 */
function logMetric(metric) {
  const prettyScore = metric.value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const logArgs = [
    `[${metric.name}] %c${prettyScore}ms (${metric.rating})`,
    `color: ${RATING_COLORS[metric.rating] || RATING_COLORS.default}`,
  ];

  // Add metric-specific details to the log title
  if (metric.name.endsWith("LCP")) {
    const lcpEntry = metric.entries[0];
    logArgs.push(
      `${(lcpEntry.size / 1000).toFixed(1)} kpx`,
      lcpEntry.element || `URL: ${lcpEntry.url}`
    );
  } else if (metric.attribution.pageUrl) {
    logArgs.push(metric.attribution.pageUrl);
  } else if (metric.attribution.interactionId) {
    logArgs.push(`InteractionId: ${metric.attribution.interactionId}`);
  }

  console.groupCollapsed(...logArgs);
  for (let entry of metric.entries) {
    console.log(entry);
  }
  console.groupEnd();
}


const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    switch (entry.entryType) {

      case "interaction-contentful-paint":
      // Fallthrough
      case "largest-contentful-paint": {
        const { isSoft, navEntry } = getNavigationInfo(entry.navigationId);
        console.assert(navEntry, `Navigation Entry expected for navigationId: ${entry.navigationId}`);

        const value = entry.startTime - navEntry.startTime;
        logMetric({
          name: isSoft ? "Soft.LCP" : "LCP",
          value: value,
          rating: valueToRating(value, LCP_THRESHOLDS),
          entries: [entry],
          attribution: {
            navEntry,
            pageUrl: navEntry.name,
            element: entry.element,
          },
        });
        break;
      }

      case "soft-navigation": {
        logMetric({
          name: "Soft.Nav",
          value: entry.duration,
          rating: "default",
          entries: [entry],
          attribution: {
            navEntry: entry,
            pageUrl: entry.name,
          },
        });
        break;
      }

      case "event": {
        if (!entry.interactionId) continue;
        logMetric({
          name: `Interaction (${entry.name})`,
          value: entry.duration,
          rating: valueToRating(entry.duration, INP_THRESHOLDS),
          entries: [entry],
          attribution: {
            interactionId: entry.interactionId,
            target: entry.target,
          },
        });
        break;
      }
    }
  }
});

// --- Start Observing ---
if (PerformanceObserver.supportedEntryTypes.includes('interaction-contentful-paint')) {
  observer.observe({ type: "interaction-contentful-paint", buffered: true, includeSoftNavigationObservations: true });
}
observer.observe({ type: "largest-contentful-paint", buffered: true, includeSoftNavigationObservations: true });
observer.observe({ type: "soft-navigation", buffered: true, includeSoftNavigationObservations: true });
observer.observe({ type: "event", durationThreshold: 0, buffered: true, includeSoftNavigationObservations: true });