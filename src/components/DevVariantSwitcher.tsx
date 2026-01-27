/**
 * DevVariantSwitcher - Development-only UI for switching chat variants
 *
 * Only renders in development mode (process.env.NODE_ENV === 'development')
 * Uses ChatBubbleVariant named contracts for type safety
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ChatBubbleVariant, type ChatBubbleVariantType } from '@supernal/interface-nextjs';

interface DevVariantSwitcherProps {
  currentVariant: ChatBubbleVariantType;
}

export function DevVariantSwitcher({ currentVariant }: DevVariantSwitcherProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const variants = Object.keys(ChatBubbleVariant) as ChatBubbleVariantType[];

  const handleVariantChange = (variant: ChatBubbleVariantType) => {
    // Update URL parameter
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, variant }
    }, undefined, { shallow: true });

    // Update localStorage
    localStorage.setItem('chat-variant', variant);

    // Collapse after selection
    setIsExpanded(false);
  };

  const getVariantIcon = (variant: ChatBubbleVariantType): string => {
    switch (variant) {
      case 'full': return '📱';
      case 'floating': return '💬';
      case 'drawer': return '📋';
      case 'subtitle': return '@/';
      default: return '❓';
    }
  };

  const getVariantLabel = (variant: ChatBubbleVariantType): string => {
    switch (variant) {
      case 'full': return 'Full ';
      case 'floating': return 'Floating';
      case 'drawer': return 'Drawer';
      case 'subtitle': return 'Subtitle (Beta)';
      default: return variant;
    }
  };

  return (
    <div
      className="fixed bottom-4 left-4 z-[9999] flex flex-col-reverse items-start gap-2"
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Variant options (only show when expanded) */}
      {isExpanded && (
        <div
          className="flex flex-col gap-1 p-2 rounded-lg"
          style={{
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          }}
        >
          {variants.map((variant) => (
            <button
              key={variant}
              onClick={() => handleVariantChange(variant)}
              className="px-3 py-2 text-xs font-medium rounded transition-all text-left"
              style={{
                background: currentVariant === variant
                  ? 'rgba(59, 130, 246, 0.3)'
                  : 'transparent',
                color: currentVariant === variant ? '#60a5fa' : '#d1d5db',
                border: currentVariant === variant
                  ? '1px solid rgba(59, 130, 246, 0.5)'
                  : '1px solid transparent',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (currentVariant !== variant) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentVariant !== variant) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span className="mr-2">{getVariantIcon(variant)}</span>
              {getVariantLabel(variant)}
            </button>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-3 py-2 text-xs font-bold rounded-lg transition-all"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(124, 58, 237, 0.9))',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <span className="mr-2">{getVariantIcon(currentVariant)}</span>
        {isExpanded ? '✕' : ''}
      </button>
    </div>
  );
}
