/**
 * NEW Supernal Interface - Landing Page
 *
 * Architecture based on: docs/planning/strategy/SITE_REDESIGN_SUMMARY.md
 *
 * Structure:
 * 1. Text-First Hero (always visible)
 * 2. Audience Tabs (Users/Devs/Business)
 * 3. Journey Tabs (Try/Build/Test/Win)
 * 4. Showcase Preview
 * 5. Pricing
 * 6. Comparison
 * 7. Final CTAs
 */

import React, { useState } from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { TextFirstHero } from '../components/hero/TextFirstHero';
import { AudienceTabs } from '../components/tabs/AudienceTabs';
import { JourneyTabs } from '../components/tabs/JourneyTabs';
import { ShowcasePreview } from '../components/showcase/ShowcasePreview';
import { PricingSection } from '../components/landing/PricingSection';
import { ComparisonSection } from '../components/landing/ComparisonSection';
import { EarlyAccessModal } from '../components/EarlyAccessModal';

export default function NewLandingPage() {
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);

  return (
    <>
      <Head>
        <title>Supernal Interface - Make Any App AI-Native in 1 Week</title>
        <meta
          name="description"
          content="Use your own API keys (Anthropic, OpenAI) or ours. Add AI control to React apps with @Tool decorators. BYOK, MCP compatible, open source."
        />
        <meta property="og:title" content="Supernal Interface - Make Any App AI-Native in 1 Week" />
        <meta property="og:description" content="Use your own API keys or ours. 40% cost savings with BYOK. Ship AI features in 1 week." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header with Simplified Navigation */}
        <Header
          currentPage="home"
          onEarlyAccessClick={() => setShowEarlyAccessModal(true)}
        />

        {/* Main Content */}
        <main>
          {/* 1. Text-First Hero - ALWAYS VISIBLE */}
          <TextFirstHero
            onGetStarted={() => window.location.href = '/docs'}
            onTryDemo={() => window.location.href = '/examples'}
          />

          {/* 2. Audience Tabs - For Users/Devs/Business */}
          <AudienceTabs />

          {/* 3. Journey Tabs - Try/Build/Test/Win */}
          <JourneyTabs />

          {/* 4. Showcase Preview - First 3 Sites */}
          <ShowcasePreview />

          {/* 5. Pricing - BYOK Emphasized */}
          <PricingSection />

          {/* 6. Comparison - vs Voiceflow/Botpress */}
          <ComparisonSection />

          {/* 7. Final CTA Section */}
          <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Make Your App AI-Native?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join developers building the next generation of AI-powered applications
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/docs'}
                  className="px-8 py-4 bg-white text-blue-600 font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all notch-md"
                >
                  Read Documentation →
                </button>
                <button
                  onClick={() => window.location.href = '/examples'}
                  className="px-8 py-4 bg-blue-700 text-white font-semibold text-lg border-2 border-white hover:bg-blue-800 hover:shadow-2xl transform hover:scale-105 transition-all notch-md"
                >
                  Try Live Examples
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-blue-400/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold mb-2">40%</div>
                    <div className="text-blue-100">Cost Savings with BYOK</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">1 Week</div>
                    <div className="text-blue-100">Average Time to Production</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">100%</div>
                    <div className="text-blue-100">Open Source Framework</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Column 1: About */}
                <div>
                  <h3 className="text-white font-bold mb-4">Supernal Interface</h3>
                  <p className="text-sm">
                    Make any React app AI-native in 1 week. BYOK, MCP compatible, open source.
                  </p>
                </div>

                {/* Column 2: Product */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Product</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/#users" className="hover:text-white">For Users</a></li>
                    <li><a href="/#devs" className="hover:text-white">For Developers</a></li>
                    <li><a href="/#business" className="hover:text-white">For Business</a></li>
                    <li><a href="/showcase" className="hover:text-white">Showcase</a></li>
                    <li><a href="/#pricing" className="hover:text-white">Pricing</a></li>
                    <li><a href="/#comparison" className="hover:text-white">vs Competitors</a></li>
                  </ul>
                </div>

                {/* Column 3: Developers */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Developers</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/docs" className="hover:text-white">Documentation</a></li>
                    <li><a href="/examples" className="hover:text-white">Examples</a></li>
                    <li><a href="https://github.com/supernalintelligence/interface" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a></li>
                  </ul>
                </div>

                {/* Column 4: Resources */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Resources</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/blog" className="hover:text-white">Blog</a></li>
                    <li><a href="https://discord.gg/supernal" target="_blank" rel="noopener noreferrer" className="hover:text-white">Community (Discord)</a></li>
                    <li><a href="mailto:support@supernal.ai" className="hover:text-white">Support</a></li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
                <p>&copy; 2026 Supernal Intelligence. Open source under MIT License.</p>
              </div>
            </div>
          </footer>
        </main>

        {/* Modals */}
        <EarlyAccessModal
          isOpen={showEarlyAccessModal}
          onClose={() => setShowEarlyAccessModal(false)}
        />
      </div>
    </>
  );
}
