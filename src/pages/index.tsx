/**
 * Supernal Interface - Landing Page
 *
 * Clean, modern design:
 * 1. Dynamic hero (app/website/future cycling)
 * 2. Expandable audience tabs (Users/Devs/Business)
 * 3. Showcase preview
 *
 * No emojis, dark theme, professional
 */

import React, { useState } from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { TextFirstHero } from '../components/hero/TextFirstHero';
import { AudienceTabs } from '../components/tabs/AudienceTabs';
import { ShowcasePreview } from '../components/showcase/ShowcasePreview';
import { EarlyAccessModal } from '../components/EarlyAccessModal';

export default function LandingPage() {
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);

  return (
    <>
      <Head>
        <title>Supernal Interface - Make Your React Agentic</title>
        <meta
          name="description"
          content="Make your React app/website/future agentic. Easy for users, fast for devs, value for you."
        />
        <meta property="og:title" content="Supernal Interface - Make Your React Agentic" />
        <meta property="og:description" content="Easy for users. Fast for devs. Value for you." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="min-h-screen bg-slate-950">
        {/* Header */}
        <Header
          currentPage="home"
          onEarlyAccessClick={() => setShowEarlyAccessModal(true)}
        />

        {/* Main Content */}
        <main>
          {/* 1. Hero - Dynamic cycling text */}
          <TextFirstHero
            onGetStarted={() => window.location.href = '/docs'}
            onTryDemo={() => window.location.href = '/examples'}
          />

          {/* 2. Audience Tabs - Expandable with embedded content */}
          <AudienceTabs />

          {/* 3. Showcase Preview */}
          <ShowcasePreview />

          {/* 4. Final CTA */}
          <section className="py-20 bg-gradient-to-br from-purple-600 to-pink-600">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Make Your App Agentic?
              </h2>
              <p className="text-xl mb-8 text-purple-100">
                Join developers building the next generation of AI-powered applications
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/docs'}
                  className="px-8 py-4 bg-white text-purple-600 font-semibold text-lg rounded-lg hover:shadow-xl transition-all"
                >
                  Read Documentation
                </button>
                <button
                  onClick={() => window.location.href = '/examples'}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all"
                >
                  Try Live Examples
                </button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-slate-900 text-gray-400 py-12 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Column 1 */}
                <div>
                  <h3 className="text-white font-bold mb-4">Supernal Interface</h3>
                  <p className="text-sm">
                    Make any React app AI-controllable. Open source, type-safe, production-ready.
                  </p>
                </div>

                {/* Column 2 */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Product</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                    <li><a href="/showcase" className="hover:text-white transition-colors">Showcase</a></li>
                    <li><a href="/#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                  </ul>
                </div>

                {/* Column 3 */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Developers</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/docs" className="hover:text-white transition-colors">Documentation</a></li>
                    <li><a href="/examples" className="hover:text-white transition-colors">Examples</a></li>
                    <li><a href="https://github.com/supernalintelligence/interface" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                  </ul>
                </div>

                {/* Column 4 */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Resources</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                    <li><a href="https://discord.gg/supernal" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Community</a></li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm">
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
