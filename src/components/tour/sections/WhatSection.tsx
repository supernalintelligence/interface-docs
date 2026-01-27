'use client';

/**
 * What Section - "What is Agentification?"
 *
 * Explains the concept of agentification with visual examples
 */


import React from 'react';
import { motion } from 'framer-motion';
import { theme, components, cn } from '@/config/theme';

export function WhatSection() {
  return (
    <div className="relative w-full bg-slate-900 py-20">
      <div className={components.section.container}>
        <div className="max-w-4xl mx-auto">
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
            What is{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Agentification
            </span>
            ?
          </motion.h2>

          {/* Description */}
          <motion.div
            className="space-y-6 text-lg text-gray-300 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p>
              <strong className="text-white">Agentification</strong> means giving AI the ability to{' '}
              <strong className="text-purple-400">understand and control your UI</strong>.
            </p>
            <p>
              Instead of users clicking through complex interfaces, they simply{' '}
              <strong className="text-pink-400">tell an AI what they want</strong>, and the AI
              navigates and executes actions for them.
            </p>
          </motion.div>

          {/* Before/After comparison */}
          <motion.div
            className="grid md:grid-cols-2 gap-8 mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Before */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-red-400 mb-4">[X] Before</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Users read documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Click through multiple screens</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Remember complex workflows</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Frustrated when lost</span>
                </li>
              </ul>
            </div>

            {/* After */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-green-400 mb-4">[✓] After</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Users describe what they want</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>AI navigates automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>No tutorials needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Delighted with outcomes</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Quote */}
          <motion.blockquote
            className="mt-12 text-center italic text-xl text-gray-400 border-l-4 border-purple-500 pl-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            "It's like having a personal assistant that knows your app inside and out."
          </motion.blockquote>
        </div>
      </div>
    </div>
  );
}
