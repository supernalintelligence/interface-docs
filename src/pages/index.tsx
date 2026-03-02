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

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TextFirstHero } from '../components/hero/TextFirstHero';
import { AudienceTabs } from '../components/tabs/AudienceTabs';
import { ShowcasePreview } from '../components/showcase/ShowcasePreview';
import { EarlyAccessModal } from '../components/EarlyAccessModal';
import { TourLandingPage } from '../components/tour/TourLandingPage';
import { theme, components, cn } from '../config/theme';
import type { GetServerSideProps } from 'next';

interface LandingPageProps {
  initialVariant: string;
}

// Read variant server-side to avoid useRouter SSG issues
export const getServerSideProps: GetServerSideProps<LandingPageProps> = async (context) => {
  const variant = (context.query.variant as string) || process.env.NEXT_PUBLIC_HERO_VARIANT || 'a';
  return { props: { initialVariant: variant } };
};

export default function LandingPage({ initialVariant }: LandingPageProps) {
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);
  const [variantId, setVariantId] = useState(initialVariant);

  // Update variant if URL changes (client-side navigation)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlVariant = params.get('variant');
      if (urlVariant) {
        setVariantId(urlVariant);
      }
    }
  }, []);

  // Variant E: Full tour experience (different layout from variants a-d)
  if (variantId === 'e') {
    return <TourLandingPage />;
  }

  // Variants a-d: Standard layout with hero variants
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
          <section className={cn(
            components.section.base,
            theme.colors.background.gradient.cta
          )}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className={cn(
                theme.typography.heading.h2,
                theme.colors.text.primary,
                theme.spacing.hero.marginBottom.title
              )}>
                Ready to Make Your App Agentic?
              </h2>
              <p className={cn(
                theme.typography.hero.subtitle,
                'text-purple-100 mb-6 sm:mb-8'
              )}>
                Join developers building the next generation of AI-powered applications
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/docs'}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-purple-600 font-semibold text-base sm:text-lg rounded-lg hover:shadow-xl transition-all"
                >
                  Read Documentation
                </button>
                <button
                  onClick={() => window.location.href = '/examples'}
                  className={cn(
                    'px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-base sm:text-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all'
                  )}
                >
                  Try Live Examples
                </button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer />
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
