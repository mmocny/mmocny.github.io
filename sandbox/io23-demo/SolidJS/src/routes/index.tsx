import { A } from "solid-start";

export default function IndexPage() {
	return (
	  <main>
		  <ul>
			  <li><A href="/pages/bad">Bad: Synchronous and unresponsive.</A></li>
			  <li><A href="/pages/better">Better: Transition, Delayed+Debounced.</A></li>
			  <li><A href="/pages/best">Best: Asynchronous, yieldy, and abortable.</A></li>
		  </ul>
	  </main>
	)
  }