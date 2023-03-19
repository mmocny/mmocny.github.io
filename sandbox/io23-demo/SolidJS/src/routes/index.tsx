import { A } from "solid-start";

export default function Home() {
	return <>
		<A href="/bad">Bad: Synchronous and unresponsive.</A>
		<A href="/better">Better: Transition, Delayed+Debounced.</A>
		<A href="/best">Best: Asynchronous, yieldy, and abortable.</A>
	</>
}