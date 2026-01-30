/**
 * CodeDisplay Component
 * 
 * Displays complete implementation code with syntax highlighting
 */

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
        <SyntaxHighlighter
          language="typescript"
          style={vscDarkPlus}
          showLineNumbers
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '13px',
            lineHeight: '1.5',
          }}
        >
          {fullCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

