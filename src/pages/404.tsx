/**
 * 404 Not Found Page
 * Retains header for consistent navigation
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Header } from '../components/Header';
import { Components } from '../architecture';

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | Supernal Interface</title>
        <meta name="description" content="Page not found" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <Header currentPage="404" />

        <div
          data-testid={Components.NotFound.container}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          <div className="text-center">
            {/* 404 Display */}
            <h1
              data-testid={Components.NotFound.title}
              className="text-9xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
            >
              404
            </h1>

            {/* Message */}
            <p
              data-testid={Components.NotFound.message}
              className="text-2xl md:text-3xl font-semibold text-white mb-4"
            >
              Page Not Found
            </p>

            <p className="text-lg text-gray-400 mb-12">
              The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Navigation Options */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/"
                data-testid={Components.NotFound.homeButton}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50"
              >
                Go Home
              </Link>
              <Link
                href="/docs"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                View Documentation
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                Try Demo
              </Link>
            </div>

            {/* Helpful Links */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">
                Popular Pages
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <Link
                  href="/showcase"
                  className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                >
                  <h3 className="font-semibold text-purple-400 mb-2">Showcase</h3>
                  <p className="text-sm text-gray-400">
                    See what others have built
                  </p>
                </Link>
                <Link
                  href="/examples"
                  className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                >
                  <h3 className="font-semibold text-purple-400 mb-2">Examples</h3>
                  <p className="text-sm text-gray-400">
                    Live interactive demos
                  </p>
                </Link>
                <Link
                  href="/blog"
                  className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                >
                  <h3 className="font-semibold text-purple-400 mb-2">Blog</h3>
                  <p className="text-sm text-gray-400">
                    Latest updates and guides
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
