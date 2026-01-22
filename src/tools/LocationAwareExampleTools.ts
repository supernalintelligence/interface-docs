/**
 * Location-Aware Example Tools
 *
 * Demonstrates the NEW unified scoping system with @LocationScope decorator.
 * These tools showcase advanced location-based filtering beyond simple containerId.
 */

import {
  Tool,
  ToolCategory,
} from "@supernalintelligence/interface-enterprise";
import { LocationScope } from "@supernal/interface/browser";

/**
 * Blog Editor Tools - Only available on blog pages with editor component
 *
 * Demonstrates @LocationScope with pages AND components filtering
 */
export class BlogEditorTools {
  @Tool({
    description: 'Save the current blog post draft',
    aiEnabled: true,
    category: ToolCategory.CONTENT_CREATION,
    examples: ['save draft', 'save post', 'save my work'],
  })
  @LocationScope({
    pages: ['/blog', '/blog/new', '/blog/edit'],
    components: ['blog-editor'], // Only when editor is mounted
  })
  async saveDraft() {
    console.log('[BlogEditorTools] Saving draft...');
    return {
      success: true,
      message: 'Draft saved successfully (demo)',
    };
  }

  @Tool({
    description: 'Publish the current blog post',
    aiEnabled: true,
    category: ToolCategory.CONTENT_CREATION,
    examples: ['publish post', 'publish blog', 'make it live'],
    dangerLevel: 'moderate',
  })
  @LocationScope({
    pages: ['/blog/edit'],
    components: ['blog-editor'],
    // Custom matcher: Only allow if user has permission
    custom: (location) => {
      // In real app, check user role from location.metadata
      // For demo, always allow
      return true;
    },
  })
  async publishPost() {
    console.log('[BlogEditorTools] Publishing post...');
    return {
      success: true,
      message: 'Post published successfully (demo)',
    };
  }
}

/**
 * Examples Page Tools - Only available on /examples page
 *
 * Demonstrates @LocationScope with single page filtering
 */
export class ExamplesPageTools {
  @Tool({
    description: 'Run all examples on the page',
    aiEnabled: true,
    category: ToolCategory.TESTING,
    examples: ['run all examples', 'test everything', 'run demos'],
  })
  @LocationScope({
    pages: ['/examples'],
  })
  async runAllExamples() {
    console.log('[ExamplesPageTools] Running all examples...');
    return {
      success: true,
      message: 'All examples executed (demo)',
    };
  }

  @Tool({
    description: 'Reset all examples to initial state',
    aiEnabled: true,
    category: ToolCategory.TESTING,
    examples: ['reset examples', 'start over', 'clear demos'],
  })
  @LocationScope({
    pages: ['/examples'],
  })
  async resetExamples() {
    console.log('[ExamplesPageTools] Resetting examples...');
    return {
      success: true,
      message: 'All examples reset (demo)',
    };
  }
}

/**
 * Global Navigation Tools - Available everywhere
 *
 * Demonstrates @LocationScope with global: true
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
    description: 'Navigate to examples page',
    aiEnabled: true,
    category: ToolCategory.NAVIGATION,
    examples: ['go to examples', 'show examples', 'examples page'],
  })
  @LocationScope({
    global: true,
  })
  async goToExamples() {
    console.log('[GlobalNavigationTools] Going to examples...');
    if (typeof window !== 'undefined') {
      window.location.href = '/examples';
    }
    return {
      success: true,
      message: 'Navigating to examples page',
    };
  }
}

// Auto-instantiate tool providers
new BlogEditorTools();
new ExamplesPageTools();
new GlobalNavigationTools();
