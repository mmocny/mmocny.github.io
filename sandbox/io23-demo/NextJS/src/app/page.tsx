// import styles from './page.module.css'

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
      <li><Link href="/search/bad/">Sync & blocky Search</Link></li>
      <li><Link href="/search/better/">Sync (but debounced) Search</Link></li>
      <li><Link href="/search/best/">Async & yieldy Search</Link></li>
      </ul>
    </main>
  )
}
