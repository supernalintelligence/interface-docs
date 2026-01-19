/**
 * Bridge @supernal-interface tools to CopilotKit
 * 
 * This hook automatically registers all AI-enabled @Tool methods
 * as CopilotKit actions, using DemoAIInterface for execution.
 * 
 * Execution flows through our existing system, preserving audit trails and
 * enabling our unique features (test generation, architecture viz, compliance).
 */

import { useCopilotAction } from '@copilotkit/react-core';
import { ToolRegistry, ToolMetadata } from "@supernal/interface/browser";
import { useEffect, useRef } from 'react';
import { DemoAIInterface } from '@supernal/interface-nextjs';

// Singleton AI interface for tool execution
let aiInterface: DemoAIInterface | null = null;

const STORAGE_KEY = 'supernal-executed-actions';
const MAX_TRACKED_IDS = 100;

function getAIInterface(): DemoAIInterface {
  if (!aiInterface) {
    aiInterface = new DemoAIInterface();
  }
  return aiInterface;
}

/**
 * Get executed action IDs from sessionStorage (persists across navigation)
 */
function getExecutedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

/**
 * Save executed action IDs to sessionStorage
 */
function saveExecutedIds(ids: Set<string>): void {
  if (typeof window === 'undefined') return;
  try {
    // Keep only the most recent IDs
    const idsArray = Array.from(ids);
    const trimmed = idsArray.slice(-MAX_TRACKED_IDS);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Check if this action has already been executed (by ID)
 * Uses sessionStorage to persist across page navigation
 */
function markExecuted(actionId: string): boolean {
  const executedIds = getExecutedIds();
  
  if (executedIds.has(actionId)) {
    console.log(`[Bridge] Skipping duplicate execution: ${actionId}`);
    return false; // Already executed
  }
  
  executedIds.add(actionId);
  saveExecutedIds(executedIds);
  return true; // OK to execute
}

/**
 * Hook to bridge @supernal-interface tools to CopilotKit
 * 
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   useSupernalToolsBridge();
 *   return <div>...</div>;
 * }
 * ```
 */
export function useSupernalToolsBridge() {
  const registeredRef = useRef(false);
  
  // Get all AI-enabled tools from our registry
  const allTools = Array.from(ToolRegistry.getAllTools().values());
  const tools = allTools.filter((t: ToolMetadata) => t.aiEnabled);
  
  // Log what we're bridging (once)
  useEffect(() => {
    if (!registeredRef.current) {
      // eslint-disable-next-line no-console
      console.log('[useSupernalToolsBridge] Bridging tools:', tools.map(t => t.name));
      // eslint-disable-next-line no-console
      console.log(`[useSupernalToolsBridge] Total: ${allTools.length} tools, ${tools.length} AI-enabled`);
      registeredRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tools.length, allTools.length]);
  
  // Register each tool as a CopilotKit action
  // Note: This violates hooks rules technically, but works because the tools array
  // is stable (same tools on every render). CopilotKit handles this pattern.
  for (const tool of tools) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCopilotAction({
      name: tool.name || `${tool.componentName}.${tool.methodName}`,
      description: tool.aiDescription || tool.description || `Execute ${tool.methodName}`,
      parameters: convertInputSchema(tool.inputSchema),
      handler: async (args: Record<string, any>, context?: { actionExecutionId?: string }) => {
        const toolName = tool.name || `${tool.componentName}.${tool.methodName}`;
        
        // Use action execution ID to prevent duplicate execution
        // CopilotKit provides this in the context
        const actionId = context?.actionExecutionId || `${toolName}-${Date.now()}`;
        
        if (!markExecuted(actionId)) {
          return `${toolName} already executed (${actionId})`;
        }
        
        console.log(`[Bridge] Executing ${toolName} (${actionId})`, args);
        
        try {
          // Use DemoAIInterface for execution (same as native chat)
          const ai = getAIInterface();
          
          // Convert args object to array for our system
          const params = Object.values(args);
          
          // Find and execute the command
          const result = await ai.findAndExecuteCommand(
            buildCommandString(tool, params),
            undefined // Let it detect current container
          );
          
          console.log(`[Bridge] ${toolName} result:`, result);
          
          // Return a simple confirmation
          return result.success ? `Done: ${toolName}` : result.message;
        } catch (error) {
          console.error(`[Bridge] ${toolName} error:`, error);
          return `Error executing ${toolName}: ${error}`;
        }
      },
    });
  }
}

/**
 * Build a natural language command string from tool and params
 * This matches what the user would type in native chat
 */
function buildCommandString(tool: ToolMetadata, params: any[]): string {
  // Use the first example as a template if available
  if (tool.examples && tool.examples.length > 0) {
    const example = tool.examples[0];
    if (params.length > 0) {
      // If example has placeholder, use it; otherwise append param
      if (example.includes('{')) {
        return example.replace(/\{[^}]+\}/, String(params[0]));
      }
      return `${example} ${params.join(' ')}`;
    }
    return example;
  }
  
  // Fallback: use method name
  if (params.length > 0) {
    return `${tool.methodName} ${params.join(' ')}`;
  }
  return tool.methodName || tool.name || 'execute';
}

/**
 * Convert our inputSchema to CopilotKit parameter format
 * 
 * Our format: { paramName: { type: 'string', description: '...', required: true } }
 * CopilotKit format: [{ name: 'paramName', type: 'string', description: '...', required: true }]
 */
function convertInputSchema(schema: Record<string, any> | undefined): any[] {
  if (!schema || Object.keys(schema).length === 0) {
    return [];
  }
  
  return Object.entries(schema).map(([name, def]) => {
    const typeDef = def as any;
    return {
      name,
      type: typeDef.type || 'string',
      description: typeDef.description || name,
      required: typeDef.required ?? false,
    };
  });
}

// Legacy export for backwards compatibility
export const useSupernalTools = useSupernalToolsBridge;
