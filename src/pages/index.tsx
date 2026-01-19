/**
 * Supernal Interface - Hero Landing Page
 * Problem → Solution → Value Proposition
 */

import React, { useState } from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { EarlyAccessModal } from '../components/EarlyAccessModal';

interface PipelineStep {
  num: string;
  name: string;
  desc: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  details: string;
  code: string;
}

function PipelineCard({ step }: { step: PipelineStep }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={`group relative bg-gradient-to-br ${step.bgGradient} p-1 cursor-pointer transition-all duration-300 notch-lg ${
        isExpanded ? 'lg:col-span-2 lg:row-span-2' : 'hover:scale-110 hover:z-10 peer-hover:scale-90'
      } peer`}
    >
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 h-full notch-md">
        {/* Header - Always Visible */}
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${step.bgGradient} flex items-center justify-center font-bold text-2xl text-white shadow-lg notch-md`}>
            {step.num}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{step.name}</h3>
            <p className="text-sm text-gray-300">{step.desc}</p>
          </div>
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="mt-4 space-y-4 animate-fadeIn">
            <p className="text-gray-200 text-sm leading-relaxed">
              {step.details}
            </p>
            <div className="bg-slate-950 p-4 border-2 border-gray-600 rounded">
              <pre className="text-xs text-green-300 overflow-x-auto">
                <code>{step.code}</code>
              </pre>
            </div>
            <button className="text-xs text-gray-400 hover:text-white transition-colors">
              Click to collapse
            </button>
          </div>
        )}

        {/* Hint */}
        {!isExpanded && (
          <p className="text-xs text-gray-400 mt-2">Click to expand</p>
        )}
      </div>
    </div>
  );
}

export default function HeroPage() {
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);
  
  useEffect(() => {
    // Set up navigation handler
    
    
    // Subscribe to tool execution results
    const unsubscribe = ToolManager.subscribe((result) => {
      const emoji = result.success ? '✅' : '❌';
      console.log(`${emoji} ${result.message}`);
    });
    
    return unsubscribe;
  }, [router, addMessage]);

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;
    console.log(text, 'user');
    
    try {
      const result = await aiInterface.findAndExecuteCommand(text, 'Home');
      if (!result.success) {
        console.log(result.message);
      }
    } catch (error) {
      console.log(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  return (
    <>
      <Head>
        <title>Supernal Interface - AI-Controllable React Framework</title>
        <meta name="description" content="Build React applications that AI assistants can navigate and control. Enable true agentic UX for your users." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <Header onEarlyAccessClick={() => setShowEarlyAccessModal(true)} />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
       
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                AI-Controllable
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  React Applications
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
                Build UIs that AI assistants can navigate, manipulate, and control.
                <br />
                Enable <strong>agentic experiences</strong> for your users.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/docs'}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all notch-md"
                >
                  Get Started →
                </button>
                <button 
                  onClick={() => window.location.href = '/demo/simple'}
                  className="px-8 py-4 bg-white text-gray-900 font-semibold text-lg border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transform hover:scale-105 transition-all notch-md"
                >
                  View Demo
                </button>
              </div>
            </div>
          </div>

          {/* Decorative gradient blobs */}
          <div className="absolute top-1/2 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/2 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </section>

        {/* Problem vs Solution - Side-by-Side */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                The Difference
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Traditional UIs vs. AI-Controllable UIs
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Problem: Traditional UI */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl border-2 border-red-200">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-red-100 px-4 py-2 rounded-full">
                    <span className="font-bold text-red-800">Traditional UI</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { step: '1', text: 'Think: "I want to reset the counter"', icon: '🤔', time: '+0s' },
                    { step: '2', text: 'Search for the right page', icon: '🔍', time: '+2s' },
                    { step: '3', text: 'Click through menus', icon: '🖱️', time: '+3s' },
                    { step: '4', text: 'Locate the reset button', icon: '👀', time: '+5s' },
                    { step: '5', text: 'Finally click reset', icon: '✋', time: '+7s' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-700 text-sm">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{item.text}</p>
                      </div>
                      <div className="text-xl">{item.icon}</div>
                      <div className="text-xs text-red-600 font-mono">{item.time}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center space-y-2">
                  <div className="text-3xl font-bold text-red-700">7+ seconds</div>
                  <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full font-semibold text-sm">
                    ❌ 5 Steps • Slow • Error-Prone
                  </div>
                </div>
              </div>

              {/* Solution: AI-Controllable UI */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-2xl border-2 border-green-200 relative">
                {/* "Better" badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-full font-bold shadow-lg transform rotate-12">
                  ⚡ Faster and Easier!
                </div>
                
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-green-100 px-4 py-2 rounded-full">
                    <span className="font-bold text-green-800">Supernal Interface</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { step: '1', text: 'User: "Reset the counter"', icon: '💬', time: '+0s' },
                    { step: '2', text: 'AI understands intent', icon: '🧠', time: '+0.5s' },
                    { step: '3', text: 'AI navigates & executes', icon: '🤖', time: '+1.5s' },
                    { step: '4', text: 'Counter is reset', icon: '✨', time: '+2s' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700 text-sm">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{item.text}</p>
                      </div>
                      <div className="text-xl">{item.icon}</div>
                      <div className="text-xs text-green-600 font-mono">{item.time}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center space-y-2">
                  <div className="text-3xl font-bold text-green-700">~2 seconds</div>
                  <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
                    ✅ 4 Steps • Fast • Accurate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How It Works: The Pipeline
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Four connected systems that make your UI AI-controllable
              </p>
            </div>

            {/* Interactive Pipeline Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  num: '1',
                  name: 'Names',
                  desc: 'Type-safe IDs',
                  color: 'blue',
                  bgGradient: 'from-blue-500 to-cyan-500',
                  borderColor: 'border-blue-400',
                  details: 'Centralized, type-safe identifiers for every UI element. Builds on TypeScript types.',
                  code: `export const Counter = {
  display: 'counter-display',
  resetBtn: 'counter-reset'
} as const;`,
                },
                {
                  num: '2',
                  name: 'Data Contracts',
                  desc: 'State definitions',
                  color: 'purple',
                  bgGradient: 'from-purple-500 to-pink-500',
                  borderColor: 'border-purple-400',
                  details: 'Define states and transitions. AI references these instead of magic strings.',
                  code: `export const CounterContract = {
  state: {
    zero: { count: 0 },
    five: { count: 5 }
  },
  after: {
    reset: () => ({ count: 0 })
  }
};`,
                },
                {
                  num: '3',
                  name: 'Story Generator',
                  desc: 'Actions & Tests',
                  color: 'green',
                  bgGradient: 'from-green-500 to-emerald-500',
                  borderColor: 'border-green-400',
                  details: 'Write Gherkin stories. Auto-generates actions, paths, and Playwright tests.',
                  code: `Given counter is Counter.state.five
When I reset counter
Then counter is Counter.state.zero

→ Generates test & execution path`,
                },
                {
                  num: '4',
                  name: 'Executor',
                  desc: 'Live execution',
                  color: 'orange',
                  bgGradient: 'from-orange-500 to-red-500',
                  borderColor: 'border-orange-400',
                  details: 'Moves through actions on your site. Uses Names + Contracts to execute stories.',
                  code: `const executor = new StoryExecutor();
await executor.executeGraph(graph);

→ Navigates, clicks, verifies state
→ Caches results for speed`,
                },
              ].map((step) => (
                <PipelineCard key={step.num} step={step} />
              ))}
            </div>

            {/* Pipeline Result */}
            <div className="mt-12 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 p-1 notch-lg">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 notch-md">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  The Result
                </h3>
                <p className="text-xl text-center text-blue-100 mb-6">
                  Auto-generated code systems enabling automated testing, feature tours, and AI controllability
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🧪</div>
                    <p className="font-semibold text-white">Automated Testing</p>
                    <p className="text-sm text-gray-300">Playwright tests from stories</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎯</div>
                    <p className="font-semibold text-white">Feature Tours</p>
                    <p className="text-sm text-gray-300">Guided user onboarding</p>
                  </div>
      <div className="text-center">
                    <div className="text-3xl mb-2">🤖</div>
                    <p className="font-semibold text-white">AI Controllability</p>
                    <p className="text-sm text-gray-300">Natural language commands</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How Does Supernal Compare?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                vs. other frameworks and approaches
              </p>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto notch-lg">
              <table className="w-full bg-white border-2 border-slate-300">
                <thead className="bg-gradient-to-r from-slate-800 to-slate-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white border-b border-slate-700">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-cyan-400 border-b border-slate-700 bg-slate-900">
                      Supernal Interface
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300 border-b border-slate-700">
                      Vercel AI SDK
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300 border-b border-slate-700">
                      React + Manual Tools
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300 border-b border-slate-700">
                      Traditional Testing
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      feature: 'AI Controllability',
                      supernal: '✅ Built-in',
                      vercel: '⚠️ Chat UI only',
                      react: '❌ Manual setup',
                      testing: '❌ Not applicable',
                    },
                    {
                      feature: 'Auto-Generated Tests',
                      supernal: '✅ From stories',
                      vercel: '❌ Manual',
                      react: '❌ Manual',
                      testing: '⚠️ Manual Playwright',
                    },
                    {
                      feature: 'Type Safety',
                      supernal: '✅ Full TypeScript',
                      vercel: '⚠️ Partial',
                      react: '✅ TypeScript',
                      testing: '⚠️ Test-level only',
                    },
                    {
                      feature: 'State Management',
                      supernal: '✅ Data contracts',
                      vercel: '⚠️ useState/context',
                      react: '✅ useState/Redux',
                      testing: '❌ External mocks',
                    },
                    {
                      feature: 'Navigation',
                      supernal: '✅ Auto-routing',
                      vercel: '❌ Manual',
                      react: '❌ Manual',
                      testing: '⚠️ Page object pattern',
                    },
                    {
                      feature: 'Story System',
                      supernal: '✅ Gherkin → Tests',
                      vercel: '❌ None',
                      react: '❌ None',
                      testing: '⚠️ Separate BDD tools',
                    },
                    {
                      feature: 'Single Source of Truth',
                      supernal: '✅ Contracts',
                      vercel: '❌ Scattered',
                      react: '❌ Scattered',
                      testing: '❌ Test-specific',
                    },
                    {
                      feature: 'Learning Curve',
                      supernal: '🟢 Low',
                      vercel: '🟡 Medium',
                      react: '🟢 Low',
                      testing: '🔴 High',
                    },
                    {
                      feature: 'Setup Time',
                      supernal: '🟢 < 5 min',
                      vercel: '🟡 ~30 min',
                      react: '🟢 < 5 min',
                      testing: '🔴 Hours',
                    },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-sm text-center font-semibold text-cyan-600 bg-cyan-50">
                        {row.supernal}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-700">{row.vercel}</td>
                      <td className="px-6 py-4 text-sm text-center text-gray-700">{row.react}</td>
                      <td className="px-6 py-4 text-sm text-center text-gray-700">{row.testing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

           
          </div>
        </section>

        {/* Benefits Section */}
        

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Build Agentic UIs?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join the future of human-AI interaction. Start building AI-controllable React apps today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/docs'}
                className="px-8 py-4 bg-white text-blue-600 font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all notch-md"
              >
                Read Documentation →
              </button>
              <button 
                onClick={() => window.location.href = '/demo/simple'}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all notch-md"
              >
                Try Live Demo
              </button>
              <button 
                onClick={() => window.open('https://github.com/supernal-io/supernal-interface', '_blank')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all notch-md"
              >
                ⭐ Star on GitHub
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-gray-900 text-gray-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-white font-bold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><button onClick={() => window.location.href = '/docs'} className="hover:text-white">Documentation</button></li>
                  <li><button onClick={() => window.location.href = '/demo/simple'} className="hover:text-white">Demo</button></li>
                  <li><button onClick={() => window.location.href = '/examples'} className="hover:text-white">Examples</button></li>
                  <li><button onClick={() => window.location.href = '/architecture'} className="hover:text-white">Architecture</button></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="https://github.com/supernalintelligence/interface" className="hover:text-white">GitHub</a></li>
                  <li><a href="https://www.npmjs.com/package/@supernal-interface/core" className="hover:text-white">npm Package</a></li>
                  <li><button onClick={() => window.location.href = '/docs'} className="hover:text-white">API Reference</button></li>
                  <li><a href="https://github.com/supernalintelligence/interface/releases" className="hover:text-white">Changelog</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-4">Community</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Discord</a></li>
                  <li><a href="#" className="hover:text-white">Twitter</a></li>
                  <li><button onClick={() => window.location.href = '/blog'} className="hover:text-white">Blog</button></li>
                  <li><a href="https://github.com/supernalintelligence/interface/graphs/contributors" className="hover:text-white">Contributors</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-4">About</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Team</a></li>
                  <li><a href="https://github.com/supernalintelligence/interface/blob/main/LICENSE" className="hover:text-white">License</a></li>
                  <li><a href="#" className="hover:text-white">Privacy</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-sm">
              <p>© 2025 <a href="https://www.supernal.ai" className="hover:text-white">Supernal Intelligence</a>. Built to empower people with the AI-native future.</p>
            </div>
          </div>
        </footer>

        {/* Chat Interface - Now global in _app.tsx, removed from here */}

        {/* Early Access Modal */}
        <EarlyAccessModal 
          isOpen={showEarlyAccessModal}
          onClose={() => setShowEarlyAccessModal(false)}
        />
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Notched corner utilities */
        .notch-lg {
          clip-path: polygon(
            12px 0,
            calc(100% - 12px) 0,
            100% 12px,
            100% calc(100% - 12px),
            calc(100% - 12px) 100%,
            12px 100%,
            0 calc(100% - 12px),
            0 12px
          );
        }
        
        .notch-md {
          clip-path: polygon(
            8px 0,
            calc(100% - 8px) 0,
            100% 8px,
            100% calc(100% - 8px),
            calc(100% - 8px) 100%,
            8px 100%,
            0 calc(100% - 8px),
            0 8px
          );
        }
        
        .notch-sm {
          clip-path: polygon(
            6px 0,
            calc(100% - 6px) 0,
            100% 6px,
            100% calc(100% - 6px),
            calc(100% - 6px) 100%,
            6px 100%,
            0 calc(100% - 6px),
            0 6px
          );
        }
      `}</style>
    </>
  );
}
