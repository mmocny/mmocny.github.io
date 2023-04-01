export function assignPresentationTime(entry) {
	const presentationTime = entry.startTime + entry.duration;
	if (Math.abs(presentationTime - entry.processingEnd) > 4) {
		entry.presentationTime = presentationTime;
	}
	return entry;
}

// After grouping entries by estimated renderTime, lets map to a single common renderTime for the frame (like a frameId)
// This is just for readability purposes.
export function estimateRenderTimeForFrame(eventTimingEntries) {
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
export function calculateTotalProcessingTime(eventTimingEntries) {
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
export function getInteractionType(eventTimingEntry) {
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

export function getInteractionTypesForFrame(eventTimingEntries) {
	return [...new Set(eventTimingEntries.map(entry => getInteractionType(entry)))];
}

export function getInteractionIdsForFrame(eventTimingEntries) {
	return [...new Set(eventTimingEntries.map(entry => entry.interactionId).filter((id) => id !== 0))];
}