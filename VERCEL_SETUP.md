# Vercel Environment Variables Required for Build

## GitHub Packages Authentication

The build requires access to private packages from GitHub Packages:
- `@supernal/interface`
- `@supernalintelligence/interface-enterprise`

### Setup in Vercel Dashboard

1. Go to Project Settings → Environment Variables
2. Add the following variables:

```
NPM_TOKEN=<your-github-packages-token>
```

Or create `.npmrc` in the project root during build (Vercel does this automatically if `NPM_TOKEN` is set).

### Alternative: Public Packages

If packages are published publicly, no authentication is needed. Otherwise, ensure `NPM_TOKEN` environment variable is set in Vercel.

## TTS API Configuration

Already configured via `.env.local`:
- `NEXT_PUBLIC_TTS_API_URL=https://tts.supernal.ai`
- `NEXT_PUBLIC_TTS_API_KEY=<your-key>`

These should also be set in Vercel Environment Variables.

