/**
 * Showcase Preview Component
 *
 * No emojis - clean, professional
 * Preview of sites built with Supernal Interface
 */

import React from 'react';

interface ShowcaseItem {
  name: string;
  description: string;
  url: string;
  toolCount?: number;
  category?: string;
  bgGradient: string;
}

const SHOWCASE_SITES: ShowcaseItem[] = [
  {
    name: 'Glowbrand',
    description: 'AI-powered branding platform for creating cohesive brand identities',
    url: 'https://glowbrand.studio',
    toolCount: 15,
    category: 'Branding',
    bgGradient: 'from-pink-500 to-rose-500'
  },
  {
    name: 'ian.ceo',
    description: 'Personal productivity dashboard with AI assistant for task management',
    url: 'https://ian.ceo',
    toolCount: 12,
    category: 'Productivity',
    bgGradient: 'from-purple-500 to-indigo-500'
  },
  {
    name: 'Supernal Coding',
    description: 'AI-assisted development workflows for faster code shipping',
    url: 'https://www.supernal.ai',
    toolCount: 20,
    category: 'Developer Tools',
    bgGradient: 'from-blue-500 to-cyan-500'
  }
];

export const ShowcasePreview: React.FC = () => {
  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Built with Supernal Interface
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
            Join a growing ecosystem of AI-native applications
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {SHOWCASE_SITES.map((site) => (
            <a
              key={site.name}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-slate-900 rounded-xl overflow-hidden border border-white/10 hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all transform hover:scale-105"
            >
              {/* Gradient Header */}
              <div className={`h-32 bg-gradient-to-br ${site.bgGradient} relative`}>
                <div className="absolute inset-0 bg-black/20"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {site.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {site.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span>{site.toolCount} AI tools</span>
                  </div>
                  <div className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-semibold border border-purple-500/20">
                    {site.category}
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className="mt-4 flex items-center text-sm text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Try Demo</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <a
            href="/showcase"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50"
          >
            <span>View Full Showcase</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        {/* Submit Info */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              <strong className="text-white">Built with Supernal Interface?</strong> Get featured in our showcase
            </p>
            <a
              href="mailto:showcase@supernal.ai?subject=Add%20to%20Showcase"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Submit your site
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
