# Event Timing + Page Unload tests

Sets up various situations where event handler causes page unload, racing against presentation feedback.

* [dont-block-next-raf.html](./dont-block-next-raf.html)
  * doesn't do anything, just lets it "race".  Presentation is likely to win because page is simple.
* [block-next-raf.html](./block-next-raf.html)
  * block next rendering task from running, but allows navigation.
  * This is the most likely to fail to report event timings.
* [block-event-and-next-raf.html](./block-after-next-raf.html)
  * This sets up a long interaction, and then tries to block rendering.
  * Even if rendering isn't blocked (i.e. you see red) you will not get presentation feedback processing.
* [block-after-next-raf.html](./block-after-next-raf.html)
  * This always allows next rendering task, so you usually see red flash.
  * Even though rendering isn't blocked, you will not get presentation feedback processing.
* [block-event-and-after-next-raf.html](./block-event-and-after-next-raf.html)
  * Similar to above, but ensure event is long, too.
