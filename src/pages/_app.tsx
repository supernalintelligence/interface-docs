import '@/styles/globals.css'
// import 'reactflow/dist/style.css' // Disabled - reactflow not installed
import 'highlight.js/styles/github-dark.css'
import type { AppProps } from 'next/app'
import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { ChatInputProvider } from '../contexts/ChatInputContext'
import { useSharedChat } from '../hooks/useSharedChat'
// @ts-ignore
const CopilotChatWidget = process.env.NEXT_PUBLIC_USE_COPILOTKIT === 'true'
  ? require('../components/chat/CopilotChatWidget').CopilotChatWidget
  : () => null;
import { ChatBubble } from '../components/chat/ChatBubble'
import { DemoAIInterface } from '../lib/AIInterface'
import { NavigationGraph } from "@supernalintelligence/interface-enterprise"
import { initializeDemoArchitecture, createNavigationHandler } from '../architecture'
import { ToolManager } from '../lib/ToolManager'
import { useRouter } from 'next/router'
import TTSInit from '../components/TTSInitializer'

// NOTE: GlobalThemeTools disabled - using widget-scoped theming instead
// Each demo widget controls its own theme via data-theme attribute
// import '../lib/GlobalThemeTools'

// Register BlogNavigationTools
import '../tools/BlogNavigationTools'

// Toggle between CopilotKit and Native chat
const USE_COPILOTKIT = process.env.NEXT_PUBLIC_USE_COPILOTKIT === 'true'

// Global chat wrapper component
function GlobalChatWrapper() {
  const router = useRouter()
  const { messages, addMessage, clearMessages } = useSharedChat()
  const [aiInterface] = useState(() => new DemoAIInterface())

  useEffect(() => {
    console.log('🚀 [_app] useEffect triggered')
    
    // Debug: Check NavigationGraph state BEFORE initialization
    const navGraph = NavigationGraph.getInstance()
    const contextsBefore = navGraph.getAllContexts()
    console.log('📊 [_app] NavigationGraph state BEFORE init:', {
      contextsCount: contextsBefore.length,
      contexts: contextsBefore.map((c: any) => c.name).join(', ')
    })
    
    // Initialize architecture (registers containers and creates nav tools)
    // Even if already initialized, this is idempotent
    console.log('🚀 [_app] Calling initializeDemoArchitecture()')
    initializeDemoArchitecture()
    
    // Debug: Check NavigationGraph state AFTER initialization
    const contextsAfter = navGraph.getAllContexts()
    console.log('📊 [_app] NavigationGraph state AFTER init:', {
      contextsCount: contextsAfter.length,
      contexts: contextsAfter.map((c: any) => c.name).join(', ')
    })
    
    // Always set navigation handler (even on refresh)
    const handler = createNavigationHandler(router)
    NavigationGraph.getInstance().setNavigationHandler(handler)
    console.log('✅ [_app] Navigation handler set')
    
    // Subscribe to tool execution results
    const unsubscribe = ToolManager.subscribe((result) => {
      const emoji = result.success ? '✅' : '❌'
      addMessage(`${emoji} ${result.message}`, 'ai')
    })
    
    return unsubscribe
  }, [router, addMessage])

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return
    addMessage(text, 'user')
    
    try {
      const result = await aiInterface.findAndExecuteCommand(text, router.pathname)
      
      if (!result.success) {
        addMessage(result.message, 'system')
      }
    } catch (error) {
      addMessage(`Error: ${error instanceof Error ? error.message : String(error)}`, 'ai')
    }
  }

  return USE_COPILOTKIT ? (
    <CopilotChatWidget defaultOpen={false} />
  ) : (
    <ChatBubble
      messages={messages}
      onSendMessage={handleUserMessage}
      onClearChat={clearMessages}
    />
  )
}

export default function App({ Component, pageProps }: AppProps) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID

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
      <ChatInputProvider>
        {/* Initialize Supernal TTS globally */}
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
        
        {/* Global chat widget - persists across all pages */}
        <GlobalChatWrapper />
      </ChatInputProvider>
    </React.Fragment>
  )
}
