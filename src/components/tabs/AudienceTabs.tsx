/**
 * Audience Tabs Component
 *
 * No emojis - proper icons using SVG
 * Folder-style tab navigation
 * Comparison embedded in Business tab
 * Install guide embedded in Devs tab
 */

import React, { useState } from 'react';
import { ComparisonTable } from '../ComparisonTable';

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
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-purple-400/50 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="text-purple-400 mt-1 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center pt-4">
          <a
            href="/examples#live-demos"
            className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
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
    tagline: 'Easy to install for your Developers, bringing automated testing, feature tours, and observability',
    icon: <CodeIcon />,
    content: (
      <div className="space-y-6">
        {/* Install Guide */}
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
          <h4 className="text-xl font-semibold text-white mb-4">Quick Install</h4>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-2">1. Install package</div>
              <pre className="bg-black/50 p-3 rounded text-sm text-green-400 overflow-x-auto">
                npm install @supernal/interface
              </pre>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-2">2. Add decorator to your functions</div>
              <pre className="bg-black/50 p-3 rounded text-sm text-purple-400 overflow-x-auto">
{`import { Tool } from '@supernal/interface';

@Tool({ description: 'Reset counter' })
function resetCounter() {
  setCount(0);
}`}
              </pre>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-2">3. That's it - your app is now AI-controllable</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Type-Safe', desc: 'Full TypeScript support with runtime validation' },
            { title: 'Auto-Testing', desc: 'Generate tests from your tool definitions' },
            { title: 'Zero Config', desc: 'No complex setup or infrastructure needed' },
            { title: 'Framework Agnostic', desc: 'Works with Next.js, Remix, Vite, etc.' }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/10">
              <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <a
            href="/docs"
            className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
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
    tagline: 'Easier for your customers means reduced churn and increased satisfaction.',
    icon: <ChartIcon />,
    content: (
      <div className="space-y-6">
        <ComparisonTable />
      </div>
    )
  }
];

export const AudienceTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | 'all'>('all');

  const isExpanded = (tabId: string) => activeTab === 'all' || activeTab === tabId;

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Folder-Style Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {AUDIENCE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(activeTab === tab.id ? 'all' : tab.id)}
              className={`group relative flex flex-col items-center px-8 py-4 font-semibold transition-all ${
                isExpanded(tab.id)
                  ? 'bg-slate-800 text-white border-t-4 border-purple-500 rounded-t-lg shadow-lg z-10'
                  : 'bg-slate-900/50 text-gray-400 border-t-4 border-transparent rounded-t-lg hover:bg-slate-800/70 hover:text-gray-200 hover:border-purple-400/50'
              }`}
              style={{
                marginBottom: isExpanded(tab.id) ? '0' : '0.5rem'
              }}
            >
              {/* Icon */}
              <div className="mb-2">
                {tab.icon}
              </div>

              {/* Label - Simple, no tagline */}
              <div className="text-sm font-bold">{tab.label}</div>

              {/* Active Indicator Line */}
              {isExpanded(tab.id) && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 rounded-b-full"></div>
              )}
            </button>
          ))}

          {/* "For All" Tab */}
          <button
            onClick={() => setActiveTab('all')}
            className={`group relative flex flex-col items-center px-8 py-4 font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white border-t-4 border-purple-500 rounded-t-lg shadow-lg z-10'
                : 'bg-slate-900/50 text-gray-400 border-t-4 border-transparent rounded-t-lg hover:bg-slate-800/70 hover:text-gray-200 hover:border-purple-400/50'
            }`}
            style={{
              marginBottom: activeTab === 'all' ? '0' : '0.5rem'
            }}
          >
            {/* Icon */}
            <div className="mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>

            {/* Label - Simple, no tagline */}
            <div className="text-sm font-bold">For All</div>

            {/* Active Indicator Line */}
            {activeTab === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 rounded-b-full"></div>
            )}
          </button>
        </div>

        {/* Tab Content - Connected to tabs */}
        <div className="bg-slate-800 rounded-b-xl rounded-tr-xl border-t-0 border-4 border-slate-700 shadow-2xl">
          <div className="p-8 space-y-8">
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
