# Content Gating Integration with Supernal SDK

## Overview

This guide shows how to integrate the Content Gating system with your existing Supernal SDK (`@supernal/sdk-api` and `@supernal/sdk-auth`).

## Architecture

```
┌─────────────────────────────────────────┐
│ docs-site (_app.tsx)                    │
│                                         │
│  ┌─────────────────┐                   │
│  │ AuthProvider    │ ← blog-template   │
│  │  config:        │                   │
│  │   validateToken │ ← SupernalAuth    │
│  │   getToken      │ ← TokenManager    │
│  └─────────────────┘                   │
│           │                             │
│           ↓                             │
│  ┌─────────────────┐                   │
│  │ Blog Post Page  │                   │
│  │  ├─ ContentGate │ ← blog-template   │
│  │  └─ Article     │                   │
│  └─────────────────┘                   │
└─────────────────────────────────────────┘
```

## Step 1: Install Dependencies

```bash
cd ~/git/supernal-nova/families/supernal-interface/docs-site

# Rebuild blog-template with content gating
cd ~/git/supernal-nova/families/supernal-tts/apps/blog-template
npm run build:lib

# Reinstall in docs-site
cd ~/git/supernal-nova/families/supernal-interface/docs-site
npm install
```

## Step 2: Initialize Supernal SDK

Create a Supernal SDK instance for use throughout the app:

```typescript
// docs-site/src/lib/supernal-sdk.ts
import { SupernalAuth, TokenManager } from '@supernal/sdk-api';

// Initialize SupernalAuth with your configuration
export const supaernalAuth = new SupernalAuth({
  authUrl: process.env.NEXT_PUBLIC_SUPERNAL_AUTH_URL || 'https://auth.supernal.ai',
  clientId: process.env.NEXT_PUBLIC_SUPERNAL_CLIENT_ID!,
  clientSecret: process.env.SUPERNAL_CLIENT_SECRET, // Server-side only
  projectId: process.env.NEXT_PUBLIC_SUPERNAL_PROJECT_ID,
  redirectUri: process.env.NEXT_PUBLIC_SUPERNAL_REDIRECT_URI || 'https://supernal.ai/auth/callback',
  scopes: ['openid', 'email', 'profile'],
});

// Initialize TokenManager for automatic token refresh
export const tokenManager = new TokenManager(supaernalAuth);

// Export helper to get current token
export async function getAccessToken(): Promise<string | null> {
  return tokenManager.getValidToken();
}
```

## Step 3: Add Environment Variables

```bash
# docs-site/.env.local
NEXT_PUBLIC_SUPERNAL_AUTH_URL=https://auth.supernal.ai
NEXT_PUBLIC_SUPERNAL_CLIENT_ID=your_client_id
SUPERNAL_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_SUPERNAL_PROJECT_ID=your_project_id
NEXT_PUBLIC_SUPERNAL_REDIRECT_URI=https://supernal.ai/auth/callback
```

## Step 4: Integrate AuthProvider in _app.tsx

```typescript
// docs-site/src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { SupernalProvider } from '@supernal/interface-nextjs';
import { AuthProvider } from 'supernal-blog/lib';
import { supaernalAuth, tokenManager } from '@/lib/supernal-sdk';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider
      config={{
        /**
         * Validate JWT token using Supernal SDK
         */
        validateToken: async (token: string) => {
          try {
            // Use SupernalAuth.validateToken() method
            const result = await supaernalAuth.validateToken(token);

            if (!result.valid || !result.user) {
              return {
                valid: false,
                error: result.error || 'Invalid token',
              };
            }

            // Map AuthUser to ContentGate User
            return {
              valid: true,
              user: {
                id: result.user.id,
                email: result.user.email,
                name: result.user.name,
                avatar: result.user.avatar_url,

                // Map tier from project_role or custom field
                // Adjust this based on your tier storage strategy
                tier: mapRoleToTier(result.user.project_role),

                // Pass through additional claims
                claims: {
                  project_role: result.user.project_role,
                  project_permissions: result.user.project_permissions,
                  tenant_id: result.user.tenant_id,
                  is_admin: result.user.is_admin,
                  approval_status: result.user.approval_status,
                },
              },
            };
          } catch (error) {
            console.error('Token validation error:', error);
            return {
              valid: false,
              error: error instanceof Error ? error.message : 'Validation failed',
            };
          }
        },

        /**
         * Get token from TokenManager (handles automatic refresh)
         */
        getToken: async () => {
          return tokenManager.getValidToken();
        },

        /**
         * Token is stored in localStorage by TokenManager
         * Keys: supernal_access_token, supernal_refresh_token
         */
        loginUrl: '/login',
      }}
    >
      <SupernalProvider mode="fuzzy" glassMode={true}>
        <Component {...pageProps} />
      </SupernalProvider>
    </AuthProvider>
  );
}

/**
 * Helper function to map project_role to subscription tier
 * Adjust this based on how you store tier information
 */
function mapRoleToTier(
  role?: string
): 'free' | 'pro' | 'enterprise' {
  // Option 1: Map based on role
  if (role === 'owner' || role === 'admin') return 'pro';
  if (role === 'enterprise_admin') return 'enterprise';

  // Option 2: Parse tier from role string
  // if (role?.includes('pro')) return 'pro';
  // if (role?.includes('enterprise')) return 'enterprise';

  return 'free';
}
```

## Step 5: Update Blog Post Frontmatter

```yaml
# docs-site/src/content/blog/premium-post.md
---
title: Premium Content
date: '2026-01-27'
description: This content requires authentication
author: Supernal Team

# Access Control
access:
  level: authenticated  # Requires Supernal login
  showTeaser: true
  previewLines: 3
  teaserMessage: 'Sign in with your Supernal account to read more'
  ctaText: 'Sign In'
  ctaUrl: '/login'
---

Your content here...
```

