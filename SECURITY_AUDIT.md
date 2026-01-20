# Security Audit - Docs Site

**Last Updated**: 2025-01-07

## Summary

- ✅ **1 High severity vulnerability** - Fixed (`@modelcontextprotocol/sdk`)
- ⚠️ **6 Moderate severity vulnerabilities** - No fix available (dependencies)

## Resolved

### ✅ MCP SDK ReDoS Vulnerability (HIGH)
- **Package**: `@modelcontextprotocol/sdk < 1.25.2`
- **Issue**: ReDoS vulnerability ([GHSA-8r9q-7v3j-jr4g](https://github.com/advisories/GHSA-8r9q-7v3j-jr4g))
- **Fix**: Updated to `@modelcontextprotocol/sdk@1.25.2`
- **Status**: ✅ Resolved via `npm audit fix`

## Remaining (No Fix Available)

### ⚠️ Prototype Pollution in extend (MODERATE)
- **Package**: `extend < 2.0.2`
- **Issue**: Prototype Pollution ([GHSA-qrmc-fj45-qfc2](https://github.com/advisories/GHSA-qrmc-fj45-qfc2))
- **Used by**: `geopattern` (blog card background generation)
- **Status**: No fix available
- **Risk Assessment**: Low impact - only used for generating SVG backgrounds
- **Mitigation**: Monitoring for updates to `geopattern`

### ⚠️ PrismJS DOM Clobbering (MODERATE)
- **Package**: `prismjs < 1.30.0`
- **Issue**: DOM Clobbering vulnerability ([GHSA-x7hr-w5r2-h6wg](https://github.com/advisories/GHSA-x7hr-w5r2-h6wg))
- **Used by**: `@copilotkit/react-ui` → `react-syntax-highlighter` → `refractor` → `prismjs`
- **Status**: Fix requires breaking change to `@copilotkit/react-ui`
- **Risk Assessment**: Low impact - syntax highlighting only
- **Mitigation**: 
  - Monitoring for `@copilotkit` updates
  - Can force update with `npm audit fix --force` if needed (breaking change)

## Updated Packages

### Minor/Patch Updates (Safe)
- ✅ `framer-motion`: `12.24.7` → `12.24.10`
- ✅ `lucide-react`: `0.561.0` → `0.562.0`
- ✅ `@modelcontextprotocol/sdk`: Updated to `1.25.2`

### Available Major Updates (Not Applied)
- ⏳ `next`: `15.5.9` → `16.1.1` (major - requires testing)
- ⏳ `tailwindcss`: `3.4.19` → `4.1.18` (major - breaking changes)
- ⏳ `eslint`: `8.57.1` → `9.39.2` (major - config changes)

## Recommendations

1. **Monitor Dependencies**
   - Watch for `geopattern` updates (fixes `extend` vulnerability)
   - Watch for `@copilotkit` updates (fixes `prismjs` vulnerability)

2. **Consider Alternatives**
   - Replace `geopattern` with custom SVG generator (low priority)
   - Replace `@copilotkit` or update when non-breaking fix available

3. **Major Version Updates**
   - Plan Next.js 16 upgrade (test thoroughly)
   - Plan Tailwind CSS 4 upgrade (breaking changes)
   - Plan ESLint 9 upgrade (config format change)

## Testing

```bash
# Check for new vulnerabilities
npm audit

# Check for outdated packages
npm outdated

# Test build after updates
npm run build

# Run full test suite
npm test
```

## Next Audit Date

**2025-02-07** (Monthly review)

