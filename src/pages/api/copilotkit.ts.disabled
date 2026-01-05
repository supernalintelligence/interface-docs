/**
 * CopilotKit Runtime Endpoint (Next.js Pages Router)
 * 
 * Uses OpenAI when available, falls back to MockAIAdapter for fuzzy matching.
 */

import { 
  CopilotRuntime, 
  OpenAIAdapter, 
  copilotRuntimeNextJSPagesRouterEndpoint 
} from '@copilotkit/runtime';
import { ToolRegistry } from "@supernal/interface-enterprise";
import { findBestMatch } from '../../lib/fuzzyMatch';

// Check for valid API key
const apiKey = process.env.OPENAI_API_KEY;
const isValidKey = apiKey && 
  !apiKey.includes('your-') && 
  !apiKey.includes('here') && 
  apiKey.startsWith('sk-') &&
  apiKey.length > 20;

const useMockAI = !isValidKey;

console.log('[CopilotKit] Mode:', useMockAI ? 'MockAI (fuzzy matching)' : 'OpenAI');

// Track recently processed message IDs to prevent duplicate processing
// This prevents infinite loops when CopilotKit replays messages after navigation
const processedMessageIds = new Set<string>();
const MAX_PROCESSED = 50;

function shouldProcess(messageId: string): boolean {
  if (processedMessageIds.has(messageId)) {
    console.log(`[FuzzyMatchAdapter] Skipping already processed message: ${messageId}`);
    return false;
  }
  
  // Clean up old IDs
  if (processedMessageIds.size >= MAX_PROCESSED) {
    const ids = Array.from(processedMessageIds);
    ids.slice(0, 25).forEach(id => processedMessageIds.delete(id));
  }
  
  processedMessageIds.add(messageId);
  return true;
}

/**
 * Custom adapter that uses fuzzy matching
 */
class FuzzyMatchAdapter {
  async process(request: any): Promise<{ threadId: string }> {
    const { messages, eventSource, actions } = request;
    
    // Extract the last user message and its ID
    let userQuery = '';
    let lastMessageId = '';
    for (const msg of messages) {
      // CopilotKit messages have isTextMessage() method
      if (typeof msg.isTextMessage === 'function' && msg.isTextMessage()) {
        userQuery = msg.content || '';
        lastMessageId = msg.id || '';
      }
    }
    
    console.log('[FuzzyMatchAdapter] Query:', userQuery, 'MessageId:', lastMessageId);
    
    // Check if we've already processed this exact message (prevents replay loops)
    if (lastMessageId && !shouldProcess(lastMessageId)) {
      // Return a "done" message to stop CopilotKit from retrying
      await eventSource.stream(async (eventStream$: any) => {
        const messageId = randomId();
        eventStream$.sendTextMessageStart({ messageId });
        eventStream$.sendTextMessageContent({ messageId, content: '✓ Action completed.' });
        eventStream$.sendTextMessageEnd({ messageId });
        eventStream$.complete();
      });
      return { threadId: request.threadId || randomId() };
    }
    
    console.log('[FuzzyMatchAdapter] Available actions:', actions?.map((a: any) => a.name));
    
    await eventSource.stream(async (eventStream$: any) => {
      if (!userQuery) {
        const messageId = randomId();
        eventStream$.sendTextMessageStart({ messageId });
        eventStream$.sendTextMessageContent({ 
          messageId, 
          content: 'I didn\'t receive a message. Try "increment counter" or "set theme dark".' 
        });
        eventStream$.sendTextMessageEnd({ messageId });
        eventStream$.complete();
        return;
      }
      
      // Use fuzzy matching against registered tools
      const allTools = Array.from(ToolRegistry.getAllTools().values())
        .filter(t => t.aiEnabled);
      
      const match = findBestMatch(userQuery, allTools);
      
      console.log('[FuzzyMatchAdapter] Match:', match.tool?.name, 'confidence:', match.confidence);
      
      // Require higher confidence (0.5) to execute
      // Also require query to be at least 3 chars and not just "open", "go", etc.
      const isVagueQuery = ['open', 'go', 'do', 'run', 'show', 'get'].includes(userQuery.toLowerCase().trim());
      const shouldExecute = match.tool && match.confidence >= 0.5 && !isVagueQuery;
      
      if (shouldExecute && match.tool) {
        const matchedTool = match.tool;
        const toolName = matchedTool.name || `${matchedTool.componentName}.${matchedTool.methodName}`;
        const actionExecutionId = randomId();
        const args = extractArguments(userQuery, matchedTool);
        
        console.log('[FuzzyMatchAdapter] Executing:', toolName, args);
        
        // Send action execution events
        eventStream$.sendActionExecutionStart({ actionExecutionId, actionName: toolName });
        eventStream$.sendActionExecutionArgs({ actionExecutionId, args: JSON.stringify(args) });
        eventStream$.sendActionExecutionEnd({ actionExecutionId });
        eventStream$.complete();
      } else {
        // No match - send helpful message
        const messageId = randomId();
        const availableCommands = allTools
          .flatMap(t => t.examples?.slice(0, 2) || [])
          .slice(0, 5);
        
        eventStream$.sendTextMessageStart({ messageId });
        eventStream$.sendTextMessageContent({ 
          messageId, 
          content: `I couldn't find a command for "${userQuery}". Try:\n${availableCommands.map(c => `• "${c}"`).join('\n')}` 
        });
        eventStream$.sendTextMessageEnd({ messageId });
        eventStream$.complete();
      }
    });
    
    return { threadId: request.threadId || randomId() };
  }
}

function randomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function extractArguments(query: string, tool: any): Record<string, any> {
  const args: Record<string, any> = {};
  const lowerQuery = query.toLowerCase();
  
  if (tool.inputSchema) {
    for (const [paramName, paramDef] of Object.entries(tool.inputSchema)) {
      const def = paramDef as any;
      if (def.type === 'number') {
        const numMatch = query.match(/\d+/);
        if (numMatch) args[paramName] = parseInt(numMatch[0], 10);
      } else if (def.type === 'boolean') {
        if (lowerQuery.includes('true') || lowerQuery.includes('enable')) args[paramName] = true;
        else if (lowerQuery.includes('false') || lowerQuery.includes('disable')) args[paramName] = false;
      }
    }
  }
  
  if (lowerQuery.includes('dark')) args.theme = 'dark';
  if (lowerQuery.includes('light')) args.theme = 'light';
  if (lowerQuery.includes('high')) args.priority = 'high';
  if (lowerQuery.includes('medium')) args.priority = 'medium';
  if (lowerQuery.includes('low')) args.priority = 'low';
  
  return args;
}

// Create the runtime with appropriate adapter
const runtime = new CopilotRuntime();
const adapter = useMockAI 
  ? new FuzzyMatchAdapter() as any  // Cast to any since it's a custom adapter
  : new OpenAIAdapter({ model: 'gpt-4o-mini' });

// Export the handler
export default copilotRuntimeNextJSPagesRouterEndpoint({
  runtime,
  serviceAdapter: adapter,
  endpoint: '/api/copilotkit',
});
