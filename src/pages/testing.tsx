/**
 * Testing Page - Documentation and Features for Auto-Generated Testing
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Components } from '../architecture';
import { Routes } from '../architecture/Routes';

interface TestingFeature {
  title: string;
  description: string;
  codeExample: string;
  benefits: string[];
}

const TESTING_FEATURES: TestingFeature[] = [
  {
    title: 'Auto-Generated Test Cases',
    description: 'Every @Tool decorator automatically generates type-safe test scenarios from your tool definitions',
    codeExample: `@Tool({ description: 'Reset counter to zero' })
function resetCounter() {
  setCount(0);
}

// Auto-generates:
// ✓ Test: "should reset counter to zero"
// ✓ Validates: function exists
// ✓ Validates: executes without error
// ✓ Validates: state changes correctly`,
    benefits: [
      'Zero test writing overhead',
      'Type-safe validation',
      'Always in sync with code'
    ]
  },
  {
    title: 'Gherkin Story Testing',
    description: 'Write human-readable feature files that execute as automated tests',
    codeExample: `Feature: Counter Component
  Scenario: Increment counter
    Given the counter is at 0
    When I increment the counter
    Then the counter should be at 1
    And the display should show "1"`,
    benefits: [
      'Business-readable tests',
      'Cacheable scenarios',
      'State-aware execution'
    ]
  },
  {
    title: 'Component State Validation',
    description: 'Automatically validate component state before and after tool execution',
    codeExample: `@Tool({
  description: 'Set counter',
  preConditions: ['counter exists'],
  postConditions: ['counter value updated']
})
function setCounter(value: number) {
  setCount(value);
}`,
    benefits: [
      'Catch state bugs early',
      'Clear error messages',
      'Contract-based validation'
    ]
  },
  {
    title: 'Test Coverage Reports',
    description: 'Track which tools are tested and identify gaps in your test suite',
    codeExample: `npm run test:coverage

Tool Coverage Report:
✓ resetCounter    100%  (3/3 scenarios)
✓ increment       100%  (2/2 scenarios)
⚠ decrement       66%   (2/3 scenarios)
✗ complexAction   0%    (0/1 scenarios)`,
    benefits: [
      'Visual coverage metrics',
      'Identify untested tools',
      'CI/CD integration'
    ]
  }
];

export default function TestingPage() {
  return (
    <>
      <Head>
        <title>Testing Features | Supernal Interface</title>
        <meta
          name="description"
          content="Auto-generated testing, Gherkin stories, and type-safe validation for your AI-powered React apps"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <Header currentPage="testing" />

        <div
          data-testid={Components.Testing.container}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1
              data-testid={Components.Testing.title}
              className="text-5xl font-bold text-white mb-4"
            >
              Testing Made Simple
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Write less test code. Get better coverage. Supernal Interface automatically generates type-safe tests from your tool definitions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={Routes.Docs}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50"
              >
                Read Documentation
              </Link>
              <Link
                href={Routes.Stories}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                Try Story Examples
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-12">
            {TESTING_FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                data-testid={Components.Testing.featureCard}
                className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10"
              >
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Description */}
                    <div>
                      <h2
                        data-testid={Components.Testing.featureTitle}
                        className="text-3xl font-bold text-white mb-4"
                      >
                        {index + 1}. {feature.title}
                      </h2>
                      <p
                        data-testid={Components.Testing.featureDescription}
                        className="text-lg text-gray-400 mb-6"
                      >
                        {feature.description}
                      </p>
                      <div className="space-y-3">
                        {feature.benefits.map((benefit) => (
                          <div key={benefit} className="flex items-start gap-3">
                            <svg
                              className="w-6 h-6 text-green-400 mt-1 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-gray-300">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Code Example */}
                    <div>
                      <pre
                        data-testid={Components.Testing.codeExample}
                        className="bg-slate-950 rounded-lg p-6 overflow-x-auto border border-white/10"
                      >
                        <code className="text-sm text-gray-300 font-mono">
                          {feature.codeExample}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div className="mt-20 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-12 border border-purple-500/20">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-6xl mb-4">1️⃣</div>
                <h3 className="text-xl font-bold text-white mb-3">Decorate Your Functions</h3>
                <p className="text-gray-400">
                  Add @Tool decorators to any function you want to make AI-controllable
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">2️⃣</div>
                <h3 className="text-xl font-bold text-white mb-3">Run Test Generation</h3>
                <p className="text-gray-400">
                  Our CLI scans your code and generates type-safe test scenarios automatically
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">3️⃣</div>
                <h3 className="text-xl font-bold text-white mb-3">Execute & Monitor</h3>
                <p className="text-gray-400">
                  Run tests in CI/CD, get coverage reports, and catch regressions early
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Automate Your Testing?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Get started with Supernal Interface and spend less time writing tests, more time shipping features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={Routes.Docs}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50"
              >
                Get Started
              </Link>
              <Link
                href={Routes.Demo}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                See Live Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
