import { A } from "solid-start";

export default function Home() {
	return <>
		<A href="/pages/bad">Bad: Synchronous and unresponsive.</A>
		<A href="/pages/better">Better: Transition, Delayed+Debounced.</A>
		<A href="/pages/best">Best: Asynchronous, yieldy, and abortable.</A>
	</>
}