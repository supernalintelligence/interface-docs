/**
 * Tool List Component
 *
 * Shared component for displaying available AI tools in a grid layout.
 * Used across Simple, Advanced, and Hierarchical demos.
 *
 * Features:
 * - Categorized tools with collapsible sections
 * - Color-coded by category
 * - Click to insert commands into chat
 */

import React, { useState, useMemo } from 'react';
import { useChatInput } from '@supernal/interface-nextjs';
import { MessageSquare, Check, ChevronDown, ChevronRight, Navigation, Zap, Settings, MessageCircle, Database, Wrench } from 'lucide-react';

export interface ToolInfo {
  name: string;
  elementId?: string;
  testId?: string;
  dangerLevel?: string;
  description?: string;
  examples?: string[];
  category?: string;
}

interface ToolCategory {
  name: string;
  tools: ToolInfo[];
  icon: React.ReactNode;
  color: string;
}

interface ToolListProps {
  tools: ToolInfo[];
  title?: string;
  subtitle?: string;
  color?: 'blue' | 'purple' | 'green';
  categorized?: boolean;
}

export const ToolList: React.FC<ToolListProps> = ({
  tools,
  title = "AI TOOLS",
  subtitle = "Click to copy commands to chat",
  color = 'blue',
  categorized = true
}) => {
  const [copiedTool, setCopiedTool] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const { insertText } = useChatInput();

  // Categorize tools
  const categorizedTools = useMemo(() => {
    if (!categorized) {
      return [{ name: 'All Tools', tools, icon: <Wrench className="h-5 w-5" />, color: 'gray' }];
    }

    const categories: { [key: string]: ToolInfo[] } = {
      PageNavigation: [],
      Counter: [],
      Chat: [],
      Settings: [],
      Data: [],
      Commands: []
    };

    tools.forEach(tool => {
      // Determine category based on multiple signals
      const name = tool.name.toLowerCase();
      const elementId = tool.elementId?.toLowerCase() || '';
      const description = tool.description?.toLowerCase() || '';

      // Page Navigation - navigation tools that change routes/pages
      if (elementId.startsWith('nav-') ||
          name.includes('go to') ||
          name.includes('navigate') ||
          description.includes('navigate to')) {
        categories.PageNavigation.push(tool);
      }
      // Counter tools
      else if (name.includes('counter') || elementId.includes('counter')) {
        categories.Counter.push(tool);
      }
      // Chat/messaging tools
      else if (name.includes('chat') || name.includes('message') || name.includes('send')) {
        categories.Chat.push(tool);
      }
      // Settings tools
      else if (name.includes('setting') || name.includes('theme') || name.includes('preference')) {
        categories.Settings.push(tool);
      }
      // Data tools (CRUD operations)
      else if (name.includes('data') || name.includes('item') || name.includes('fetch') ||
               name.includes('add') || name.includes('delete') || name.includes('update')) {
        categories.Data.push(tool);
      }
      // Everything else
      else {
        categories.Commands.push(tool);
      }
    });

    // Create category objects with icons (in logical order)
    const result: ToolCategory[] = [];

    // Page navigation first
    if (categories.PageNavigation.length > 0) {
      result.push({
        name: 'Page Navigation',
        tools: categories.PageNavigation,
        icon: <Navigation className="h-5 w-5" />,
        color: 'blue'
      });
    }

    // Interactive widgets
    if (categories.Counter.length > 0) {
      result.push({
        name: 'Counter',
        tools: categories.Counter,
        icon: <Zap className="h-5 w-5" />,
        color: 'green'
      });
    }
    if (categories.Chat.length > 0) {
      result.push({
        name: 'Chat',
        tools: categories.Chat,
        icon: <MessageCircle className="h-5 w-5" />,
        color: 'purple'
      });
    }
    if (categories.Settings.length > 0) {
      result.push({
        name: 'Settings',
        tools: categories.Settings,
        icon: <Settings className="h-5 w-5" />,
        color: 'yellow'
      });
    }
    if (categories.Data.length > 0) {
      result.push({
        name: 'Data',
        tools: categories.Data,
        icon: <Database className="h-5 w-5" />,
        color: 'pink'
      });
    }

    // Other commands last
    if (categories.Commands.length > 0) {
      result.push({
        name: 'Commands',
        tools: categories.Commands,
        icon: <Wrench className="h-5 w-5" />,
        color: 'gray'
      });
    }

    return result;
  }, [tools, categorized]);

  const copyToChat = (tool: ToolInfo) => {
    const command = tool.examples?.[0] || tool.name.toLowerCase();
    insertText(command, false);
    setCopiedTool(tool.name);
    setTimeout(() => setCopiedTool(null), 2000);
  };

  const toggleCategory = (categoryName: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  const colorClasses = {
    blue: {
      header: 'bg-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      border: 'border-blue-500/40'
    },
    purple: {
      header: 'bg-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700',
      border: 'border-purple-500/40'
    },
    green: {
      header: 'bg-green-600',
      button: 'bg-green-700 hover:bg-green-800',
      border: 'border-green-500/40'
    },
    yellow: {
      header: 'bg-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700',
      border: 'border-yellow-500/40'
    },
    pink: {
      header: 'bg-pink-600',
      button: 'bg-pink-600 hover:bg-pink-700',
      border: 'border-pink-500/40'
    },
    gray: {
      header: 'bg-gray-600',
      button: 'bg-gray-600 hover:bg-gray-700',
      border: 'border-gray-500/40'
    }
  };

  const colors = colorClasses[color];

  const categoryColors: { [key: string]: typeof colorClasses[keyof typeof colorClasses] } = {
    blue: colorClasses.blue,
    green: colorClasses.green,
    purple: colorClasses.purple,
    yellow: colorClasses.yellow,
    pink: colorClasses.pink,
    gray: colorClasses.gray,
  };

  const totalTools = categorizedTools.reduce((sum, cat) => sum + cat.tools.length, 0);

  return (
    <div className="bg-slate-800/50 rounded-xl border border-purple-500/30 overflow-hidden">
      {/* Header */}
      <div className={`${colors.header} text-white px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm opacity-90">{subtitle}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{totalTools}</div>
            <div className="text-xs opacity-75">Tools Available</div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 space-y-3">
        {categorizedTools.map((category) => {
          const isCollapsed = collapsedCategories.has(category.name);
          const catColors = categoryColors[category.color] || colorClasses[color];

          return (
            <div key={category.name} className={`bg-slate-900/50 rounded-lg border ${catColors.border} overflow-hidden`}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${catColors.header} bg-opacity-20 rounded-lg`}>
                    {category.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="text-white font-semibold">{category.name}</h4>
                    <p className="text-xs text-gray-400">{category.tools.length} tool{category.tools.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                {isCollapsed ? (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {/* Category Tools */}
              {!isCollapsed && (
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.tools.map((tool, index) => (
                      <div
                        key={`${tool.name}-${tool.elementId || tool.testId || index}`}
                        className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 hover:border-slate-600 transition-all"
                      >
                        {/* Tool Header */}
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-sm text-white">{tool.name}</h5>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            tool.dangerLevel === 'safe' ? 'bg-green-500/20 text-green-300' :
                            tool.dangerLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            tool.dangerLevel === 'dangerous' ? 'bg-red-500/20 text-red-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {tool.dangerLevel || 'safe'}
                          </span>
                        </div>

                        {/* Tool Description */}
                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">{tool.description}</p>

                        {/* Tool Examples */}
                        {tool.examples && tool.examples.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 italic">&quot;{tool.examples[0]}&quot;</p>
                          </div>
                        )}

                        {/* Copy to Chat Button */}
                        <button
                          data-testid={`copy-${tool.elementId}`}
                          onClick={() => copyToChat(tool)}
                          className={`w-full px-3 py-1.5 ${catColors.button} text-white text-xs rounded transition-colors flex items-center justify-center gap-2`}
                        >
                          {copiedTool === tool.name ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <MessageSquare className="h-3.5 w-3.5" />
                              Insert to Chat
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {totalTools === 0 && (
          <div className="text-center text-gray-400 py-8">
            No tools registered yet.
          </div>
        )}
      </div>
    </div>
  );
};

