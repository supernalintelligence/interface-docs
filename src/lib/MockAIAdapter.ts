/**
 * Mock AI Adapter for CopilotKit
 * 
 * Implements CopilotServiceAdapter to provide fuzzy matching without OpenAI.
 * Uses our existing fuzzy matching logic from DemoAIInterface.
 */

import { randomId } from '@copilotkit/shared';
import { ToolRegistry } from "@supernalintelligence/interface-enterprise";
import { findBestMatch } from './fuzzyMatch';

// Types from CopilotKit (simplified)
interface CopilotRuntimeRequest {
  eventSource: {
    stream: (callback: (eventStream$: EventStream) => Promise<void>) => Promise<void>;
  };
  messages: Array<{
    isTextMessage: () => boolean;
    content?: string;
    textMessage?: { content: string; role: string };
  }>;
  actions: Array<{ name: string }>;
  threadId?: string;
}

interface EventStream {
  sendTextMessageStart: (params: { messageId: string }) => void;
  sendTextMessageContent: (params: { messageId: string; content: string }) => void;
  sendTextMessageEnd: (params: { messageId: string }) => void;
  sendTextMessage: (messageId: string, content: string) => void;
  sendActionExecutionStart: (params: { actionExecutionId: string; actionName: string }) => void;
  sendActionExecutionArgs: (params: { actionExecutionId: string; args: string }) => void;
  sendActionExecutionEnd: (params: { actionExecutionId: string }) => void;
  sendActionExecution: (params: { actionExecutionId: string; actionName: string; args: string }) => void;
  complete: () => void;
}

/**
 * Mock adapter that uses fuzzy matching instead of an LLM
 */
export class MockAIAdapter {
  async process(request: CopilotRuntimeRequest): Promise<{ threadId: string }> {
    const { messages, eventSource } = request;
    
    // Extract the last user message
    let userQuery = '';
    for (const msg of messages) {
      if (msg.isTextMessage && msg.isTextMessage()) {
        const content = (msg as any).content;
        if (content) {
          userQuery = content;
        }
      }
    }
    
    console.log('[MockAIAdapter] User query:', userQuery);
    
    await eventSource.stream(async (eventStream$) => {
      if (!userQuery) {
        const messageId = randomId();
        eventStream$.sendTextMessage(
          messageId, 
          'I didn\'t receive a message. Try "increment counter" or "set theme dark".'
        );
        eventStream$.complete();
        return;
      }
      
      // Use fuzzy matching
      const allTools = Array.from(ToolRegistry.getAllTools().values())
        .filter(t => t.aiEnabled);
      
      const match = findBestMatch(userQuery, allTools);
      
      console.log('[MockAIAdapter] Match:', match.tool?.name, 'confidence:', match.confidence);
      
      if (match.tool && match.confidence >= 0.3) {
        const toolName = match.tool.name || `${match.tool.componentName}.${match.tool.methodName}`;
        const actionExecutionId = randomId();
        const args = extractArguments(userQuery, match.tool);
        
        console.log('[MockAIAdapter] Executing:', toolName, args);
        
        // Send action execution
        eventStream$.sendActionExecution({
          actionExecutionId,
          actionName: toolName,
          args: JSON.stringify(args)
        });
        
        eventStream$.complete();
      } else {
        // No match - send helpful message
        const messageId = randomId();
        const availableCommands = allTools
          .flatMap(t => t.examples?.slice(0, 2) || [])
          .slice(0, 5);
        
        eventStream$.sendTextMessage(
          messageId,
          `I couldn't find a command for "${userQuery}". Try:\n${availableCommands.map(c => `• "${c}"`).join('\n')}`
        );
        eventStream$.complete();
      }
    });
    
    return {
      threadId: request.threadId || randomId()
    };
  }
}

function extractArguments(query: string, tool: any): Record<string, any> {
  const args: Record<string, any> = {};
  const lowerQuery = query.toLowerCase();
  
  if (tool.inputSchema) {
    for (const [paramName, paramDef] of Object.entries(tool.inputSchema)) {
      const def = paramDef as any;
      
      if (def.type === 'number') {
        const numMatch = query.match(/\d+/);
        if (numMatch) {
          args[paramName] = parseInt(numMatch[0], 10);
        }
      } else if (def.type === 'boolean') {
        if (lowerQuery.includes('true') || lowerQuery.includes('enable')) {
          args[paramName] = true;
        } else if (lowerQuery.includes('false') || lowerQuery.includes('disable')) {
          args[paramName] = false;
        }
      }
    }
  }
  
  // Common patterns
  if (lowerQuery.includes('dark')) args.theme = 'dark';
  if (lowerQuery.includes('light')) args.theme = 'light';
  if (lowerQuery.includes('high')) args.priority = 'high';
  if (lowerQuery.includes('medium')) args.priority = 'medium';
  if (lowerQuery.includes('low')) args.priority = 'low';
  
  return args;
}








