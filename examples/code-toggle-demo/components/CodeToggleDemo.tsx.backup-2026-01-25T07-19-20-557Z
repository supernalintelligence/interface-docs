/**
 * CodeToggleDemo Component
 * 
 * Displays demo and code side-by-side in split view
 */

import React from 'react';
import { CodeDisplay } from './CodeDisplay';
import styles from './CodeToggleDemo.module.css';

export interface CodeSnippet {
  component: string;  // React component code
  tool: string;       // Tool decorator code
  names: string;      // Name contract code
  full: string;       // Full implementation
}

export interface CodeToggleDemoProps {
  widgetId: string;
  title: string;
  description?: string;
  children: React.ReactNode;  // The actual widget
  code: CodeSnippet;
}

export function CodeToggleDemo({
  widgetId,
  title,
  description,
  children,
  code,
}: CodeToggleDemoProps) {
  return (
    <div className={styles.codeToggleDemo} data-widget-id={widgetId}>
      {/* Header */}
      <div className={styles.codeToggleHeader}>
        <div className={styles.headerInfo}>
          <h3>{title}</h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </div>

      {/* Content - Always Split View */}
      <div className={styles.codeToggleContent}>
        <div className={styles.splitView}>
          <div className={styles.demoPanel}>
            <h4>Interactive Demo</h4>
            {children}
          </div>
          <div className={styles.codePanel}>
            <h4>Implementation</h4>
            <CodeDisplay code={code} />
          </div>
        </div>
      </div>
    </div>
  );
}

