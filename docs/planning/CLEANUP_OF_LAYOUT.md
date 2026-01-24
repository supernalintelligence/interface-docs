DemoLayout Component: Delete ✅
DemoLayout is only used by the separate pages we're deleting. Remove it entirely.

Implementation Steps
Step 1: Delete Separate Demo Pages
Remove these files completely:

docs-site/src/pages/demo/simple.tsx
docs-site/src/pages/demo/stateful.tsx
docs-site/src/pages/demo/hierarchical.tsx
docs-site/src/pages/demo/advanced.tsx
Step 2: Delete DemoLayout Component
docs-site/src/components/DemoLayout.tsx (or wherever it lives)
Remove all imports of DemoLayout
Step 3: Update Main Demo Page (Zero-Config, No Containers)
Modify docs-site/src/pages/demo/index.tsx:

CRITICAL: Do NOT use useContainer() calls anywhere

Remove any existing useContainer() calls from the demo page (currently line 65)

Add new sections after existing #advanced section:


{/* PATTERNS: Simple/Stateful/Hierarchical */}
<motion.section id="simple" className="mb-16 scroll-mt-20">
  {/* Simple pattern content with InteractiveWidgets */}
  {/* NO useContainer() call - zero-config inference */}
</motion.section>

<motion.section id="stateful" className="mb-16 scroll-mt-20">
  {/* Stateful pattern content with InteractiveWidgets */}
  {/* NO useContainer() call - zero-config inference */}
</motion.section>

<motion.section id="hierarchical" className="mb-16 scroll-mt-20">
  {/* Hierarchical pattern content */}
  {/* NO useContainer() call - zero-config inference */}
