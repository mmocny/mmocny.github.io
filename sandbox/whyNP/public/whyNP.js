(() => {
  // processLoAFEntry.js
  function floorObject(o) {
    return Object.fromEntries(
      Array.from(Object.entries(o)).map(([key, value]) => [
        key,
        typeof value === "number" ? Math.floor(value) : value
      ])
    );
  }
  function processLoAFEntry(entry) {
    const startTime = entry.startTime;
    const endTime = entry.startTime + entry.duration;
    const delay = entry.desiredRenderStart ? Math.max(0, entry.startTime - entry.desiredRenderStart) : 0;
    const deferredDuration = Math.max(
      0,
      entry.desiredRenderStart - entry.startTime
    );
    const rafDuration = entry.styleAndLayoutStart - entry.renderStart;
    const totalForcedStyleAndLayoutDuration = entry.scripts.reduce(
      (sum, script) => sum + script.forcedStyleAndLayoutDuration,
      0
    );
    const styleAndLayoutDuration = entry.styleAndLayoutStart ? endTime - entry.styleAndLayoutStart : 0;
    const scripts = entry.scripts.map((script) => {
      const delay2 = script.startTime - script.desiredExecutionStart;
      const scriptEnd = script.startTime + script.duration;
      const compileDuration = script.executionStart - script.startTime;
      const execDuration = scriptEnd - script.executionStart;
      return floorObject({
        delay: delay2,
        compileDuration,
        execDuration,
        ...script.toJSON()
      });
    });
    return floorObject({
      startTime,
      endTime,
      delay,
      deferredDuration,
      rafDuration,
      styleAndLayoutDuration,
      totalForcedStyleAndLayoutDuration,
      ...entry.toJSON(),
      scripts
    });
  }

  // onNewLoAFInteraction.js
  function onNewLoAFInteraction(loaf, events2) {
    console.log("New LoAF Interaction!", loaf, events2);
  }

  // whyNP.js
  var loafs = [];
  var events = [];
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
        if (eventEndTime < loaf.startTime)
          continue;
        if (event.processingStart > loaf.endTime)
          break;
        const loafAndEventOverlap = loaf.startTime <= event.processingStart;
        frameData.events.push(event);
      }
      return frameData;
    });
    const longFramesWithInteractions = framesData.filter(
      (fd) => (
        /* fd.blockingDuration && */
        fd.events.some((entry) => entry.interactionId > 0)
      )
    );
    return longFramesWithInteractions;
  }
  var previousLoggedFrame = -1;
  function logIfInteresting() {
    const results = groupInteractionEventsByLoAF();
    if (results.length === 0)
      return;
    const newestFrame = results.at(-1);
    if (newestFrame.frameNum === previousLoggedFrame)
      return;
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
    const interactionEntries = entries.getEntries();
    if (interactionEntries.length === 0)
      return;
    events.push(...interactionEntries);
    logIfInteresting();
  }).observe({
    type: "event",
    buffered: true,
    durationThreshold: 0
  });
})();
