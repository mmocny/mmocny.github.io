import peekableIterator from './peekableIterator.js';

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

	const ret = [[eventTimingEntries[0]]]; // entry[][]

	// 8ms sliding window
	const WINDOW = 8;
	for (let entry of eventTimingEntries) {
		const curr = ret.at(-1);
		if (entry.presentationTime - curr[0].presentationTime > WINDOW) {
			ret.push([entry]);
		} else {
			curr.push(entry);
		}
	}

	return ret;
}


export function groupEntriesByOverlappingLoAF(allEventTimingEntries, allLoAFEntries) {
	allEventTimingEntries.sort((a,b) => a.processingStart - b.processingEnd);

	const ret = []; // entry[][]
	let eventsOutsideLoAF = []; // entry[]
	let eventsInsideLoAF = []; // entry[]

	const eventsTimingsIter = peekableIterator(allEventTimingEntries);

	let i = 0;
	for (let loafEntry of allLoAFEntries) {
		const loafEntryEndTime = loafEntry.startTime + loafEntry.duration;

		for (; !eventsTimingsIter.done && eventsTimingsIter.value.processingStart <= loafEntryEndTime; eventsTimingsIter.next()) {
			// Add all events that do NOT overlap the LoAF		
			if (eventsTimingsIter.value.processingStart < loafEntry.startTime) {
				eventsOutsideLoAF.push(eventsTimingsIter.value);
				continue;
			}

			// Add all events that overlap the LoAF
			if (eventsTimingsIter.value.processingStart >= loafEntry.startTime && eventsTimingsIter.value.processingStart <= loafEntryEndTime) {
				eventsInsideLoAF.push(eventsTimingsIter.value);
				continue;
			}
		}

		ret.push(...groupEntriesByEstimatedFrameRenderTime(eventsOutsideLoAF)
			.map(entryList => ({ eventTimingEntries: entryList }))
		);
		eventsOutsideLoAF = [];

		if (eventsInsideLoAF.length > 0) {
			ret.push({ eventTimingEntries: eventsInsideLoAF, loafEntry });
			eventsInsideLoAF = [];
		}
	}

	ret.push(...groupEntriesByEstimatedFrameRenderTime(allEventTimingEntries.slice(i))
		.map(entryList => ({ eventTimingEntries: entryList }))
	);

	return ret;
}