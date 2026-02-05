# Security Model

This document describes the authentication and authorization security model for the Supernal Dashboard.

## Core Principle: Fail Closed

The dashboard implements a **fail-closed** security model. This means:

- If authentication is misconfigured → **NO ACCESS** (redirect to error page)
- If authentication errors occur → **NO ACCESS** (redirect to error page)
- If environment variables are missing → **NO ACCESS** (build fails in production)

We **never** silently serve protected content when auth is broken. This is the opposite of "fail-open" which would serve content when auth fails (dangerous!).

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Request Flow                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Request → Middleware → Auth Check → Protected Content          │
│                 │              │                                 │
│                 │              └─→ Fail → /auth/unavailable      │
│                 │              └─→ No Session → /auth/signin     │
│                 │                                                │
│                 └─→ Auth not configured (prod) → /auth/unavailable│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Protected Routes

The following routes require authentication:

- `/dashboard` - Main dashboard
- `/admin/*` - Admin pages (future)

## Public Routes

The following routes are accessible without authentication:

- `/` - Landing page
- `/docs/*` - Documentation
- `/blog/*` - Blog
- `/examples/*` - Examples
- `/auth/*` - Authentication pages

## Configuration

### Required Environment Variables

| Variable | Description | How to Generate |
|----------|-------------|-----------------|
| `AUTH_SECRET` | Encrypts session cookies | `openssl rand -base64 32` |
| `GITHUB_CLIENT_ID` | GitHub OAuth App ID | Create at github.com/settings/developers |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Secret | From OAuth App settings |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ALLOWED_EMAILS` | Comma-separated allowlist | All authenticated users |

## Security Layers

### 1. Build-time Validation

In `next.config.js`, we validate that all required auth variables are set before the build proceeds. A production build without auth configured will **fail**.

```javascript
// next.config.js
if (isProduction) {
  const missing = REQUIRED_AUTH_VARS.filter(v => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(`Missing auth variables: ${missing.join(', ')}`);
  }
}
```

### 2. Middleware Protection

The middleware (`middleware.ts`) runs on every request to protected routes:

1. Checks if auth is configured
2. If not configured in production → redirect to `/auth/unavailable`
3. Checks for valid session cookie
4. If no session → redirect to `/auth/signin`
5. If any error → redirect to `/auth/unavailable` (fail closed)

### 3. Server-side Verification

Protected pages use `getServerSideProps` for additional server-side auth checks:

```typescript
export const getServerSideProps = async (context) => {
  try {
    const session = await getSession();
    if (!session) {
      return { redirect: { destination: '/auth/signin' } };
    }
    return { props: { user: session.user } };
  } catch (error) {
    // FAIL CLOSED: Any error = no access
    return { redirect: { destination: '/auth/unavailable' } };
  }
};
```

### 4. Allowlist (Optional)

If `ALLOWED_EMAILS` is set, only those specific email addresses can access. Others are redirected to `/auth/unauthorized`.

## Auth Pages

| Path | Purpose |
|------|---------|
| `/auth/signin` | GitHub OAuth sign-in |
| `/auth/signout` | Sign out (via API) |
| `/auth/error` | OAuth errors (user-facing) |
| `/auth/unavailable` | System-level auth failures |
| `/auth/unauthorized` | User not in allowlist |

## Testing Auth Failures

To verify fail-closed behavior:

```bash
# 1. Remove auth env vars
unset GITHUB_CLIENT_ID
unset GITHUB_CLIENT_SECRET
unset AUTH_SECRET

# 2. Try to access dashboard
curl -I http://localhost:3000/dashboard
# Should redirect to /auth/unavailable

# 3. Try production build (should FAIL)
NODE_ENV=production npm run build
# Should exit with error
```

## Common Issues

### "Authentication Unavailable" in production

Missing one or more of:
- `AUTH_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

Check your deployment platform's environment variable configuration.

### "Access Denied" after sign-in

If `ALLOWED_EMAILS` is configured, your email isn't in the list. Ask an admin to add you.

### OAuth callback errors

Verify your GitHub OAuth App callback URL matches your deployment:
- Local: `http://localhost:3000/api/auth/callback/github`
- Production: `https://your-domain.com/api/auth/callback/github`

## Security Audit Checklist

- [ ] `AUTH_SECRET` is random (32+ bytes)
- [ ] GitHub OAuth App callback URLs are correct
- [ ] `ALLOWED_EMAILS` is configured for internal/private dashboards
- [ ] Production build fails without auth vars
- [ ] Protected routes redirect to signin when not authenticated
- [ ] Errors redirect to /auth/unavailable, not to content
