function peekable(iterator) {
	let state = iterator.next();
  
	const _i = (function* (initial) {
	  while (!state.done) {
		const current = state.value;
		state = iterator.next();
		const arg = yield current;
	  }
	  return state.value;
	})()
  
	_i.peek = () => state;
	return _i;
  }

// After grouping entries by estimated renderTime, lets map to a single common renderTime for the frame (like a frameId)
// This is just for readability purposes.
// 
// Note: with enough effort, this may become a fairly accurate renderTime
// See: https://bugs.chromium.org/p/chromium/issues/detail?id=1295823
function estimateRenderTimeForFrame(eventTimingEntries) {
	// TODO: looking up the nearest frame presentation time via the rAF time of the next frame
	const renderTimes = eventTimingEntries.map(entry => entry.presentationTime);
	const min = Math.min(...renderTimes);
	const max = Math.max(...renderTimes);
	const mid = (max+min)/2;
	// const roundedMid = Math.floor((mid+4)/8)*8;
	// return roundedMid;
	return mid;
}

// Calculate the total time spent inside entries we care about.
// Due to some peculiarities, this isn't as easy as just summing processingEnd-processingStart
// See: https://bugs.chromium.org/p/chromium/issues/detail?id=1295718
function calculateTotalProcessingTime(eventTimingEntries) {
	// Sort by processing [start, end].  Sometimes processing re-ordered and not in order of input timeStamp.
	eventTimingEntries.sort((a,b) => a.processingStart - b.processingStart || a.processingEnd - b.processingEnd);

	let sum = 0;
	let previousEndTime;
	for (let entry of eventTimingEntries) {
		if (!previousEndTime) {
			previousEndTime = entry.processingEnd;
		} else if (entry.processingStart < previousEndTime) {
			// Skip entries which start before the previous ended
			continue;
		}
		sum += (entry.processingEnd - entry.processingStart);
		previousEndTime = entry.processingEnd;
	}

	return sum;
}

// Unlike for InteractionID, here I assign labels to *all* the event types.
// Some of these may end up grouped wrong, for example, you can get a click event synthesized after a keypress.
// This grouping may make that look like "KEY,TAP".
// But for timings, I don't actually use these type values, just as FYI.
function getInteractionType(eventTimingEntry) {
	switch(eventTimingEntry.name) {
	case "keydown":
	case "keyup":
	case "keypress":
		return "KEY";
		
	case "pointerdown":
	case "pointerup":
	case "pointercancel":
	case "touchstart":
	case "touchend":
	case "touchcancel":
	case "mousedown":
	case "mouseup":
	case "gotpointercapture":
	case "lostpointercapture":
	case "click":
	case "dblclick":
	case "auxclick":
	case "contextmenu":
		return "TAP";
		
	case "pointerleave":
	case "pointerout":
	case "pointerover":
	case "pointerenter":
	case "mouseout":
	case "mouseover":
	case "mouseleave":
	case "mouseenter":
	case "lostpointercapture":
		return "HOVER";
	
	case "dragstart":
	case "dragend":
	case "dragenter":
	case "dragleave":
	case "dragover":
	case "drop":
		return "DRAG";
	
	case "beforeinput":
	case "input":
	case "compositionstart":
	case "compositionupdate":
	case "compositionend":
		return "INPUT";
		
	default:
		// Shouldn't have missed any...
		return "OTHER";
	}
}

function getInteractionTypesForFrame(eventTimingEntries) {
	return [...new Set(eventTimingEntries.map(entry => getInteractionType(entry)))];
}

function getInteractionIdsForFrame(eventTimingEntries) {
	return [...new Set(eventTimingEntries.map(entry => entry.interactionId).filter((id) => id !== 0))];
}




