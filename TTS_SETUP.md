# TTS Widget Setup

## Status
✅ **Configured** - Ready for production deployment

## Configuration

### Environment Variables (`.env.local`)
```bash
NEXT_PUBLIC_TTS_API_URL=https://tts.supernal.ai
NEXT_PUBLIC_TTS_API_KEY=sk-tts-ianceo-a75d732272536120d93c85e8cfdf178d
```

### Components
- **`TTSInitializer.tsx`**: Global TTS widget initialization (rendered in `_app.tsx`)
- **Blog posts**: Include `tts` frontmatter configuration

### Frontmatter Example
```yaml
---
title: "Blog Post Title"
tts:
  enabled: true
  voice: "alloy"
  voices: ["alloy", "echo", "fable", "nova", "onyx", "shimmer"]
  enableSpeed: true
  enableProgress: true
---
```

### Content Rendering
Blog posts must include these attributes on the content container:
```tsx
<div
  className="supernal-tts-widget"
  data-text={post.content}
  data-voice={post.metadata.tts?.voice}
  data-voices={post.metadata.tts?.voices?.join(',')}
  data-provider={post.metadata.tts?.provider}
  data-speed={post.metadata.tts?.speed}
  dangerouslySetInnerHTML={{ __html: post.html }}
/>
```

## Local Development Limitation

**CORS Issue on Localhost**: The TTS API (`tts.supernal.ai`) only allows CORS from production domains, not `localhost:3011`.

**To test TTS locally**, you need to either:
1. Add `http://localhost:3011` to the TTS API's CORS allowlist
2. Deploy to production and test there

## Production Deployment

Once deployed to your allowed domain (e.g., `supernal.ai`, `ianderrington.github.io`), the TTS widget will work correctly as it does on your production blog.

## Reference

Working example: `/Users/ianderrington/git/ianderrington/nextjs-github-markdown-blog`
- Uses same API key
- Works in production
- Calls API directly from browser (client-side)

