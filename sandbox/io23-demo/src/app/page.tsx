import SpaLink from 'next/link';

function MpaLink({ href, children }: { href: string, children: any }) {
  return <a href={href}>{children}</a>
}

// Switch to SpaLink as necessary
const Link = MpaLink;

export default async function Home() {
  return (
    <main>
      <ul>
      <li><Link href="/search/bad/">Bad Search</Link></li>
      <li><Link href="/search/badless/">Less Bad Search</Link></li>
      <li><Link href="/search/better/">Better Search</Link></li>
      <li><Link href="/search/best/">Best Search</Link></li>
      </ul>
    </main>
  )
}
