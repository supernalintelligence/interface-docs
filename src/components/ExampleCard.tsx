/**
 * Enhanced Example Card Component
 * - Collapsible sections
 * - Command examples
 * - Full spec vs Shorthand toggle
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Terminal, Code, Copy, Check, MessageSquare } from 'lucide-react';
import { useChatInput } from '@supernal/interface-nextjs';
import { Examples } from '../architecture';

interface CodeVariants {
  shorthand: string;
  fullSpec: string;
}

interface CommandExample {
  command: string;
  description: string;
}

export interface ExampleCardProps {
  id: string;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  children: React.ReactNode;
  commands: CommandExample[];
  code: {
    names?: string;
    tool: CodeVariants;
    component?: string;
  };
  defaultExpanded?: boolean;
  showCode?: boolean;
}

export const ExampleCard: React.FC<ExampleCardProps> = ({
  id,
  title,
  description,
  badge,
  badgeColor = 'blue',
  children,
  commands,
  code,
  defaultExpanded = false,
  showCode = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [codeMode, setCodeMode] = useState<'shorthand' | 'fullSpec'>('shorthand');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [insertedSection, setInsertedSection] = useState<string | null>(null);
  const { insertText } = useChatInput();

  const badgeColors = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      // Failed to copy
    }
  };
  
  const copyToChat = (text: string, section: string) => {
    insertText(text, false); // Insert but don't auto-submit
    setInsertedSection(section);
    setTimeout(() => setInsertedSection(null), 2000);
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      data-example-id={id}
    >
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4 flex-1">
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {badge && (
                <span className={`text-xs px-2 py-1 rounded-full border font-medium ${badgeColors[badgeColor]}`}>
                  {badge}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 flex-shrink-0 ml-4">
          <Terminal className="h-4 w-4" />
          <span>{commands.length} {commands.length === 1 ? 'command' : 'commands'}</span>
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-gray-200 overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Command Examples */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-blue-600" />
                  Try These Commands
                </h4>
                <div className="space-y-2">
                  {commands.map((cmd, cmdIndex) => (
                    <div 
                      key={cmd.command}
                      className="bg-gray-900 rounded-lg p-3 group relative"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <code className="text-sm text-green-400 font-mono break-all">
                            &quot;{cmd.command}&quot;
                          </code>
                          <p className="text-xs text-gray-400 mt-1">{cmd.description}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => copyToChat(cmd.command, `chat-${cmdIndex}`)}
                            data-testid={Examples.copyToChatButton}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded transition-colors"
                            title="Copy to chat"
                          >
                            {insertedSection === `chat-${cmdIndex}` ? (
                              <Check className="h-4 w-4 text-blue-400" />
                            ) : (
                              <MessageSquare className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(cmd.command, `cmd-${cmdIndex}`)}
                            data-testid={Examples.copyButton}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedSection === `cmd-${cmdIndex}` ? (
                              <Check className="h-4 w-4 text-green-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Demo */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Interactive Demo
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {children}
                </div>
              </div>

              {/* Code Implementation */}
              {showCode && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Code className="h-4 w-4 text-purple-600" />
                      Implementation
                    </h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCodeMode('shorthand')}
                        className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                          codeMode === 'shorthand'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Shorthand
                      </button>
                      <button
                        onClick={() => setCodeMode('fullSpec')}
                        className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                          codeMode === 'fullSpec'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Full Spec
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                  {/* Names Contract */}
                  {code.names && (
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Name Contract
                        </span>
                        <button
                          onClick={() => copyToClipboard(code.names!, 'names')}
                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
                        >
                          {copiedSection === 'names' ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border border-gray-700">
                        <code>{code.names}</code>
                      </pre>
                    </div>
                  )}

                  {/* Tool Code */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Tool Decorator {codeMode === 'shorthand' ? '(Shorthand)' : '(Full Spec)'}
                      </span>
                      <button
                        onClick={() => copyToClipboard(code.tool[codeMode], 'tool')}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
                      >
                        {copiedSection === 'tool' ? (
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border border-gray-700">
                      <code>{code.tool[codeMode]}</code>
                    </pre>
                  </div>

                  {/* Component Code */}
                  {code.component && (
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          React Component
                        </span>
                        <button
                          onClick={() => copyToClipboard(code.component!, 'component')}
                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
                        >
                          {copiedSection === 'component' ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border border-gray-700">
                        <code>{code.component}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

