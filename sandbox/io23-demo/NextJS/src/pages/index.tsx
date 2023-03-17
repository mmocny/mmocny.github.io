export default function IndexPage() {
  return (
  	<>
		<main>
			<ul>
				<li><a href="/bad/">Naive: Synchronous and unresponsive.</a></li>
				<li><a href="/better/">Better: Transition, Delayed+Debounced.</a></li>
				<li><a href="/best/">Best: Asynchronous, yieldy, and abortable.</a></li>
			</ul>
		</main>
      </>
  )
}