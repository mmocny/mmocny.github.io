const appDiv = document.getElementById('app');

// const DELAY_PER_FRAME = 200; // ms.  Using 100 because that is the deadline for NORMAL priority rendering in Chrome.
const DELAY_PER_TASK = 10; // ms.
const DEMO_LENGTH = 10_000; // ms.
const PRIORITY = ['user-blocking', 'user-visible', 'background'][1];

const controller = new TaskController({ priority: PRIORITY });

function markNeedsNextPaint() {
  // Trusted discrete events *will increase* rendering priority automatically, as of chromium m109.

  // We cannot programatically *increase* the priority of Rendering... but we can decrease the priority of all the tasks we control
  // controller.setPriority('background');

  // Once a task starts running, at any priority, it will not get pre-empted.
  // So the other part of the story is that every single task must yield() regularly.
  
  // isInputPending() is a signal that can be used to decide if it is worth yielding()... however:
  // - It is true only BEFORE an event gets dispatched
  // - Inisde event handlers, and after events handlers but before next rendering opporunity, it is false.
  // - So any library code that does:
  //   if (!isInputPending()) do_expensive_work();
  // ... will block the main thread if called from event handlers or rAF or tasks that happen to get scheduled in the event->rendering gap.
  // Therefore, I suggest to just remove the *IF*, and always yield, unless you specifically know there is a scheduling cost to doing so.
  // Even better is so schedule the followup at background or requestIdleCallback priority -- which increases the likelihood that it comes after the next rendering task.
  
  // If you want complete control-- I would set global state from markNeedsNextPaint(), and then call markNeedsNextPaint() in places that update important UI.
  // Then, you task scheduler can use the signal to decide to postpone work until after rendering, for example:
// TODO HERE

  // Note: sadly, simulated events don't trick the scheduler
  // const evt = new Event('click', { bubbles: true });
  // document.dispatchEvent(evt);
}

function markDoneNextPaint() {
  controller.setPriority(PRIORITY);
}

/*
 * Block the main thread for `ms`
 */
function block(ms) {
  const target = performance.now() + ms;
  while (performance.now() < target);
}

/*
 * Create a bunch of "small" tasks.  Each of which will:
 * - yield to run loop
 * - attempt to modify DOM (invalidation -> needsBeginFrames)
 *
 * However, they are all queued up-front, rather than waterfall
 */
function createTasks(cb) {
  const count = DEMO_LENGTH / DELAY_PER_TASK;

  for (let i = 0; i < count; i++) {
    scheduler.postTask(
      () => {
        block(DELAY_PER_TASK);
        cb();
      },
      { signal: controller.signal }
    );
  }
}

/*
 * Start a rAF loop
 */
function startRunLoop(cb) {
  let rafid = 0;
  function raf() {
    rafid = requestAnimationFrame(() => {
      cb();
      raf();
    });
  }
  raf();
  return () => cancelAnimationFrame(rafid);
}

/*
 * New experimental feature, better than traditional Long Tasks
 *
 * open -a /Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary --args --force-enable-metrics-reporting --enable-blink-featutres=LongAnimationFrameTiming
 */
function startMarkingLoAF() {
  // if (
  //   !PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')
  // ) {
  //   return console.warn(
  //     'LoAF Entry type not supported.  Type launching Canary with --enable-blink-featutres=LongAnimationFrameTiming'
  //   );
  // }

  const observer = new PerformanceObserver((list) => {
    for (let entry of list.getEntries()) {
      performance.measure('LoAF', {
        start: entry.startTime,
        duration: entry.duration,
      });
      console.log(entry);
    }
  });
  observer.observe({ type: 'long-animation-frame', buffered: true });
}

function stopTheDemoEventually(stopRunLoop) {
  // Like setTimeout but higher priority
  scheduler.postTask(
    () => {
      stopRunLoop();
      controller.abort();
    },
    { priority: 'user-blocking', signal: controller.signal, delay: DEMO_LENGTH }
  );
}

/*
 * Lets get going!
 */
function main() {
  startMarkingLoAF();

  createTasks(() => {
    const now = performance.now().toString();
    appDiv.innerHTML = now;

    // If you "need a next paint" quickly...
    markNeedsNextPaint();
  });
  // Every raf, create a new set of Tasks, which try update the DOM
  // We *should* have a DOM update every 10ms and a raf every opportunity... but we dont!
  const stopRunLoop = startRunLoop(() => {
    markDoneNextPaint();
  });

  stopTheDemoEventually(stopRunLoop);
}

main();
