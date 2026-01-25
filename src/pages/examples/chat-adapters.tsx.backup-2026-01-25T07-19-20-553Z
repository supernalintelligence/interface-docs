/**
 * Chat Adapters Example
 *
 * NOTE: This page is deprecated. The adapter system has been replaced by SupernalProvider.
 *
 * SupernalProvider (from @supernal/interface-nextjs) provides:
 * - Pattern matching mode (fuzzy) - no LLM required
 * - AI mode (with API key) - full LLM integration
 * - Premium ChatBubble UI with glassmorphism
 * - Zero configuration required
 *
 * See _app.tsx for the recommended approach using SupernalProvider.
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header } from '../../components/Header';

// Demo widgets with @Tool methods
import { SimpleWidget, SettingsWidget } from '../../widgets';

export default function ChatAdaptersExample() {
  const router = useRouter();
  
  return (
    <>
      <Head>
        <title>Chat Adapters Example - Supernal Interface</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Header 
          currentPage="examples"
          onNavigate={(page) => router.push(`/${page}`)}
          onSettingsClick={() => {}}
        />
        
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Chat Adapters (Deprecated)
            </h1>
            <p className="text-gray-600">
              This page has been deprecated. Use SupernalProvider instead.
            </p>
          </div>

          {/* Deprecation Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Deprecated API</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    The ChatUIAdapter system has been deprecated in favor of <strong>SupernalProvider</strong>.
                    All demos on this site now use SupernalProvider for a simpler, more DRY architecture.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Interactive Widgets</h2>
              <p className="text-sm text-gray-600 mb-4">
                These widgets have @Tool methods that work with SupernalProvider.
              </p>
              <div className="space-y-4">
                <SimpleWidget />
                <SettingsWidget />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Try the Chat</h2>
              <p className="text-sm text-gray-600 mb-4">
                The chat bubble in the bottom right uses SupernalProvider with pattern matching (no LLM required).
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 rounded text-sm">
                  <strong>Try:</strong> "increment the counter"
                </div>
                <div className="p-3 bg-blue-50 rounded text-sm">
                  <strong>Try:</strong> "toggle notifications"
                </div>
                <div className="p-3 bg-blue-50 rounded text-sm">
                  <strong>Try:</strong> "go to the docs"
                </div>
              </div>
            </div>
          </div>

          {/* New Recommended Approach */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Recommended: Use SupernalProvider</h2>

            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// In _app.tsx or layout.tsx
import { SupernalProvider } from '@supernal/interface-nextjs';

export default function App({ children }) {
  return (
    <SupernalProvider
      mode="fuzzy"  // Pattern matching (no LLM)
      // OR mode="ai" apiKey={process.env.OPENAI_API_KEY}  // LLM mode
      position="bottom-right"
      theme="auto"
    >
      {children}
    </SupernalProvider>
  );
}

// That's it! No adapter setup, bridging, or boilerplate.
// Tools are auto-discovered via @Tool decorators.
// Premium ChatBubble UI included with glassmorphism.`}
            </pre>
          </div>
        </main>
      </div>
    </>
  );
}

