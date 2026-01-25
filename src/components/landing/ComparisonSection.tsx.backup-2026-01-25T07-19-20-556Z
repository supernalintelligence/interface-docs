/**
 * Comparison Section
 *
 * Quick comparison vs competitors
 * Shows why Supernal Interface is unique
 */

import React from 'react';

export const ComparisonSection: React.FC = () => {
  const features = [
    { feature: 'BYOK (Bring Your Own Key)', supernal: true, voiceflow: false, botpress: false, others: false },
    { feature: '@Tool Decorators (Type-Safe)', supernal: true, voiceflow: false, botpress: false, others: false },
    { feature: 'Auto-Generated Testing', supernal: true, voiceflow: false, botpress: false, others: false },
    { feature: 'MCP Compatible', supernal: true, voiceflow: false, botpress: false, others: false },
    { feature: 'Open Source', supernal: true, voiceflow: false, botpress: true, others: 'Some' },
    { feature: 'React Integration', supernal: true, voiceflow: false, botpress: false, others: true },
    { feature: 'Voice + Chat + UI + Auto', supernal: true, voiceflow: 'Partial', botpress: 'Partial', others: false }
  ];

  return (
    <section id="comparison" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            How We Compare
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            vs Voiceflow, Botpress, and other AI UI frameworks
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800/50 rounded-2xl overflow-hidden">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-4 text-left text-lg font-semibold">Feature</th>
                <th className="px-6 py-4 text-center bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                  <div className="font-bold text-xl text-blue-300">Supernal Interface</div>
                </th>
                <th className="px-6 py-4 text-center text-gray-400">Voiceflow</th>
                <th className="px-6 py-4 text-center text-gray-400">Botpress</th>
                <th className="px-6 py-4 text-center text-gray-400">Others</th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{row.feature}</td>
                  <td className="px-6 py-4 text-center bg-gradient-to-br from-blue-600/10 to-purple-600/10">
                    {row.supernal ? (
                      <div className="inline-flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    {typeof row.voiceflow === 'boolean' ? (
                      row.voiceflow ? '✓' : '✗'
                    ) : (
                      <span className="text-yellow-400">{row.voiceflow}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    {typeof row.botpress === 'boolean' ? (
                      row.botpress ? '✓' : '✗'
                    ) : (
                      <span className="text-yellow-400">{row.botpress}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    {typeof row.others === 'boolean' ? (
                      row.others ? '✓' : '✗'
                    ) : (
                      <span className="text-yellow-400">{row.others}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key Differentiators */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-bold mb-2">40% Cost Savings</h3>
            <p className="text-gray-300 text-sm">
              BYOK means your users pay their AI costs directly
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-lg font-bold mb-2">10X Faster</h3>
            <p className="text-gray-300 text-sm">
              Ship AI features in 1 week instead of 6 months
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-bold mb-2">Privacy First</h3>
            <p className="text-gray-300 text-sm">
              User API keys never touch your servers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
