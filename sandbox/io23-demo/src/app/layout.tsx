import './globals.css'

import React from 'react';

import WebVitalsMonitor from '@/components/WebVitalsMonitor';

export const metadata = {
  title: 'Sailoogle',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:,"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <WebVitalsMonitor></WebVitalsMonitor>
        {children}
      </body>
    </html>
  )
}