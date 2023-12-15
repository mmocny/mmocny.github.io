import { raf } from '../lib/raf.js';

export class FpsTracker extends EventTarget {
  constructor(dur = 1000) {
    super();
    this._dur = dur;
    this._frameTimes = [];
    // TODO: Allow replacing the raf loop with a stream that is given
    // or something to allow worker raf polling
    this.start();
  }

  async start() {
    for (; ;) {
      const frameTime = await raf();
      const fps = this.reportNewFrame(frameTime);
      // TODO: Experiment with observables
      this.dispatchEvent(new CustomEvent('fps', { detail: { fps } }));
    }
  }

  reportNewFrame(frameTime) {
    this._frameTimes.push(frameTime);
    return this.computeFps(frameTime);
  }

  // Separate this
  computeFps(ts = performance.now()) {
    this._frameTimes = this._frameTimes.filter(t => (ts - t) <= this._dur);
    return (this._frameTimes.length / this._dur) * 1000;

  }

  static fpsToColor(fps) {
    const percentDropped = 1 - (fps / 60);
    if (percentDropped > 3 / 4) return 'red';
    if (percentDropped > 2 / 4) return 'orange';
    if (percentDropped > 1 / 4) return 'yellow';
    return '#73AD21';
  }
};


