'use client';

/**
 * How Section - "How It Works"
 *
 * Explains the technical architecture: Named Contracts, Tools, Navigation Graph
 */


import React from 'react';
import { motion } from 'framer-motion';
import { theme, components, cn } from '@/config/theme';

export function HowSection() {
  const concepts = [
    {
      icon: '1',
      title: 'Named Contracts',
      description:
        'Type-safe references for routes and components. No magic strings, full IDE autocomplete.',
      codeExample: `const Routes = {
  Dashboard: '/dashboard',
  Profile: '/profile'
}

// Use anywhere with full type safety
router.push(Routes.Dashboard)`,
    },
    {
      icon: '2',
      title: 'Tools',
      description: 'AI-callable functions that perform actions. Decorated with metadata for AI understanding.',
      codeExample: `@Tool({
  id: 'navigate-home',
  description: 'Navigate to home page'
})
navigateHome() {
  router.push(Routes.Home);
}`,
    },
    {
      icon: '3',
      title: 'Navigation Graph',
      description: 'Maps your app structure so AI knows what is possible and how to get there.',
      codeExample: `// Auto-validated graph
si validate-graph \\
  --routes src/Routes.ts \\
  --components src/Components.ts

[✓] All routes reachable
[✓] No broken links`,
    },
  ];

  return (
    <div className="relative w-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 py-20">
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
            How It{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Works
            </span>
          </motion.h2>

          {/* Three core concepts */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {concepts.map((concept, index) => (
              <motion.div
                key={concept.title}
                className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl mb-4">
                  {concept.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{concept.title}</h3>
                <p className="text-gray-300 mb-4 text-sm">{concept.description}</p>
                <pre className="bg-slate-900 rounded p-3 text-xs overflow-x-auto">
                  <code className="text-green-400">{concept.codeExample}</code>
                </pre>
              </motion.div>
            ))}
          </div>

          {/* Benefits summary */}
          <motion.div
            className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-lg p-8 border border-purple-500/30"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              This enables AI to understand your UI without:
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-green-400 mt-1">[✓]</span>
                <span>Fragile CSS selectors</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 mt-1">[✓]</span>
                <span>Hardcoded paths</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 mt-1">[✓]</span>
                <span>Manual documentation</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 mt-1">[✓]</span>
                <span>Breaking on updates</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
