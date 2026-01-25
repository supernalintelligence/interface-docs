/**
 * Demo Page: Code Toggle Examples
 * 
 * Shows interactive widgets alongside their implementation code
 */

import React, { useState } from 'react';
import { CodeToggleDemo } from '../components/CodeToggleDemo';
import { widgetCodeSnippets } from '../data/widget-code-snippets';
import styles from './CodeTogglePage.module.css';

// Simple demo widgets for demonstration
function ChatWidget() {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    console.log('Sending message:', message);
    setSent(true);
    setTimeout(() => {
      setMessage('');
      setSent(false);
    }, 1500);
  };

  return (
    <div className="chat-widget-demo">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        rows={3}
      />
      <button onClick={handleSend} disabled={!message || sent}>
        {sent ? '✓ Sent!' : 'Send Message'}
      </button>
    </div>
  );
}

function DeleteUserWidget() {
  const [confirming, setConfirming] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleDelete = () => {
    console.log('User deleted');
    setDeleted(true);
    setTimeout(() => {
      setDeleted(false);
      setConfirming(false);
    }, 2000);
  };

  if (deleted) {
    return <div className="success-message">✓ User deleted successfully</div>;
  }

  return (
    <div className="delete-widget-demo">
      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="btn-danger"
        >
          Delete User
        </button>
      ) : (
        <div className="confirmation">
          <p className="warning">⚠️ This action cannot be undone!</p>
          <div className="button-group">
            <button onClick={handleDelete} className="btn-confirm-danger">
              Confirm Delete
            </button>
            <button onClick={() => setConfirming(false)} className="btn-cancel">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NavigationWidget() {
  const [current, setCurrent] = useState<string>('home');

  return (
    <div className="nav-widget-demo">
      <div className="current-page">
        Current: <strong>{current}</strong>
      </div>
      <nav className="nav-buttons">
        <button onClick={() => setCurrent('settings')}>
          Go to Settings
        </button>
        <button onClick={() => setCurrent('dashboard')}>
          Go to Dashboard
        </button>
        <button onClick={() => setCurrent('home')}>
          Go to Home
        </button>
      </nav>
    </div>
  );
}

export default function CodeTogglePage() {
  return (
    <div className="code-toggle-page">
      <header className="page-header">
        <h1>Interactive Code Examples</h1>
        <p className="subtitle">
          See the implementation alongside the live demo - toggle between views or see them side-by-side
        </p>
      </header>

      <div className="examples">
        {/* Example 1: Simple AI Tool */}
        <CodeToggleDemo
          widgetId="chat-send-button"
          title="Simple AI Tool"
          description="AI-enabled chat with @AITool decorator - only 3 lines of code!"
          code={widgetCodeSnippets['chat-send-button']}
        >
          <ChatWidget />
        </CodeToggleDemo>

        {/* Example 2: Dangerous Operation */}
        <CodeToggleDemo
          widgetId="dangerous-delete"
          title="Dangerous Operation"
          description="@DangerousTool requires approval before AI can execute"
          code={widgetCodeSnippets['dangerous-delete']}
        >
          <DeleteUserWidget />
        </CodeToggleDemo>

        {/* Example 3: Navigation */}
        <CodeToggleDemo
          widgetId="navigation-tool"
          title="Navigation Tools"
          description="Using PresetTemplates.Navigation for DRY configuration"
          code={widgetCodeSnippets['navigation-tool']}
        >
          <NavigationWidget />
        </CodeToggleDemo>
      </div>

      {/* Benefits Section */}
      <section className="benefits">
        <h2>Why Use Specialized Decorators?</h2>
        <div className="benefit-grid">
          <div className="benefit">
            <div className="benefit-icon">📝</div>
            <h3>80% Less Code</h3>
            <p>Reduce from 15 lines to 3 lines per tool declaration</p>
          </div>
          <div className="benefit">
            <div className="benefit-icon">🎯</div>
            <h3>Clear Intent</h3>
            <p>@DangerousTool vs config flags - instantly understand safety</p>
          </div>
          <div className="benefit">
            <div className="benefit-icon">🔒</div>
            <h3>Type Safe</h3>
            <p>Full TypeScript support with IDE autocomplete</p>
          </div>
          <div className="benefit">
            <div className="benefit-icon">♻️</div>
            <h3>DRY with Presets</h3>
            <p>Define common config once at class level</p>
          </div>
        </div>
      </section>

      {/* Code Comparison */}
      <section className="comparison">
        <h2>Before vs After</h2>
        <div className="comparison-grid">
          <div className="before">
            <h3>Before (15 lines)</h3>
            <pre>{`@Tool({
  toolId: 'send-message',
  aiEnabled: true,
  toolType: 'ai-safe',
  dangerLevel: 'safe',
  requiresApproval: false,
  generateSimulation: true,
  generateStories: true,
  category: ToolCategory.CHAT,
  tags: ['chat'],
  executionContext: 'both'
})
async sendMessage(text: string) {
  // ...
}`}</pre>
          </div>
          <div className="after">
            <h3>After (3 lines)</h3>
            <pre>{`@ToolPreset(PresetTemplates.Chat)
class ChatTools {
  @AITool({ toolId: 'send-message' })
  async sendMessage(text: string) {
    // ...
  }
}`}</pre>
          </div>
        </div>
      </section>
    </div>
  );
}

