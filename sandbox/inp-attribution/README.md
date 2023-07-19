# INP Attibution

Using LoAF + Event Timing

* PO over LoAF and Event Timing events
* Store everything into buffers
  * Maybe map the values to post-process data on the way in.
* Event Timing may dispatch to Performance Timeline later than LoAF... but there can only be one "active" LoAF and events arrive in order.
  * Therefore we should have: "completed", "active", and "waiting"
  * With each new event timing, we can append to active or "move forward"
  * Can peek at latest eagerly or wait till its finalized

Q: How can we know if a new LoAF which arrives should be marked "complete" when there are *no* events firing?  Timeout?  Hints from LoAF attribution that events are to come?

## Building

`esbuild inp-attribution.js --bundle --outdir=public`

## Usage

Paste [`public/inp-attribution.js`](public/inp-attribution.js) contents into JS console.
