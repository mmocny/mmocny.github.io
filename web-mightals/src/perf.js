/**
 * perf$: Emits groups of PerformanceEntries belonging to the same animation frame.
 * Uses the W3C Observable proposal.
 */
export const perf$ = (
    types = ["event", "largest-contentful-paint", "interaction-contentful-paint", "soft-navigation", "layout-shift", "long-animation-frame"],
    options = { buffered: true, durationThreshold: 0 }
) => new Observable(subscriber => {
    const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();

        // 1. Collect and sort all valid paint timestamps
        // TODO: Layout Shift and Event Timing should get PaintTimingMixin
        const paintTimes = entries.map(entry => entry.paintTime).filter(t => typeof t === 'number' && t > 0);
        const uniquePaintTimes = [...new Set(paintTimes)].sort((a, b) => a - b);

        const frames = new Map();
        uniquePaintTimes.forEach(pt => frames.set(pt, []));
        frames.set(Infinity, []);

        const getAnchorTime = (e) => {
            const visualTime = getVisualTime(e);
            if (visualTime) return visualTime;
            if (e.entryType === "event") return e.processingStart;
            if (e.entryType === "long-animation-frame") return e.scripts[0]?.startTime || e.startTime;
            return e.startTime;
        };

        // 3. Group entries into the closest animation frame (anchorTime <= paintTime)
        for (const e of entries) {
            const t = getAnchorTime(e);
            const frameTime = uniquePaintTimes.find(pt => t <= pt) ?? Infinity;
            frames.get(frameTime).push(e);
        }

        // 4. Emit non-empty frames in chronological order
        [...uniquePaintTimes, Infinity].forEach(pt => {
            const frameEntries = frames.get(pt);
            if (frameEntries && frameEntries.length > 0) {
                const grouped = {};
                for (const e of frameEntries) (grouped[e.entryType] ??= []).push(e);
                subscriber.next(grouped);
            }
        });
    });

    types.forEach(type => {
        try {
            observer.observe({ type, ...options });
        } catch (e) {
            // Silently ignore unsupported types in production-like reset
        }
    });

    subscriber.addTeardown(() => observer.disconnect());
});
