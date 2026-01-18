/**
 * Demo AI Interface - uses enterprise AIInterface
 *
 * This is a thin wrapper that:
 * 1. Imports the generic AIInterface from enterprise
 * 2. Hooks into app-specific ToolManager for UI notifications
 * 3. Provides backward-compatible interface for existing code
 */

import {
  AIInterface,
  type AICommand,
  type AIResponse
} from '@supernalintelligence/interface-enterprise';
import { ToolManager, type ToolExecutionResult } from './ToolManager';

/**
 * Demo-specific AIInterface with ToolManager integration
 */
export class DemoAIInterface extends AIInterface {
  private toolExecutionListeners: Array<(result: ToolExecutionResult) => void> = [];

  constructor() {
    super();

    // Subscribe to tool execution results from ToolManager
    ToolManager.subscribe((result) => {
      this.notifyToolExecutionListeners(result);
    });
  }

  /**
   * Subscribe to tool execution results (for chat UI)
   */
  onToolExecution(callback: (result: ToolExecutionResult) => void): () => void {
    this.toolExecutionListeners.push(callback);
    return () => {
      this.toolExecutionListeners = this.toolExecutionListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners about tool execution
   */
  private notifyToolExecutionListeners(result: ToolExecutionResult) {
    this.toolExecutionListeners.forEach(listener => {
      try {
        listener(result);
      } catch (error) {
        console.error('Error in tool execution listener:', error);
      }
    });
  }

  /**
   * Find and execute command with smart error feedback (backward compatibility)
   */
  async findAndExecuteCommand(
    query: string,
    currentContainer?: string
  ): Promise<{ success: boolean; message: string; tool?: any }> {
    // The generic AIInterface automatically infers container from NavigationGraph
    // currentContainer parameter is ignored (kept for backward compatibility)
    const result = await this.processQuery(query);

    return {
      success: result.success,
      message: result.message,
      tool: result.executedTool
    };
  }
}

// Re-export types
export type { AICommand, AIResponse };
