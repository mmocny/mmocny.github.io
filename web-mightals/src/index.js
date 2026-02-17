import { webMightals$, finalized$ } from './webMightals.js';
import { logActivity, logFinalNav } from './reporter.js';

webMightals$.subscribe(logActivity);
finalized$.subscribe(logFinalNav);
