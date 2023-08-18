function floorObject(o) {
	return Object.fromEntries(
	  Array.from(Object.entries(o)).map(([key, value]) => [
		key,
		typeof value === "number" ? Math.floor(value) : value
	  ])
	);
  }
  
  export default function processLoAFEntry(entry) {
	const startTime = entry.startTime;
	const endTime = entry.startTime + entry.duration;
  
	const delay = entry.desiredRenderStart
	  ? Math.max(0, entry.startTime - entry.desiredRenderStart)
	  : 0;
	const deferredDuration = Math.max(
	  0,
	  entry.desiredRenderStart - entry.startTime
	);
  
	const rafDuration = entry.styleAndLayoutStart - entry.renderStart;
	const totalForcedStyleAndLayoutDuration = entry.scripts.reduce(
	  (sum, script) => sum + script.forcedStyleAndLayoutDuration,
	  0
	);
	const styleAndLayoutDuration = entry.styleAndLayoutStart
	  ? endTime - entry.styleAndLayoutStart
	  : 0;
  
	const scripts = entry.scripts.map((script) => {
	  const delay = script.startTime - script.desiredExecutionStart;
	  const scriptEnd = script.startTime + script.duration;
	  const compileDuration = script.executionStart - script.startTime;
	  const execDuration = scriptEnd - script.executionStart;
	  return floorObject({
		delay,
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
  