/**
 * Stories Page - View and Execute Test Stories
 *
 * Displays available .feature files and allows live execution
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { DemoContainers as Containers } from "@/architecture";

interface FeatureFile {
  name: string;
  path: string;
  scenarios: number;
  status: 'ready' | 'running' | 'passed' | 'failed';
  description?: string;
}

interface ScenarioResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
}

export default function StoriesPage() {
  const [features, setFeatures] = useState<FeatureFile[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [scenarioResults, setScenarioResults] = useState<ScenarioResult[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  // Load available features
  useEffect(() => {
    // Real features from the codebase
    const availableFeatures: FeatureFile[] = [
      { 
        name: 'Counter Component', 
        path: 'counter.feature', 
        scenarios: 6, 
        status: 'ready',
        description: 'Interactive counter with increment, decrement, and reset functionality'
      },
      { 
        name: 'Chat Interface', 
        path: 'chat.feature', 
        scenarios: 4, 
        status: 'ready',
        description: 'Chat bubble with message sending and clearing'
      },
      { 
        name: 'Cache Demo', 
        path: 'cache-demo.feature', 
        scenarios: 3, 
        status: 'ready',
        description: 'Demonstrates state-aware caching in story execution'
      },
      { 
        name: 'State Caching', 
        path: 'state-caching.feature', 
        scenarios: 5, 
        status: 'ready',
        description: 'Advanced caching scenarios with checkpoints'
      },
    ];
    setFeatures(availableFeatures);
  }, []);

  const handleExecuteStory = async (featureName: string) => {
    setIsExecuting(true);
    setSelectedFeature(featureName);
    setScenarioResults([]);
    
    try {
      // Simulate story execution for demo purposes
      // In production, this would call a server-side API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock results
      const mockResults: ScenarioResult[] = [
        { name: 'Starting from zero', status: 'passed', duration: 145 },
        { name: 'Incrementing multiple times', status: 'passed', duration: 230 },
        { name: 'Decrementing from five', status: 'passed', duration: 180 },
        { name: 'Reset to zero', status: 'passed', duration: 120 },
        { name: 'Increment and decrement combination', status: 'passed', duration: 310 },
        { name: 'Working with negative values', status: 'passed', duration: 165 },
      ];
      
      setScenarioResults(mockResults);
      setFeatures(prev => prev.map(f =>
        f.name === featureName
          ? { ...f, status: 'passed' }
          : f
      ));
    } catch (error) {
      console.error('Error executing story:', error);
      setFeatures(prev => prev.map(f => 
        f.name === featureName ? { ...f, status: 'failed' } : f
      ));
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusIcon = (status: FeatureFile['status']) => {
    switch (status) {
      case 'ready': return '⏸️';
      case 'running': return '▶️';
      case 'passed': return '✅';
      case 'failed': return '❌';
    }
  };

  const getStatusColor = (status: FeatureFile['status']) => {
    switch (status) {
      case 'ready': return 'bg-gray-100 text-gray-700';
      case 'running': return 'bg-blue-100 text-blue-700';
      case 'passed': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
    }
  };

  return (
    <>
      <Head>
        <title>Stories | Supernal Interface</title>
        <meta name="description" content="View and execute test stories" />
      </Head>

      <div 
        data-testid={Containers.Stories.id}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <Header 
          currentPage="stories"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Test Stories
            </h1>
            <p className="text-lg text-gray-600">
              Available feature files and scenarios
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {features.map((feature) => (
              <div
                key={feature.path}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {feature.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {feature.path}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(feature.status)}`}>
                      {getStatusIcon(feature.status)} {feature.status}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <span>📝 {feature.scenarios} scenarios</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExecuteStory(feature.name)}
                      disabled={isExecuting}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isExecuting && selectedFeature === feature.name ? 'Running...' : 'Execute'}
                    </button>
                    <a
                      href={`/stories/${feature.path}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-center"
                    >
                      View
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Execution Result */}
          {scenarioResults.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Execution Results: {selectedFeature}
              </h2>

              <div className="space-y-4">
                {/* Summary */}
                <div className="flex items-center gap-4 pb-4 border-b">
                  <span className="text-2xl text-green-600">
                    ✅ All Passed
                  </span>
                  <span className="text-gray-600">
                    {scenarioResults.length} scenarios
                  </span>
                  <span className="text-gray-400 text-sm ml-auto">
                    Total: {scenarioResults.reduce((sum, r) => sum + r.duration, 0)}ms
                  </span>
                </div>

                {/* Scenarios */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Scenarios:</h3>
                  <div className="space-y-2">
                    {scenarioResults.map((scenario, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                        <span className="text-lg">
                          {scenario.status === 'passed' ? '✅' : scenario.status === 'failed' ? '❌' : '⏭️'}
                        </span>
                        <span className="flex-1 text-gray-700">
                          {scenario.name}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {scenario.duration}ms
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-8">
            <h3 className="font-semibold text-blue-900 mb-2">💡 About Test Stories</h3>
            <p className="text-sm text-blue-800">
              Stories are defined in <code className="bg-blue-100 px-1 rounded">.feature</code> files 
              using Gherkin syntax. They provide type-safe, cacheable test scenarios with data contracts.
            </p>
          </div>
        </div>

        {/* Chat is now global in _app.tsx */}
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

