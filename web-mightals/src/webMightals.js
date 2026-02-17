import { perf$ } from './perf.js';

/**
 * webMightals$: Aggregates perf$ frames into Navigation and Interaction updates.
 */
export const webMightals$ = new Observable(subscriber => {
    const _createNav = (url, startTime = 0, interactionId = null) => ({
        url, startTime, interactionId, type: interactionId ? "Soft" : "Hard",
        inp: 0, cls: 0, lcp: 0, tbt: 0, loafs: [],
        baseInteractionCount: performance.interactionCount || 0
    });

    const activationStart = performance.getEntriesByType('navigation')[0]?.activationStart || 0;
    let nav = _createNav(location.href, activationStart);
    let reported = { cls: 0, tbt: 0, lcp: 0 };

    subscriber.next({ type: "hard-navigation", data: nav });

    const processFrame = (frame, targetNav) => {
        const metrics = [];
        const pendingEntries = [];

        for (const typeEntries of Object.values(frame)) {
            for (const e of typeEntries) {
                if (e.entryType === "soft-navigation") continue;
                pendingEntries.push(e);

                if (e.entryType === "long-animation-frame") {
                    targetNav.tbt += e.blockingDuration;
                    targetNav.loafs.push(e);
                } else if (e.entryType === "layout-shift" && !e.hadRecentInput) {
                    targetNav.cls += e.value;
                } else if (e.entryType === "largest-contentful-paint" && targetNav.type === "Hard") {
                    targetNav.lcp = e.startTime - targetNav.startTime;
                } else if (e.entryType === "event" && e.interactionId) {
                    const getProc = (evt) => evt.processingEnd - evt.processingStart;
                    const isNewLongest = !targetNav.longestEvent ||
                        e.duration > targetNav.longestEvent.duration ||
                        (e.duration === targetNav.longestEvent.duration && getProc(e) > getProc(targetNav.longestEvent));
                    if (isNewLongest) {
                        targetNav.inp = e.duration;
                        targetNav.longestEvent = e;
                    }
                } else if (e.entryType === "interaction-contentful-paint") {
                    if (targetNav.type === "Soft" && e.interactionId === targetNav.interactionId) {
                        targetNav.lcp = e.duration;
                    }
                }
            }
        }

        const clsDelta = targetNav.cls - reported.cls;
        if (clsDelta > 0.0005) {
            metrics.push({ label: "CLS", delta: clsDelta, total: targetNav.cls });
            reported.cls = targetNav.cls;
        }
        const tbtDelta = targetNav.tbt - reported.tbt;
        if (tbtDelta > 0) {
            metrics.push({ label: "TBT", delta: tbtDelta, total: targetNav.tbt });
            reported.tbt = targetNav.tbt;
        }
        const lcpDelta = targetNav.lcp - reported.lcp;
        if (lcpDelta !== 0) {
            metrics.push({ label: "LCP", delta: lcpDelta, total: targetNav.lcp });
            reported.lcp = targetNav.lcp;
        }

        if (pendingEntries.length || metrics.length) {
            subscriber.next({ type: "update", data: { entries: pendingEntries, metrics }, nav: targetNav });
        }
    };

    const controller = new AbortController();
    perf$().subscribe({
        next(frame) {
            const softNavs = frame["soft-navigation"] || [];
            const softNavEntry = softNavs[softNavs.length - 1];

            if (softNavEntry) {
                // Split frame entries into before/after soft nav based on startTime
                const before = {};
                const after = {};
                for (const [type, entries] of Object.entries(frame)) {
                    for (const e of entries) {
                        if (e === softNavEntry) continue;
                        const target = e.startTime < softNavEntry.startTime ? before : after;
                        (target[type] ??= []).push(e);
                    }
                }

                // Process leftovers for previous nav and finalize
                processFrame(before, nav);
                subscriber.next({ type: "navigation-finalized", data: nav });

                // Initialize new nav
                nav = _createNav(softNavEntry.name, softNavEntry.startTime, softNavEntry.interactionId);
                nav.softEntry = softNavEntry;
                nav.lcp = softNavEntry.duration || 0;
                reported = { cls: 0, tbt: 0, lcp: 0 };
                subscriber.next({ type: "soft-navigation", data: nav });

                // Process initial entries for new nav
                processFrame(after, nav);
            } else {
                processFrame(frame, nav);
            }
        }
    }, { signal: controller.signal });

    const finalize = () => subscriber.complete();
    window.addEventListener("pagehide", finalize, { capture: true });

    subscriber.addTeardown(() => {
        controller.abort();
        window.removeEventListener("pagehide", finalize);
    });
});

/**
 * finalized$: A higher-order Observable that aggregates webMightals$ into navigation summaries.
 */
export const finalized$ = new Observable(subscriber => {
    let state = null;
    const controller = new AbortController();
    webMightals$.subscribe({
        next(r) {
            if (r.type === "navigation-finalized") {
                if (state) subscriber.next(state);
            } else if (r.type.endsWith("-navigation")) {
                state = { ...r.data };
            } else if (r.type === "update") {
                if (state) {
                    state.inp = r.nav.inp;
                    state.lcp = r.nav.lcp;
                    state.cls = r.nav.cls;
                    state.tbt = r.nav.tbt;
                    state.softEntry = r.nav.softEntry;
                }
            }
        },
        complete() { if (state) subscriber.next(state); subscriber.complete(); }
    }, { signal: controller.signal });

    subscriber.addTeardown(() => controller.abort());
});
