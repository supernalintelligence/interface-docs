'use client';

/**
 * Get Started Section - Final CTA
 *
 * Encourages users to install and try Supernal Interface
 */


import React from 'react';
import { motion } from 'framer-motion';
import { theme, components, cn } from '@/config/theme';

export function GetStartedSection() {
  return (
    <div className={cn(
      'relative w-full',
      theme.colors.background.gradient.cta,
      'py-20'
    )}>
      <div className={components.section.container}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading */}
          <motion.h2
            className={cn(
              'text-4xl md:text-5xl font-bold text-white mb-6'
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Make Your App{' '}
            <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              Agentic
            </span>
            ?
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-xl mb-8 text-purple-100"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Install Supernal Interface and have AI-powered navigation running in under 5 minutes
          </motion.p>

          {/* Quick start code */}
          <motion.div
            className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400 font-mono">Quick Start</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('npm install @supernal/interface-nextjs');
                }}
                className="text-xs text-purple-300 hover:text-purple-200 transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code className="text-green-400">npm install @supernal/interface-nextjs</code>
            </pre>
          </motion.div>

          {/* Features checklist */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12 text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold mb-2">
                1
              </div>
              <h3 className="font-semibold text-white mb-2">Fast Setup</h3>
              <p className="text-sm text-purple-100">5 minutes from install to working AI navigation</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold mb-2">
                2
              </div>
              <h3 className="font-semibold text-white mb-2">Type Safe</h3>
              <p className="text-sm text-purple-100">Full TypeScript support with IDE autocomplete</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold mb-2">
                3
              </div>
              <h3 className="font-semibold text-white mb-2">Auto-Testable</h3>
              <p className="text-sm text-purple-100">Generate Playwright tests from Gherkin stories</p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <button
              onClick={() => (window.location.href = '/docs')}
              className="px-8 py-4 bg-white text-purple-600 font-semibold text-lg rounded-lg hover:shadow-xl transition-all"
            >
              Read Documentation
            </button>
            <button
              onClick={() => (window.location.href = '/examples')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              Try Live Examples
            </button>
          </motion.div>

          {/* Final message */}
          <motion.p
            className="mt-8 text-sm text-purple-200"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            Join developers building the next generation of AI-powered applications
          </motion.p>
        </div>
      </div>
    </div>
  );
}
