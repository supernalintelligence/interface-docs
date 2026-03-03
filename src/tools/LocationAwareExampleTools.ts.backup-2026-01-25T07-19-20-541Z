/**
 * Location-Aware Navigation Tools
 *
 * Demonstrates the NEW unified scoping system with @LocationScope decorator.
 * Uses global scoping for site-wide navigation.
 *
 * NOTE: Real widget tools (counter, chat, etc.) are in ExampleTools.ts
 * and use the OLD containerId pattern. Both patterns work together!
 */

import {
  Tool,
  ToolCategory,
} from "@supernalintelligence/interface-enterprise";
import { LocationScope } from "@supernal/interface/browser";

/**
 * Global Navigation Tools - Available everywhere
 *
 * Demonstrates @LocationScope with global: true
 * These tools work on ALL pages including landing page
 */
export class GlobalNavigationTools {
  @Tool({
    description: 'Navigate to home page',
    aiEnabled: true,
    category: ToolCategory.NAVIGATION,
    examples: ['go home', 'take me home', 'home page'],
  })
  @LocationScope({
    global: true, // Available on all pages
  })
  async goHome() {
    console.log('[GlobalNavigationTools] Going home...');
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return {
      success: true,
      message: 'Navigating to home page',
    };
  }

  @Tool({
    description: 'Navigate to demo page',
    aiEnabled: true,
    category: ToolCategory.NAVIGATION,
    examples: ['go to demo', 'show demo', 'demo page'],
  })
  @LocationScope({
    global: true,
  })
  async goToDemo() {
    console.log('[GlobalNavigationTools] Going to demo...');
    if (typeof window !== 'undefined') {
      window.location.href = '/demo';
    }
    return {
      success: true,
      message: 'Navigating to demo page',
    };
  }

  @Tool({
    description: 'Navigate to blog page',
    aiEnabled: true,
    category: ToolCategory.NAVIGATION,
    examples: ['go to blog', 'show blog', 'blog page'],
  })
  @LocationScope({
    global: true,
  })
  async goToBlog() {
    console.log('[GlobalNavigationTools] Going to blog...');
    if (typeof window !== 'undefined') {
      window.location.href = '/blog';
    }
    return {
      success: true,
      message: 'Navigating to blog page',
    };
  }
}

// Auto-instantiate tool provider
new GlobalNavigationTools();