</motion.section>
Add navigation buttons for these sections (alongside existing #beginner, #intermediate, #advanced):


<a href="#simple" className="px-5 py-2.5 bg-slate-700...">
  Simple Pattern
</a>
<a href="#stateful" className="px-5 py-2.5 bg-slate-700...">
  Stateful Pattern
</a>
<a href="#hierarchical" className="px-5 py-2.5 bg-slate-700...">
  Hierarchical Pattern
</a>
Preserve content from separate pages:

Simple page description: "Uses HOCs with callbacks. State is NOT persistent."
Stateful page description: "Uses ComponentState helpers. State PERSISTS via localStorage."
Include InteractiveWidgets and ToolList in each section
Apply different color themes (blue for simple, green for stateful, etc.)
Update tool filtering for ToolList components:

Remove container-based filtering
Rely on ExposureCollector automatic filtering
Tools will automatically appear/disappear based on element visibility
Step 4: Update Routes Contract
Run si scan-routes to regenerate Routes.ts. It should remove:

DemoSimple: '/demo/simple'
DemoStateful: '/demo/stateful'
DemoHierarchical: '/demo/hierarchical'
DemoAdvanced: '/demo/advanced'
Only Demo: '/demo' should remain.

Step 5: DemoContainers - May Need Cleanup
DemoContainers.ts may need cleanup:

Option A: Keep for documentation/reference

Containers can stay as metadata/documentation
BUT they should NOT be used in @Tool({ containerId: ... })
They're just descriptive, not functional
Option B: Remove entirely

If containers aren't used anywhere after cleanup, delete them
Zero-config inference doesn't need container definitions
Decision: Check after Step 6 (removing containerId from tools). If no code references DemoContainers anymore, consider removing the file.

Step 6: Remove containerId from ALL Demo Tools
Based on FINISHING_LOCATION_CONTEXT.md - CRITICAL

Remove containerId from all tool decorators:

Files to update:

docs-site/src/lib/DemoWidgetProvider.ts
docs-site/src/lib/UIWidgetComponents.tsx
docs-site/src/tools/ExampleTools.ts
Any other files with @Tool or @ToolProvider decorators
Pattern to apply:


// BEFORE:
@Tool({
  elementId: Components.Demo.IncrementButton,
  containerId: DemoContainers.Demo.route,  // ❌ DELETE THIS
})
async increment() { }

// AFTER:
@Tool({
  elementId: Components.Demo.IncrementButton,  // ✅ Only elementId
})
async increment() { }
Verification:


# Ensure no containerId remains in demo tools:
grep -r "containerId:" docs-site/src/lib/
grep -r "containerId:" docs-site/src/tools/
Step 6a: Verify ExposureCollector → LocationContext Integration
Check if FINISHING_LOCATION_CONTEXT.md changes are already implemented:

Verify open-source/src/exposure/ExposureCollector.ts has:

Import for LocationContext
syncToLocationContext() method
Call to syncToLocationContext() in updateToolState()
Verify docs-site/src/pages/_app.tsx has:

ExposureCollector initialization
Tool registration on mount
If missing, implement as per FINISHING_LOCATION_CONTEXT.md

Step 7: Clean Up Tests
Delete these test files (they test non-existent routes):

docs-site/tests/e2e/demo-routes.spec.ts - Tests /demo/simple, /demo/stateful routes
References to /demo/simple in docs-site/tests/basic-functionality.spec.ts
References to DemoSimple scoping in docs-site/tests/scoping.test.ts
docs-site/tests/navigation-debug.spec.ts - References /demo/simple
Update remaining tests to:

Navigate to /demo only
Test sections via # anchor navigation if needed
Step 8: Clean Up Stories & Features
Delete these files:

docs-site/stories/simple-demo.story.ts - Mislabeled, navigates to wrong page
docs-site/features/archive/simple-demo.feature - Archived, no longer relevant
All generated tests in docs-site/tests/generated/stories/ with TODO placeholders:
simple-interface-demo.spec.ts
counter-tools-demo.spec.ts
complete-interface-demo.spec.ts
Any others referencing /demo/simple or separate demo routes
Step 9: Verify & Validate
Run si scan-routes --pages src/pages --output src/architecture/Routes.ts
Run si validate --all
Check for broken imports: grep -r "demo/simple" docs-site/src/
Check for broken links: grep -r "/demo/simple" docs-site/
Run npm test
Run npx playwright test
Manually test /demo page navigation
File Change Summary
Files to DELETE (11 files)
docs-site/src/pages/demo/simple.tsx
docs-site/src/pages/demo/stateful.tsx
docs-site/src/pages/demo/hierarchical.tsx
docs-site/src/pages/demo/advanced.tsx
docs-site/src/components/DemoLayout.tsx (if exists)
docs-site/tests/e2e/demo-routes.spec.ts
docs-site/tests/navigation-debug.spec.ts
docs-site/stories/simple-demo.story.ts
docs-site/features/archive/simple-demo.feature
docs-site/tests/generated/stories/simple-interface-demo.spec.ts
Other generated test files with TODOs
Files to MODIFY (3 files)
docs-site/src/pages/demo/index.tsx - Add #simple, #stateful, #hierarchical sections
docs-site/tests/basic-functionality.spec.ts - Remove /demo/simple references
docs-site/tests/scoping.test.ts - Update to test container scoping within /demo page
Files to REGENERATE (1 file)
docs-site/src/architecture/Routes.ts - Via si scan-routes
Verification Checklist
After implementation:

 /demo page loads successfully
 All sections visible: #beginner, #intermediate, #advanced, #simple, #stateful, #hierarchical
 Navigation buttons work for all sections
 InteractiveWidgets function in each pattern section
 NO useContainer() calls in demo page code
 NO containerId in any @Tool decorators - verify with grep
 Tools automatically available based on visible elements (zero-config)
 ExposureCollector → LocationContext integration working
 Scrolling reveals/hides tools automatically
 No 404 errors when navigating
 No broken imports in codebase
 si validate --all passes
 Routes.ts only contains Demo: '/demo'
 All tests pass
 No references to deleted routes remain
