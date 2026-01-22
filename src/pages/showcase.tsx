/**
 * Showcase Page - Full Gallery of Sites Built with Supernal Interface
 */

import React, { useState } from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Components } from '../architecture';

interface ShowcaseItem {
  name: string;
  description: string;
  url: string;
  toolCount?: number;
  category: string;
  bgGradient: string;
  features?: string[];
}

const SHOWCASE_SITES: ShowcaseItem[] = [
  {
    name: 'Glowbrand',
    description: 'AI-powered branding platform for creating cohesive brand identities',
    url: 'https://glowbrand.ai',
    toolCount: 15,
    category: 'Branding',
    bgGradient: 'from-pink-500 to-rose-500',
    features: ['Brand Generation', 'Color Palettes', 'Logo Design']
  },
  {
    name: 'ian.ceo',
    description: 'Personal productivity dashboard with AI assistant for task management',
    url: 'https://ian.ceo',
    toolCount: 12,
    category: 'Productivity',
    bgGradient: 'from-purple-500 to-indigo-500',
    features: ['Task Management', 'AI Scheduling', 'Notes']
  },
  {
    name: 'Supernal Coding',
    description: 'AI-assisted development workflows for faster code shipping',
    url: 'https://coding.supernal.ai',
    toolCount: 20,
    category: 'Developer Tools',
    bgGradient: 'from-blue-500 to-cyan-500',
    features: ['Code Generation', 'Test Automation', 'Documentation']
  }
];

const CATEGORIES = ['All', 'Branding', 'Productivity', 'Developer Tools'];

export default function ShowcasePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSites = selectedCategory === 'All'
    ? SHOWCASE_SITES
    : SHOWCASE_SITES.filter(site => site.category === selectedCategory);

  return (
    <>
      <Head>
        <title>Showcase | Supernal Interface</title>
        <meta
          name="description"
          content="Explore applications built with Supernal Interface - AI-native apps across branding, productivity, and development"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <Header currentPage="showcase" />

        <div
          data-testid={Components.Showcase.container}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1
              data-testid={Components.Showcase.title}
              className="text-5xl font-bold text-white mb-4"
            >
              Showcase
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Explore real applications built with Supernal Interface. From branding tools to productivity apps, see what's possible when you make your React app agentic.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                data-testid={Components.Showcase.categoryFilter}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredSites.map((site) => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={Components.Showcase.siteCard}
                className="group relative bg-slate-900 rounded-xl overflow-hidden border border-white/10 hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all transform hover:scale-105"
              >
                {/* Gradient Header */}
                <div className={`h-32 bg-gradient-to-br ${site.bgGradient} relative`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    data-testid={Components.Showcase.siteTitle}
                    className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors"
                  >
                    {site.name}
                  </h3>
                  <p
                    data-testid={Components.Showcase.siteDescription}
                    className="text-gray-400 text-sm mb-4"
                  >
                    {site.description}
                  </p>

                  {/* Features */}
                  {site.features && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {site.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-white/5 text-gray-400 rounded text-xs border border-white/10"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

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
                  <div
                    data-testid={Components.Showcase.siteLink}
                    className="mt-4 flex items-center text-sm text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span>Try Demo</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Submit Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Built Something Amazing?
            </h2>
            <p className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto">
              We'd love to feature your project in our showcase. Share your Supernal Interface creation with the community.
            </p>
            <a
              href="mailto:showcase@supernal.ai?subject=Add%20to%20Showcase"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50"
            >
              Submit Your Site
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
