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
  { id: 'voiceflow', name: 'Voiceflow', color: 'text-orange-500' },
  { id: 'botpress', name: 'Botpress', color: 'text-blue-500' },
  { id: 'vercel', name: 'Vercel AI SDK', color: 'text-gray-500' },
  { id: 'langchain', name: 'LangChain', color: 'text-green-500' },
  { id: 'copilotkit', name: 'CopilotKit', color: 'text-purple-500' },
];

const comparisonData = {
  voiceflow: {
    'AI Control': { value: 'Chat flows', level: 'partial' },
    'Auto Tests': { value: 'Manual', level: 'none' },
    'Type Safety': { value: 'No', level: 'none' },
    'React Integration': { value: 'Embed only', level: 'partial' },
    'BYOK': { value: 'No', level: 'none' },
    'Open Source': { value: 'No', level: 'none' },
  },
  botpress: {
    'AI Control': { value: 'Conversational', level: 'partial' },
    'Auto Tests': { value: 'Manual', level: 'none' },
    'Type Safety': { value: 'Limited', level: 'partial' },
    'React Integration': { value: 'Webchat', level: 'partial' },
    'BYOK': { value: 'Yes', level: 'full' },
    'Open Source': { value: 'Yes', level: 'full' },
  },
  vercel: {
    'AI Control': { value: 'Chat only', level: 'partial' },
    'Auto Tests': { value: 'Manual', level: 'none' },
    'Type Safety': { value: 'Partial', level: 'partial' },
    'React Integration': { value: 'Hooks', level: 'full' },
    'BYOK': { value: 'Yes', level: 'full' },
    'Open Source': { value: 'Yes', level: 'full' },
  },
  langchain: {
    'AI Control': { value: 'Python/JS', level: 'partial' },
    'Auto Tests': { value: 'Manual', level: 'none' },
    'Type Safety': { value: 'TypeScript', level: 'full' },
    'React Integration': { value: 'Custom', level: 'partial' },
    'BYOK': { value: 'Yes', level: 'full' },
    'Open Source': { value: 'Yes', level: 'full' },
  },
  copilotkit: {
    'AI Control': { value: 'Components', level: 'full' },
    'Auto Tests': { value: 'Manual', level: 'none' },
    'Type Safety': { value: 'TypeScript', level: 'full' },
    'React Integration': { value: 'Native', level: 'full' },
    'BYOK': { value: 'Limited', level: 'partial' },
    'Open Source': { value: 'Yes', level: 'full' },
  },
};

const supernalData = {
  'AI Control': { value: 'Full native', level: 'full' },
  'Auto Tests': { value: 'Generated', level: 'full' },
  'Type Safety': { value: 'Complete', level: 'full' },
  'React Integration': { value: 'Native', level: 'full' },
  'BYOK': { value: 'Yes', level: 'full' },
  'Open Source': { value: 'MIT', level: 'full' },
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'full': return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'partial': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'none': return 'bg-red-500/10 text-red-400 border-red-500/20';
    default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

export function ComparisonTable() {
  const [selected, setSelected] = useState<string[]>(['voiceflow', 'copilotkit']);

  const toggleFramework = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length > 1) {
        setSelected(selected.filter(s => s !== id));
      }
    } else {
      if (selected.length < 3) {
        setSelected([...selected, id]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Framework Selector */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <span className="text-sm text-gray-400 self-center">Compare with:</span>
        {frameworks.map(fw => (
          <button
            key={fw.id}
            onClick={() => toggleFramework(fw.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selected.includes(fw.id)
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {fw.name}
          </button>
        ))}
        <span className="text-xs text-gray-500 self-center">(Select up to 3)</span>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-xl bg-slate-900">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-800 to-slate-900">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-white border-b border-slate-700">Feature</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-purple-300 bg-purple-500/10 border-b border-slate-700 border-l border-r">
                Supernal
              </th>
              {selected.map(id => {
                const fw = frameworks.find(f => f.id === id)!;
                return (
                  <th key={id} className="px-6 py-4 text-center text-sm font-semibold text-gray-400 border-b border-slate-700">
                    {fw.name}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Object.keys(supernalData).map((feature, idx) => {
              const supernalItem = supernalData[feature as keyof typeof supernalData];
              return (
                <tr key={feature} className={idx % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800/50'}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-300 border-b border-slate-800">{feature}</td>
                  <td className={`px-6 py-4 text-sm text-center font-semibold border-b border-slate-800 border-l border-r border-slate-700 ${getLevelColor(supernalItem.level)}`}>
                    {supernalItem.value}
                  </td>
                  {selected.map(id => {
                    const compItem = comparisonData[id as keyof typeof comparisonData][feature as keyof typeof comparisonData.voiceflow];
                    return (
                      <td key={id} className={`px-6 py-4 text-sm text-center border-b border-slate-800 ${getLevelColor(compItem.level)}`}>
                        {compItem.value}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

