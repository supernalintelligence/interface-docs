/**
 * Real AI Interface for @supernal-interface/core Demo
 * 
 * This actually uses the ToolRegistry to find and execute tools.
 */

import { ToolRegistry, ToolMetadata } from "@supernal/interface/browser";
import { RuntimeTreeBuilder, NavigationGraph } from "@supernalintelligence/interface-enterprise";
import { Components } from '../architecture';
import { subscribeToStateChanges } from './UIWidgetComponents';
import { ToolManager, ToolExecutionResult } from './ToolManager';
import { NAVIGATION_TOOL_PREFIX } from './constants';
import { findBestMatch } from './fuzzyMatch';

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

export class DemoAIInterface {
  private toolExecutionListeners: Array<(result: ToolExecutionResult) => void> = [];
  
  constructor() {
    // Subscribe to state changes for real-time AI notifications
    subscribeToStateChanges((_state, _changes) => {
      // In a real implementation, this would notify the AI agent
      // For now, we just track state updates
    });
    
    // Subscribe to tool execution results from ToolManager
    ToolManager.subscribe((result) => {
      // Notify any chat interface listeners
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
      } catch {
        // Error in tool execution listener
      }
    });
  }
  
  /**
   * Extract parameters from natural language command
   * Now supports automatic trailing text extraction!
   */
  private extractParameters(query: string, tool?: ToolMetadata): { parameters: any[], parsedIntent: any } {
    const lowerQuery = query.toLowerCase().trim();
    const parameters: any[] = [];
    const parsedIntent: any = { 
      action: tool?.methodName || '', 
      target: '', 
      value: '',
      query: '',
      originalCommand: query
    };

    // NEW: Try automatic trailing text extraction first
    if (tool && tool.examples && tool.examples.length > 0) {
      console.log('🔍 [ParamExtract] Tool has examples:', tool.examples);
      const matchedExample = this.findMatchedExample(query, tool.examples);
      console.log('🔍 [ParamExtract] Matched example pattern:', matchedExample);
      
      if (matchedExample) {
        const trailingText = this.extractTrailingText(query, matchedExample);
        console.log('🔍 [ParamExtract] Extracted trailing text:', trailingText);
        
        if (trailingText) {
          parameters.push(trailingText);
          parsedIntent.query = trailingText;
          parsedIntent.value = trailingText;
          console.log('✅ [ParamExtract] Parameter extraction successful:', trailingText);
          return { parameters, parsedIntent };
        } else {
          console.warn('⚠️  [ParamExtract] Trailing text was empty after pattern match');
        }
      } else {
        console.warn('⚠️  [ParamExtract] No example pattern matched query:', query);
      }
    } else {
      console.warn('⚠️  [ParamExtract] Tool has no examples or tool is undefined');
    }

    // FALLBACK: Old hardcoded extraction for backward compatibility
    // Extract priority values
    if (lowerQuery.includes('priority')) {
      parsedIntent.action = 'setPriority';
      if (lowerQuery.includes('high')) {
        parameters.push('high');
        parsedIntent.value = 'high';
      } else if (lowerQuery.includes('medium')) {
        parameters.push('medium');
        parsedIntent.value = 'medium';
      } else if (lowerQuery.includes('low')) {
        parameters.push('low');
        parsedIntent.value = 'low';
      }
    }

    // Extract theme values
    if (lowerQuery.includes('theme')) {
      parsedIntent.action = 'setTheme';
      if (lowerQuery.includes('dark')) {
        parameters.push('dark');
        parsedIntent.value = 'dark';
      } else if (lowerQuery.includes('light')) {
        parameters.push('light');
        parsedIntent.value = 'light';
      } else if (lowerQuery.includes('auto')) {
        parameters.push('auto');
        parsedIntent.value = 'auto';
      }
    }

    // Extract status values
    if (lowerQuery.includes('status')) {
      parsedIntent.action = 'setStatus';
      if (lowerQuery.includes('active')) {
        parameters.push('active');
        parsedIntent.value = 'active';
      } else if (lowerQuery.includes('inactive')) {
        parameters.push('inactive');
        parsedIntent.value = 'inactive';
      } else if (lowerQuery.includes('pending')) {
        parameters.push('pending');
        parsedIntent.value = 'pending';
      } else if (lowerQuery.includes('disabled')) {
        parameters.push('disabled');
        parsedIntent.value = 'disabled';
      }
    }

    // Extract toggle states
    if (lowerQuery.includes('toggle')) {
      parsedIntent.value = 'toggle';
    } else if (lowerQuery.includes('enable') || lowerQuery.includes('turn on')) {
      parameters.push(true);
      parsedIntent.value = 'enable';
    } else if (lowerQuery.includes('disable') || lowerQuery.includes('turn off')) {
      parameters.push(false);
      parsedIntent.value = 'disable';
    }

    return { parameters, parsedIntent };
  }

  /**
   * Find which example pattern matched the query
   */
  private findMatchedExample(query: string, examples: string[]): string | null {
    const lowerQuery = query.toLowerCase();
    
    for (const example of examples) {
      const lowerExample = example.toLowerCase();
      
      // Remove placeholder syntax (e.g., "open blog {title}" → "open blog")
      const pattern = lowerExample.replace(/\{[^}]+\}/g, '').trim();
      
      // Check if query starts with this pattern
      if (lowerQuery.startsWith(pattern)) {
        return pattern;
      }
      
      // Also check word-by-word match (fuzzy)
      const patternWords = pattern.split(/\s+/);
      const queryWords = lowerQuery.split(/\s+/);
      
      if (patternWords.length <= queryWords.length) {
        const matches = patternWords.every((word, i) => 
          queryWords[i] === word
        );
        
        if (matches) {
          return pattern;
        }
      }
    }
    
    return null;
  }

  /**
   * Extract text that comes after the matched command
   */
  private extractTrailingText(query: string, matchedPattern: string): string {
    const lowerQuery = query.toLowerCase();
    const index = lowerQuery.indexOf(matchedPattern);
    
    if (index === -1) {
      return '';
    }
    
    // Get everything after the matched pattern
    const trailing = query.substring(index + matchedPattern.length).trim();
    
    return trailing;
  }

  /**
   * Get current container ID from page context
   */
  private getCurrentContainer(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    
    const pathname = window.location.pathname;
    if (pathname.includes('/demo/simple')) {
      return 'DemoSimple';
    } else if (pathname.includes('/demo/stateful')) {
      return 'DemoStateful';
    } else if (pathname.includes('/examples')) {
      return 'Examples';
    } else if (pathname.includes('/dashboard')) {
      return 'Dashboard';
    } else if (pathname.includes('/blog')) {
      return 'Blog';
    }
    
    return undefined;
  }

  /**
   * Try to parse ordinal/positional commands like "first blog post", "second button"
   * Returns AICommand if matched, null if no positional pattern detected
   */
  private tryPositionalMatch(query: string): AICommand | null {
    // Pattern: (first|second|third|last|1st|2nd|3rd|4th...) <element-type> [filter]
    const ordinalPattern = /(first|second|third|last|(\d+)(st|nd|rd|th)?)\s+(.+?)(?:\s+(about|with|containing)\s+(.+))?$/i;
    const match = query.match(ordinalPattern);
    
    if (!match) return null;
    
    const position = match[1] || (match[2] ? parseInt(match[2], 10) : null);
    const elementType = match[4].trim();
    const filter = match[6]?.trim();
    
    console.log(`🔍 [Positional] Detected: position="${position}", type="${elementType}", filter="${filter || 'none'}"`);
    
    // Map element types to testid patterns
    const testIdPatterns: Record<string, string> = {
      'blog post': 'blog-post-link',
      'blog': 'blog-post-link',
      'post': 'blog-post-link',
      'example': 'example-card',
      'card': 'example-card',
      'button': 'button',
    };
    
    const testIdPattern = testIdPatterns[elementType] || null;
    if (!testIdPattern) {
      console.log(`⚠️ [Positional] Unknown element type: "${elementType}"`);
      return null;
    }
    
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.log(`⚠️ [Positional] Not in browser context`);
      return null;
    }
    
    // Find all matching elements
    const elements = Array.from(document.querySelectorAll(`[data-testid*="${testIdPattern}"]`));
    console.log(`📋 [Positional] Found ${elements.length} elements matching "${testIdPattern}"`);
    
    if (elements.length === 0) {
      return null;
    }
    
    // Apply filter if present
    let filteredElements = elements;
    if (filter) {
      filteredElements = elements.filter(el => 
        el.textContent?.toLowerCase().includes(filter.toLowerCase())
      );
      console.log(`🔍 [Positional] After filter "${filter}": ${filteredElements.length} elements`);
    }
    
    if (filteredElements.length === 0) {
      return null;
    }
    
    // Get element by position
    let targetElement: Element | undefined;
    if (typeof position === 'number') {
      targetElement = filteredElements[position - 1]; // 1-indexed for user
    } else {
      switch (position) {
        case 'first':
          targetElement = filteredElements[0];
          break;
        case 'second':
          targetElement = filteredElements[1];
          break;
        case 'third':
          targetElement = filteredElements[2];
          break;
        case 'last':
          targetElement = filteredElements[filteredElements.length - 1];
          break;
      }
    }
    
    if (!targetElement) {
      console.log(`⚠️ [Positional] Position "${position}" out of range (${filteredElements.length} elements)`);
      return null;
    }
    
    console.log(`✅ [Positional] Found target element:`, targetElement.textContent?.substring(0, 50));
    
    // Create a synthetic tool to click the element
    const syntheticTool: ToolMetadata = {
      toolId: `positional-click-${Date.now()}`,
      name: `Click ${position} ${elementType}`,
      description: `Click the ${position} ${elementType}${filter ? ` about "${filter}"` : ''}`,
      elementId: targetElement.getAttribute('data-testid') || '',
      actionType: 'click',
      aiEnabled: true,
      requiresApproval: false,
      dangerLevel: 'safe',
      examples: [query],
      testId: targetElement.getAttribute('data-testid') || '',
      element: targetElement as HTMLElement, // Store reference
    };
    
    return {
      query,
      tool: syntheticTool,
      confidence: 0.95, // High confidence for positional matches
      requiresApproval: false,
    };
  }

  /**
   * Process natural language command and find matching tools
   * NOW USES SCOPED SEARCH for component-aware tool resolution
   */
  findToolsForCommand(query: string, currentPage?: string): AICommand {
    if (!query || typeof query !== 'string') {
      console.error('❌ [AIInterface] Invalid query:', query);
      return {
        query: query || '',
        confidence: 0,
        requiresApproval: false
      };
    }
    const lowerQuery = query.toLowerCase().trim();
    
    // NEW: Try ordinal/positional parsing first (e.g., "first blog post", "second button")
    const positionalMatch = this.tryPositionalMatch(lowerQuery);
    if (positionalMatch) {
      console.log(`🎯 [AIInterface] Positional match: ${positionalMatch.elementType} at position ${positionalMatch.position}`);
      return positionalMatch;
    }
    
    // Get current container for scoped search
    const currentContainer = this.getCurrentContainer();
    
    // NEW: Use searchScoped for component-aware tool resolution
    // This automatically prioritizes local (container-specific) tools over global tools
    const allMatchingTools = ToolRegistry.searchScoped(lowerQuery, currentContainer);
    
    // Filter to AI-enabled tools only
    let matchingTools = allMatchingTools.filter(tool => {
      if (!tool.aiEnabled) return false;
      // Always include navigation tools
      if (tool.elementId?.startsWith(NAVIGATION_TOOL_PREFIX)) return true;
      return true;
    });
    
    console.log(`🎯 [AIInterface] Scoped search (container: ${currentContainer || 'global'}): ${matchingTools.length} tools found`);
    if (matchingTools.length > 0) {
      console.log(`   Tools: ${matchingTools.map(t => t.componentName ? `${t.componentName}.${t.methodName}` : t.toolId).join(', ')}`);
    }
    
    if (matchingTools.length === 0) {
      return {
        query,
        confidence: 0,
        requiresApproval: false
      };
    }
    
    // Use shared fuzzy matching logic
    const { tool: bestTool, score: bestScore, confidence } = findBestMatch(query, matchingTools);
    
    // Log the matching process for transparency
    if (bestTool) {
      console.log(`🎯 Tool Match: ${bestTool.name} (${Math.round(confidence * 100)}% confidence)`);
      console.log(`   Score: ${bestScore}/10`);
      console.log(`   Tool Schema:`, {
        testId: bestTool.testId,
        elementType: bestTool.elementType,
        actionType: bestTool.actionType,
        dangerLevel: bestTool.dangerLevel,
        requiresApproval: bestTool.requiresApproval,
        examples: bestTool.examples
      });
    } else {
      console.log(`❌ No tool match found for: "${query}"`);
      console.log(`💡 Available commands:`, Array.from(ToolRegistry.getAllTools().values())
        .filter(t => t.aiEnabled)
        .flatMap(t => t.examples));
    }
    
    // Extract parameters from the query
    const { parameters, parsedIntent } = this.extractParameters(query, bestTool);
    
    return {
      query,
      tool: bestTool,
      confidence,
      requiresApproval: bestTool?.requiresApproval || false,
      parameters,
      parsedIntent
    };
  }
  
  
  /**
   * Execute a tool command
   */
  async executeCommand(command: AICommand, approved: boolean = false): Promise<AIResponse> {
    const timestamp = new Date().toISOString();
    
    if (!command.tool) {
      return {
        success: false,
        message: `❓ I don't understand "${command.query}". Try commands like "open menu" or "send message hello".`,
        timestamp
      };
    }
    
    if (command.tool.requiresApproval && !approved) {
      return {
        success: false,
        message: `⚠️ "${command.tool.name}" requires approval. This is a ${command.tool.dangerLevel} action.`,
        timestamp
      };
    }
    
    if (!command.tool.aiEnabled) {
      return {
        success: false,
        message: `🚫 "${command.tool.name}" is test-only and cannot be executed by AI.`,
        timestamp
      };
    }
    
    try {
      // Execute the tool by calling the actual method
      const result = await this.executeToolMethod(command.tool, command.parameters || []);
      
      return {
        success: result.success,
        message: result.message,
        executedTool: command.tool.name,
        timestamp
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Execution failed: ${error instanceof Error ? error.message : String(error)}`,
        executedTool: command.tool.name,
        timestamp
      };
    }
  }
  
  /**
   * Execute the tool - either by calling query function or triggering DOM element
   */
  private async executeToolMethod(tool: ToolMetadata, parameters: any[] = []): Promise<{ success: boolean; message: string }> {
    const startTime = Date.now();
    let result: { success: boolean; message: string };
    
    try {
      // SPECIAL CASE: Programmatic navigation tools (no DOM interaction needed)
      // Check for: navigation category OR actionType, AND has no elementId
      const isNavigationTool = ((tool as any).actionType === 'navigation' || tool.category === 'navigation') 
        && !tool.elementId;
      
      console.log(`🔍 [AIInterface] Tool execution check:`, {
        name: tool.name,
        category: tool.category,
        actionType: (tool as any).actionType,
        elementId: tool.elementId,
        isNavigationTool,
        hasInstance: !!tool.instance,
        hasMethodName: !!tool.methodName
      });
      
      if (isNavigationTool && tool.instance && tool.methodName) {
        console.log(`🗺️  [AIInterface] Executing programmatic navigation tool: ${tool.name}`);
        console.log(`🗺️  [AIInterface] Parameters:`, parameters);
        try {
          const navResult = await tool.instance[tool.methodName](...parameters);
          
          // Report navigation execution
          ToolManager.reportExecution({
            toolName: tool.name || tool.methodName,
            elementId: tool.elementId,
            actionType: 'navigation',
            success: navResult.success,
            message: navResult.message
          });
          
          return navResult;
        } catch (error) {
          const errorMsg = `Navigation failed: ${error}`;
          console.error(`❌ [AIInterface] ${errorMsg}`);
          
          ToolManager.reportExecution({
            toolName: tool.name || tool.methodName,
            elementId: tool.elementId,
            actionType: 'navigation',
            success: false,
            message: errorMsg
          });
          
          return { success: false, message: errorMsg };
        }
      }
      
      // Handle query tools (read-only, no DOM interaction)
      if (tool.category === 'content_retrieval' && !tool.elementId) {
        // Query tools are functions stored in the registry
        if (tool.method) {
          const queryResult = await tool.method(...parameters);
          result = {
            success: true,
            message: `✅ Query result: ${JSON.stringify(queryResult)}`
            };
        } else {
          result = {
              success: false, 
            message: `❌ Query tool ${tool.methodName} has no method`
            };
          }
        
        // Report query execution
        ToolManager.reportExecution({
          toolName: tool.name || tool.methodName,
          elementId: tool.elementId,
          actionType: tool.actionType,
          success: result.success,
          message: result.message
        });
        
        return result;
      }
      
      // Handle global action tools (USER_INTERACTION with no elementId - like theme tools)
      if (tool.category === 'user_interaction' && !tool.elementId && tool.method) {
        console.log(`🌐 [AIInterface] Executing global tool: ${tool.name}`);
        try {
          const actionResult = await tool.method(...parameters);
          result = actionResult;
          
          // Report execution
          ToolManager.reportExecution({
            toolName: tool.name || tool.methodName,
            elementId: tool.elementId,
            actionType: tool.actionType,
            success: result.success,
            message: result.message
          });
          
          return result;
        } catch (error) {
          const errorMsg = `Global tool execution failed: ${error}`;
          console.error(`❌ [AIInterface] ${errorMsg}`);
          
          ToolManager.reportExecution({
            toolName: tool.name || tool.methodName,
            elementId: tool.elementId,
            actionType: tool.actionType,
            success: false,
            message: errorMsg
          });
          
          return { success: false, message: errorMsg };
        }
      }
      
      // Handle positional/synthetic tools (have direct element reference)
      if ((tool as any).element) {
        const element = (tool as any).element as HTMLElement;
        console.log(`🎯 [AIInterface] Executing positional tool on element:`, element.tagName);
        
        try {
          // Scroll into view first
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await new Promise(resolve => setTimeout(resolve, 300)); // Wait for scroll
          
          // Click the element
          element.click();
          
          result = {
            success: true,
            message: `✅ Clicked ${tool.name}`
          };
          
          ToolManager.reportExecution({
            toolName: tool.name,
            elementId: tool.elementId,
            actionType: 'click',
            success: true,
            message: result.message
          });
          
          return result;
        } catch (error) {
          const errorMsg = `Positional tool execution failed: ${error}`;
          console.error(`❌ [AIInterface] ${errorMsg}`);
          
          ToolManager.reportExecution({
            toolName: tool.name,
            elementId: tool.elementId,
            actionType: 'click',
            success: false,
            message: errorMsg
          });
          
          return { success: false, message: errorMsg };
        }
      }
      
      // Handle action tools (trigger DOM elements)
      
      // Find the element - use Components map for parameter routing
      let elementId = tool.elementId;
      
      // Special handling for parameterized tools (radios, selects with multiple components)
      if (parameters.length > 0 && tool.elementId) {
        // Priority radios: map parameter to correct component name
        if (tool.elementId.includes('priority')) {
          const priorityValue = parameters[0] as 'high' | 'medium' | 'low';
          const componentKey = `Priority${priorityValue.charAt(0).toUpperCase() + priorityValue.slice(1)}Radio` as keyof typeof Components.Demo;
          if (Components.Demo[componentKey]) {
            elementId = Components.Demo[componentKey];
          }
        }
        
        // Can add more parameterized patterns here:
        // - Theme select options
        // - Status radio buttons
        // - Tab selections
        // etc.
      }
      
      let element = document.querySelector(`[data-testid="${elementId}"]`) as HTMLElement;
      
      if (!element) {
        // Navigation: Check if tool needs us to be on a different page
        if (elementId) {
          const toolContainer = RuntimeTreeBuilder.getInstance().getToolContainer(elementId);
          const currentContainer = RuntimeTreeBuilder.getInstance().getCurrentContainer();
          console.log(`🔍 [AIInterface] Element not found. Tool container: ${toolContainer}, Current: ${currentContainer}`);
          console.log(`🔍 [AIInterface] Tool elementId: ${elementId}`);
          console.log(`🔍 [AIInterface] TreeBuilder exists: ${!!RuntimeTreeBuilder}`);
          console.log(`🔍 [AIInterface] NavigationGraph exists: ${!!NavigationGraph}`);
          
          if (toolContainer && toolContainer !== currentContainer) {
            const graph = NavigationGraph.getInstance();
            console.log(`🗺️  [Navigation] Computing path from "${currentContainer}" to "${toolContainer}"`);
            const path = graph.computePath(currentContainer, toolContainer);
            console.log(`🗺️  [Navigation] Path result:`, path);
            
            if (path && path.steps.length > 0) {
              console.log(`🗺️  [Navigation] Path: ${path.steps.map(s => s.from).join(' → ')} → ${path.to}`);
              
              // Execute navigation steps by finding and executing navigation tools
              for (const step of path.steps) {
                console.log(`🗺️  [Navigation] Need to navigate to: ${step.to}`);
                
                // Find the navigation tool for this step
                // Look for tools with actionType 'navigation' that target this container
                const navToolName = `navigateTo${step.to}`;
                const navTools = Array.from(ToolRegistry.getAllTools().values())
                  .filter(t => (t as any).actionType === 'navigation' && t.methodName === navToolName);
                
                if (navTools.length > 0) {
                  const navTool = navTools[0];
                  console.log(`🗺️  [Navigation] Found navigation tool: ${navTool.name}`);
                  
                  // Execute navigation tool directly
                  if (navTool.instance && navTool.methodName) {
                    try {
                      await navTool.instance[navTool.methodName]();
                      console.log(`✅ [Navigation] Navigated to ${step.to}`);
                      await new Promise(resolve => setTimeout(resolve, 300));
                    } catch (error) {
                      console.error(`❌ [Navigation] Failed to execute nav tool: ${error}`);
                    }
                  } else {
                    console.warn(`⚠️  [Navigation] Nav tool ${navTool.name} has no instance/method`);
                  }
                } else {
                  console.warn(`⚠️  [Navigation] No navigation tool found for ${step.to}`);
                }
              }
              
              // Retry finding element
              element = document.querySelector(`[data-testid="${elementId}"]`) as HTMLElement;
              console.log(`🗺️  [Navigation] Element found after navigation:`, !!element);
            } else {
              console.log(`❌ [Navigation] No path found or path is empty`);
            }
          } else {
            console.log(`⚠️  [Navigation] Cannot navigate: toolContainer=${toolContainer}, currentContainer=${currentContainer}`);
          }
        }
      }
      
      if (!element) {
        // Check if this is a navigation tool that doesn't need the element to exist
        const isNavigationTool = (
          tool.dangerLevel === 'safe' && 
          (tool.name?.toLowerCase().includes('navigate') ||
           tool.name?.toLowerCase().includes('blog') ||
           tool.elementId?.includes('nav-'))
        );
        
        if (isNavigationTool) {
          // For navigation tools, try executing directly without requiring element presence
          console.log(`🗺️  [Navigation] Executing navigation tool without element check: ${tool.name}`);
          console.log(`🗺️  [Navigation] Parameters to pass:`, parameters);
          console.log(`🗺️  [Navigation] Method name:`, tool.methodName);
          console.log(`🗺️  [Navigation] Has instance:`, !!tool.instance);
          
          try {
            if (tool.instance && tool.methodName) {
              console.log(`🗺️  [Navigation] Calling ${tool.methodName} with params:`, parameters);
              const methodResult = await tool.instance[tool.methodName](...parameters);
              console.log(`🗺️  [Navigation] Method result:`, methodResult);
              result = methodResult || { success: true, message: `Navigated via ${tool.name}` };
              
              ToolManager.reportExecution({
                toolName: tool.name || tool.methodName,
                elementId: tool.elementId,
                actionType: tool.actionType,
                success: true,
                message: result.message
              });
              
              return result;
            }
          } catch (error) {
            result = {
              success: false,
              message: `Navigation failed: ${error}`
            };
            
            ToolManager.reportExecution({
              toolName: tool.name || tool.methodName,
              elementId: tool.elementId,
              actionType: tool.actionType,
              success: false,
              message: result.message
            });
            
            return result;
          }
        }
        
        result = {
          success: false, 
          message: `Could not find element with data-testid="${elementId}". Try navigating to the correct page first.`
        };
        
        // Report failure
        ToolManager.reportExecution({
          toolName: tool.name || tool.methodName,
          elementId: tool.elementId,
          actionType: tool.actionType,
          success: false,
          message: result.message
        });
        
        return result;
      }
      
      // Trigger the appropriate event based on element type
      if (element instanceof HTMLButtonElement) {
        element.click();
      } else if (element instanceof HTMLInputElement) {
        if (element.type === 'checkbox' || element.type === 'radio') {
          // For checkboxes and radios, click is most reliable with React
          element.click();
        } else {
          // For text inputs
          const newValue = parameters[0] ?? '';
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
          nativeInputValueSetter?.call(element, newValue);
          element.dispatchEvent(new Event('input', { bubbles: true }));
        }
      } else if (element instanceof HTMLSelectElement) {
        const newValue = parameters[0] ?? '';
        const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')?.set;
        nativeSelectValueSetter?.call(element, newValue);
        element.dispatchEvent(new Event('change', { bubbles: true }));
      } else if (element instanceof HTMLTextAreaElement) {
        const newValue = parameters[0] ?? '';
        const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
        nativeTextAreaValueSetter?.call(element, newValue);
        element.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      // Give React one tick to process the synthetic event
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Check if ToolManager received the auto-report from the HOC
      const lastReport = ToolManager.getLastReport();
      
      // Match by routed elementId (not original tool.elementId) or tool name
      if (lastReport && 
          (lastReport.elementId === elementId || lastReport.toolName === tool.name)) {
        // Clear it so next execution doesn't re-use it
        ToolManager.clearLastReport();
        
        return {
          success: lastReport.success,
          message: lastReport.message
        };
      }
      
      // Fallback if no report received (shouldn't happen with HOCs)
      result = {
        success: true,
        message: `✅ Executed ${tool.methodName}(${parameters.join(', ')})`
      };
      
      return result;
    } catch (error) {
      console.error('[AIInterface] Tool execution error:', error);
      result = {
        success: false, 
        message: `❌ Error executing tool: ${error instanceof Error ? error.message : String(error)}`
      };
      
      // Report error
      ToolManager.reportExecution({
        toolName: tool.name || tool.methodName,
        elementId: tool.elementId,
        actionType: tool.actionType,
        success: false,
        message: result.message
      });
      
      return result;
    }
  }
  
  
  /**
   * Get available commands for help
   */
  getAvailableCommands(): string[] {
    const tools = ToolRegistry.getAIEnabledTools();
    const commands: string[] = [];
    
    for (const tool of tools) {
      commands.push(...tool.examples);
    }
    
    return [...new Set(commands)].sort();
  }
  
  /**
   * Convenience method: Find and execute command with smart error feedback
   * This combines findToolsForCommand + executeCommand + error handling
   */
  async findAndExecuteCommand(
    query: string, 
    currentContainer?: string
  ): Promise<{ success: boolean; message: string; tool?: ToolMetadata }> {
    const command = this.findToolsForCommand(query);
    
    // Check if any tool was found
    if (!command.tool || command.confidence === 0) {
      // Get current container and available commands
      const containerTools = Array.from(ToolRegistry.getAllTools().values())
        .filter(t => t.aiEnabled && t.containerId === currentContainer);
      const globalTools = Array.from(ToolRegistry.getAllTools().values())
        .filter(t => t.aiEnabled && (!t.containerId || t.elementId?.startsWith(NAVIGATION_TOOL_PREFIX)));
      
      const containerExamples = containerTools.flatMap(t => t.examples?.slice(0, 2) || []);
      const globalExamples = globalTools.flatMap(t => t.examples?.slice(0, 2) || []);
      
      const errorMessage = `❓ No matching command found for "${query}".\n\n📍 Container: ${currentContainer || 'Unknown'}\n\n🎯 Local commands:\n${containerExamples.slice(0, 4).map(ex => `• "${ex}"`).join('\n')}\n\n🌐 Global commands:\n${globalExamples.slice(0, 4).map(ex => `• "${ex}"`).join('\n')}`;
      
      return {
        success: false,
        message: errorMessage
      };
    }
    
    // Execute the command
    const result = await this.executeCommand(command, true);
    return {
      ...result,
      tool: command.tool
    };
  }
  
  /**
   * Get tool statistics
   */
  getToolStats() {
    return ToolRegistry.getStats();
  }
}
