# Multi-Repository Development Handoff

**Date**: January 4, 2026  
**Status**: Repository structure complete, ready for publishing workflow

---

## 🎯 Overview

We've successfully split the monolithic `@supernal-interface/core` into a multi-repository structure:

- **Open-Source** (`@supernal/interface`) - PUBLIC on npm + GitHub
- **Enterprise** (`@supernal/interface-enterprise`) - PRIVATE on npm, in monorepo
- **Docs/Demo** (`interface-docs`) - PUBLIC on GitHub, deployed to Vercel

---

## 📁 Repository Structure

### Development Environment (Monorepo)

```
/Users/ianderrington/git/supernal-nova/platform/packages/@supernal-interface/
├── open-source/              (git submodule → github.com/supernalintelligence/interface)
│   ├── .git/                 (separate git repo)
│   ├── src/                  (open-source code)
│   ├── package.json          (@supernal/interface)
│   └── README.md
│
├── enterprise/               (stays in monorepo, published to npm private)
│   ├── src/                  (enterprise-only features)
│   ├── package.json          (@supernal/interface-enterprise)
│   └── README.md
│
├── docs-site/                (git submodule → github.com/supernalintelligence/interface-docs)
│   ├── .git/                 (separate git repo)
│   ├── src/                  (demo/docs site code)
│   ├── package.json          (demo dependencies)
│   └── README.md
│
├── .gitmodules               (tracks submodules)
└── enterprise/               (private code, not a submodule)
```

### Published Repos

1. **https://github.com/supernalintelligence/interface** (PUBLIC)
   - Open-source package source
   - Published to npm as `@supernal/interface`
   - Community contributions welcome

2. **https://github.com/supernalintelligence/interface-docs** (PUBLIC)
   - Documentation and demo site
   - Deployed to Vercel
   - Uses published npm packages

3. **npm: @supernal/interface-enterprise** (PRIVATE)
   - Published from monorepo `enterprise/` directory
   - Not in separate GitHub repo
   - Licensed/restricted access

---

## 🔄 Development Workflows

### Workflow 1: Making Changes to Open-Source Package

**Scenario**: Fix bug or add feature to `@supernal/interface`

```bash
# 1. Navigate to submodule
cd /Users/ianderrington/git/supernal-nova/platform/packages/@supernal-interface/open-source

# 2. Create feature branch
git checkout -b fix/component-scanner-issue

# 3. Make changes
nano src/components/ComponentScanner.ts

# 4. Test locally
npm run build
cd ../docs-site
npm run dev  # Uses local build via file: dependency

# 5. Commit to submodule
cd ../open-source
git add src/components/ComponentScanner.ts
git commit -m "fix: ComponentScanner type issue"

# 6. Push to GitHub
git push origin fix/component-scanner-issue

# 7. Create PR on GitHub
gh pr create --web

# 8. After merge, update monorepo to track new commit
cd ..
git add open-source  # Updates submodule pointer
git commit -m "chore: Update open-source submodule to latest"
git push
```

**Key Point**: Changes to `open-source/` are committed to its own repo, not the monorepo.

---

### Workflow 2: Making Changes to Enterprise Package

**Scenario**: Add enterprise-only feature

```bash
# 1. Navigate to enterprise directory (NOT a submodule)
cd /Users/ianderrington/git/supernal-nova/platform/packages/@supernal-interface/enterprise

# 2. Make changes
nano src/ai/NewAIFeature.ts

# 3. Test locally
npm run build
cd ../docs-site
npm run dev  # Uses local build

# 4. Commit to monorepo
cd ..
git add enterprise/src/ai/NewAIFeature.ts
git commit -m "feat(enterprise): Add new AI feature"
git push
```

**Key Point**: Enterprise changes are committed directly to the monorepo.

---

### Workflow 3: Making Changes to Docs/Demo Site

**Scenario**: Update documentation or demo

```bash
# 1. Navigate to submodule
cd /Users/ianderrington/git/supernal-nova/platform/packages/@supernal-interface/docs-site

# 2. Make changes
nano src/pages/index.tsx

# 3. Test locally
npm run dev

# 4. Commit to submodule
git add src/pages/index.tsx
git commit -m "docs: Update homepage content"

# 5. Push to GitHub
git push origin main

# 6. Deploy automatically via Vercel (if webhook configured)
# Or manually: vercel --prod

# 7. Update monorepo
cd ..
git add docs-site
git commit -m "chore: Update docs-site submodule"
git push
```

