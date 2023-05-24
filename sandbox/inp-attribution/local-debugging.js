import { assignPresentationTime } from "./event-timing-helpers.js";
import { groupEntriesByOverlappingLoAF } from './group-entries-by-frame.js'

function reportAsTable(getTimingsForFrame, eventTimingEntries, loafEntries) {
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

	const entriesByFrame = groupEntriesByOverlappingLoAF(eventTimingEntries, loafEntries);

	let timingsByFrame = entriesByFrame
		.map(getTimingsForFrame)
		.filter(timings => timings.ids.length > 0)
		.filter(timings => timings.types.some(type => type != "HOVER"))
		.filter(timings => timings.maxINP > 100)
		.map(decorateTimings);

	console.log(`Now have: ${timingsByFrame.length} interaction-frames (${performance.interactionCount} interactions, ${eventTimingEntries.length} events); ${loafEntries.length} LoAF;`);
	console.table(timingsByFrame);
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


// TODO: Add support for events missing presentationTime events.
function startCollectingEventTiming() {
	const entries = [];
	const observer = new PerformanceObserver(list => {
		entries.push(...list.getEntries()
			.map(assignPresentationTime)
			.filter(entry => "presentationTime" in entry)
		);
	});
	observer.observe({
		type: "event",
		durationThreshold: 0, // 16 minumum by spec
		buffered: true
	});
	return entries;
}

function startCollectingLoAF() {
	const entries = [];
	const observer = new PerformanceObserver(list => {
		entries.push(...list.getEntries());
	});
	observer.observe({
		type: "long-animation-frame",
		buffered: true
	});
	return entries;
}


export default function startLocalDebugging(getTimingsForFrame) {
	const AllEventTimingEntries = startCollectingEventTiming();
	const AllLoAFEntries = startCollectingLoAF();

	let previousNumEvents = 0;
	setInterval(() => {
		if (AllEventTimingEntries.length == previousNumEvents) return;
		reportAsTable(getTimingsForFrame, AllEventTimingEntries, AllLoAFEntries);
		previousNumEvents = AllEventTimingEntries.length;
	}, 1000);

	window.addEventListener('beforeunload', () => {
		reportAsTable(getTimingsForFrame, AllEventTimingEntries, AllLoAFEntries);
		// reportToTimings(AllEventTimingEntries, AllLoAFEntries);
	});
}