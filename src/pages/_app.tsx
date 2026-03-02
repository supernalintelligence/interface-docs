import '@/styles/globals.css'
import 'highlight.js/styles/github-dark.css'
import '@supernal/tts-widget/widget.css'
import type { AppProps } from 'next/app'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import dynamic from 'next/dynamic'

// Dynamically import heavy components to avoid SSG issues
const SupernalProvider = dynamic(
  () => import('@supernal/interface-nextjs').then(mod => mod.SupernalProvider),
  { ssr: false }
)

const TTSInit = dynamic(
  () => import('../components/TTSInitializer'),
  { ssr: false }
)

const DevVariantSwitcher = dynamic(
  () => import('../components/DevVariantSwitcher').then(mod => mod.DevVariantSwitcher),
  { ssr: false }
)

const DEBUG = false && process.env.NODE_ENV === 'development'

// Toggle between CopilotKit and Supernal native chat
const USE_COPILOTKIT = process.env.NEXT_PUBLIC_USE_COPILOTKIT === 'true'

// Architecture initialization component - loads on client only
function ArchitectureInitializer() {
  useEffect(() => {
    // Dynamically import to avoid SSG issues
    import('../architecture').then(({ initializeDemoArchitecture }) => {
      initializeDemoArchitecture()
      DEBUG && console.log('✅ [_app] Demo architecture initialized')
    })
    
    // Also import tools
    import('../tools/LocationAwareExampleTools')
    import('../tools/ExampleTools')
    import('../lib/DevTools')
  }, [])

  return null
}

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false)
  const gtmId = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID

  // Only render full app after mount to avoid SSG issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // 🎯 Persistent chat variant across page navigation
  const [chatVariant, setChatVariant] = React.useState<'full' | 'floating' | 'drawer' | 'subtitle'>('full')

  // Initialize variant from localStorage on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chat-variant')
      if (saved && ['full', 'floating', 'drawer', 'subtitle'].includes(saved)) {
        setChatVariant(saved as typeof chatVariant)
      }
    }
  }, [])

  // 🎯 Initialize analytics
  useEffect(() => {
    if (typeof window === 'undefined') return

    import('@/lib/analytics').then(async (analyticsModule: any) => {
      const config = {
        providers: {
          gtm: {
            containerId: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID || '',
            enabled: !!process.env.NEXT_PUBLIC_GTM_CONTAINER_ID,
            dataLayerName: 'dataLayer',
          },
          posthog: {
            apiKey: process.env.NEXT_PUBLIC_POSTHOG_API_KEY || '',
            host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
            enabled: !!process.env.NEXT_PUBLIC_POSTHOG_API_KEY,
            sessionReplay: process.env.NEXT_PUBLIC_POSTHOG_SESSION_REPLAY === 'true',
            capturePageView: false,
            autocapture: false,
            maskAllInputs: true,
          },
          console: {
            enabled: process.env.NODE_ENV === 'development',
            verboseEvents: [],
            groupBySession: false,
          },
        },
        consent: {
          required: true,
          defaultState: 'granted' as const,
          storageKey: 'supernal-cookie-consent',
        },
        performance: {
          batchEnabled: false,
          batchSize: 10,
          batchInterval: 5000,
          offlineQueue: false,
          maxQueueSize: 100,
        },
        debug: process.env.NODE_ENV === 'development',
      }

      await analyticsModule.initializeAnalytics(config, null)
    }).catch((error: unknown) => {
      console.error('[_app] Failed to initialize analytics:', error)
    })
  }, [])

  // GTM initialization
  useEffect(() => {
    if (gtmId && typeof window !== 'undefined') {
      // @ts-ignore
      window.dataLayer = window.dataLayer || []
      // @ts-ignore
      function gtag(...args: any[]) { window.dataLayer.push(args) }
      // @ts-ignore
      gtag('js', new Date())
      // @ts-ignore
      gtag('config', gtmId)
    }
  }, [gtmId])

  // For SSG/SSR, render minimal version
  if (!mounted) {
    return (
      <React.Fragment>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        </Head>
        <Component {...pageProps} />
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      </Head>
      <SupernalProvider
        mode="fuzzy"
        disabled={USE_COPILOTKIT}
        glassMode={process.env.NEXT_PUBLIC_GLASS_MODE !== 'false'}
        variant={chatVariant}
      >
        <ArchitectureInitializer />
        <TTSInit />

        {/* Google Tag Manager */}
        {gtmId && (
          <>
            <Script
              id="gtm-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${gtmId}');
                `,
              }}
            />
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
          </>
        )}
        <Component {...pageProps} />

        {/* Dev-only variant switcher */}
        {process.env.NODE_ENV === 'development' && (
          <DevVariantSwitcher currentVariant={chatVariant} />
        )}
      </SupernalProvider>
    </React.Fragment>
  )
}
