/**
 * ToolTracker - Automatic Tool Execution Tracking
 *
 * Listens to existing CustomEvents dispatched by @Tool decorators
 * and tracks tool executions with duration, success/failure, and parameters.
 *
 * CustomEvents pattern: 'example-tool-{action}'
 * Detail structure: { success: boolean, method: 'ai' | 'direct', ...parameters }
 */

import { Routes } from '@/architecture/Routes';
import type { ChatBubbleVariant } from '@supernal/interface-nextjs';
import type { ToolExecutionEvent } from '../events/EventSchema';

export type TrackFunction = (event: ToolExecutionEvent) => void;

export class ToolTracker {
  private currentRoute: keyof typeof Routes;
  private currentVariant: keyof typeof ChatBubbleVariant;
  private trackFn: TrackFunction;
  private sessionId: string;
  private toolStartTimes = new Map<string, number>();
  private isInitialized = false;

  constructor(
    trackFn: TrackFunction,
    currentRoute: keyof typeof Routes,
    currentVariant: keyof typeof ChatBubbleVariant,
    sessionId: string
  ) {
    this.trackFn = trackFn;
    this.currentRoute = currentRoute;
    this.currentVariant = currentVariant;
    this.sessionId = sessionId;
  }

  /**
   * Initialize tool event listeners
   */
  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Listen for all example-tool-* events
    // We hook into the global dispatchEvent to catch all CustomEvents
    this.setupCustomEventListener();

    this.isInitialized = true;
  }

  /**
   * Update current route
   */
  setRoute(route: keyof typeof Routes): void {
    this.currentRoute = route;
  }

  /**
   * Update current variant
   */
  setVariant(variant: keyof typeof ChatBubbleVariant): void {
    this.currentVariant = variant;
  }

  /**
   * Update session ID
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  /**
   * Track tool start time (for duration calculation)
   */
  trackToolStart(toolId: string): void {
    this.toolStartTimes.set(toolId, Date.now());
  }

  /**
   * Setup listener for CustomEvents matching tool pattern
   */
  private setupCustomEventListener(): void {
    // Pattern for tool events: example-tool-{action}
    const toolEventPattern = /^example-tool-(.+)$/;

    // Hook into window.addEventListener to catch all CustomEvents
    const originalAddEventListener = window.addEventListener.bind(window);

    // Listen for specific tool events we know about
    const knownToolEvents = [
      'example-tool-increment',
      'example-tool-decrement',
      'example-tool-reset',
      'example-tool-send-message',
      'example-tool-clear-chat',
      'example-tool-change-setting',
      'example-tool-reset-settings',
      'example-tool-delete-data',
      'example-tool-fetch-items',
      'example-tool-add-item',
      'example-tool-delete-item',
    ];

    knownToolEvents.forEach((eventType) => {
      originalAddEventListener(eventType, (event: Event) => {
        const match = eventType.match(toolEventPattern);
        if (match) {
          const toolName = match[1];
          this.handleToolEvent(toolName, event as CustomEvent);
        }
      });
    });

    // Also intercept any new tool events dynamically
    // by overriding dispatchEvent temporarily during initialization
    const originalDispatchEvent = window.dispatchEvent.bind(window);
    window.dispatchEvent = (event: Event): boolean => {
      const match = event.type.match(toolEventPattern);
      if (match) {
        const toolName = match[1];
        this.handleToolEvent(toolName, event as CustomEvent);
      }
      return originalDispatchEvent(event);
    };
  }

  /**
   * Handle tool execution event
   */
  private handleToolEvent(toolName: string, event: CustomEvent): void {
    const detail = event.detail || {};

    // Extract tool ID (usually {namespace}.{toolName})
    const toolId = this.inferToolId(toolName, detail);

    // Calculate duration if we tracked start time
    const startTime = this.toolStartTimes.get(toolId);
    const duration = startTime ? Date.now() - startTime : undefined;

    // Clean up start time
    if (startTime) {
      this.toolStartTimes.delete(toolId);
    }

    // Extract method (AI-initiated vs direct user action)
    const method = detail.method || 'direct';

    // Extract success status
    const success = detail.success !== false;

    // Extract error if present
    const error = detail.error ? String(detail.error) : undefined;

    // Extract component if present
    const component = detail.component || undefined;

    // Extract parameters (exclude known fields)
    const { success: _, method: __, component: ___, error: ____, ...parameters } = detail;

    // Track the tool execution
    this.track({
      toolId,
      toolName,
      component,
      method,
      success,
      duration,
      error,
      parameters,
    });
  }

  /**
   * Infer tool ID from tool name and detail
   */
  private inferToolId(toolName: string, detail: Record<string, unknown>): string {
    // Check if detail has explicit toolId
    if (typeof detail.toolId === 'string') {
      return detail.toolId;
    }

    // Infer from tool name (map common patterns)
    const toolIdMap: Record<string, string> = {
      'increment': 'counter.increment',
      'decrement': 'counter.decrement',
      'reset': 'counter.reset',
      'send-message': 'chat.sendMessage',
      'clear-chat': 'chat.clearChat',
      'change-setting': 'settings.changeSetting',
      'reset-settings': 'settings.resetSettings',
      'delete-data': 'data.deleteData',
      'fetch-items': 'data.fetchItems',
      'add-item': 'data.addItem',
      'delete-item': 'data.deleteItem',
    };

    return toolIdMap[toolName] || toolName;
  }

  /**
   * Track tool execution event
   */
  private track(data: {
    toolId: string;
    toolName: string;
    component?: string;
    method: 'ai' | 'direct';
    success: boolean;
    duration?: number;
    error?: string;
    parameters?: Record<string, unknown>;
  }): void {
    this.trackFn({
      event: 'tool_execution',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      route: this.currentRoute,
      variant: this.currentVariant,
      toolId: data.toolId,
      toolName: data.toolName,
      component: data.component,
      method: data.method,
      success: data.success,
      duration: data.duration,
      error: data.error,
      parameters: data.parameters,
    });
  }
}
