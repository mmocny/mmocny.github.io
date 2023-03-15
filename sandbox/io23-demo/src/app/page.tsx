import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'

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
