'use client';

/**
 * Tour Landing Page - Variant E
 *
 * AI-guided interactive tour with dual-mode navigation:
 * - Passive mode: Traditional scroll-through
 * - Active mode: AI-led tour with chat commands ("next", "back", etc.)
 *
 * This variant transforms the entire landing page into an interactive experience
 * that demonstrates Supernal's "agentification" philosophy.
 */

import React, { useState } from 'react';
import Head from 'next/head';
import { SupernalProvider } from '@supernal/interface-nextjs';
import { TourProvider } from './TourContext';
import { TourContent } from './TourContent';
import { TourChat } from './TourChat';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { EarlyAccessModal } from '../EarlyAccessModal';

export function TourLandingPage() {
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);

  return (
    <>
      <Head>
        <title>Supernal Interface - Interactive Tour</title>
        <meta
          name="description"
          content="I am here to agentify your site. Take an AI-guided tour or scroll naturally through Supernal Interface capabilities."
        />
        <meta property="og:title" content="Supernal Interface - AI-Guided Tour" />
        <meta property="og:description" content="Experience agentic UI through an interactive tour" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <TourProvider>
        <SupernalProvider
          displayMode="auto"
          drawerSide="right"
          glassMode={true}
          mode="fuzzy"
          disabled={false}
        >
          <div className="relative min-h-screen bg-slate-950">
            {/* Header */}
            <Header
              currentPage="tour"
              onEarlyAccessClick={() => setShowEarlyAccessModal(true)}
            />

            {/* Tour Content */}
            <TourContent />
            <TourChat />

            {/* Footer */}
            <Footer />

            {/* Modals */}
            <EarlyAccessModal
              isOpen={showEarlyAccessModal}
              onClose={() => setShowEarlyAccessModal(false)}
            />
          </div>
        </SupernalProvider>
      </TourProvider>
    </>
  );
}
