import { Html, Head, Main, NextScript } from 'next/document'

import { testId } from '@supernal/interface/testing';
import { Document as DocumentNames } from '@/architecture/ComponentNames';
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon - Multiple sizes for different devices */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"  data-testid={testId(DocumentNames.link)}/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"  data-testid={testId(DocumentNames.link4)}/>
        <link rel="apple-touch-icon" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />

        {/* Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest"  data-testid={testId(DocumentNames.link5)}/>

        {/* Theme Color for mobile browsers */}
        <meta name="theme-color" content="#9333ea" />

        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/favicon-512x512.png" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content="/favicon-512x512.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
