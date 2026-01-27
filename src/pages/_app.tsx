import '@/styles/globals.css'
// import 'reactflow/dist/style.css' // Disabled - reactflow not installed
import 'highlight.js/styles/github-dark.css'
import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import { SupernalProvider, ChatBubbleVariant } from '@supernal/interface-nextjs'

type ChatBubbleVariantType = keyof typeof ChatBubbleVariant;
import { NavigationGraph } from "@supernalintelligence/interface-enterprise"
import { LocationContext } from "@supernal/interface/browser"
import { initializeDemoArchitecture, createNavigationHandler } from '../architecture'
import { useRouter } from 'next/router'
import TTSInit from '../components/TTSInitializer'
import '../lib/DevTools'  // Expose AI interface for testing
import { DevVariantSwitcher } from '../components/DevVariantSwitcher'

// 🎯 NEW: Import location-aware tools (demonstrates unified scoping system)
import '../tools/LocationAwareExampleTools'

// ✅ CRITICAL: Import ExampleTools to trigger @Component/@Tool decorators
// Without this import, the decorators never execute and tools are never registered!
import '../tools/ExampleTools'

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
  const [isInitialized, setIsInitialized] = React.useState(false)

  useEffect(() => {
    DEBUG  && console.log('🚀 [_app] useEffect triggered')

    // Debug: Check NavigationGraph state BEFORE initialization
    const navGraph = NavigationGraph.getInstance()
    const contextsBefore = navGraph.getAllContexts()
    DEBUG  && console.log('📊 [_app] NavigationGraph state BEFORE init:', {
      contextsCount: contextsBefore.length,
      contexts: contextsBefore.map((c: any) => c.name).join(', ')
    })

    // Initialize architecture (registers containers and creates nav tools)
    // Even if already initialized, this is idempotent
    DEBUG  && console.log('🚀 [_app] Calling initializeDemoArchitecture()')
    initializeDemoArchitecture()

    // Debug: Check NavigationGraph state AFTER initialization
    const contextsAfter = navGraph.getAllContexts()
    DEBUG  && console.log('📊 [_app] NavigationGraph state AFTER init:', {
      contextsCount: contextsAfter.length,
      contexts: contextsAfter.map((c: any) => c.name).join(', ')
    })

    // Always set navigation handler (even on refresh)
    const handler = createNavigationHandler(router)
    NavigationGraph.getInstance().setNavigationHandler(handler)
    DEBUG  && console.log('✅ [_app] Navigation handler set')

    // Mark as initialized and set initial context
    setIsInitialized(true)
    NavigationGraph.getInstance().setCurrentContext(router.asPath)
  }, [router])

  // Update context whenever route changes (only after initialization)
  // 🎯 UNIFIED SCOPING: NavigationGraph.setCurrentContext() now updates LocationContext
  useEffect(() => {
    if (!isInitialized) return

    const currentPath = router.asPath
    DEBUG  && console.log('🔄 [_app] Route changed to:', currentPath)

    // Update both systems (NavigationGraph delegates to LocationContext)
    NavigationGraph.getInstance().setCurrentContext(currentPath)

    // For debugging: verify LocationContext is updated
    if (DEBUG) {
      const location = LocationContext.getCurrent()
      DEBUG && console.log('📍 [_app] LocationContext state:', location)
    }
  }, [router.asPath, isInitialized])

  return null
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const gtmId = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID
  const glassMode = process.env.NEXT_PUBLIC_GLASS_MODE !== 'false'

  // 🎯 Initialize analytics (GTM + PostHog) - Inlined to avoid TypeScript resolution issues
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Dynamically import and initialize analytics
    // @ts-ignore - TypeScript has module resolution issues with analytics types
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

      // Call initialize with config and router
      await analyticsModule.initializeAnalytics(config, router)
    }).catch((error: unknown) => {
      console.error('[_app] Failed to initialize analytics:', error)
    })
  }, [router])

  // 🎯 Mobile detection for responsive variant
  const [isMobile, setIsMobile] = React.useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(max-width: 768px)')
    setIsMobile(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // 🎯 Persistent chat variant across page navigation (preserves across sites via URL)
  // Using ChatBubbleVariant named contract (ComponentNames pattern)
  // Defaults to 'subtitle' on mobile, 'full' on desktop
  const [chatVariant, setChatVariant] = React.useState<ChatBubbleVariantType>(
    ChatBubbleVariant.full as ChatBubbleVariantType
  )

  // Allowed variants (from ChatBubbleVariant contract)
  const allowedVariants = Object.keys(ChatBubbleVariant) as ChatBubbleVariantType[]

  // Initialize variant from localStorage or URL parameter
  // Priority: URL param > localStorage > mobile detection > default
  useEffect(() => {
    const variantParam = router.query.variant as string | undefined

    // Priority 1: URL parameter (for testing/sharing + cross-site navigation)
    if (variantParam && allowedVariants.includes(variantParam as ChatBubbleVariantType)) {
      setChatVariant(variantParam as ChatBubbleVariantType)
      // Persist to localStorage when set via URL
      if (typeof window !== 'undefined') {
        localStorage.setItem('chat-variant', variantParam)
      }
    } else if (typeof window !== 'undefined') {
      // Priority 2: localStorage (persisted preference)
      const savedVariant = localStorage.getItem('chat-variant')
      if (savedVariant && allowedVariants.includes(savedVariant as ChatBubbleVariantType)) {
        setChatVariant(savedVariant as ChatBubbleVariantType)

        // Add variant to URL if not present (enables cross-site navigation)
        if (!variantParam && savedVariant !== ChatBubbleVariant.full) {
          router.replace({
            pathname: router.pathname,
            query: { ...router.query, variant: savedVariant }
          }, undefined, { shallow: true })
        }
      } else {
        // Priority 3: Mobile detection (default to subtitle on mobile)
        const defaultVariant = isMobile
          ? (ChatBubbleVariant.subtitle as ChatBubbleVariantType)
          : (ChatBubbleVariant.full as ChatBubbleVariantType)
        setChatVariant(defaultVariant)
      }
    }
  }, [router.query.variant, allowedVariants, isMobile])

  DEBUG && console.log('[_app] NEXT_PUBLIC_GLASS_MODE:', process.env.NEXT_PUBLIC_GLASS_MODE);
  DEBUG && console.log('[_app] glassMode prop:', glassMode);
  DEBUG && console.log('[_app] chatVariant (persistent):', chatVariant);
  DEBUG  && console.log('[_app] SupernalProvider imported:', SupernalProvider);
  DEBUG  && console.log('[_app] USE_COPILOTKIT:', USE_COPILOTKIT);

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
      <Head>
        {/* Viewport - CRITICAL for mobile responsiveness */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      </Head>
      <SupernalProvider
        mode="fuzzy"
        disabled={USE_COPILOTKIT}  // Disable Supernal chat when using CopilotKit
        glassMode={process.env.NEXT_PUBLIC_GLASS_MODE !== 'false'}
        variant={chatVariant as 'full' | 'floating' | 'drawer' | 'subtitle'}
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

        {/* Dev-only variant switcher (only renders in development) */}
        DEBUG && <DevVariantSwitcher currentVariant={chatVariant} />
      </SupernalProvider>
    </React.Fragment>
  )
}
