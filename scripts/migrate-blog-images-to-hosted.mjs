#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET_DIRS = ['src/content/blog', 'public/blog'];
const IMAGE_LINK_RE = /!\[[^\]]*\]\(([^)]+\.(?:png|jpg|jpeg|webp|gif))\)/gi;

const args = new Set(process.argv.slice(2));
const WRITE = args.has('--write');
const DRY_RUN = !WRITE;

const API_URL = process.env.SUPERNAL_IMAGES_API_URL || process.env.NEXT_PUBLIC_SUPERNAL_IMAGES_API_URL || 'https://www.images.supernal.ai';
const UPLOAD_ENDPOINT = process.env.SUPERNAL_IMAGES_UPLOAD_ENDPOINT || `${API_URL.replace(/\/$/, '')}/api/v1/images/upload`;
const API_KEY = process.env.SUPERNAL_IMAGES_API_KEY || process.env.NEXT_PUBLIC_SUPERNAL_IMAGES_API_KEY || '';

function isLocalRef(ref) {
  return ref.startsWith('./') || ref.startsWith('../') || ref.startsWith('/');
}

async function listMarkdownFiles(dir) {
  const out = [];
  async function walk(d) {
    let ents = [];
    try { ents = await fs.readdir(d, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.isFile() && e.name.endsWith('.md')) out.push(p);
    }
  }
  await walk(path.join(ROOT, dir));
  return out;
}

async function uploadFile(localPath) {
  if (!API_KEY) throw new Error('Missing SUPERNAL_IMAGES_API_KEY for upload');
  const data = await fs.readFile(localPath);
  const form = new FormData();
  form.append('file', new Blob([data]), path.basename(localPath));

  const res = await fetch(UPLOAD_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}` },
    body: form,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Upload failed (${res.status}): ${txt.slice(0, 200)}`);
  }

  const body = await res.json();
  const hostedUrl = body?.url || body?.imageUrl || body?.data?.url;
  if (!hostedUrl) throw new Error(`Upload response missing url field: ${JSON.stringify(body).slice(0, 200)}`);
  return hostedUrl;
}

async function main() {
  let files = [];
  for (const dir of TARGET_DIRS) files.push(...await listMarkdownFiles(dir));

  let touched = 0;
  let replacements = 0;
  let missing = 0;
  let failed = 0;

  for (const file of files) {
    let text = await fs.readFile(file, 'utf8');
    let changed = false;

    const matches = [...text.matchAll(IMAGE_LINK_RE)];
    for (const m of matches) {
      const ref = m[1];
      if (!isLocalRef(ref)) continue;

      const abs = ref.startsWith('/')
        ? path.join(ROOT, ref.replace(/^\//, ''))
        : path.resolve(path.dirname(file), ref);

      try {
        await fs.access(abs);
      } catch {
        missing++;
        console.log(`MISSING: ${path.relative(ROOT, file)} -> ${ref} (${abs})`);
        continue;
      }

      try {
        const hosted = await uploadFile(abs);
        text = text.replace(ref, hosted);
        changed = true;
        replacements++;
        console.log(`OK: ${path.relative(ROOT, file)} -> ${hosted}`);
      } catch (e) {
        failed++;
        console.log(`FAILED: ${path.relative(ROOT, file)} -> ${ref} :: ${e.message}`);
      }
    }

    if (changed) {
      touched++;
      if (!DRY_RUN) await fs.writeFile(file, text, 'utf8');
    }
  }

  console.log('\nSummary');
  console.log(`  mode: ${DRY_RUN ? 'dry-run' : 'write'}`);
  console.log(`  files scanned: ${files.length}`);
  console.log(`  files touched: ${touched}`);
  console.log(`  replacements: ${replacements}`);
  console.log(`  missing assets: ${missing}`);
  console.log(`  upload failures: ${failed}`);

  if (DRY_RUN) console.log('\nRun with --write to persist replacements.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
