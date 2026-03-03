/**
 * Text-First Hero Component
 *
 * Dynamic cycling text: app/website/future
 * No emojis - clean, professional
 */

import React, { useState, useEffect } from 'react';

interface TextFirstHeroProps {
  onGetStarted?: () => void;
  onTryDemo?: () => void;
}

const CYCLING_WORDS = ['React App', 'React Website', 'Future'];

export const TextFirstHero: React.FC<TextFirstHeroProps> = ({
  onGetStarted = () => window.location.href = '/docs',
  onTryDemo = () => window.location.href = '/examples'
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % CYCLING_WORDS.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-32 pb-20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TEXT ALWAYS AT TOP - NEVER HIDDEN */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Agentify
            your{' '}
            <br />
            <span
              className={`inline-block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-300 ${
                isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              {CYCLING_WORDS[wordIndex]}
            </span>
            <br />
            in minutes
          </h1>

          <div className="space-y-2 text-xl md:text-2xl text-gray-300 mb-10">
            <p>Easy for your users</p>
            <p>Fast for devs</p>
            <p>Value for you</p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50"
            >
              Get Started
            </button>
            <button
              onClick={onTryDemo}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              View Examples
            </button>
          </div>
        </div>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-pink-500/30 rounded-full filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
    </section>
  );
};
