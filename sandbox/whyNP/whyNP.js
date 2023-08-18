// whyNP.js
// https://gist.github.com/mmocny/77a9e748edf95232df2e555cb494af2d
// Based on work from Noam Rosenthal

import processLoAFEntry from "./processLoAFEntry.js";
import onNewLoAFInteraction from "./onNewLoAFInteraction.js";

let loafs = [];
let events = [];

// Algorithm:
// - Walk both sorted lists: (loafs and events)
// - For each event
function groupInteractionEventsByLoAF() {
  let i = 0;

  const framesData = loafs.map((loaf, j) => {
    const frameData = {
      frameNum: j,
      blockingDuration: loaf.blockingDuration,
      loaf,
      scripts: loaf.scripts,
      events: []
    };

    for (; i < events.length; i++) {
      const event = events[i];
      const eventEndTime = event.startTime + event.duration;

      // console.log('event', i, event);

      // This event is obviously from a previous frame (or isn't long and doesn't need Next Paint)
      if (eventEndTime < loaf.startTime) continue;

      // This event is obviously for a future frame
      if (event.processingStart > loaf.endTime) break;

      if (loaf.startTime <= event.processingStart) {
		// This event is guarenteed to overlap LoAF
		frameData.events.push(event);
	  } else {
		// Even if it isn't guarenteed-- there will not be a better fit.
		// This is the first LoAF entry to follow an event timing entry...
		// It is possible there was a BeginMainFrame that went unreported and we are blind to it.
		// To work around that, we would need to force LoAF to report after long Event Timings.
		frameData.events.push(event);
	  }
    }

    return frameData;
  });

  const longFramesWithInteractions = framesData.filter(
    (fd) => /* fd.blockingDuration && */ fd.events.some((entry) => entry.interactionId > 0)
  );

  return longFramesWithInteractions;
}

let previousLoggedFrame = -1;

function logIfInteresting() {
  const results = groupInteractionEventsByLoAF();

  if (results.length === 0) return;

  const newestFrame = results.at(-1);

  if (newestFrame.frameNum === previousLoggedFrame) return;

  // TODO: Right now we have to wait for all events and loaf to arrive...
  // Perhaps one strategy is to wait for the next frame, or, log every time a frame change
  // Or use a timeout, or use rAF + rIC to assume things are logged.

  onNewLoAFInteraction(newestFrame.loaf, newestFrame.events);

  previousLoggedFrame = newestFrame.frameNum;
}

new PerformanceObserver((entries) => {
  loafs.push(...entries.getEntries().map(processLoAFEntry));
  logIfInteresting();
}).observe({
  type: "long-animation-frame",
  buffered: true
});

new PerformanceObserver((entries) => {
  const interactionEntries = entries
    .getEntries()
    // .filter((entry) => entry.interactonId > 0);

  if (interactionEntries.length === 0) return;

  events.push(...interactionEntries);
  logIfInteresting();
}).observe({
  type: "event",
  buffered: true,
  durationThreshold: 0
});
