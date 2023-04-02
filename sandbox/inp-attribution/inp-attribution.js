import { estimateRenderTimeForFrame, calculateTotalProcessingTime, getInteractionIdsForFrame, getInteractionTypesForFrame } from "./event-timing-helpers.js";
import startLocalDebugging from "./local-debugging.js";

export function getTimingsForFrame(entriesForFrame) {
	const { eventTimingEntries, loafEntry } = entriesForFrame;

	// A note here: many entries can share startTime.  Use the first one, but don't assume its the first to get processed.
	// It is possible that processing could take priority by event type, and be out of order of dispatch.  I am not sure.
	// TODO: Should test e.g. passive event handlers which are dispatched to main late...
	const firstInputEntry = eventTimingEntries.reduce((prev,next) => prev.startTime <= next.startTime ? prev : next, eventTimingEntries[0]);
	const firstProcessedEntry = eventTimingEntries.reduce((prev,next) => prev.processingStart <= next.processingStart ? prev : next, eventTimingEntries[0]);
	const lastProcessedEntry = eventTimingEntries.reduce((prev,next) => prev.processingEnd > next.processingEnd ? prev : next, eventTimingEntries[0]);

	console.assert(firstInputEntry.startTime === firstProcessedEntry.startTime, "First Input by startTime and processingStart differ... passive events out of order?", firstInputEntry, firstProcessedEntry);


	// Time points
	const eventsStartTime = firstInputEntry.startTime;
	const presentationTime = estimateRenderTimeForFrame(eventTimingEntries);
	const loafStartTime = loafEntry?.startTime + 0; // +0 to NaN
	const loafEndTime = loafEntry?.startTime + loafEntry?.duration;

	const bmfStartTime = loafEntry?.renderStart;
	const rafEtcStartTime = Math.max(bmfStartTime, lastProcessedEntry.processingEnd); // There are other things that run before rAF, but events are common
	const renderingStartTime = loafEntry?.styleAndLayoutStart;

	// Durations
	const inputDelay = firstProcessedEntry.processingStart - firstInputEntry.startTime;

	const psDur = calculateTotalProcessingTime(eventTimingEntries);
	const psGap = (lastProcessedEntry.processingEnd - firstProcessedEntry.processingStart) - psDur;

	const rafEtcDuration = renderingStartTime - rafEtcStartTime;
	const renderingDuration = loafEndTime - renderingStartTime;
	const presentationDelay = presentationTime - loafEndTime;
	const maxINP = presentationTime - eventsStartTime;

	// Overlapping Time Ranges
	const jsTime = renderingStartTime - Math.max(eventsStartTime, loafStartTime); // Wish we had `eventArrivedAtMain`

	const renderRequestDelay = Math.max(0, loafEntry?.desiredRenderStart - loafEntry?.startTime);
	const renderSchedulingDelay = Math.max(0, loafEntry?.renderStart - loafEntry?.desiredRenderStart);
	const renderStartDelay = bmfStartTime - loafStartTime;


	// const scripts = loafEntry.scripts.map(script => {
	//     const delay = script.startTime - script.desiredExecutionStart;
	//     const scriptEnd = script.startTime + script.duration;
	//     const compileDuration = script.executionStart - script.startTime;
	//     const execDuration = scriptEnd - script.executionStart;
	//     return {delay, compileDuration, execDuration, ...script.toJSON()};
	// });

	const interactionIds = getInteractionIdsForFrame(eventTimingEntries);
	const interactionTypes = getInteractionTypesForFrame(eventTimingEntries);
	const numEvents = eventTimingEntries.length;

	return {
		// "evtStart": eventsStartTime,
		// "loafStart": loafStartTime,
		// "loafEnd": loafEndTime,
		// "evtEnd": presentationTime,

		"ids": interactionIds,
		"types": interactionTypes,
		"#event": numEvents,

		"maxINP": maxINP,
		"jsTime": jsTime,

		"inputDelay": inputDelay,
		"events": psDur,
		"??": psGap,
		"rAF": rafEtcDuration,
		"render": renderingDuration,
		"presDelay": presentationDelay,
	}
}

startLocalDebugging(getTimingsForFrame);