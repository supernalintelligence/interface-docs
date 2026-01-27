# Integrating Content Gating into docs-site

## Overview

The blog-template package now includes built-in content gating with JWT authentication. This guide shows how to integrate it into the docs-site.

## Prerequisites

You mentioned having:
- ✅ External JWT auth system
- ✅ Externally managed users (not in database)
- ✅ JWT tokens for authentication

Perfect! The content gating system is designed for exactly this setup.

## Quick Integration Steps

### 1. Rebuild blog-template Package

```bash
cd ~/git/supernal-nova/families/supernal-tts/apps/blog-template
npm run build:lib
cd ~/git/supernal-nova/families/supernal-interface/docs-site
npm install
```

### 2. Add AuthProvider to _app.tsx

```tsx
// docs-site/src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { AuthProvider } from 'supernal-blog/lib';
import { SupernalProvider } from '@supernal/interface-nextjs';
// ... other imports

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider
      config={{
        validateToken: async (token: string) => {
          // TODO: Replace with your JWT validation logic
          // This should call your external auth system

          try {
            // Example: Verify with your auth API
            const response = await fetch('/api/auth/verify', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              return { valid: false, error: 'Token verification failed' };
            }

            const user = await response.json();
            return {
              valid: true,
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                tier: user.tier || 'free', // 'free' | 'pro' | 'enterprise'
              },
            };
          } catch (error) {
            console.error('Token validation error:', error);
            return { valid: false, error: 'Validation failed' };
          }
        },
        tokenCookieName: 'auth_token', // TODO: Update to your cookie name
        loginUrl: '/login', // TODO: Update to your login page
      }}
    >
      <SupernalProvider mode="fuzzy" glassMode={true}>
        <Component {...pageProps} />
      </SupernalProvider>
    </AuthProvider>
  );
}
```

### 3. Create Token Verification API Route

```typescript
// docs-site/src/pages/api/auth/verify.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // TODO: Replace with your JWT validation logic
    // This should call your external auth system to verify the token

    // Example placeholder response:
    // In production, this would verify the JWT and extract user info
    const user = {
      id: 'user-123',
      email: 'user@example.com',
      name: 'User Name',
      tier: 'free', // or 'pro', 'enterprise'
    };

    res.status(200).json(user);
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

### 4. Update Blog Post Frontmatter

The blog posts are in `docs-site/src/content/blog/`. Update frontmatter:

**For public posts** (keep accessible to everyone):

```yaml
---
title: My Public Post
access:
  public: true
---
```

**For premium/gated posts** (require authentication):

```yaml
---
title: Premium Guide
access:
  level: authenticated  # Requires login
  showTeaser: true
  previewLines: 3
  teaserMessage: 'Sign in to access this exclusive content'
  ctaText: 'Sign In'
  ctaUrl: '/login'
---
```

**For pro-tier content**:

```yaml
---
title: Advanced Pro Guide
access:
  level: pro
  showTeaser: true
  previewLines: 4
  teaserMessage: 'Upgrade to Pro to unlock this advanced guide'
  ctaText: 'Upgrade to Pro'
  ctaUrl: '/pricing'
---
```

### 5. Test the Integration

```bash
npm run dev
```

Then visit:
1. Public post → Should show full content
2. Gated post (not logged in) → Should show teaser with preview
3. Gated post (logged in) → Should show full content

## Your Requirements Met

You asked about integrating the blog-template and mentioned having an external JWT auth system. Here's how the solution addresses your needs:

### ✅ External JWT Auth
- Works with **any** JWT-based auth system
- No database changes needed
- Users managed externally
- Just provide a `validateToken` function

### ✅ Landing Page Integration with Teasers
- ContentGate component shows beautiful teasers
- Configurable preview length (default: 3 lines)
- Custom CTA buttons drive users to login/pricing
- Gradient fade effect for professional look

### ✅ Login-Gated Content
- Default behavior: Posts are **private** (require authentication)
- Opt-in public: Add `access: { public: true }` to make posts public
- Tiered access: Support for free, pro, enterprise tiers

### ✅ blog-template Package Integration
- Already declared as dependency in docs-site `package.json`
- Just rebuild the package and add AuthProvider
- Blog posts automatically use ContentGate component

## Configuration Options per Post

```yaml
access:
  # Quick toggle: Make post public (overrides level)
  public: false

  # Access level (default: 'authenticated')
  # Options: 'public' | 'authenticated' | 'pro' | 'enterprise'
  level: authenticated

  # Show teaser for unauthorized users (default: true)
  showTeaser: true

  # Number of preview lines (default: 3)
  previewLines: 3

  # Custom teaser message
  teaserMessage: 'Sign in to read this exclusive content'

  # Custom CTA text
  ctaText: 'Sign In'

  # Custom CTA URL (overrides default loginUrl)
  ctaUrl: '/login'
