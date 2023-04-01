export function reportAsTable(eventTimingEntries, loafEntries) {
	function roundOffNumbers(obj, places) {
		for (let key in obj) {
			const val = obj[key];
			if (typeof val === 'number') {
				obj[key] = Number(val.toFixed(places));
			}
		}
		return obj;
	}

	function decorateTimings(timings) {
		roundOffNumbers(timings, 0);
		timings.ids = timings.ids.join(',');
		timings.types = timings.types.join(',');
		return timings;
	}

	const AllInteractionIds = getInteractionIdsForFrame(eventTimingEntries);
	const entriesByFrame = groupEntriesByOverlappingLoAF(eventTimingEntries, loafEntries); // TODO: slice

	// Filter *frames* which have *only* HOVER interactions.  Leave HOVER events in for the remaining frames to account for timings.
	let filteredEntriesByFrame = entriesByFrame.map(getTimingsForFrame)
		.filter(timings => timings.types.some(type => type != "HOVER"));

	console.log(`Now have ${AllInteractionIds.length} interactions, in ${filteredEntriesByFrame.length} (${entriesByFrame.length - filteredEntriesByFrame.length} ignored) frames, with ${eventTimingEntries.length} events.`);
	console.table(filteredEntriesByFrame.map(decorateTimings));
}




// function reportToTimings() {
// 	const entriesByFrame = groupEntriesByEstimatedFrameRenderTime(AllEventTimingEntries);
	
// 	// Filter *frames* which have *only* HOVER interactions.  Leave HOVER events in for the remaining frames to account for timings.
// 	// TODO: may want to filer down to only KEY/TAP/DRAG, but I left everything else since its not that much noise typically.
// 	let timingsByFrame = entriesByFrame.map(getTimingsForFrame)
// 		.filter(timings => timings.interactionTypes.some(type => type != "HOVER"));

// 	for (const timing of timingsByFrame) {
// 		performance.measure(
// 			`[Frame] with ${timing.interactionIds.length} Interactions: ${timing.interactionIds.join(',')}, ${timing.interactionTypes.join(',')}`,
// 			{
// 				start: timing.startTime,
// 				end: timing.renderTime,
// 			});
// 		for (const entry of timing.entries) {
// 			performance.measure(`[Event] ${entry.name}.${entry.interactionId}`,
// 			{
// 				start: entry.processingStart,
// 				end: entry.processingEnd,
// 			});
// 		}
		
// 	}
// }





