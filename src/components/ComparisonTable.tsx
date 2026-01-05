/**
 * Comparison Table Component
 * Simple, focused comparison with selectable frameworks
 */

import React, { useState } from 'react';

interface Framework {
  id: string;
  name: string;
  color: string;
}

const frameworks: Framework[] = [
  { id: 'vercel', name: 'Vercel AI SDK', color: 'text-gray-700' },
  { id: 'playwright', name: 'Playwright', color: 'text-green-700' },
  { id: 'react', name: 'React + Tools', color: 'text-blue-700' },
];

const comparisonData = {
  vercel: {
    'AI Control': '⚠️ Chat only',
    'Auto Tests': '❌ Manual',
    'Type Safety': '⚠️ Partial',
    'State Mgmt': '⚠️ Basic',
    'Navigation': '❌ Manual',
    'Story System': '❌ None',
  },
  playwright: {
    'AI Control': '❌ None',
    'Auto Tests': '⚠️ Manual',
    'Type Safety': '✅ TypeScript',
    'State Mgmt': '❌ Mocks',
    'Navigation': '⚠️ Selectors',
    'Story System': '⚠️ BDD tools',
  },
  react: {
    'AI Control': '❌ Manual',
    'Auto Tests': '❌ Manual',
    'Type Safety': '✅ TypeScript',
    'State Mgmt': '✅ Redux/etc',
    'Navigation': '❌ Manual',
    'Story System': '❌ None',
  },
};

const supernalData = {
  'AI Control': '✅ Built-in',
  'Auto Tests': '✅ Generated',
  'Type Safety': '✅ Full',
  'State Mgmt': '✅ Contracts',
  'Navigation': '✅ Auto',
  'Story System': '✅ Gherkin',
};

export function ComparisonTable() {
  const [selected, setSelected] = useState<string[]>(['vercel', 'playwright']);

  const toggleFramework = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length > 1) {
        setSelected(selected.filter(s => s !== id));
      }
    } else {
      if (selected.length < 2) {
        setSelected([...selected, id]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Framework Selector */}
      <div className="flex flex-wrap gap-3 justify-center">
        <span className="text-sm text-gray-600 self-center">Compare with:</span>
        {frameworks.map(fw => (
          <button
            key={fw.id}
            onClick={() => toggleFramework(fw.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selected.includes(fw.id)
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {fw.name}
          </button>
        ))}
        <span className="text-xs text-gray-500 self-center">(Select up to 2)</span>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
        <table className="w-full bg-white">
          <thead className="bg-gradient-to-r from-slate-800 to-slate-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-white">Feature</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-cyan-400 bg-slate-900">
                Supernal
              </th>
              {selected.map(id => {
                const fw = frameworks.find(f => f.id === id)!;
                return (
                  <th key={id} className="px-4 py-3 text-center text-xs font-semibold text-gray-300">
                    {fw.name}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Object.keys(supernalData).map((feature, idx) => (
              <tr key={feature} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{feature}</td>
                <td className="px-4 py-3 text-sm text-center font-semibold text-cyan-600 bg-cyan-50">
                  {supernalData[feature as keyof typeof supernalData]}
                </td>
                {selected.map(id => (
                  <td key={id} className="px-4 py-3 text-sm text-center text-gray-700">
                    {comparisonData[id as keyof typeof comparisonData][feature as keyof typeof comparisonData.vercel]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