---

### Workflow 4: Syncing All Three Together

**Scenario**: Feature that touches all three packages

```bash
# Example: Add new decorator to open-source, use in enterprise, demo in docs

# 1. Add to open-source
cd open-source
git checkout -b feature/new-decorator
# ... make changes ...
git commit -m "feat: Add @NewDecorator"
git push origin feature/new-decorator

# 2. Add to enterprise (depends on open-source changes)
cd ../enterprise
# ... make changes ...
cd ..
git add enterprise/
git commit -m "feat(enterprise): Use @NewDecorator"

# 3. Add demo
cd docs-site
# ... make changes ...
git commit -m "docs: Demo @NewDecorator usage"
git push origin main

# 4. Sync monorepo
cd ..
git add open-source docs-site
git commit -m "feat: Complete @NewDecorator implementation across packages"
git push
```

---

## 📦 Publishing Workflow

### Publishing Open-Source to npm

```bash
cd open-source

# 1. Update version
npm version patch  # or minor, major

# 2. Build
npm run build

# 3. Test package
npm pack
tar -tzf supernal-interface-*.tgz | head -20  # Verify contents

# 4. Publish
npm publish --access public

# 5. Verify
npm view @supernal/interface

# 6. Commit version bump
git add package.json package-lock.json
git commit -m "chore: Release v1.0.1"
git push origin main

# 7. Create GitHub release
gh release create v1.0.1 --notes "Bug fixes and improvements"
```

### Publishing Enterprise to npm

```bash
cd enterprise

# 1. Ensure open-source is published and update dependency
nano package.json
# Change: "@supernal/interface": "file:../open-source"
# To: "@supernal/interface": "^1.0.1"

npm install  # Get latest from npm

# 2. Update version
npm version patch

# 3. Build and test
npm run build
npm test

# 4. Publish (private)
npm publish --access restricted

# 5. Verify
npm view @supernal/interface-enterprise

# 6. Commit
cd ..
git add enterprise/package.json enterprise/package-lock.json
git commit -m "chore(enterprise): Release v1.0.1"
git push
```

### Deploying Docs Site

```bash
cd docs-site

# 1. Update dependencies to use published packages
nano package.json
# Change: "@supernal/interface": "file:../open-source"
# To: "@supernal/interface": "^1.0.1"
# Change: "@supernal/interface-enterprise": "file:../enterprise"
# To: "@supernal/interface-enterprise": "^1.0.1"

npm install

# 2. Test with published packages
npm run build
npm run dev

# 3. Deploy to Vercel
vercel --prod

# 4. Commit dependency updates
git add package.json package-lock.json
git commit -m "chore: Use published packages v1.0.1"
git push origin main
```

---

## 🔍 Checking Status

### Check Submodule Status

```bash
cd /Users/ianderrington/git/supernal-nova/platform/packages/@supernal-interface

# View submodule status
git submodule status

# Should show:
#  0031f88... open-source (heads/main)
#  7f11d20... docs-site (heads/main)
```

### Check for Uncommitted Changes

```bash
# In monorepo root
git status

# Check each submodule
cd open-source && git status
cd ../docs-site && git status
cd ../enterprise && git status
```

### Check Published Versions

```bash
# Open-source
npm view @supernal/interface version

# Enterprise
npm view @supernal/interface-enterprise version

# Docs site
curl -s https://interface-docs.vercel.app/_next/data/*/index.json | grep version
```

---

## ⚠️ Common Pitfalls

### Pitfall 1: Forgetting to Push Submodule Changes

**Problem**: You commit to `open-source/` but forget to push

```bash
cd open-source
git commit -m "fix: Important fix"
# ❌ Forgot: git push
cd ..
git add open-source
git commit -m "Update submodule"  # ⚠️ Points to unpushed commit!
```

**Solution**: Always push submodule changes before updating monorepo

```bash
cd open-source
git push origin main  # ✅ Push first
cd ..
git add open-source
git commit -m "chore: Update open-source submodule"
```

