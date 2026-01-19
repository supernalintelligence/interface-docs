# Archived Files - Pre-Package Migration

**Date:** January 19, 2026
**Reason:** Migration to `@supernal/interface-nextjs` package

## What was archived

These files were moved to the `@supernal/interface-nextjs` package and are no longer needed in docs-site:

### Components (`src/components/chat/`)
- `ChatBubble.tsx` → Now in `@supernal/interface-nextjs`
- `ChatUI.tsx` → Replaced by package version
- `CopilotChatWidget.tsx` → No longer used

### Contexts (`src/contexts/`)
- `ChatInputContext.tsx` → Now in `@supernal/interface-nextjs`

### Library Files (already deleted before archiving)
- `AIInterface.ts` → Now `ChatAIInterface.ts` in package, extends enterprise
- `ToolManager.ts` → Now in package
- `FuzzyMatcher.ts` → Now in package
- `fuzzyMatch.ts` → Now `fuzzyMatchTools.ts` in package

## Package Location

All these files are now maintained in:
```
/Users/ianderrington/git/supernal-nova/families/supernal-interface/open-source/interface-nextjs/
```

## Migration Details

See:
- [SIMPLIFICATION_ROADMAP.md](../../docs/features/framework-adapters/nextjs/SIMPLIFICATION_ROADMAP.md)
- [PACKAGE_EXTRACTION_CHECKLIST.md](../../docs/features/framework-adapters/nextjs/PACKAGE_EXTRACTION_CHECKLIST.md)

## Restoration

If needed, these files can be restored from this archive or from git history:
```bash
git log --all -- src/components/chat/ChatBubble.tsx
git show COMMIT_HASH:docs-site/src/components/chat/ChatBubble.tsx
```
