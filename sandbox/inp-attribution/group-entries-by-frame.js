import { estimateRenderTimeForFrame } from "./event-timing-helpers.js";

// For events that share the same real presentation time, because we round() off duration to 8ms, an odd thing happens:
// - As startTime moves forward, the duration gets smaller
// - It can be either rounded-down or rounded-up, so...
// - The reported renderTime (startTime + duration) can end up be anywhere in the 8ms range.
// - For a single shared frame, the `duration` value for any one event may be much lower than the largest duration.
// 
// By sorting events by their reported renderTime, we know that all events which ended up at the same presentation should be within 8ms of each other.
//
// ...this heiristic can become a problem on screens with refresh rates higher than 120hz, since after that, there is less than an 8ms gap between renderTimes.
// ...also, if presentation times are not accurate or not vsync aligned, issues with grouping can arrise even at 60hz.
export function groupEntriesByEstimatedFrameRenderTime(eventTimingEntries) {
	if (eventTimingEntries.length === 0) {
		return [];
	}
	// This helper only works when we have a presentationTime, not just for sorting...
	eventTimingEntries.sort((a,b) => a.presentationTime - b.presentationTime);

	const ret = [{ "eventTimingEntries": [eventTimingEntries[0]] }]; // entry[][]

	// 8ms sliding window
	const WINDOW = 8;
	for (let entry of eventTimingEntries) {
		const curr = ret.at(-1).eventTimingEntries;

		if (entry.presentationTime - curr[0].presentationTime > WINDOW) {
			ret.push({ eventTimingEntries: [entry] });
		} else {
			curr.push(entry);
		}
	}

	return ret;
}


export function groupEntriesByOverlappingLoAF(allEventTimingEntries, allLoAFEntries) {
	allEventTimingEntries.sort((a,b) => a.processingStart - b.processingEnd);

	if (allLoAFEntries.length == 0) {
		return [];
	}

	const ret = []; // entry[][]
	let eventsOutsideLoAF = []; // entry[]
	let eventsInsideLoAF = []; // entry[]

	let i = 0;
	for (let loafEntry of allLoAFEntries) {
		const loafEntryEndTime = loafEntry.startTime + loafEntry.duration;

		// TODO: For readability, using nested loops with .slice(), but this causes lots of needless copies.  Would be better to use an iterator/view.
		for (const eventEntry of allEventTimingEntries.slice(i)) {
			if (eventEntry.processingStart > loafEntryEndTime) {
				break;
			}

			// Add all events that do NOT overlap the LoAF		
			if (eventEntry.processingStart < loafEntry.startTime) {
				eventsOutsideLoAF.push(eventEntry);
				i++;
				continue;
			}

			// Add all events that overlap the LoAF
			if (eventEntry.processingStart >= loafEntry.startTime && eventEntry.processingStart <= loafEntryEndTime) {
				eventsInsideLoAF.push(eventEntry);
				i++;
				continue;
			}

		}

		ret.push(...groupEntriesByEstimatedFrameRenderTime(eventsOutsideLoAF));
		eventsOutsideLoAF = [];

		if (eventsInsideLoAF.length > 0) {
			ret.push({ eventTimingEntries: eventsInsideLoAF, loafEntry });
			eventsInsideLoAF = [];
		}
	}

	return ret;
}

export function getTimingsForFrame(entriesForFrame) {
	const { eventTimingEntries, loafEntry } = entriesForFrame;
	console.assert(eventTimingEntries !== undefined, "Expected eventTimingEntries to be defined", entriesForFrame);

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