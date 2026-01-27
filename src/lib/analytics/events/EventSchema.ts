/**
 * Event Schema - TypeScript definitions for all analytics events
 *
 * All events reference named contracts (Routes, Components, ChatBubbleVariant)
 * for type safety and consistency across the application.
 */

import type { Routes } from '@/architecture/Routes';
import type { ChatBubbleVariant } from '@supernal/interface-nextjs';

/**
 * Base event structure - all events extend this
 */
export interface BaseAnalyticsEvent {
  event: string;                    // Event name
  timestamp: number;                // Unix timestamp (milliseconds)
  sessionId: string;                // Session identifier
  userId?: string;                  // Optional user ID
  route: keyof typeof Routes;       // Current route (named contract)
  variant: keyof typeof ChatBubbleVariant; // Current chat variant
  metadata?: Record<string, unknown>; // Additional custom data
}

/**
 * Component interaction events - Track user interactions with UI elements
 */
export interface ComponentInteractionEvent extends BaseAnalyticsEvent {
  event: 'component_interaction';
  component: string;                // e.g., 'counter-increment-btn', 'chat-send-button'
  action: 'click' | 'focus' | 'blur' | 'change' | 'submit' | 'hover';
  value?: string | number | boolean; // Optional value (e.g., input value, checkbox state)
  target?: {
    tagName?: string;               // HTML tag name
    className?: string;             // CSS class names
    id?: string;                    // Element ID
  };
}

/**
 * Tool execution events - Track @Tool decorator executions
 */
export interface ToolExecutionEvent extends BaseAnalyticsEvent {
  event: 'tool_execution';
  toolId: string;                   // e.g., 'counter.increment', 'chat.sendMessage'
  toolName: string;                 // e.g., 'increment', 'sendMessage'
  component?: string;               // Associated component (from named contracts)
  method: 'ai' | 'direct';          // AI-initiated or user click
  success: boolean;                 // Execution result
  duration?: number;                // Execution time (milliseconds)
  error?: string;                   // Error message (if failed)
  parameters?: Record<string, unknown>; // Tool parameters
}

/**
 * Navigation events - Track route changes
 */
export interface NavigationEvent extends BaseAnalyticsEvent {
  event: 'navigation';
  fromRoute: keyof typeof Routes | null; // Previous route (null on initial load)
  toRoute: keyof typeof Routes;     // New route
  method: 'link' | 'router' | 'ai' | 'browser' | 'back' | 'forward'; // Navigation method
  duration?: number;                // Time spent on previous route (milliseconds)
  referrer?: string;                // Referrer URL
}

/**
 * ChatBubbleVariant change events - Track variant switching
 */
export interface VariantChangeEvent extends BaseAnalyticsEvent {
  event: 'variant_change';
  fromVariant: keyof typeof ChatBubbleVariant; // Previous variant
  toVariant: keyof typeof ChatBubbleVariant;   // New variant
  method: 'manual' | 'url' | 'storage' | 'experiment'; // How the change occurred
  experimentId?: string;            // A/B test ID (if applicable)
}

/**
 * Page view events - Track initial page loads
 */
export interface PageViewEvent extends BaseAnalyticsEvent {
  event: 'page_view';
  title: string;                    // Page title
  referrer?: string;                // Referrer URL
  landingPage?: boolean;            // Is this the first page view in session?
}

/**
 * User engagement events - Track scroll depth and time on site
 */
export interface EngagementEvent extends BaseAnalyticsEvent {
  event: 'engagement';
  type: 'scroll' | 'time' | 'visibility' | 'exit';
  value: number;                    // Depth (%), time (ms), or visibility (%)
  target?: string;                  // Target element (for scroll to specific section)
}

/**
 * Feedback submission events - Track user feedback
 */
export interface FeedbackEvent extends BaseAnalyticsEvent {
  event: 'feedback_submitted' | 'component_feedback' | 'nps_score' | 'rating';
  feedbackType?: 'bug' | 'feature' | 'question' | 'general'; // For feedback_submitted
  helpful?: boolean;                // For component_feedback (thumbs up/down)
  score?: number;                   // For nps_score (0-10) or rating (1-5)
  hasComment?: boolean;             // Whether user provided comment
  componentId?: string;             // For component_feedback
  context?: string;                 // For rating (what was rated)
}

/**
 * Cookie consent events - Track GDPR consent
 */
export interface ConsentEvent extends BaseAnalyticsEvent {
  event: 'cookie_consent';
  accepted: boolean;                // User accepted or declined
  consentType?: 'analytics' | 'marketing' | 'all'; // Type of consent
}

/**
 * Error tracking events - Track errors and exceptions
 */
export interface ErrorEvent extends BaseAnalyticsEvent {
  event: 'error';
  errorType: 'javascript' | 'network' | 'render' | 'api';
  message: string;                  // Error message
  stack?: string;                   // Stack trace
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Union type of all analytics events
 */
export type AnalyticsEvent =
  | ComponentInteractionEvent
  | ToolExecutionEvent
  | NavigationEvent
  | VariantChangeEvent
  | PageViewEvent
  | EngagementEvent
  | FeedbackEvent
  | ConsentEvent
  | ErrorEvent;

/**
 * Event type discriminator - for type narrowing
 */
export type EventType = AnalyticsEvent['event'];

/**
 * Helper type to extract event by type
 */
export type EventByType<T extends EventType> = Extract<AnalyticsEvent, { event: T }>;
