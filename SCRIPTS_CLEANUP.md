# Scripts Cleanup - Migration to SI CLI

**Date**: 2026-01-06  
**Status**: ✅ Complete

---

## Summary

Migrated test generation and benchmarking scripts to the new `si` CLI. Old scripts removed, package.json updated with new commands.

---

## Scripts Removed

### Replaced by `si` CLI:
1. ✅ **`dogfood-generate-tests.ts`**
   - **Replaced by**: `si generate-tests`
   - **New command**: `npm run si:generate-tests`
   
2. ✅ **`benchmark-story-cache.ts`**
   - **Replaced by**: `si benchmark-cache`
   - **New command**: `npm run si:benchmark`

### Already Disabled (Cleaned up):
3. ✅ **`generate-tests.ts.disabled`** - Old test generator
4. ✅ **`generate-story-tests.ts.disabled`** - Old story test generator

### Temporary Files (Cleaned up):
5. ✅ **`_DEPRECATED_benchmark.ts`** - Deprecation wrapper
6. ✅ **`_DEPRECATED_generate-tests.ts`** - Deprecation wrapper

---

## Remaining Scripts (Project-Specific)

These scripts are **kept** because they're project-specific, not library features:

- ✅ **`dev-server.js`** - Custom Next.js dev server
- ✅ **`sync-docs.ts`** - Syncs docs from other packages
- ✅ **`validate-client-directives.ts`** - Next.js client directive validation
- ✅ **`test-tools.js`** - Test runner wrapper
- ✅ **`update-tests.js`** - Test updates
- ✅ **`find-port.js`**, **`get-port.js`** - Port utilities

---

## New package.json Scripts

### Contract Generation
```json
{
  "contracts:routes": "si scan-routes --pages src/pages --output src/architecture/Routes.ts",
  "contracts:names": "si scan-names --components src/components --output src/architecture/Components.ts",
  "contracts:all": "npm run contracts:routes && npm run contracts:names",
  "contracts:watch": "si scan-routes --watch & si scan-names --watch"
}
```

### Test Generation & Validation
```json
{
  "si:generate-tests": "si generate-tests --output tests/generated --routes src/architecture/Routes.ts --names src/architecture/Components.ts --include-e2e",
  "si:validate": "si validate --routes src/architecture/Routes.ts --names src/architecture/Components.ts --tools"
}
```

### Benchmarking
```json
{
  "si:benchmark": "si benchmark-cache --runs 5 --output benchmark-results.json"
}
```

---

## Migration Commands

### Before (Old Scripts)
```bash
# Old way
tsx scripts/dogfood-generate-tests.ts
tsx scripts/benchmark-story-cache.ts
```

### After (SI CLI)
```bash
# New way (direct)
si generate-tests --include-e2e
si benchmark-cache --runs 5

# Or via package.json
npm run si:generate-tests
npm run si:benchmark
npm run si:validate
```

---

## Benefits of Migration

### ✅ Portability
- Old scripts: Hardcoded to docs-site
- SI CLI: Works in **any** project

### ✅ Maintainability
- Old scripts: Duplicated logic
- SI CLI: Single source of truth in `@supernal-interface/cli`

### ✅ Discoverability
- Old scripts: Hidden in `scripts/` folder
- SI CLI: `si --help` shows all commands

### ✅ Documentation
- Old scripts: Comments in files
- SI CLI: Full README with examples

### ✅ Standardization
- Old scripts: Inconsistent patterns
- SI CLI: Follows CLI-COMMAND-PATTERN.md

---

## Verification

All new commands tested and working:

```bash
$ si --help
✅ Shows all 5 commands

$ si scan-routes --pages src/pages --output src/architecture/Routes.ts
✅ Generated 15 routes

$ si validate --routes src/architecture/Routes.ts --names src/architecture/Components.ts
✅ Routes valid (15 routes)
✅ Names valid (47 components)
```

---

## Next Steps

1. ✅ **Scripts removed** - Complete
2. ✅ **package.json updated** - Complete
3. ⏭️ **Publish CLI** - Ready for npm publish
4. ⏭️ **Integrate with `sc`** - Add to supernal-coding deps

---

**Completed**: 2026-01-06  
**Scripts Removed**: 6  
**Scripts Kept**: 7  
**New Commands Added**: 7

