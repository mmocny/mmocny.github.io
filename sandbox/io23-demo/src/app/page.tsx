import Image from 'next/image'
import styles from './page.module.css'
//import Link from 'next/link'

// Instead of renaming each time
const Link = function ({ href, children }: { href: string, children: any }) {
  return <a href={href}>{children}</a>
}

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
