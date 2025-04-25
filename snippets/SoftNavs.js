const RATING_COLORS = {
  "good": "#0CCE6A",
  "needs-improvement": "#FFA400",
  "poor": "#FF4E42",
  "invalid": "#FFC0CB",
  "default": "inherit", // Will default to this, anyway
};

function log(metric) {
  const prettyScore = metric.value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  console.groupCollapsed(
    `[${metric.name}] %c${prettyScore} ms (${
      metric.rating
    })`,
    `color: ${RATING_COLORS[metric.rating] || "inherit"}`
  );

  console.log(metric);
  console.log(...metric.entries);
  console.groupEnd();
}

function getNavigationEntry(navigationId) {
  const hardNav = performance.getEntriesByType('navigation')[0];
  if (hardNav.navigationId == navigationId) {
    return {
      isSoft: false,
      navEntry: hardNav,
    };
  }
  return {
    isSoft: true,
    navEntry: performance.getEntriesByType('soft-navigation').filter(nav => nav.navigationId == navigationId)[0],
  };
};

const valueToRating = (score) =>
  score <= 0 ? "invalid" : score <= 2500 ? "good" : score <= 4000 ? "needs-improvement" : "poor";

const observer = new PerformanceObserver((entryList) => {
  for (const paintEntry of entryList.getEntries()) {
    const {isSoft, navEntry} = getNavigationEntry(paintEntry.navigationId);
    const name = `${isSoft ? "Soft." : ""}${(paintEntry.name || paintEntry.entryType).split('-').map((s)=>s[0].toUpperCase()).join('')}`;
    const value = paintEntry.startTime - navEntry.startTime;
    const metric = {
        attribution: {
          navEntry,
          paintEntry,
          pageUrl: navEntry.name,
          elementUrl: paintEntry.url,
        },
        entries: [paintEntry],
        name,
        rating: valueToRating(value),
        value,
      };

    performance.measure(name, {
      start: navEntry.startTime,
      end: paintEntry.startTime,
    });

    log(metric);
  }
});

observer.observe({
  type: 'paint',
  buffered: true,
  includeSoftNavigationObservations: true,
});
observer.observe({
  type: 'largest-contentful-paint',
  buffered: true,
  includeSoftNavigationObservations: true,
});

const observer2 = new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    const name = `Soft.Nav`;
    const value = entry.duration;
    const metric = {
        attribution: {
          navEntry: entry,
          pageUrl: entry.name,
        },
        entries: [entry],
        name,
        rating: "default",
        value,
      };
    performance.measure(name, {
      start: entry.startTime,
      duration: entry.duration,
    })
    log(metric);
  }
});
observer2.observe({
  type: 'soft-navigation',
  buffered: true,
});