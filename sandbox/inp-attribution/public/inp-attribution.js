"use strict";
(() => {
  // event-timing-helpers.js
  function assignPresentationTime(entry) {
    const presentationTime = entry.startTime + entry.duration;
    if (Math.abs(presentationTime - entry.processingEnd) > 4) {
      entry.presentationTime = presentationTime;
    }
    return entry;
  }
  function estimateRenderTimeForFrame(eventTimingEntries) {
    const renderTimes = eventTimingEntries.map((entry) => entry.presentationTime);
    const min = Math.min(...renderTimes);
    const max = Math.max(...renderTimes);
    const mid = (max + min) / 2;
    return mid;
  }
  function calculateTotalProcessingTime(eventTimingEntries) {
    eventTimingEntries.sort((a, b) => a.processingStart - b.processingStart || a.processingEnd - b.processingEnd);
    let sum = 0;
    let previousEndTime;
    for (let entry of eventTimingEntries) {
      if (!previousEndTime) {
        previousEndTime = entry.processingEnd;
      } else if (entry.processingStart < previousEndTime) {
        continue;
      }
      sum += entry.processingEnd - entry.processingStart;
      previousEndTime = entry.processingEnd;
    }
    return sum;
  }
  function getInteractionType(eventTimingEntry) {
    switch (eventTimingEntry.name) {
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
        return "OTHER";
    }
  }
  function getInteractionTypesForFrame(eventTimingEntries) {
    return [...new Set(eventTimingEntries.map((entry) => getInteractionType(entry)))];
  }
  function getInteractionIdsForFrame(eventTimingEntries) {
    return [...new Set(eventTimingEntries.map((entry) => entry.interactionId).filter((id) => id !== 0))];
  }

  // group-entries-by-frame.js
  function groupEntriesByEstimatedFrameRenderTime(eventTimingEntries) {
    if (eventTimingEntries.length === 0) {
      return [];
    }
    eventTimingEntries.sort((a, b) => a.presentationTime - b.presentationTime);
    const ret = [[eventTimingEntries[0]]];
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
  function groupEntriesByOverlappingLoAF(allEventTimingEntries, allLoAFEntries) {
    allEventTimingEntries.sort((a, b) => a.processingStart - b.processingEnd);
    const ret = [];
    let eventsOutsideLoAF = [];
    let eventsInsideLoAF = [];
    let i = 0;
    for (let loafEntry of allLoAFEntries) {
      const loafEntryEndTime = loafEntry.startTime + loafEntry.duration;
      for (const eventEntry of allEventTimingEntries.slice(i)) {
        if (eventEntry.processingStart > loafEntryEndTime) {
          break;
        }
        if (eventEntry.processingStart < loafEntry.startTime) {
          eventsOutsideLoAF.push(eventEntry);
          i++;
          continue;
        }
        if (eventEntry.processingStart >= loafEntry.startTime && eventEntry.processingStart <= loafEntryEndTime) {
          eventsInsideLoAF.push(eventEntry);
          i++;
          continue;
        }
      }
      ret.push(
        ...groupEntriesByEstimatedFrameRenderTime(eventsOutsideLoAF).map((entryList) => ({ eventTimingEntries: entryList }))
      );
      eventsOutsideLoAF = [];
      if (eventsInsideLoAF.length > 0) {
        ret.push({ eventTimingEntries: eventsInsideLoAF, loafEntry });
        eventsInsideLoAF = [];
      }
    }
    ret.push(
      ...groupEntriesByEstimatedFrameRenderTime(allEventTimingEntries.slice(i)).map((entryList) => ({ eventTimingEntries: entryList }))
    );
    return ret;
  }

  // local-debugging.js
  function reportAsTable(getTimingsForFrame2, eventTimingEntries, loafEntries) {
    function roundOffNumbers(obj, places) {
      for (let key in obj) {
        const val = obj[key];
        if (typeof val === "number") {
          obj[key] = Number(val.toFixed(places));
        }
      }
      return obj;
    }
    function decorateTimings(timings) {
      roundOffNumbers(timings, 0);
      timings.ids = timings.ids.join(",");
      timings.types = timings.types.join(",");
      return timings;
    }
    const entriesByFrame = groupEntriesByOverlappingLoAF(eventTimingEntries, loafEntries);
    let timingsByFrame = entriesByFrame.map(getTimingsForFrame2).filter((timings) => timings.types.some((type) => type != "HOVER")).filter((timings) => timings.maxINP > 100).map(decorateTimings);
    console.log(`Now have: ${timingsByFrame.length} long-interactions (${performance.interactionCount} total, ${eventTimingEntries.length} events); ${loafEntries.length} LoAF;`);
    console.table(timingsByFrame);
  }
  function startCollectingEventTiming() {
    const entries = [];
    const observer = new PerformanceObserver((list) => {
      entries.push(
        ...list.getEntries().map(assignPresentationTime).filter((entry) => "presentationTime" in entry)
      );
    });
    observer.observe({
      type: "event",
      durationThreshold: 0,
      // 16 minumum by spec
      buffered: true
    });
    return entries;
  }
  function startCollectingLoAF() {
    const entries = [];
    const observer = new PerformanceObserver((list) => {
      entries.push(...list.getEntries());
    });
    observer.observe({
      type: "long-animation-frame",
      buffered: true
    });
    return entries;
  }
  function startLocalDebugging(getTimingsForFrame2) {
    const AllEventTimingEntries = startCollectingEventTiming();
    const AllLoAFEntries = startCollectingLoAF();
    let previousNumEvents = 0;
    setInterval(() => {
      if (AllEventTimingEntries.length == previousNumEvents)
        return;
      reportAsTable(getTimingsForFrame2, AllEventTimingEntries, AllLoAFEntries);
      previousNumEvents = AllEventTimingEntries.length;
    }, 1e3);
    window.addEventListener("beforeunload", () => {
    });
  }

  // inp-attribution.js
  function getTimingsForFrame(entriesForFrame) {
    const { eventTimingEntries, loafEntry } = entriesForFrame;
    const firstInputEntry = eventTimingEntries.reduce((prev, next) => prev.startTime <= next.startTime ? prev : next, eventTimingEntries[0]);
    const firstProcessedEntry = eventTimingEntries.reduce((prev, next) => prev.processingStart <= next.processingStart ? prev : next, eventTimingEntries[0]);
    const lastProcessedEntry = eventTimingEntries.reduce((prev, next) => prev.processingEnd > next.processingEnd ? prev : next, eventTimingEntries[0]);
    console.assert(firstInputEntry.startTime === firstProcessedEntry.startTime, "First Input by startTime and processingStart differ... passive events out of order?", firstInputEntry, firstProcessedEntry);
    const eventsStartTime = firstInputEntry.startTime;
    const presentationTime = estimateRenderTimeForFrame(eventTimingEntries);
    const loafStartTime = loafEntry?.startTime + 0;
    const loafEndTime = loafEntry?.startTime + loafEntry?.duration;
    const bmfStartTime = loafEntry?.renderStart;
    const rafEtcStartTime = Math.max(bmfStartTime, lastProcessedEntry.processingEnd);
    const renderingStartTime = loafEntry?.styleAndLayoutStart;
    const inputDelay = firstProcessedEntry.processingStart - firstInputEntry.startTime;
    const psDur = calculateTotalProcessingTime(eventTimingEntries);
    const psGap = lastProcessedEntry.processingEnd - firstProcessedEntry.processingStart - psDur;
    const rafEtcDuration = renderingStartTime - rafEtcStartTime;
    const renderingDuration = loafEndTime - renderingStartTime;
    const presentationDelay = presentationTime - loafEndTime;
    const maxINP = presentationTime - eventsStartTime;
    const jsTime = renderingStartTime - Math.max(eventsStartTime, loafStartTime);
    const renderRequestDelay = Math.max(0, loafEntry?.desiredRenderStart - loafEntry?.startTime);
    const renderSchedulingDelay = Math.max(0, loafEntry?.renderStart - loafEntry?.desiredRenderStart);
    const renderStartDelay = bmfStartTime - loafStartTime;
    const interactionIds = getInteractionIdsForFrame(eventTimingEntries);
    const interactionTypes = getInteractionTypesForFrame(eventTimingEntries);
    const numEvents = eventTimingEntries.length;
    return {
      "evtStart": eventsStartTime,
      "loafStart": loafStartTime,
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
      "presDelay": presentationDelay
    };
  }
  startLocalDebugging(getTimingsForFrame);
})();
