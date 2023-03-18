function Link({ href, children }: { href: string, children: any }) {
	return <a href={href}>{ children }</a>
}

export default function IndexPage() {
  return (
  	<>

		<main>
			<ul>
				<li><Link href="/bad.html">Naive: Synchronous and unresponsive.</Link></li>
				<li><Link href="/better.html">Better: Transition, Delayed+Debounced.</Link></li>
				<li><Link href="/best.html">Best: Asynchronous, yieldy, and abortable.</Link></li>
			</ul>
		</main>
      </>
  )
}