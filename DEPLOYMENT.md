# Deployment Guide - Supernal Interface Docs Site

## Vercel Deployment

### Prerequisites

1. **GitHub Personal Access Token** with `read:packages` scope
2. Token must be **authorized for `supernalintelligence` organization** (SSO)
3. Vercel project linked to GitHub repository

### Environment Variables

Required in Vercel dashboard (`Settings` → `Environment Variables`):

#### Authentication
```bash
# For GitHub Packages (CRITICAL)
NPM_TOKEN=ghp_YOUR_GITHUB_PAT_HERE
# Must have read:packages permission
# Must be SSO-authorized for supernalintelligence org

# Alternative (legacy)
GITHUB_PACKAGES_TOKEN=ghp_YOUR_GITHUB_PAT_HERE
```

#### TTS Integration
```bash
NEXT_PUBLIC_TTS_API_URL=https://tts.supernal.ai
NEXT_PUBLIC_TTS_API_KEY=sk-tts-supernal-your-key-here
```

### Common Issues

#### 1. `npm error 401 Unauthorized`

**Symptom**: 
```
npm error 401 Unauthorized - GET https://npm.pkg.github.com/download/@supernalintelligence/interface-enterprise/1.0.2/...
npm error unauthenticated: User cannot be authenticated with the token provided.
```

**Cause**: Token doesn't have permission or isn't SSO-authorized

**Fix**:
1. Go to https://github.com/settings/tokens
2. Find your token
3. Click **"Configure SSO"**
4. Click **"Authorize"** next to `supernalintelligence`
5. Update `NPM_TOKEN` in Vercel
6. Redeploy

#### 2. TypeScript Errors

**Symptom**: 
```
Type error: Cannot find module 'X' or its corresponding type declarations
```

**Fix**:
1. Test locally: `npm run build`
2. Fix import paths
3. Commit and push
4. Vercel auto-deploys

#### 3. Missing PostMetadata Type

**Symptom**:
```
Property 'tts' does not exist on type 'PostMetadata'
```

**Fix**: Already fixed in latest commit - unified types in `src/lib/content/types.ts`

### Build Process

```bash
# Vercel runs:
npm ci                    # Install with package-lock.json
npm run build            # Next.js build

# Pre-build steps:
npm run validate         # Validate "use client" directives
npm run sync:docs        # Sync story system docs (optional)
```

### File Structure

```
docs-site/
├── .npmrc                          # GitHub Packages authentication
│   └── Uses ${NPM_TOKEN} env var
├── src/lib/                        # All library code (unified)
│   ├── content/
│   │   ├── types.ts               # Unified types (Post & Doc)
│   │   ├── blog.ts                # Blog post functions
│   │   └── index.ts               # Documentation functions
│   └── svg-generator.ts           # SVG utilities
├── lib/                            # REMOVED (was duplicate)
└── tsconfig.json                   # TypeScript config
```

### Deployment Checklist

Before deploying:
- [ ] Local build passes: `npm run build`
- [ ] All imports use `src/lib/` (not `lib/`)
- [ ] Environment variables set in Vercel
- [ ] GitHub PAT has SSO authorization
- [ ] Blog posts have TTS frontmatter (if using TTS)

### Rollback

If deployment fails:

1. **Check Vercel logs** for error details
2. **Test locally**: `npm run build`
3. **Revert if needed**:
   ```bash
   git revert HEAD
   git push origin main
   ```
4. **Redeploy** from Vercel dashboard

### Production URL

https://supernal.ai (or your configured domain)

### Support

- Vercel Dashboard: https://vercel.com/supernalintelligence/interface-docs
- GitHub Repo: https://github.com/supernalintelligence/interface-docs
- GitHub Packages: https://github.com/orgs/supernalintelligence/packages

---

## Recent Fixes (2025-01-07)

### Issue: Token Authentication
- **Problem**: `npm_iWMVdUeJ...` token didn't have permissions
- **Solution**: Updated to `ghp_w2rk...` token with SSO authorization
- **Status**: ✅ Resolved

### Issue: Duplicate lib/ directories
- **Problem**: Both `lib/` and `src/lib/` existed, causing confusion
- **Solution**: Consolidated all code into `src/lib/`
- **Status**: ✅ Resolved

### Issue: Missing Types
- **Problem**: `PostMetadata` lacked `tts` field
- **Solution**: Unified types in `src/lib/content/types.ts`
- **Status**: ✅ Resolved

### Issue: Missing svg-generator
- **Problem**: Accidentally deleted during refactor
- **Solution**: Restored to `src/lib/svg-generator.ts`
- **Status**: ✅ Resolved
