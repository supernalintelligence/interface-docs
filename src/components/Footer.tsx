/**
 * Professional footer component for Supernal Interface
 * Includes navigation, social links, newsletter, and legal information
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { brandAssets, brandText } from '@/lib/brand';
import { Routes } from '../architecture/Routes';
import { theme, components, cn } from '@/config/theme';

import { testId } from '@supernal/interface/testing';
import { Footer as FooterNames } from '@/architecture/ComponentNames';
export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className={cn(
      theme.colors.background.secondary,
      theme.colors.text.muted,
      'border-t',
      theme.colors.border.default
    )}>
      <div className={components.section.container}>
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12">
          {/* Brand & Newsletter - Full width on all screens */}
          <div className="mb-8 sm:mb-12 pb-8 sm:pb-12 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 sm:gap-8">
              {/* Brand */}
              <div className="sm:max-w-sm">
                <div className="flex items-center mb-3 sm:mb-4 gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brandAssets.logo}
                    alt={`${brandText.product} Logo`}
                    className="w-7 h-7 sm:w-8 sm:h-8"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg items-center justify-center hidden">
                    <span className="text-white font-bold text-xs">SI</span>
                  </div>
                  <h3 className={cn(theme.colors.text.primary, 'font-bold text-base sm:text-lg')}>{brandText.product}</h3>
                </div>
                <p className={cn(theme.typography.body.small, 'mb-0')}>
                  Make any React app AI-controllable. Open source, type-safe, and production-ready.
                </p>
              </div>

              {/* Newsletter */}
              <div className="sm:min-w-[320px]">
                <h4 className={cn(theme.colors.text.primary, 'font-semibold mb-2 sm:mb-3 text-xs sm:text-sm')}>Stay Updated</h4>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2" data-testid={testId(FooterNames.form)}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-3 py-2 bg-slate-800 border border-white/10 rounded-md text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white font-medium text-xs sm:text-sm rounded-md hover:bg-purple-700 transition-colors whitespace-nowrap"
                  >
                    {subscribed ? 'Subscribed!' : 'Subscribe'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Navigation Columns - 2 cols on all screens */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 mb-8">

            {/* Product Column */}
            <div>
              <h3 className={cn(theme.colors.text.primary, 'font-semibold mb-3 sm:mb-4 text-sm sm:text-base')}>Product</h3>
              <ul className={cn('space-y-2 sm:space-y-3', theme.typography.body.small)}>
              <li>
                <Link href={Routes.demo} className="hover:text-white transition-colors" data-testid={testId(FooterNames.link)}>
                  Demo
                </Link>
              </li>
              <li>
                <Link href={Routes.showcase} className="hover:text-white transition-colors" data-testid={testId(FooterNames.link2)}>
                  Showcase
                </Link>
              </li>
              <li>
                <Link href={Routes.testing} className="hover:text-white transition-colors" data-testid={testId(FooterNames.link3)}>
                  Testing
                </Link>
              </li>
              <li>
                <Link href="/tours" className="hover:text-white transition-colors" data-testid={testId(FooterNames.link4)}>
                  Feature Tours
                </Link>
              </li>
              <li>
                <Link href={Routes.stories} className="hover:text-white transition-colors" data-testid={testId(FooterNames.link5)}>
                  Stories
                </Link>
              </li>
            </ul>
            </div>

            {/* Developers Column */}
            <div>
              <h3 className={cn(theme.colors.text.primary, 'font-semibold mb-3 sm:mb-4 text-sm sm:text-base')}>Developers</h3>
              <ul className={cn('space-y-2 sm:space-y-3', theme.typography.body.small)}>
              <li>
                <Link href={Routes.docs} className="hover:text-white transition-colors" data-testid={testId(FooterNames.link6)}>
                  Documentation
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/supernalintelligence/interface"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  GitHub
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
              <li>
                <Link href={Routes.blog} className="hover:text-white transition-colors" data-testid={testId(FooterNames.link7)}>
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/@supernal/interface"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  NPM Package
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            </ul>
            </div>
          </div>

          {/* Community Section - Prominent Social Icons */}
          <div className="pt-6 pb-4 border-t border-white/10">
            <h3 className={cn(theme.colors.text.primary, 'font-semibold mb-4 text-sm sm:text-base text-center')}>Community</h3>
            <div className="flex items-center justify-center gap-6 sm:gap-8">
              <a
                href="https://github.com/supernalintelligence/interface"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://twitter.com/supernal_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://discord.gg/supernal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Discord"
              >
                <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/supernal-intelligence"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 sm:py-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            {/* Copyright */}
            <p className={cn(theme.typography.body.small, 'text-center sm:text-left')}>
              &copy; {new Date().getFullYear()} Supernal Intelligence.
            </p>

            {/* Legal Links */}
            <div className={cn('flex flex-wrap items-center justify-center gap-4 sm:gap-6', theme.typography.body.small)}>
              <Link href="/privacy" className="hover:text-white transition-colors" data-testid={testId(FooterNames.link8)}>
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors" data-testid={testId(FooterNames.link9)}>
                Terms of Service
              </Link>
              <Link href="/security" className="hover:text-white transition-colors" data-testid={testId(FooterNames.link10)}>
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
