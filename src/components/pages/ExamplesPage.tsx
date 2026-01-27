/**
 * Enhanced Examples Page
 * - Collapsible examples
 * - Command examples above each widget
 * - Shorthand vs Full Spec code toggle
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useContainer } from "@supernal/interface/browser";
import { ExampleCard } from '../ExampleCard';
import { enhancedSnippets } from '../../data/enhancedCodeSnippets';
import { 
  SimpleWidget, 
  ChatWidget, 
  SettingsWidget,
  DataWidget
} from '../../widgets';
import { Info, Zap, Shield, Database, Book, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Examples } from '../../architecture';
import { Routes } from '../../architecture/Routes';

import { testId } from '@supernal/interface/testing';
import { Pages as pagesNames } from '@/architecture/ComponentNames';
export const ExamplesPage: React.FC = () => {
  useContainer('Examples');
  const [expandAll, setExpandAll] = useState(true); // Start expanded for easier testing

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          💡 Interactive Examples
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Working examples with real tools. Try typing commands in the chat bubble!
        </p>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                <strong>These are real working tools!</strong> Each example shows both <strong>shorthand</strong> (80% less code) 
                and <strong>full spec</strong> (complete configuration) versions. Commands listed above each widget 
                work in the chat interface.
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setExpandAll(!expandAll)}
              data-testid={Examples.expandAllButton}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              {expandAll ? 'Collapse All' : 'Expand All'}
            </button>
            <span className="text-sm text-gray-600">
              {expandAll ? 'Showing all details' : 'Click any example to expand'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Examples Grid */}
      <div className="space-y-8">
        {/* Basic Tools Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Basic Tool Decorators</h2>
          </div>
          
          <div className="space-y-4">
            <ExampleCard
              id="ai-tool-example"
              title="@AITool - Safe for AI Agents"
              description="Tools decorated with @AITool are automatically included in AI agent context"
              badge="Safe"
              badgeColor="green"
              commands={enhancedSnippets.aiTool.commands}
              code={enhancedSnippets.aiTool}
              defaultExpanded={expandAll}
            >
              <SimpleWidget />
            </ExampleCard>

            <ExampleCard
              id="test-tool-example"
              title="@TestTool - Auto-Generate Tests"
              description="Automatically generates Playwright tests for this tool"
              badge="Test Only"
              badgeColor="purple"
              commands={enhancedSnippets.testTool.commands}
              code={enhancedSnippets.testTool}
              defaultExpanded={expandAll}
            >
              <SimpleWidget />
            </ExampleCard>
          </div>
        </motion.section>

        {/* Chat Tools Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Book className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Chat & Messaging Tools</h2>
          </div>
          
          <div className="space-y-4">
            <ExampleCard
              id="chat-tool-example"
              title="Chat Tool with Parameter Extraction"
              description="Extract message content from natural language commands"
              badge="Parameters"
              badgeColor="blue"
              commands={enhancedSnippets.chatTool.commands}
              code={enhancedSnippets.chatTool}
              defaultExpanded={expandAll}
            >
              <ChatWidget />
            </ExampleCard>
          </div>
        </motion.section>

        {/* Safety Tools Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">Safety & Permissions</h2>
          </div>
          
          <div className="space-y-4">
            <ExampleCard
              id="dangerous-tool-example"
              title="@DangerousTool - Requires Confirmation"
              description="Tools that modify critical data require explicit user confirmation"
              badge="Dangerous"
              badgeColor="yellow"
              commands={enhancedSnippets.dangerousTool.commands}
              code={enhancedSnippets.dangerousTool}
              defaultExpanded={expandAll}
            >
              <SettingsWidget />
            </ExampleCard>
          </div>
        </motion.section>

        {/* Data Tools Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Data Access Tools</h2>
          </div>
          
          <div className="space-y-4">
            <ExampleCard
              id="data-write-tool-example"
              title="@DataWriteTool - Clear Data Patterns"
              description="Explicitly mark tools that write or modify data"
              badge="Write Access"
              badgeColor="green"
              commands={enhancedSnippets.dataWriteTool.commands}
              code={enhancedSnippets.dataWriteTool}
              defaultExpanded={expandAll}
            >
              <DataWidget />
            </ExampleCard>
          </div>
        </motion.section>

        {/* Chat Adapters Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Chat UI Adapters</h2>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Swappable Chat UI Providers
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Use CopilotKit for full LLM integration or Native for zero-dependency pattern matching.
                  Same tools work with both!
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">CopilotKit</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Native</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Audit Trail</span>
                </div>
              </div>
              <Link
                href={Routes.examplesChat_adapters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                View Example →
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📊 Why Use Specialized Decorators?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ✅ 80% Less Code
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Shorthand decorators reduce boilerplate from 15+ lines to just 3-5 lines
              </p>
              <div className="bg-gray-900 rounded-lg p-3 text-xs font-mono">
                <div className="text-gray-400">{`// Before: 15 lines`}</div>
                <div className="text-gray-300">@Tool(&#123; ...config &#125;)</div>
                <div className="text-gray-400 mt-2">{`// After: 3 lines`}</div>
                <div className="text-blue-400">@AITool(&#123; ... &#125;)</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ✅ Clear Intent
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Decorator name immediately shows purpose and safety level
              </p>
              <div className="bg-gray-900 rounded-lg p-3 text-xs font-mono space-y-1">
                <div><span className="text-green-400">@AITool()</span> <span className="text-gray-400">{`// Safe for AI`}</span></div>
                <div><span className="text-yellow-400">@DangerousTool()</span> <span className="text-gray-400">{`// Needs care`}</span></div>
                <div><span className="text-purple-400">@TestTool()</span> <span className="text-gray-400">{`// Auto-tested`}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ✅ Type-Safe
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Full TypeScript support with IDE autocomplete and type checking
              </p>
              <div className="bg-gray-900 rounded-lg p-3 text-xs font-mono space-y-1">
                <div className="text-blue-400">@AITool(&#123;</div>
                <div className="text-gray-300 pl-4">category: <span className="text-gray-400">{`// suggests valid values`}</span></div>
                <div className="text-gray-300 pl-4">permissions: <span className="text-gray-400">{`// type-checked`}</span></div>
                <div className="text-blue-400">&#125;)</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ✅ Parameter Extraction
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Automatically extract parameters from natural language
              </p>
              <div className="bg-gray-900 rounded-lg p-3 text-xs font-mono space-y-1">
                <div className="text-green-400">&quot;send message hello&quot;</div>
                <div className="text-gray-400">↓ extracts</div>
                <div className="text-purple-400">message: &quot;hello&quot;</div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

