#!/usr/bin/env node
/**
 * fetch-thumbnails.js — One-time script to download Google Places photos
 * for eat and sleep entries, saving them as static thumbnails.
 *
 * Usage:
 *   node scripts/fetch-thumbnails.js
 *
 * What it does:
 *   1. Reads all eat + sleep JSON files
 *   2. For each entry, calls the live Places API to get top 3 photo refs
 *   3. Downloads each photo as a 400px-wide JPEG
 *   4. Saves to public/thumbnails/{section}/{id}-{1,2,3}.jpg
 *   5. Generates an HTML preview page (scripts/thumbnail-preview.html)
 *      so you can pick the best photo for each entry
 *
 * After choosing, run:
 *   node scripts/apply-thumbnails.js
 * to write the selected thumbnail paths into the JSON data.
 */

const fs = require('fs');
const path = require('path');

// ─── Config ──────────────────────────────────────────────────────────────────

const BASE_URL = 'https://www.lilatrips.com';
const THUMB_DIR = path.join(__dirname, '..', 'public', 'thumbnails');
const PHOTOS_PER_ENTRY = 3;
const PHOTO_WIDTH = 400;
const DELAY_MS = 5000; // delay between entries to avoid rate limits

// ─── Data files ──────────────────────────────────────────────────────────────

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

const EAT_FILES = [
  'restaurants/big-sur-eat.json',
  'restaurants/joshua-tree-eat.json',
  'restaurants/kauai-eat.json',
  'restaurants/olympic-peninsula-eat.json',
  'restaurants/vancouver-island-eat.json',
  'restaurants/zion-eat.json',
];

const SLEEP_FILES = [
  'accommodations/big-sur.json',
  'accommodations/joshua-tree.json',
  'accommodations/kauai.json',
  'accommodations/olympic-peninsula.json',
  'accommodations/vancouver-island.json',
  'accommodations/zion.json',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchPhotoRefs(name, location) {
  const query = `${name} ${location || ''}`.trim();
  const url = `${BASE_URL}/api/places-search?query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) { console.log(`  ⚠ Places search failed (${res.status}): ${name}`); return []; }
    const data = await res.json();
    return (data.photoRefs || []).slice(0, PHOTOS_PER_ENTRY);
  } catch (e) { console.log(`  ⚠ Places search error: ${name} — ${e.message}`); return []; }
}

async function downloadPhoto(photoRef, outPath) {
  const url = `${BASE_URL}/api/place-photo?ref=${encodeURIComponent(photoRef)}&maxwidth=${PHOTO_WIDTH}`;
  try {
    const res = await fetch(url);
    if (!res.ok) { console.log(`  ⚠ Photo download failed (${res.status})`); return false; }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(outPath, buffer);
    return true;
  } catch (e) { console.log(`  ⚠ Photo download error: ${e.message}`); return false; }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Ensure output dirs exist
  fs.mkdirSync(path.join(THUMB_DIR, 'eat'), { recursive: true });
  fs.mkdirSync(path.join(THUMB_DIR, 'sleep'), { recursive: true });

  const manifest = []; // { id, name, section, location, photos: [path1, path2, path3] }

  // Process eat files
  for (const file of EAT_FILES) {
    const entries = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
    const dest = file.split('/')[1].replace('-eat.json', '');
    console.log(`\n── Eat: ${dest} (${entries.length} entries) ──`);

    for (const entry of entries) {
      // Skip if already have photos
      const existingFile = path.join(THUMB_DIR, 'eat', `${entry.id}-1.jpg`);
      if (fs.existsSync(existingFile)) {
        const photos = [1,2,3].map(i => `/thumbnails/eat/${entry.id}-${i}.jpg`).filter(p => fs.existsSync(path.join(__dirname, '..', 'public', p)));
        manifest.push({ id: entry.id, name: entry.name, section: 'eat', location: entry.location, dest, photos });
        console.log(`  ${entry.name} — cached (${photos.length} photos)`);
        continue;
      }

      console.log(`  ${entry.name}...`);
      const refs = await fetchPhotoRefs(entry.name, entry.location);
      const photos = [];

      for (let i = 0; i < refs.length; i++) {
        const filename = `${entry.id}-${i + 1}.jpg`;
        const outPath = path.join(THUMB_DIR, 'eat', filename);
        const ok = await downloadPhoto(refs[i], outPath);
        if (ok) photos.push(`/thumbnails/eat/${filename}`);
      }

      manifest.push({ id: entry.id, name: entry.name, section: 'eat', location: entry.location, dest, photos });
      if (refs.length > 0) await sleep(DELAY_MS);
    }
  }

  // Process sleep files
  for (const file of SLEEP_FILES) {
    const entries = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
    const dest = file.split('/')[1].replace('.json', '');
    console.log(`\n── Sleep: ${dest} (${entries.length} entries) ──`);

    for (const entry of entries) {
      // Skip if already have photos
      const existingFile = path.join(THUMB_DIR, 'sleep', `${entry.id}-1.jpg`);
      if (fs.existsSync(existingFile)) {
        const photos = [1,2,3].map(i => `/thumbnails/sleep/${entry.id}-${i}.jpg`).filter(p => fs.existsSync(path.join(__dirname, '..', 'public', p)));
        manifest.push({ id: entry.id, name: entry.name, section: 'sleep', location: entry.location, dest, photos });
        console.log(`  ${entry.name} — cached (${photos.length} photos)`);
        continue;
      }

      console.log(`  ${entry.name}...`);
      const refs = await fetchPhotoRefs(entry.name, entry.location);
      const photos = [];

      for (let i = 0; i < refs.length; i++) {
        const filename = `${entry.id}-${i + 1}.jpg`;
        const outPath = path.join(THUMB_DIR, 'sleep', filename);
        const ok = await downloadPhoto(refs[i], outPath);
        if (ok) photos.push(`/thumbnails/sleep/${filename}`);
      }

      manifest.push({ id: entry.id, name: entry.name, section: 'sleep', location: entry.location, dest, photos });
      if (refs.length > 0) await sleep(DELAY_MS);
    }
  }

  // Save manifest
  const manifestPath = path.join(__dirname, 'thumbnail-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n✓ Manifest saved: ${manifestPath}`);

  // Generate HTML preview
  const html = generatePreviewHTML(manifest);
  const previewPath = path.join(__dirname, 'thumbnail-preview.html');
  fs.writeFileSync(previewPath, html);
  console.log(`✓ Preview saved: ${previewPath}`);
  console.log(`\nOpen ${previewPath} in your browser to pick the best photo for each entry.`);
  console.log(`Total entries: ${manifest.length}, Photos downloaded: ${manifest.reduce((n, m) => n + m.photos.length, 0)}`);
}

