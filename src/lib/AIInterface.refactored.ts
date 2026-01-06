/**
 * REFACTORED AI Interface for @supernal-interface/core Demo
 * 
 * Now uses core abstractions:
 * - ToolMatcher (pluggable matching strategies)
 * - ParameterExtractor (declarative parameter extraction)
 * - ToolExecutor (universal execution engine)
 * - SuggestionEngine ("Did You Mean?" system)
 * - LLMProvider (optional LLM integration)
 */

import { ToolRegistry, ToolMetadata } from "@supernal/interface/browser";
import { 
  ToolMatcher, 
  ParameterExtractor, 
  ToolExecutor,
  SuggestionEngine,
  LLMMatcher,
  AnthropicProvider,
  type MatchContext
} from "@supernalintelligence/interface-enterprise";
// Components available from architecture if needed
import { subscribeToStateChanges } from './UIWidgetComponents';
import { ToolManager, ToolExecutionResult } from './ToolManager';

export interface AICommand {
  query: string;
  tool?: ToolMetadata;
  confidence: number;
  requiresApproval: boolean;
  parameters?: unknown[];
  parsedIntent?: {
    action: string;
    target?: string;
    value?: string;
  };
}

export interface AIResponse {
  success: boolean;
  message: string;
  executedTool?: string;
  timestamp: string;
}

/**
 * REFACTORED: DemoAIInterface using core abstractions
 */
export class DemoAIInterface {
  private toolExecutionListeners: Array<(result: ToolExecutionResult) => void> = [];
  
  // NEW: Core abstractions
  private matcher: ToolMatcher;
  private paramExtractor: ParameterExtractor;
  private executor: ToolExecutor;
  private suggestionEngine: SuggestionEngine;
  
