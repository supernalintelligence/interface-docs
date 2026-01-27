/**
 * ComponentTracker - Automatic Component Interaction Tracking
 *
 * Uses global event delegation to track interactions with components
 * that have data-testid attributes (which already use named contracts).
 *
 * Tracks: click, focus, blur, change, submit events
 */

import { Routes } from '@/architecture/Routes';
import type { ChatBubbleVariant } from '@supernal/interface-nextjs';
import type { ComponentInteractionEvent } from '../events/EventSchema';

export type TrackFunction = (event: ComponentInteractionEvent) => void;

export class ComponentTracker {
  private currentRoute: keyof typeof Routes;
  private currentVariant: keyof typeof ChatBubbleVariant;
  private trackFn: TrackFunction;
  private sessionId: string;
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
   * Initialize global event listeners
   */
  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Click events (most common)
    document.addEventListener('click', (e) => this.handleClick(e), true);

    // Focus/blur events (for inputs)
    document.addEventListener('focus', (e) => this.handleFocus(e), true);
    document.addEventListener('blur', (e) => this.handleBlur(e), true);

    // Change events (for inputs, selects, etc.)
    document.addEventListener('change', (e) => this.handleChange(e), true);

    // Submit events (for forms)
    document.addEventListener('submit', (e) => this.handleSubmit(e), true);

    this.isInitialized = true;
  }

  /**
   * Update current route (called by NavigationTracker)
   */
  setRoute(route: keyof typeof Routes): void {
    this.currentRoute = route;
  }

  /**
   * Update current variant (called by VariantTracker)
   */
  setVariant(variant: keyof typeof ChatBubbleVariant): void {
    this.currentVariant = variant;
  }

  /**
   * Update session ID (for new sessions)
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  /**
   * Handle click events
   */
  private handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    const component = this.getComponentId(target);

    if (component) {
      this.track({
        component,
        action: 'click',
        target: this.getTargetInfo(target),
      });
    }
  }

  /**
   * Handle focus events
   */
  private handleFocus(e: Event): void {
    const target = e.target as HTMLElement;
    const component = this.getComponentId(target);

    // Only track focus on interactive elements
    if (component && this.isInteractiveElement(target)) {
      this.track({
        component,
        action: 'focus',
        target: this.getTargetInfo(target),
      });
    }
  }

  /**
   * Handle blur events
   */
  private handleBlur(e: Event): void {
    const target = e.target as HTMLElement;
    const component = this.getComponentId(target);

    if (component && this.isInteractiveElement(target)) {
      this.track({
        component,
        action: 'blur',
        target: this.getTargetInfo(target),
      });
    }
  }

  /**
   * Handle change events
   */
  private handleChange(e: Event): void {
    const target = e.target as HTMLElement;
    const component = this.getComponentId(target);

    if (component) {
      const value = this.getInputValue(target);

      this.track({
        component,
        action: 'change',
        value,
        target: this.getTargetInfo(target),
      });
    }
  }

  /**
   * Handle submit events
   */
  private handleSubmit(e: Event): void {
    const target = e.target as HTMLElement;
    const component = this.getComponentId(target);

    if (component) {
      this.track({
        component,
        action: 'submit',
        target: this.getTargetInfo(target),
      });
    }
  }

  /**
   * Get component ID from element or its parents (bubble up to 5 levels)
   */
  private getComponentId(element: HTMLElement | null): string | null {
    let current = element;
    let depth = 0;
    const maxDepth = 5;

    while (current && depth < maxDepth) {
      const testId = current.getAttribute('data-testid');
      if (testId) {
        return testId;
      }

      current = current.parentElement;
      depth++;
    }

    return null;
  }

  /**
   * Get target element information
   */
  private getTargetInfo(element: HTMLElement): {
    tagName?: string;
    className?: string;
    id?: string;
  } {
    return {
      tagName: element.tagName?.toLowerCase(),
      className: element.className,
      id: element.id || undefined,
    };
  }

  /**
   * Check if element is interactive (input, select, textarea)
   */
  private isInteractiveElement(element: HTMLElement): boolean {
    const interactiveTags = ['INPUT', 'SELECT', 'TEXTAREA'];
    return interactiveTags.includes(element.tagName);
  }

  /**
   * Get value from input element
   */
  private getInputValue(element: HTMLElement): string | number | boolean | undefined {
    if (element instanceof HTMLInputElement) {
      if (element.type === 'checkbox' || element.type === 'radio') {
        return element.checked;
      }
      return element.value;
    }

    if (element instanceof HTMLSelectElement) {
      return element.value;
    }

    if (element instanceof HTMLTextAreaElement) {
      return element.value;
    }

    return undefined;
  }

  /**
   * Track component interaction event
   */
  private track(data: {
    component: string;
    action: 'click' | 'focus' | 'blur' | 'change' | 'submit';
    value?: string | number | boolean;
    target?: { tagName?: string; className?: string; id?: string };
  }): void {
    this.trackFn({
      event: 'component_interaction',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      route: this.currentRoute,
      variant: this.currentVariant,
      component: data.component,
      action: data.action,
      value: data.value,
      target: data.target,
    });
  }
}
