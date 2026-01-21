/**
 * Journey Tabs Component
 *
 * Four journey steps:
 * - Try It (playground/examples)
 * - Build It (construction/implementation)
 * - Test It (testing tools)
 * - Win It (optimization/success)
 *
 * Based on: docs/planning/strategy/SITE_REDESIGN_SUMMARY.md
 */

import React, { useState } from 'react';

interface JourneyStep {
  id: string;
  icon: string;
  label: string;
  headline: string;
  description: string;
  steps: { num: number; title: string; desc: string }[];
  cta?: { text: string; href: string };
  visual?: React.ReactNode;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'try',
    icon: '🎮',
    label: 'Try It',
    headline: 'Experience It in 2 Minutes',
    description: 'See real AI control in action. No installation needed.',
    steps: [
      { num: 1, title: 'Visit Examples', desc: 'Browse live demos and code snippets' },
      { num: 2, title: 'Click Try Demo', desc: 'Interact with a working AI-controlled app' },
      { num: 3, title: 'Talk to It', desc: 'Use chat, voice, or traditional UI' }
    ],
    cta: { text: 'Try Examples Now →', href: '/examples' }
  },
  {
    id: 'build',
    icon: '🏗️',
    label: 'Build It',
    headline: 'Ship Your First AI Feature Today',
    description: 'Add AI control to your existing React app in 3 simple steps.',
    steps: [
      { num: 1, title: 'Install Package', desc: 'npm install @supernal/interface' },
      { num: 2, title: 'Add @Tool Decorator', desc: 'Mark functions you want AI to control' },
      { num: 3, title: 'Deploy', desc: 'Ship AI-native features to your users' }
    ],
    cta: { text: 'Read Quick Start →', href: '/docs' }
  },
  {
    id: 'test',
    icon: '🧪',
    label: 'Test It',
    headline: 'Automated Testing Built-In',
    description: 'Generate tests from your @Tool definitions. Catch bugs before users do.',
    steps: [
      { num: 1, title: 'Define Tools', desc: 'Existing @Tool decorators define the contract' },
      { num: 2, title: 'Run Story System', desc: 'Auto-generate test scenarios' },
      { num: 3, title: 'Fix Issues', desc: 'See exactly what broke and why' }
    ],
    cta: { text: 'Learn Testing →', href: '/docs#testing' }
  },
  {
    id: 'win',
    icon: '🏆',
    label: 'Win It',
    headline: 'Optimize and Scale',
    description: 'Join showcase, reduce costs, and grow your user base.',
    steps: [
      { num: 1, title: 'Enable BYOK', desc: 'Users bring their own API keys (40% savings)' },
      { num: 2, title: 'Join Showcase', desc: 'Get featured in our gallery for free' },
      { num: 3, title: 'Scale Up', desc: 'Cross-promote with other AI-native apps' }
    ],
    cta: { text: 'View Showcase →', href: '/showcase' }
  }
];

export const JourneyTabs: React.FC = () => {
  const [activeStep, setActiveStep] = useState('try');

  const currentStep = JOURNEY_STEPS.find(s => s.id === activeStep) || JOURNEY_STEPS[0];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Journey to AI-Native
          </h2>
          <p className="text-xl text-gray-600">
            From first demo to production in one week
          </p>
        </div>

        {/* Progress Bar with Step Buttons */}
        <div className="relative mb-16">
          {/* Connection Line */}
          <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 hidden md:block">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
              style={{
                width: `${(JOURNEY_STEPS.findIndex(s => s.id === activeStep) / (JOURNEY_STEPS.length - 1)) * 100}%`
              }}
            />
          </div>

          {/* Step Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {JOURNEY_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all notch-md ${
                  activeStep === step.id
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <div className={`text-4xl mb-2 ${activeStep === step.id ? 'animate-bounce' : ''}`}>
                  {step.icon}
                </div>
                <div className="text-center">
                  <div className="font-semibold">{step.label}</div>
                  <div className={`text-xs mt-1 ${activeStep === step.id ? 'text-blue-100' : 'text-gray-500'}`}>
                    Step {idx + 1}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          {/* Step Header */}
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">{currentStep.icon}</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              {currentStep.headline}
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {currentStep.description}
            </p>
          </div>

          {/* Steps List */}
          <div className="max-w-3xl mx-auto space-y-6 mb-10">
            {currentStep.steps.map((step) => (
              <div
                key={step.num}
                className="flex items-start gap-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 notch-md"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {step.num}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    {step.title}
                  </h4>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          {currentStep.cta && (
            <div className="text-center">
              <a
                href={currentStep.cta.href}
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all notch-md"
              >
                {currentStep.cta.text}
              </a>
            </div>
          )}
        </div>

        {/* Timeline Visual */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 bg-white rounded-full px-8 py-4 shadow-md">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-lg font-semibold text-gray-900">
              Average time to production: <span className="text-blue-600">7 days</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
