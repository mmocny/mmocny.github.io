import WebVitalsMonitor from '@/components/WebVitalsMonitor'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'

import './index.css';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <>
      <WebVitalsMonitor></WebVitalsMonitor>
      <Component {...pageProps} />
    </>
  )
}