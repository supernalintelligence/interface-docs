# Production Features ✅

**Status**: 100% passing (7/7 tests)

These features are **production-ready** and demonstrate the universal Gherkin system in action.

## Quick Start

```bash
# Validate all production features
npx si story validate features/production/*.feature

# Generate tests
npx si generate-story-tests features/production/*.feature

# Run tests
npx playwright test tests/generated/stories/counter-basic-operations.spec.ts \
                       tests/generated/stories/chat-messages.spec.ts \
                       tests/generated/stories/blog-basic-navigation.spec.ts
```

## Features

### ✅ Counter Basic Operations (4 scenarios)
- Increment counter
- Increment three times
- Increment and decrement
- Reset counter

**Test Results**: 4/4 passing (100%)

### ✅ Chat Messages (2 scenarios)
- Send one message
- Send multiple messages

**Test Results**: 2/2 passing (100%)

### ✅ Blog Basic Navigation (1 scenario)
- View blog page

**Test Results**: 1/1 passing (100%)

## Use as Templates

These features serve as templates for writing your own. Copy and modify them for your use cases.

### Example: Create a New Feature

1. Copy a template:
```bash
cp features/production/counter-basic.feature features/production/my-feature.feature
```

2. Edit with your scenarios

3. Validate:
```bash
npx si story validate features/production/my-feature.feature
```

4. Generate and run:
```bash
npx si generate-story-tests features/production/my-feature.feature
npx playwright test tests/generated/stories/my-feature.spec.ts
```

## Pattern Reference

See [PRODUCTION_READY.md](../../../PRODUCTION_READY.md) for:
- Complete pattern reference
- Best practices
- Troubleshooting
- Blog demo guide
