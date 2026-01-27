'use client';

/**
 * Examples Section - "Live Examples"
 *
 * Showcases real examples of Supernal in action
 */


import React from 'react';
import { motion } from 'framer-motion';
import { theme, components, cn } from '@/config/theme';

export function ExamplesSection() {
  const examples = [
    {
      title: 'Chat Interface',
      description: 'AI navigates and fills forms through conversation',
      features: ['Natural language input', 'Context-aware responses', 'Auto-navigation'],
      demoUrl: '/examples/chat',
    },
    {
      title: 'E-commerce Checkout',
      description: 'Complete purchases with voice or text commands',
      features: ['Cart management', 'Form filling', 'Payment processing'],
      demoUrl: '/examples/checkout',
    },
    {
      title: 'Dashboard Analytics',
      description: 'Query and visualize data through conversation',
      features: ['Data queries', 'Report generation', 'Export options'],
      demoUrl: '/examples/dashboard',
    },
  ];

  return (
    <div className="relative w-full bg-slate-900 py-20">
      <div className={components.section.container}>
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <motion.h2
            className={cn(
              theme.typography.heading.h2,
              theme.colors.text.primary,
              'text-center mb-12'
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            See It in{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Action
            </span>
          </motion.h2>

          {/* Examples grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {examples.map((example, index) => (
              <motion.div
                key={example.title}
                className="bg-slate-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-slate-700 hover:border-purple-500 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                {/* Mock screenshot placeholder */}
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 h-48 flex items-center justify-center">
                  <div className="text-4xl font-bold text-white opacity-50">
                    {index === 0 ? 'CHAT' : index === 1 ? 'SHOP' : 'DATA'}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{example.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{example.description}</p>

                  {/* Features */}
                  <ul className="space-y-2 mb-4">
                    {example.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-400">
                        <span className="text-green-400 mt-0.5">[✓]</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => (window.location.href = example.demoUrl)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Try Demo
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to action */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className="text-lg text-gray-300 mb-6">
              These examples show real applications where users can navigate, fill forms, and complete
              tasks just by chatting with an AI.
            </p>
            <button
              onClick={() => (window.location.href = '/examples')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              View All Examples
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