  constructor(options?: {
    enableLLM?: boolean;
    anthropicApiKey?: string;
  }) {
    // Initialize core abstractions
    this.matcher = new ToolMatcher();
    this.paramExtractor = new ParameterExtractor();
    this.executor = new ToolExecutor();
    this.suggestionEngine = new SuggestionEngine();
    
    // Optional: Add LLM matcher
    if (options?.enableLLM && options.anthropicApiKey) {
      const anthropicProvider = new AnthropicProvider(options.anthropicApiKey);
      const llmMatcher = new LLMMatcher(anthropicProvider);
      this.matcher.registerStrategy(llmMatcher);
    }
    
    // Subscribe to state changes
    subscribeToStateChanges((_state, _changes) => {
      // Track state updates
    });
    
    // Subscribe to tool execution results
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
   * Get current page/container context for matching
   */
  private getCurrentContext(): MatchContext {
    const pathname = window.location.pathname;
    let currentPage = 'unknown';
    let currentContainer = 'unknown';
    
    // Extract page from pathname
    if (pathname.includes('/demo/simple')) {
      currentPage = 'simple';
      currentContainer = 'DemoSimple';
    } else if (pathname.includes('/demo/stateful')) {
      currentPage = 'stateful';
      currentContainer = 'DemoStateful';
    } else if (pathname.includes('/blog')) {
      currentPage = 'blog';
      currentContainer = 'Blog';
    } else if (pathname.includes('/dashboard')) {
      currentPage = 'dashboard';
      currentContainer = 'Dashboard';
    }
    
    return {
      currentContainer,
      currentPage
    };
  }
  
  /**
   * REFACTORED: Find matching tools using ToolMatcher
   */
  async findToolsForCommand(query: string): Promise<AICommand[]> {
    console.log(`🔍 [AI] Finding tools for: "${query}"`);
    
    // Get all available tools
    const toolsMap = ToolRegistry.getAllTools();
    const allTools = Array.from(toolsMap.values());
    const context = this.getCurrentContext();
    
    // Filter tools by current container
    const contextTools = allTools.filter(tool => {
      // Allow global tools or tools in current container
      return !tool.containerId || 
             tool.containerId === context.currentContainer ||
             tool.category === 'navigation';
    });
    
    console.log(`📦 [AI] Filtered to ${contextTools.length} tools for context: ${context.currentContainer}`);
    
    // Use ToolMatcher to find matches
    const matches = await this.matcher.findMatches(query, contextTools, context, 5);
    
    // Convert to AICommand format
    const commands: AICommand[] = matches.map(match => ({
      query,
      tool: match.tool,
      confidence: match.confidence,
      requiresApproval: match.tool.dangerLevel === 'dangerous' || match.tool.dangerLevel === 'destructive',
      parameters: match.parameters || []
    }));
    
    console.log(`✅ [AI] Found ${commands.length} matching tools:`, 
      commands.map(c => `${c.tool?.name} (${c.confidence}%)`));
    
    return commands;
  }
  
  /**
   * REFACTORED: Execute a command using ToolExecutor
   */
  async executeCommand(commands: AICommand[], useFirstMatch: boolean = false): Promise<AIResponse> {
    if (commands.length === 0) {
      // Use SuggestionEngine for helpful response
      const toolsMap = ToolRegistry.getAllTools();
      const allTools = Array.from(toolsMap.values());
      const suggestions = this.suggestionEngine.getSuggestions(commands[0]?.query || '', allTools, 5);
      const suggestionText = this.suggestionEngine.formatSuggestions(suggestions);
      
      return {
        success: false,
        message: `❓ No matching command found for "${commands[0]?.query}".\n\n${suggestionText}`,
        timestamp: new Date().toISOString()
      };
    }
    
    const command = commands[0]; // Use highest confidence match
    
    if (!command.tool) {
      return {
        success: false,
        message: `❌ No tool found for command`,
        timestamp: new Date().toISOString()
      };
    }
    
    console.log(`🎯 [AI] Executing: ${command.tool.name}`);
    
    // Extract parameters using ParameterExtractor
    const extraction = await this.paramExtractor.extract(command.query, command.tool);
    const parameters = extraction.parameters.length > 0 ? extraction.parameters : command.parameters;
    
    console.log(`📋 [AI] Parameters:`, parameters);
    
    // Execute using ToolExecutor
    try {
      const result = await this.executor.execute(command.tool, parameters);
      
      // Notify ToolManager for tracking
      ToolManager.reportExecution({
        toolName: command.tool.name,
        elementId: command.tool.elementId,
        success: result.success,
        message: result.message || ''
      });
      
      return {
        success: result.success,
        message: result.success ? `✅ ${result.message}` : `❌ ${result.message}`,
        executedTool: command.tool.name,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      // Provide helpful suggestions on error
      if (errorMsg.includes('Could not find element')) {
        const toolsMap = ToolRegistry.getAllTools();
        const allTools = Array.from(toolsMap.values());
        const suggestions = this.suggestionEngine.getSuggestions(command.query, allTools, 3);
        const suggestionText = this.suggestionEngine.formatSuggestions(suggestions);
        
        return {
          success: false,
          message: `❌ ${errorMsg}\n\n${suggestionText}`,
          timestamp: new Date().toISOString()
        };
      }
      
      return {
        success: false,
        message: `❌ ${errorMsg}`,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  /**
   * CONVENIENCE: Process a text query end-to-end
   */
  async processQuery(query: string): Promise<AIResponse> {
    const commands = await this.findToolsForCommand(query);
    return this.executeCommand(commands, true);
  }
  
  /**
   * Get all available commands for help/autocomplete
   */
  getAvailableCommands(): string[] {
    const toolsMap = ToolRegistry.getAllTools();
    const allTools = Array.from(toolsMap.values());
    const context = this.getCurrentContext();
    
    // Filter by current context
    const contextTools = allTools.filter(tool => 
      !tool.containerId || 
      tool.containerId === context.currentContainer ||
      tool.category === 'navigation'
    );
    
    // Extract examples
    const commands: string[] = [];
    for (const tool of contextTools) {
      const examples = (tool as any).examples || [];
      commands.push(...examples);
    }
    
    return commands;
  }
  
  /**
   * Get suggestions for incomplete query (autocomplete)
   */
  async getSuggestions(partialQuery: string): Promise<string[]> {
    const toolsMap = ToolRegistry.getAllTools();
    const allTools = Array.from(toolsMap.values());
    const suggestions = this.suggestionEngine.getSuggestions(partialQuery, allTools, 5);
    return suggestions.map(s => s.text);
  }
}