## Step 6: Create Login Page (if needed)

```typescript
// docs-site/src/pages/login.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supaernalAuth, tokenManager } from '@/lib/supernal-sdk';
import { AuthFlowHandler } from '@supernal/sdk-auth';

export default function LoginPage() {
  const router = useRouter();
  const { code, state, error } = router.query;

  useEffect(() => {
    // Handle OAuth callback
    if (code) {
      handleCallback();
    }
  }, [code]);

  async function handleCallback() {
    try {
      // Exchange code for tokens
      const tokens = await supaernalAuth.exchangeCodeForToken(
        code as string,
        state as string
      );

      // Store tokens
      await tokenManager.storeTokens(tokens);

      // Redirect to original page or home
      router.push(state || '/');
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  async function handleLogin() {
    // Generate authorization URL
    const authUrl = supaernalAuth.getAuthorizationUrl(
      router.asPath // Save current page to return after login
    );

    // Redirect to Supernal auth
    window.location.href = authUrl;
  }

  if (error) {
    return <div>Login error: {error}</div>;
  }

  if (code) {
    return <div>Completing login...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Sign In</h1>
        <p className="text-gray-600 mb-8">
          Sign in with your Supernal account to access premium content
        </p>
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Sign In with Supernal
        </button>
      </div>
    </div>
  );
}
```

## Tier Mapping Strategies

### Option 1: Use `project_role` Field

```typescript
function mapRoleToTier(role?: string): 'free' | 'pro' | 'enterprise' {
  if (!role) return 'free';

  // Map role to tier
  switch (role) {
    case 'owner':
    case 'admin':
      return 'pro';
    case 'enterprise_admin':
    case 'enterprise_member':
      return 'enterprise';
    default:
      return 'free';
  }
}
```

### Option 2: Add Custom `tier` Field to AuthUser

If you control the auth service, add a `tier` field to the user object:

```typescript
// In your auth service, return:
{
  id: 'user-123',
  email: 'user@example.com',
  name: 'User Name',
  tier: 'pro', // Add this field
  project_role: 'admin'
}

// Then in validateToken:
tier: result.user.tier || 'free'
```

### Option 3: Store Tier in Organization Subscription

```typescript
// Fetch organization subscription data
const org = await api.getOrganization(result.user.tenant_id);
tier: org.subscription_data?.tier || 'free'
```

## Testing the Integration

### 1. Test Public Content

```yaml
access:
  public: true
```

✅ Should show full content without login

### 2. Test Authenticated Content

```yaml
access:
  level: authenticated
```

- ❌ Logged out → Should show teaser
- ✅ Logged in → Should show full content

### 3. Test Pro Tier Content

```yaml
access:
  level: pro
```

- ❌ Free user → Should show teaser
- ✅ Pro user → Should show full content

## Using SupernalAPI for Enhanced Features

You can use the full `SupernalAPI` for additional features:

```typescript
// docs-site/src/lib/supernal-sdk.ts
import { SupernalAPI, UserManagementAPI } from '@supernal/sdk-api';
import { supaernalAuth, tokenManager } from './supernal-sdk';

// Create API client
export const api = new UserManagementAPI({
  auth: supaernalAuth,
  tokenManager: tokenManager,
});

// Get user profile
const profile = await api.getProfile();

// Get user organizations
const orgs = await api.getOrganizations();
```

## Advanced: Dynamic Tier Loading

Load tier dynamically from API on authentication:

```typescript
validateToken: async (token: string) => {
  try {
    const result = await supaernalAuth.validateToken(token);

    if (!result.valid || !result.user) {
      return { valid: false, error: 'Invalid token' };
    }

    // Fetch tier from API
    let tier: 'free' | 'pro' | 'enterprise' = 'free';
    try {
      const profile = await api.getProfile();
      tier = profile.subscription_tier || 'free';
    } catch (error) {
      console.error('Error fetching tier:', error);
    }

    return {
      valid: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        avatar: result.user.avatar_url,
        tier,
        claims: { /* ... */ },
      },
    };
  } catch (error) {
    return { valid: false, error: 'Validation failed' };
  }
}
```

## Troubleshooting

### Token not found
**Issue**: `getValidToken()` returns `null`

**Solutions**:
1. Check localStorage keys: `supernal_access_token`, `supernal_refresh_token`
2. Verify user completed OAuth flow
3. Check token expiration

### Token validation fails
**Issue**: `validateToken()` returns `{ valid: false }`

**Solutions**:
1. Verify `NEXT_PUBLIC_SUPERNAL_AUTH_URL` is correct
2. Check token is valid JWT
3. Verify auth service is accessible

### Tier not working
**Issue**: All users show as `'free'` tier

**Solutions**:
1. Check `mapRoleToTier()` logic
2. Verify `project_role` is populated
3. Add custom `tier` field to auth service

## Summary

✅ **What we integrated:**
- Supernal SDK (`@supernal/sdk-auth`) with ContentGate
- OAuth authentication flow
- Automatic token refresh via `TokenManager`
- Token validation using `SupernalAuth.validateToken()`
- Tier mapping from `project_role` or custom field

✅ **What you need to configure:**
1. Environment variables (client ID, auth URL, etc.)
2. Tier mapping strategy (role-based or custom field)
3. Login page with OAuth flow
4. Blog post frontmatter with access control

✅ **Ready to go!**
- Content gating works with your existing auth system
- No database changes required
- Users managed externally via Supernal platform

---

**Questions?** Let me know:
- How do you currently store subscription tier?
- Do you want to use `project_role` or add a custom `tier` field?
- Should we fetch tier from organization subscription data?