/**
 * 
 * 
 * 
 */










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
function groupEntriesByEstimatedFrameRenderTime(eventTimingEntries) {
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


function groupEntriesByOverlappingLoAF(allEventTimingEntries, allLoAFEntries) {
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




// Generate interesting timings for a specific frame of entries
function getTimingsForFrame(entriesForFrame) {
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

	const bmfStart = loafEntry?.renderStart;
	const rafEtcStartTime = Math.max(bmfStart, lastProcessedEntry.processingEnd); // There are other things that run before rAF, but events are common
	const renderingStart = loafEntry?.styleAndLayoutStart;

	// Durations
	const inputDelay = firstProcessedEntry.processingStart - firstInputEntry.startTime;

	const psTime = calculateTotalProcessingTime(eventTimingEntries);
	const psRange = lastProcessedEntry.processingEnd - firstProcessedEntry.processingStart;
	const psGap = psRange - psTime;

	const rafEtcDuration = renderingStart - rafEtcStartTime;
	const renderingDuration = loafEndTime - renderingStart;
	const presentationDelay = presentationTime - loafEndTime;
	const maxINP = presentationTime - eventsStartTime;

	// Ideally we would know when the even was queued on main, not arrived in hardware
	const jsTime = renderingStart - Math.max(eventsStartTime, loafStartTime);

	const renderRequestDelay = Math.max(0, loafEntry?.desiredRenderStart - loafEntry?.startTime);
	const renderSchedulingDelay = Math.max(0, loafEntry?.renderStart - loafEntry?.desiredRenderStart);
	const renderStartDelay = bmfStart - loafStartTime;


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
		"evtStart": eventsStartTime,
		"loafStart": loafStartTime,
		"loafEnd": loafEndTime,
		"evtEnd": presentationTime,

		"ids": interactionIds,
		"types": interactionTypes,
		"#event": numEvents,

		"maxINP": maxINP,
		"jsTime": jsTime,

		"inputDelay": inputDelay,
		"psTime": psTime,
		"??": psGap,
		"rAF": rafEtcDuration,
		"render": renderingDuration,
		"presDelay": presentationDelay,
	}
}



/**
 * 
 * 
 * 
 * 
 * 
 */

function reportAsTable(eventTimingEntries, loafEntries) {
	// Make results easier to look at
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
	// TODO: may want to filer down to only KEY/TAP/DRAG, but I left everything else since its not that much noise typically.
	let filteredEntriesByFrame = entriesByFrame.map(getTimingsForFrame)
		.filter(timings => timings.types.some(type => type != "HOVER"));

	// Optional: Filter down the single longest frame
	// timingsByFrame = [timingsByFrame.reduce((prev,curr) => (curr.duration > prev.duration) ? curr : prev)];

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






const Watcher = {
	timer_: 0,

	get(target, prop) {
		if (prop === "push") {
			clearTimeout(this.timer_);
			this.timer_ = setTimeout(() => {
				reportAsTable(AllEventTimingEntries, AllLoAFEntries);
			}, 1000);
		}
		return target[prop];
	}
}

const AllEventTimingEntries = new Proxy([], Watcher);
const AllLoAFEntries = [];

function assignPresentationTime(entry) {
	const presentationTime = entry.startTime + entry.duration;
	if (Math.abs(presentationTime - entry.processingEnd) > 4) {
		entry.presentationTime = presentationTime;
	}
	return entry;
}

function startCollectingEventTiming() {
	const observer = new PerformanceObserver(list => {
		AllEventTimingEntries.push(...list.getEntries().map(assignPresentationTime).filter(entry => "presentationTime" in entry));
	});

	observer.observe({
		type: "event",
		durationThreshold: 0, // 16 minumum by spec
		buffered: true
	});
}

function startCollectingLoAF() {
	const observer = new PerformanceObserver(list => {
		AllLoAFEntries.push(...list.getEntries());
	});

	observer.observe({
		type: "long-animation-frame",
		buffered: true
	});
}

startCollectingEventTiming();
startCollectingLoAF();

window.addEventListener('beforeunload', () => {
	reportAsTable(AllEventTimingEntries, AllLoAFEntries);
	reportToTimings(AllEventTimingEntries, AllLoAFEntries);
});