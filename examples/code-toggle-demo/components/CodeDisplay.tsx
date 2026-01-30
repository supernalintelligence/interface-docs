/**
 * CodeDisplay Component
 *
 * Displays complete implementation code with syntax highlighting
 */

import React, { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { CodeSnippet } from './CodeToggleDemo';
import styles from './CodeDisplay.module.css';

export interface CodeDisplayProps {
  code: CodeSnippet;
}

export function CodeDisplay({ code }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  // Combine all code sections into one view
  const fullCode = `// ============================================
// NAME CONTRACTS
// ============================================
${code.names}

// ============================================
// TOOL DECORATOR
// ============================================
${code.tool}

// ============================================
// REACT COMPONENT
// ============================================
${code.component}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={styles.codeDisplay}>
      {/* Header with copy button */}
      <div className={styles.codeHeader}>
        <span className={styles.codeTitle}>Complete Implementation</span>
        <button
          className={styles.copyButton}
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      {/* Syntax Highlighted Code */}
      <div className={styles.codeContent}>
        <Highlight
          theme={themes.vsDark}
          code={fullCode.trim()}
          language="typescript"
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={className}
              style={{
                ...style,
                margin: 0,
                borderRadius: 0,
                fontSize: '13px',
                lineHeight: '1.5',
                padding: '1rem',
                overflow: 'auto',
              }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })} style={{ display: 'table-row' }}>
                  <span
                    style={{
                      display: 'table-cell',
                      textAlign: 'right',
                      paddingRight: '1em',
                      userSelect: 'none',
                      opacity: 0.5,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ display: 'table-cell' }}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
