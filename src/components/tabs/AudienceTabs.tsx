/**
 * Audience Tabs Component
 *
 * No emojis - proper icons using SVG
 * Folder-style tab navigation
 * Comparison embedded in Business tab
 * Install guide embedded in Devs tab
 */

import React, { useState, useEffect } from 'react';
import { ComparisonTable } from '../ComparisonTable';
import { Routes } from '../../architecture/Routes';
import { theme, components, cn } from '@/config/theme';

interface AudienceTab {
  id: string;
  label: string;
  tagline: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const AUDIENCE_TABS: AudienceTab[] = [
  {
    id: 'users',
    label: 'For Users',
    tagline: 'Users want your app to work, not to learn it.',
    icon: <UserIcon />,
    content: (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {[
            {
              title: 'Talk Naturally',
              desc: '"Reset my counter" beats clicking through 5 screens',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              )
            },
            {
              title: 'Voice Control',
              desc: 'Hands-free interaction for accessibility',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )
            },
            {
              title: 'Smart Suggestions',
              desc: 'AI suggests next actions based on context',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )
            },
            {
              title: 'Cross-App Context',
              desc: 'Carry your context between applications',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              )
            }
          ].map((feature, idx) => (
            <div
              key={idx}
              className={cn(components.card.base)}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="text-purple-400 mt-0.5 sm:mt-1 group-hover:scale-110 transition-transform flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className={cn(components.card.title, 'text-base sm:text-lg mb-1 sm:mb-2')}>{feature.title}</h4>
                  <p className={cn(components.card.description)}>{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center pt-2 sm:pt-4">
          <a
            href={Routes.examples}
            className={components.button.primary('medium')}
          >
            See User Demo
          </a>
        </div>
      </div>
    )
  },
  {
    id: 'devs',
    label: 'For Developers',
    tagline: 'Fast testing, AI-assisted development, instant setup',
    icon: <CodeIcon />,
    content: (
      <div className="space-y-4 sm:space-y-6">
        {/* Install Guide */}
        <div className="bg-slate-900 rounded-lg p-4 sm:p-6 border border-slate-700">
          <h4 className={cn(theme.typography.heading.h4, theme.colors.text.primary, 'mb-3 sm:mb-4')}>One-Command Setup</h4>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <div className={cn(theme.typography.body.small, theme.colors.text.muted, 'mb-2')}>Install with curl (sets up everything)</div>
              <pre className="bg-black/50 p-2 sm:p-3 rounded text-xs sm:text-sm text-green-400 overflow-x-auto whitespace-pre-wrap break-all">
{`curl -fsSL https://raw.githubusercontent.com/supernalintelligence/supernal-interface/main/enterprise/scripts/install.sh | bash`}
              </pre>
            </div>
            <div>
              <div className={cn(theme.typography.body.small, theme.colors.text.muted, 'mb-2')}>What you get:</div>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-purple-300">
                  <span className="text-green-400">+</span> Type-safe contracts
                </div>
                <div className="flex items-center gap-2 text-purple-300">
                  <span className="text-green-400">+</span> Auto-generated tests
                </div>
                <div className="flex items-center gap-2 text-purple-300">
                  <span className="text-green-400">+</span> 6,000x faster E2E tests
                </div>
                <div className="flex items-center gap-2 text-purple-300">
                  <span className="text-green-400">+</span> Claude Code integration
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {[
            { title: '6,000x Faster Tests', desc: 'Story System caching eliminates redundant setup' },
            { title: 'AI-Assisted Dev', desc: '12 Claude Code skills + 3 specialized agents' },
            { title: 'Auto Test Generation', desc: 'Generate tests from Gherkin or @Tool decorators' },
            { title: 'Works Everywhere', desc: 'Next.js, React, Remix - any framework' }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10">
              <h4 className={cn(theme.colors.text.primary, 'font-semibold mb-1 text-sm sm:text-base')}>{feature.title}</h4>
              <p className={cn(theme.colors.text.muted, 'text-xs sm:text-sm')}>{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-2 sm:pt-4">
          <a
            href={Routes.docs}
            className={components.button.primary('medium')}
          >
            Read Documentation
          </a>
        </div>
      </div>
    )
  },
  {
    id: 'business',
    label: 'For Business',
    tagline: 'Reduce costs, increase quality, ship faster.',
    icon: <ChartIcon />,
    content: (
      <div className="space-y-6">
        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/10 p-4 rounded-lg border border-green-500/30">
            <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">90%</div>
            <div className="text-sm text-green-200">Faster Test Execution</div>
            <div className="text-xs text-gray-400 mt-1">Story System caching</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 p-4 rounded-lg border border-purple-500/30">
            <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">10x</div>
            <div className="text-sm text-purple-200">Developer Productivity</div>
            <div className="text-xs text-gray-400 mt-1">AI-assisted development</div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 p-4 rounded-lg border border-blue-500/30">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">Zero</div>
            <div className="text-sm text-blue-200">Config Required</div>
            <div className="text-xs text-gray-400 mt-1">One-command setup</div>
          </div>
        </div>
        <ComparisonTable />
      </div>
    )
  }
];

export const AudienceTabs: React.FC = () => {
  // Always start with 'users' for both SSR and initial client render
  // This prevents hydration mismatch
  const [activeTab, setActiveTab] = useState<string | 'all'>('users');

  // After hydration, update to 'all' if on desktop
  useEffect(() => {
    if (window.innerWidth >= 640) {
      setActiveTab('all');
    }
  }, []);

  const isExpanded = (tabId: string) => activeTab === 'all' || activeTab === tabId;

  return (
    <section className={cn(
      components.section.base,
      'bg-gradient-to-b from-slate-900 to-slate-950'
    )}>
      <div className={components.section.container}>

        {/* Folder-Style Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-6 sm:mb-8">
          {AUDIENCE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(activeTab === tab.id ? 'all' : tab.id)}
              className={`group relative flex flex-col items-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 font-semibold transition-all text-xs sm:text-sm ${
                isExpanded(tab.id)
                  ? 'bg-slate-800 text-white border-t-4 border-purple-500 rounded-t-lg shadow-lg z-10'
                  : 'bg-slate-900/50 text-gray-400 border-t-4 border-transparent rounded-t-lg hover:bg-slate-800/70 hover:text-gray-200 hover:border-purple-400/50'
              }`}
              style={{
                marginBottom: isExpanded(tab.id) ? '0' : '0.5rem'
              }}
            >
              {/* Icon */}
              <div className="mb-1 sm:mb-2 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                {tab.icon}
              </div>

              {/* Label - Simple, no tagline */}
              <div className="text-xs sm:text-sm font-bold whitespace-nowrap">{tab.label}</div>

              {/* Active Indicator Line */}
              {isExpanded(tab.id) && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 rounded-b-full"></div>
              )}
            </button>
          ))}

          {/* "For All" Tab - Hidden on mobile */}
          <button
            onClick={() => setActiveTab('all')}
            className={`hidden sm:flex group relative flex-col items-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 font-semibold transition-all text-xs sm:text-sm ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white border-t-4 border-purple-500 rounded-t-lg shadow-lg z-10'
                : 'bg-slate-900/50 text-gray-400 border-t-4 border-transparent rounded-t-lg hover:bg-slate-800/70 hover:text-gray-200 hover:border-purple-400/50'
            }`}
            style={{
              marginBottom: activeTab === 'all' ? '0' : '0.5rem'
            }}
          >
            {/* Icon */}
            <div className="mb-1 sm:mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>

            {/* Label - Simple, no tagline */}
            <div className="text-xs sm:text-sm font-bold whitespace-nowrap">For All</div>

            {/* Active Indicator Line */}
            {activeTab === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 rounded-b-full"></div>
            )}
          </button>
        </div>

        {/* Tab Content - Connected to tabs */}
        <div className="bg-slate-800 rounded-b-xl rounded-tr-xl border-t-0 border-2 sm:border-4 border-slate-700 shadow-2xl">
          <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            {AUDIENCE_TABS.map((tab) => (
              <div
                key={tab.id}
                className={`transition-all duration-500 ${
                  isExpanded(tab.id) ? 'block' : 'hidden'
                }`}
              >
                {isExpanded(tab.id) && (
                  <>
                    {/* When showing all, add separator between sections */}
                    {activeTab === 'all' && tab.id !== 'users' && (
                      <div className="mb-8 pt-8 border-t-2 border-purple-500/20"></div>
                    )}

                    {tab.content}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
