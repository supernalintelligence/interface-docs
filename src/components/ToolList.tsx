/**
 * Tool List Component
 * 
 * Shared component for displaying available AI tools in a grid layout.
 * Used across Simple, Advanced, and Hierarchical demos.
 */

import React from 'react';

interface ToolInfo {
  name: string;
  elementId?: string;
  testId?: string;
  dangerLevel?: string;
  description?: string;
  examples?: string[];
}

interface ToolListProps {
  tools: ToolInfo[];
  title?: string;
  subtitle?: string;
  onExecuteTool?: (tool: ToolInfo) => void;
  color?: 'blue' | 'purple' | 'green';
}

export const ToolList: React.FC<ToolListProps> = ({ 
  tools, 
  title = "🤖 AI TOOLS",
  subtitle = "Click to execute tools via AI commands",
  onExecuteTool,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: {
      header: 'bg-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    purple: {
      header: 'bg-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700'
    },
    green: {
      header: 'bg-green-600',
      button: 'bg-green-700 hover:bg-green-800'
    }
  };

  const colors = colorClasses[color];

  return (
    <>
      {/* Header */}
      <div className="mb-2 mt-6">
        <div className={`${colors.header} text-white px-4 py-2 rounded-t-lg`}>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm opacity-90">{subtitle}</p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="bg-white rounded-b-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool, index) => (
            <div 
              key={`${tool.name}-${tool.elementId || tool.testId || index}`} 
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Tool Header */}
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-sm text-gray-900">{tool.name}</h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  tool.dangerLevel === 'safe' ? 'bg-green-100 text-green-800' :
                  tool.dangerLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {tool.dangerLevel || 'safe'}
                </span>
              </div>

              {/* Tool Description */}
              <p className="text-xs text-gray-600 mb-3">{tool.description}</p>

              {/* Tool Examples */}
              {tool.examples && tool.examples.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Examples:</p>
                  <div className="space-y-1">
                    {tool.examples.slice(0, 2).map((example: string) => (
                      <p key={example} className="text-xs text-gray-500 italic">&quot;{example}&quot;</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Execute Button */}
              <button
                data-testid={`execute-${tool.elementId}`}
                onClick={() => onExecuteTool?.(tool)}
                className={`w-full px-3 py-2 ${colors.button} text-white text-sm rounded transition-colors`}
              >
                Execute
              </button>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {tools.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No tools registered yet.
          </div>
        )}
      </div>
    </>
  );
};

