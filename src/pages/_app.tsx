import '@/styles/globals.css'
// import 'reactflow/dist/style.css' // Disabled - reactflow not installed
import 'highlight.js/styles/github-dark.css'
import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import Script from 'next/script'
import { SupernalProvider } from '@supernal/interface-nextjs'
import { NavigationGraph } from "@supernalintelligence/interface-enterprise"
import { initializeDemoArchitecture, createNavigationHandler } from '../architecture'
import { useRouter } from 'next/router'
import TTSInit from '../components/TTSInitializer'
import '../lib/DevTools'  // Expose AI interface for testing

const DEBUG = false
// @ts-ignore - CopilotKit is optional
const CopilotChatWidget = process.env.NEXT_PUBLIC_USE_COPILOTKIT === 'true'
  ? require('../components/CopilotChatWidget').CopilotChatWidget
  : () => null;

// NOTE: GlobalThemeTools disabled - using widget-scoped theming instead
// Each demo widget controls its own theme via data-theme attribute
// import '../lib/GlobalThemeTools'

// NOTE: BlogNavigationTools removed - blog navigation is now auto-generated
// via ContentResolver in DemoContainers.ts (see Blog container definition)

// Toggle between CopilotKit and Supernal native chat
const USE_COPILOTKIT = process.env.NEXT_PUBLIC_USE_COPILOTKIT === 'true'

// Architecture initialization component - handles demo-specific setup
function ArchitectureInitializer() {
  const router = useRouter()

  useEffect(() => {
    DEBUG && console.log('🚀 [_app] useEffect triggered')

    // Debug: Check NavigationGraph state BEFORE initialization
    const navGraph = NavigationGraph.getInstance()
    const contextsBefore = navGraph.getAllContexts()
    DEBUG && console.log('📊 [_app] NavigationGraph state BEFORE init:', {
      contextsCount: contextsBefore.length,
      contexts: contextsBefore.map((c: any) => c.name).join(', ')
    })

    // Initialize architecture (registers containers and creates nav tools)
    // Even if already initialized, this is idempotent
    DEBUG && console.log('🚀 [_app] Calling initializeDemoArchitecture()')
    initializeDemoArchitecture()

    // Debug: Check NavigationGraph state AFTER initialization
    const contextsAfter = navGraph.getAllContexts()
    DEBUG && console.log('📊 [_app] NavigationGraph state AFTER init:', {
      contextsCount: contextsAfter.length,
      contexts: contextsAfter.map((c: any) => c.name).join(', ')
    })

    // Always set navigation handler (even on refresh)
    const handler = createNavigationHandler(router)
    NavigationGraph.getInstance().setNavigationHandler(handler)
    DEBUG && console.log('✅ [_app] Navigation handler set')
  }, [router])

  // Update context whenever route changes (including initial load)
  useEffect(() => {
    const currentPath = router.asPath
    DEBUG && console.log('🔄 [_app] Route changed to:', currentPath)
    NavigationGraph.getInstance().setCurrentContext(currentPath)
  }, [router.asPath])

  return null
}

export default function App({ Component, pageProps }: AppProps) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID

  DEBUG && console.log('[_app] SupernalProvider imported:', SupernalProvider);
  DEBUG && console.log('[_app] USE_COPILOTKIT:', USE_COPILOTKIT);

  useEffect(() => {
    // Initialize GTM dataLayer
    if (typeof window !== 'undefined' && gtmId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).dataLayer = (window as any).dataLayer || []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function gtag(...args: unknown[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).dataLayer.push(args)
      }
      gtag('js', new Date())
      gtag('config', gtmId)
    }
  }, [gtmId])

  return (
    <React.Fragment>
      <SupernalProvider
        mode="fuzzy"
        disabled={USE_COPILOTKIT}  // Disable Supernal chat when using CopilotKit
        // Don't pass routes - AutoNavigationContext causes conflicts with useContainer
        // Pages will set their own context using useContainer() hook
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

        {/* CopilotKit chat (if enabled) */}
        {USE_COPILOTKIT && <CopilotChatWidget defaultOpen={false} />}
      </SupernalProvider>
    </React.Fragment>
  )
}