```

## What You Need to Provide

To complete the integration, you need to:

1. **JWT Token Validation Function**
   - Accepts JWT token string
   - Verifies with your external auth system
   - Returns user info (id, email, tier)

2. **Token Cookie Name**
   - What cookie name stores your JWT? (e.g., `auth_token`)

3. **Login Page URL**
   - Where to redirect users to login? (e.g., `/login`)

4. **User Tier Information**
   - How to extract tier from JWT? (e.g., custom claim `tier`)
   - Possible values: `'free'`, `'pro'`, `'enterprise'`

## Example: Custom JWT Integration

```typescript
import jwt from 'jsonwebtoken';

<AuthProvider
  config={{
    validateToken: async (token: string) => {
      try {
        // Verify JWT signature
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

        // Check expiration
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
          return { valid: false, error: 'Token expired' };
        }

        // Extract user info
        return {
          valid: true,
          user: {
            id: decoded.sub || decoded.userId,
            email: decoded.email,
            name: decoded.name,
            tier: decoded.tier || 'free',
          },
        };
      } catch (error) {
        return { valid: false, error: 'Invalid token' };
      }
    },
    tokenCookieName: 'auth_token',
    loginUrl: '/login',
  }}
>
```

## Testing Without Auth (Development)

For local testing without a full auth system:

```typescript
<AuthProvider
  config={{
    validateToken: async (token: string) => {
      // Mock validation for testing
      if (process.env.NODE_ENV === 'development') {
        return {
          valid: true,
          user: {
            id: 'dev-user',
            email: 'dev@example.com',
            name: 'Dev User',
            tier: 'pro', // Test with pro tier
          },
        };
      }
      // Real validation in production
      // ...
    },
    getToken: () => {
      if (process.env.NODE_ENV === 'development') {
        return 'dev-token'; // Mock token for testing
      }
      // Real token retrieval in production
      // ...
    },
  }}
>
```

## Migration Strategy

### Phase 1: Keep Everything Public (Backward Compatible)
```yaml
# Add to all existing posts
access:
  public: true
```

### Phase 2: Identify Premium Content
```yaml
# Mark premium content as gated
access:
  level: authenticated
  showTeaser: true
```

### Phase 3: Implement Tiers
```yaml
# Add pro/enterprise gating
access:
  level: pro
  showTeaser: true
  teaserMessage: 'Upgrade to Pro for full access'
```

## Next Steps

1. ✅ **Rebuild blog-template** - `npm run build:lib`
2. ⏳ **Implement JWT validation** - Provide validateToken function
3. ⏳ **Add AuthProvider** - Wrap app in _app.tsx
4. ⏳ **Update blog posts** - Add access control frontmatter
5. ⏳ **Test flow** - Verify teaser → login → full content

## Resources

- [AUTH_INTEGRATION.md](../../supernal-tts/apps/blog-template/AUTH_INTEGRATION.md) - Complete guide
- [CONTENT_GATING_IMPLEMENTATION.md](../../supernal-tts/apps/blog-template/CONTENT_GATING_IMPLEMENTATION.md) - Implementation details
- [example-gated-post.md](../../supernal-tts/apps/blog-template/content/blog/example-gated-post.md) - Example post

## Questions?

Let me know:
- What JWT auth system are you using?
- What cookie/header name stores your JWT token?
- How is user tier/subscription stored in JWT claims?
- Where is your login page?

I can provide specific integration code for your setup!

---

**Built with ❤️ by Supernal AI**
