/**
 * SIMPLIFIED Tool Provider Example
 * 
 * This demonstrates the new shorthand syntax introduced in the simplification effort.
 * Compare this with DemoWidgetProvider.ts to see the ~80% boilerplate reduction.
 * 
 * Key improvements:
 * - Just pass elementId string + minimal config
 * - Container ID inherited from @ToolProvider
 * - AI enablement inferred from method names
 * - Danger level inferred from method names
 * - Only specify what CAN'T be inferred (examples)
 */

import { ToolProvider, Tool } from "@supernalintelligence/interface-enterprise";
import { StatefulDemoNames } from '../names/StatefulDemoNames';
import { DemoContainers } from '../architecture/DemoContainers';
import type { ToolOptions } from "@supernalintelligence/interface-enterprise";

// **NEW SHORTHAND SYNTAX** - Just pass containerId string!
@ToolProvider(DemoContainers.DemoStateful.id)
export class SimplifiedDemoTools {
  private count: number = 0;

  // **ULTRA-SHORT SYNTAX** - elementId + examples only!
  // Everything else is inferred:
  // - name: "Increment Count" (from method name)
  // - category: "user_interaction" (from method name)
  // - dangerLevel: "safe" (from method name - no destructive words)
  // - aiEnabled: true (from method name - no dangerous/restricted words)
  // - containerId: "DemoStateful" (inherited from @ToolProvider)
  @Tool(StatefulDemoNames.incrementButton, {
    examples: [
      'increment the counter',
      'add one to the count',
      'increase counter'
    ]
  })
  async incrementCount(options?: ToolOptions) {
    try {
      this.count++;
      options?.onSuccess?.({ count: this.count });
      return { success: true, count: this.count };
    } catch (error) {
      options?.onError?.(error as Error);
      throw error;
    }
  }

  // Another example - still ultra-short!
  @Tool(StatefulDemoNames.decrementButton, {
    examples: [
      'decrement the counter',
      'subtract one from the count',
      'decrease counter'
    ]
  })
  async decrementCount(options?: ToolOptions) {
    try {
      this.count--;
      options?.onSuccess?.({ count: this.count });
      return { success: true, count: this.count };
    } catch (error) {
      options?.onError?.(error as Error);
      throw error;
    }
  }

  // Manual override example - you can still override inferred values if needed
  @Tool(StatefulDemoNames.resetButton, {
    examples: [
      'reset the counter',
      'set counter to zero',
      'clear the count'
    ],
    dangerLevel: 'moderate', // Override: resetting is more dangerous than incrementing
    name: 'Reset Counter to Zero' // Override: more specific name
  })
  async resetCount(options?: ToolOptions) {
    try {
      this.count = 0;
      options?.onSuccess?.({ count: this.count });
      return { success: true, count: this.count };
    } catch (error) {
      options?.onError?.(error as Error);
      throw error;
    }
  }
}

/**
 * COMPARISON NOTES:
 * 
 * OLD SYNTAX (DemoWidgetProvider.ts):
 * ```typescript
 * @Tool({
 *   elementId: StatefulDemoNames.incrementButton,
 *   containerId: DemoContainers.StatefulDemo,
 *   toolId: 'stateful-demo.increment',
 *   name: 'Increment Count',
 *   description: 'Increment the counter by 1',
 *   category: 'user_interaction',
 *   aiEnabled: true,
 *   dangerLevel: 'safe',
 *   examples: ['increment counter', 'add one'],
 *   callbacks: { storage: true }
 * })
 * async incrementCount(options?: ToolOptions) { ... }
 * ```
 * 
 * NEW SYNTAX (This file):
 * ```typescript
 * @Tool(StatefulDemoNames.incrementButton, {
 *   examples: ['increment counter', 'add one']
 * })
 * async incrementCount(options?: ToolOptions) { ... }
 * ```
 * 
 * BOILERPLATE REDUCTION: ~85%
 * - No toolId (auto-generated)
 * - No name (inferred from method name)
 * - No description (inferred from method name)
 * - No category (inferred from method name)
 * - No containerId (inherited from @ToolProvider)
 * - No aiEnabled (inferred from method name)
 * - No dangerLevel (inferred from method name)
 * - Only examples required (cannot be inferred)
 */

