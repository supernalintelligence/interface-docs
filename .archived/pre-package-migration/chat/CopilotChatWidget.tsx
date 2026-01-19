'use client';

/**
 * CopilotKit Chat Widget
 * 
 * Drop-in replacement for ChatBubble that uses CopilotKit for the UI
 * while bridging to our @supernal-interface tool system.
 * 
 * Our tools remain the source of truth - CopilotKit is just the UI layer.
 * 
 * NOTE: CopilotKit requires OPENAI_API_KEY to function properly.
 * Without it, use the Native chat (ChatBubble) instead.
 */

import { CopilotPopup } from '@copilotkit/react-ui';
import { useSupernalToolsBridge } from '../../hooks/useSupernalTools';
import '@copilotkit/react-ui/styles.css';

interface CopilotChatWidgetProps {
  /** Initial open state */
  defaultOpen?: boolean;
  /** Custom title */
  title?: string;
  /** Custom placeholder/initial message */
  placeholder?: string;
}

export function CopilotChatWidget({ 
  defaultOpen = false,
  title = 'Supernal Intelligence',
  placeholder = 'How can I help? Try "increment the counter" or "go to docs"'
}: CopilotChatWidgetProps) {
  // Bridge our @Tool methods to CopilotKit actions
  useSupernalToolsBridge();
  
  return (
    <>
      <style jsx global>{`
        /* Hide CopilotKit branding - targets the actual <p class="poweredBy"> element */
        .poweredBy {
          display: none !important;
        }
      `}</style>
      <CopilotPopup
        instructions={`You are an AI assistant that can control this application using tools.

Available capabilities:
- Navigate between pages (docs, examples, dashboard, etc.)
- Interact with demo widgets (counter, notifications, theme)
- Read and modify application state

Guidelines:
- When users ask you to do something, use the appropriate tool
- Always confirm what action you took
- If a tool fails, explain what went wrong
- Be helpful and concise

This is a demo of @supernal-interface - a framework for building AI-controllable applications.`}
        labels={{
          title,
          initial: placeholder,
        }}
        defaultOpen={defaultOpen}
      />
    </>
  );
}

export default CopilotChatWidget;

