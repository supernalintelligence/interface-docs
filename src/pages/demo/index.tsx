/**
 * Demo Page - /demo
 *
 * Main demo page combining:
 * - Interactive widgets (InteractiveWidgets, ToolList)
 * - Example cards (code snippets, ExampleCard)
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Header } from '../../components/Header';
import { motion } from 'framer-motion';
import { ToolRegistry, useContainer } from "@supernal/interface/browser";
import { useChatInput } from '@supernal/interface-nextjs';
import { ExampleCard } from '../../components/ExampleCard';
import { ToolList, ToolInfo } from '../../components/ToolList';
import { InteractiveWidgets } from '../../components/InteractiveWidgets';
import { enhancedSnippets } from '../../data/enhancedCodeSnippets';
import {
  SimpleWidget,
  ChatWidget,
  SettingsWidget,
  DataWidget
} from '../../widgets';
import { Zap, Shield, Code, MessageSquare, Check, FileText } from 'lucide-react';
import { DemoContainers } from '../../architecture';
import { registerExampleTools } from '../../tools/ExampleTools';
import { NAVIGATION_TOOL_PREFIX } from '../../lib/constants';

// Import widgets to register tools
import '../../lib/UIWidgetComponents';
import { Routes } from '../../architecture/Routes';

// Level Badge Component
const LevelBadge = ({ level, label }: { level: 1 | 2 | 3; label: string }) => {
  const colors = {
    1: 'bg-green-500/20 text-green-300 border-green-500/40',
    2: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    3: 'bg-red-500/20 text-red-300 border-red-500/40'
  };
  return (
    <span className={`${colors[level]} px-3 py-1 rounded-lg text-xs font-semibold border`}>
      Level {level}: {label}
    </span>
  );
};

export default function DemoPage() {
  const [availableTools, setAvailableTools] = useState<ToolInfo[]>([]);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const { insertText } = useChatInput();
  const showCode = false; // Code examples always visible

  // CRITICAL: Set container context using named contract
  // Use Demo container which matches route /demo
  useContainer(DemoContainers.Demo.id);

  useEffect(() => {
    // Register example-specific tools
    registerExampleTools();

    // Get available tools for the tool list - filter using named contracts
    const tools = Array.from(ToolRegistry.getAllTools().values())
      .filter(t => {
        // Include tools that are AI enabled
        // TODO: Add container/scope filtering once ToolMetadata includes scope info
        return t.aiEnabled;
      })
      .sort((a, b) => {
        const order: Record<string, number> = {
          'Open Menu': 1,
          'Close Menu': 2,
          'Toggle Feature': 3,
          'Toggle Notifications': 4,
        };
        return (order[a.name] || 999) - (order[b.name] || 999);
      });
    setAvailableTools(tools);
  }, []);

  return (
    <>
      <Head>
        <title>Live Demo - Supernal Interface</title>
        <meta name="description" content="Interactive examples with real working tools" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <Header currentPage="demo" />

        <div className="max-w-6xl ml-8 mr-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-bold text-white mb-4">
              Live Interactive Examples
            </h1>
            <p className="text-xl text-gray-400">
              Try commands in the chat to control these widgets
            </p>
          </motion.div>

          {/* INTRO: Clear Value Proposition */}
          <div className="mb-12">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">

              <div className="flex items-start gap-3 text-sm text-gray-400">
                <MessageSquare className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  Click any <strong className="text-blue-300">"Insert"</strong> button below to copy example commands to the chat input. Then press Enter to see it work.
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={Routes.Home}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all shadow-md border border-green-500/30"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-green-500 rounded-full">Level 1</span>
                  <span>Beginner</span>
                </div>
              </a>
              <a
                href={Routes.Home}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all shadow-md border border-yellow-500/30"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-yellow-500 rounded-full">Level 2</span>
                  <span>Intermediate</span>
                </div>
              </a>
              <a
                href={Routes.Home}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all shadow-md border border-red-500/30"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-red-500 rounded-full">Level 3</span>
                  <span>Advanced</span>
                </div>
              </a>
              <a
                href={Routes.Home}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all shadow-md border border-purple-500/30"
              >
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span>Code Examples</span>
                </div>
              </a>
            </div>
          </div>

          {/* LEVEL 1: Single Independent Widget */}
          <motion.section
            id="beginner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-16 scroll-mt-20"
          >
            <div className="bg-slate-800/50 border border-green-500/30 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <LevelBadge level={1} label="BEGINNER" />
                  <h2 className="text-3xl font-bold text-white">Single Independent Widget</h2>
                </div>
                <details className="group">
                  <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors flex items-center gap-2 list-none">
                    <FileText className="h-5 w-5" />
                    <span className="text-xs">Dev Notes</span>
                  </summary>
                  <div className="absolute right-8 mt-2 w-80 bg-slate-800 border border-green-500/40 rounded-lg p-4 shadow-xl z-10">
                    <h4 className="text-sm font-semibold text-white mb-2">Key Pattern: Independent State</h4>
                    <code className="text-green-400 text-xs">const [count, setCount] = useState(0)</code>
                    <p className="text-xs text-gray-300 mt-2">Component manages its own state using useState. Event listeners for tool integration. This widget is completely self-contained.</p>
                  </div>
                </details>
              </div>

              <div className="flex justify-center mb-6">
                <SimpleWidget />
              </div>

              {/* Try It */}
              <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => {
                  insertText('increment counter', false);
                  setCopiedCommand('increment');
                  setTimeout(() => setCopiedCommand(null), 2000);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2 shadow-md"
              >
                {copiedCommand === 'increment' ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4" />
                    <span>Insert → "increment counter"</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  insertText('decrement counter', false);
                  setCopiedCommand('decrement');
                  setTimeout(() => setCopiedCommand(null), 2000);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2 shadow-md"
              >
                {copiedCommand === 'decrement' ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4" />
                    <span>Insert → "decrement counter"</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  insertText('reset counter', false);
                  setCopiedCommand('reset');
                  setTimeout(() => setCopiedCommand(null), 2000);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2 shadow-md"
              >
                {copiedCommand === 'reset' ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4" />
                    <span>Insert → "reset counter"</span>
                  </>
                )}
              </button>
            </div>
            </div>
          </motion.section>

          {/* LEVEL 2: Multiple Independent Widgets */}
          <motion.section
            id="intermediate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-16 scroll-mt-20"
          >
            <div className="bg-slate-800/50 border border-yellow-500/30 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <LevelBadge level={2} label="INTERMEDIATE" />
                  <h2 className="text-3xl font-bold text-white">Multiple Independent Widgets</h2>
                </div>
                <details className="group">
                  <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors flex items-center gap-2 list-none">
                    <FileText className="h-5 w-5" />
                    <span className="text-xs">Dev Notes</span>
                  </summary>
                  <div className="absolute right-8 mt-2 w-80 bg-slate-800 border border-yellow-500/40 rounded-lg p-4 shadow-xl z-10">
                    <h4 className="text-sm font-semibold text-white mb-2">Key Pattern: Isolation</h4>
                    <p className="text-xs text-gray-300">
                      Each widget manages its own state - no coordination needed. These widgets are completely independent. Changing one doesn't affect the others.
                    </p>
                  </div>
                </details>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Simple State</span>
                  <h3 className="text-lg font-semibold text-white">Settings</h3>
                </div>
                <SettingsWidget />
                <button
                  onClick={() => {
                    insertText('change setting to custom', false);
                    setCopiedCommand('setting');
                    setTimeout(() => setCopiedCommand(null), 2000);
                  }}
                  className="mt-2 w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  {copiedCommand === 'setting' ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Insert → "change setting to custom"</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Array State</span>
                  <h3 className="text-lg font-semibold text-white">Chat</h3>
                </div>
                <ChatWidget />
                <button
                  onClick={() => {
                    insertText('send message hello', false);
                    setCopiedCommand('chat');
                    setTimeout(() => setCopiedCommand(null), 2000);
                  }}
                  className="mt-2 w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  {copiedCommand === 'chat' ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Insert → "send message hello"</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded">CRUD Operations</span>
                  <h3 className="text-lg font-semibold text-white">Data</h3>
                </div>
                <DataWidget />
                <button
                  onClick={() => {
                    insertText('add item new task', false);
                    setCopiedCommand('data');
                    setTimeout(() => setCopiedCommand(null), 2000);
                  }}
                  className="mt-2 w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  {copiedCommand === 'data' ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Insert → "add item new task"</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            </div>
          </motion.section>

          {/* LEVEL 3: Advanced Shared State */}
          <motion.section
            id="advanced"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-16 scroll-mt-20"
          >
            <div className="bg-slate-800/50 border border-red-500/30 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <LevelBadge level={3} label="ADVANCED" />
                  <h2 className="text-3xl font-bold text-white">Shared State Architecture</h2>
                </div>
                <details className="group">
                  <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors flex items-center gap-2 list-none">
                    <FileText className="h-5 w-5" />
                    <span className="text-xs">Dev Notes</span>
                  </summary>
                  <div className="absolute right-8 mt-2 w-80 bg-slate-800 border border-red-500/40 rounded-lg p-4 shadow-xl z-10">
                    <h4 className="text-sm font-semibold text-white mb-2">Why Shared State?</h4>
                    <ul className="list-disc list-inside text-gray-300 text-xs space-y-1">
                      <li>Coordinate behavior across multiple widgets</li>
                      <li>Single source of truth for application state</li>
                      <li>Predictable state updates and easier testing</li>
                    </ul>
                    <p className="text-xs text-gray-400 mt-2">
                      All components share a SINGLE StateManager. When one changes, all update automatically.
                    </p>
                  </div>
                </details>
              </div>

              <div className="mb-6">
                <InteractiveWidgets />
              </div>

              {/* Try It */}
              <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => {
                  insertText('open menu', false);
                  setCopiedCommand('menu');
                  setTimeout(() => setCopiedCommand(null), 2000);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2 shadow-md"
              >
                {copiedCommand === 'menu' ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4" />
                    <span>Insert → "open menu"</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  insertText('toggle feature', false);
                  setCopiedCommand('feature');
                  setTimeout(() => setCopiedCommand(null), 2000);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2 shadow-md"
              >
                {copiedCommand === 'feature' ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4" />
                    <span>Insert → "toggle feature"</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  insertText('change theme to dark', false);
                  setCopiedCommand('theme');
                  setTimeout(() => setCopiedCommand(null), 2000);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2 shadow-md"
              >
                {copiedCommand === 'theme' ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4" />
                    <span>Insert → "change theme to dark"</span>
                  </>
                )}
              </button>
            </div>
            </div>
          </motion.section>

          {/* REFERENCE: Available AI Tools */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <ToolList
              tools={availableTools}
              title="Available AI Tools"
              subtitle="Explore and test all available tools organized by category"
              color="purple"
              categorized={true}
            />
          </motion.section>

          {/* EXAMPLES SECTION: Code Examples with Cards */}
          <div id="code-examples" className="space-y-8 scroll-mt-20">
            {/* Section Divider */}
            <div className="border-t-2 border-purple-500/20 pt-12 mb-8">
              <h2 className="text-4xl font-bold text-white mb-4 text-center">
                Code Examples & Documentation
              </h2>
              <p className="text-xl text-gray-400 text-center max-w-3xl mx-auto">
                Learn how to implement these patterns in your own application
              </p>
            </div>

            {/* Basic Tools Section */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Basic Tool Decorators</h2>
              </div>

              <div className="space-y-6">
                <ExampleCard
                  id="ai-tool-example"
                  title="@AITool - Safe for AI Agents"
                  description="Tools decorated with @AITool are automatically included in AI agent context"
                  badge="Safe"
                  badgeColor="green"
                  commands={enhancedSnippets.aiTool.commands}
                  code={enhancedSnippets.aiTool}
                  showCode={showCode}
                >
                  <SimpleWidget />
                </ExampleCard>

                <ExampleCard
                  id="chat-tool-example"
                  title="@Tool - Chat Integration"
                  description="The @Tool decorator makes any function callable by AI agents with type safety"
                  badge="Core"
                  badgeColor="blue"
                  commands={enhancedSnippets.chatTool.commands}
                  code={enhancedSnippets.chatTool}
                  showCode={showCode}
                >
                  <ChatWidget />
                </ExampleCard>
              </div>
            </motion.section>

            {/* Advanced Tools Section */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-500/10 rounded-lg">
                  <Shield className="h-6 w-6 text-pink-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Advanced Features</h2>
              </div>

              <div className="space-y-6">
                <ExampleCard
                  id="dangerous-tool-example"
                  title="@DangerousTool - High Risk Operations"
                  description="For destructive operations that require explicit user confirmation"
                  badge="Dangerous"
                  badgeColor="red"
                  commands={enhancedSnippets.dangerousTool.commands}
                  code={enhancedSnippets.dangerousTool}
                  showCode={showCode}
                >
                  <SettingsWidget />
                </ExampleCard>

                <ExampleCard
                  id="data-write-tool-example"
                  title="Data Write Tools"
                  description="Tools that read and modify application state with type safety"
                  badge="Stateful"
                  badgeColor="purple"
                  commands={enhancedSnippets.dataWriteTool.commands}
                  code={enhancedSnippets.dataWriteTool}
                  showCode={showCode}
                >
                  <DataWidget />
                </ExampleCard>
              </div>
            </motion.section>

            {/* Data Integration Section
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <Database className="h-6 w-6 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Data & Integration</h2>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  API Integration Examples
                </h3>
                <p className="text-gray-400 mb-4">
                  Connect your tools to external APIs, databases, and services. Supernal Interface
                  handles authentication, rate limiting, and error handling automatically.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="font-semibold text-white mb-2">REST APIs</h4>
                    <p className="text-sm text-gray-400">
                      Connect to any REST API with built-in retry logic and caching
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="font-semibold text-white mb-2">GraphQL</h4>
                    <p className="text-sm text-gray-400">
                      Type-safe GraphQL queries with automatic schema validation
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="font-semibold text-white mb-2">Databases</h4>
                    <p className="text-sm text-gray-400">
                      Direct database access with ORM integration and query building
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="font-semibold text-white mb-2">WebSockets</h4>
                    <p className="text-sm text-gray-400">
                      Real-time data streaming with automatic reconnection
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>
          */}
         </div> 
          {/* Bottom CTA */}
          <div className="mt-16 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-12 border border-purple-500/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Build Your Own?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              These examples are just the beginning. Explore our documentation to learn how to build
              complex AI-powered applications with Supernal Interface.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={Routes.Docs}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50"
              >
                Read Documentation
              </a>
              <a
                href={Routes.Testing}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                Learn About Testing
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