function generatePreviewHTML(manifest) {
  const rows = manifest.map(m => {
    const photoImgs = m.photos.length > 0
      ? m.photos.map((p, i) => `
        <label style="cursor:pointer; display:inline-block; margin:4px; border:3px solid transparent;" class="photo-option">
          <input type="radio" name="${m.id}" value="${p}" style="display:none" onchange="this.parentElement.style.border='3px solid #c9963a'; document.querySelectorAll('input[name=${m.id}]').forEach(r => { if(r!==this) r.parentElement.style.border='3px solid transparent'; }); updateSelection();">
          <img src="../public${p}" width="200" style="display:block; border-radius:4px;" />
          <div style="text-align:center; font-size:11px; color:#888; margin-top:2px;">Option ${i + 1}</div>
        </label>`).join('')
      : '<span style="color:#ccc; font-style:italic;">No photos found</span>';

    return `
    <div style="margin-bottom:32px; padding-bottom:24px; border-bottom:1px solid #eee;">
      <div style="margin-bottom:8px;">
        <strong style="font-size:16px;">${m.name}</strong>
        <span style="color:#999; font-size:12px; margin-left:8px;">${m.section} · ${m.dest}</span>
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:4px;">
        ${photoImgs}
      </div>
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8"><title>Thumbnail Preview — Lila Trips</title>
<style>
  body { font-family: 'Quicksand', sans-serif; max-width: 1200px; margin: 40px auto; padding: 0 20px; background: #faf8f4; }
  h1 { font-size: 24px; font-weight: 300; color: #1a2530; }
  p.instructions { font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 32px; }
  button#save { position: fixed; bottom: 20px; right: 20px; padding: 14px 28px; background: #1a2530; color: white; border: none; font-family: inherit; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; z-index: 100; }
</style>
</head><body>
<h1>Pick the best thumbnail for each entry</h1>
<p class="instructions">Click the best photo for each entry. When done, click "Save Selections" — it will download a JSON file. Then run <code>node scripts/apply-thumbnails.js</code> to write them into the data.</p>
<button id="save" onclick="saveSelections()">Save Selections</button>
${rows}
<script>
function updateSelection() {}
function saveSelections() {
  const selections = {};
  document.querySelectorAll('input[type=radio]:checked').forEach(r => {
    selections[r.name] = r.value;
  });
  const blob = new Blob([JSON.stringify(selections, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'thumbnail-selections.json';
  a.click();
}
</script>
</body></html>`;
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
