"use strict";
import { estimateRenderTimeForFrame } from "./event-timing-helpers.js";
export function groupEntriesByEstimatedFrameRenderTime(eventTimingEntries) {
  if (eventTimingEntries.length === 0) {
    return [];
  }
  eventTimingEntries.sort((a, b) => a.presentationTime - b.presentationTime);
  const ret = [{ "eventTimingEntries": [eventTimingEntries[0]] }];
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
  allEventTimingEntries.sort((a, b) => a.processingStart - b.processingEnd);
  if (allLoAFEntries.length == 0) {
    return [];
  }
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
  console.assert(eventTimingEntries !== void 0, "Expected eventTimingEntries to be defined", entriesForFrame);
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
    "presDelay": presentationDelay
  };
}