### Pitfall 2: Using file: Dependencies in Production

**Problem**: Deploying with `file:../open-source` dependencies

```bash
# ❌ This won't work in production
{
  "dependencies": {
    "@supernal/interface": "file:../open-source"
  }
}
```

**Solution**: Use published npm versions

```bash
# ✅ For production
{
  "dependencies": {
    "@supernal/interface": "^1.0.0"
  }
}
```

### Pitfall 3: Submodule Out of Sync

**Problem**: Monorepo points to old submodule commit

```bash
# Check submodule commit
cd open-source
git log --oneline -1  # Shows: abc1234 Latest fix

cd ..
git diff open-source  # Shows submodule is behind

# ✅ Update submodule pointer
git add open-source
git commit -m "chore: Sync open-source to latest"
```

### Pitfall 4: Conflicting Changes

**Problem**: Both monorepo and submodule have changes

**Solution**: Commit submodule changes first, then monorepo

```bash
# 1. Commit submodule
cd open-source
git add .
git commit -m "fix: Issue"
git push

# 2. Then commit monorepo
cd ..
git add open-source  # Updates pointer
git commit -m "chore: Update submodule"
```

---

## 🧪 Testing Strategy

### Local Development Testing

```bash
# Test all packages locally
cd open-source && npm run build
cd ../enterprise && npm run build
cd ../docs-site && npm run build && npm run dev
```

### Pre-Publish Testing

```bash
# Test with packed npm packages
cd open-source
npm pack
cd ../docs-site
npm install ../open-source/supernal-interface-*.tgz
npm run build  # Verify builds with packed version
```

### Post-Publish Testing

```bash
# Test with published packages
cd docs-site
nano package.json  # Use published versions
npm install
npm run build
```

---

## 📋 Checklists

### Before Publishing Open-Source

- [ ] All tests passing: `npm test`
- [ ] Build successful: `npm run build`
- [ ] Version bumped: `npm version <patch|minor|major>`
- [ ] CHANGELOG updated
- [ ] README updated
- [ ] Git tag created
- [ ] Pushed to GitHub: `git push && git push --tags`

### Before Publishing Enterprise

- [ ] Open-source published to npm
- [ ] Dependency updated to published version
- [ ] All tests passing
- [ ] Build successful
- [ ] Version bumped
- [ ] License/access configured

### Before Deploying Docs

- [ ] Both packages published to npm
- [ ] Dependencies updated to published versions
- [ ] Build successful with published packages
- [ ] Environment variables configured in Vercel
- [ ] Domain/DNS configured (if custom domain)

---

## 🚀 Quick Reference Commands

```bash
# Clone with submodules (for new developer)
git clone --recurse-submodules <monorepo-url>

# Update all submodules
git submodule update --remote

# Check all submodule status
git submodule foreach 'git status'

# Push all submodules
git submodule foreach 'git push'

# Build all packages
npm run build --workspaces

# Test all packages
npm test --workspaces
```

---

## 📞 Getting Help

### For Open-Source Issues
- GitHub: https://github.com/supernalintelligence/interface/issues
- Discussions: https://github.com/supernalintelligence/interface/discussions

### For Enterprise Support
- Contact: Your account representative
- Documentation: Internal enterprise docs

### For Deployment Issues
- Vercel Dashboard: https://vercel.com/dashboard
- Check logs: `vercel logs <deployment-url>`

---

## 🔗 Related Documentation

- [REPOSITORY_SETUP_PLAN.md](./REPOSITORY_SETUP_PLAN.md) - Initial setup plan
- [REPOSITORY_STATUS.md](./REPOSITORY_STATUS.md) - Current status
- [MIGRATION_GUIDE_COMPLETE.md](./MIGRATION_GUIDE_COMPLETE.md) - Full migration guide
- [open-source/README.md](../../open-source/README.md) - Open-source package docs
- [enterprise/README.md](../../enterprise/README.md) - Enterprise package docs
- [docs-site/README.md](../../docs-site/README.md) - Demo/docs site README

---

**Last Updated**: January 4, 2026, 11:58 PM  
**Maintained By**: Supernal Intelligence Team  
**Review Cadence**: After each major change to repository structure

