#!/usr/bin/env node
/**
 * fetch-coordinates.cjs — One-time script to fetch lat/lng from Google Places
 * for eat and sleep entries, writing them directly into the JSON data.
 *
 * Usage:
 *   node scripts/fetch-coordinates.cjs
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.lilatrips.com';
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const DELAY_MS = 2000;

const ALL_FILES = [
  { path: 'restaurants/big-sur-eat.json', type: 'eat' },
  { path: 'restaurants/joshua-tree-eat.json', type: 'eat' },
  { path: 'restaurants/kauai-eat.json', type: 'eat' },
  { path: 'restaurants/olympic-peninsula-eat.json', type: 'eat' },
  { path: 'restaurants/vancouver-island-eat.json', type: 'eat' },
  { path: 'restaurants/zion-eat.json', type: 'eat' },
  { path: 'accommodations/big-sur.json', type: 'sleep' },
  { path: 'accommodations/joshua-tree.json', type: 'sleep' },
  { path: 'accommodations/kauai.json', type: 'sleep' },
  { path: 'accommodations/olympic-peninsula.json', type: 'sleep' },
  { path: 'accommodations/vancouver-island.json', type: 'sleep' },
  { path: 'accommodations/zion.json', type: 'sleep' },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchCoords(name, location) {
  const query = `${name} ${location || ''}`.trim();
  const url = `${BASE_URL}/api/places-search?query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) { console.log(`  ⚠ Failed (${res.status}): ${name}`); return null; }
    const data = await res.json();
    if (data.lat && data.lng) return { lat: data.lat, lng: data.lng };
    if (data.geometry?.location) return { lat: data.geometry.location.lat, lng: data.geometry.location.lng };
    console.log(`  ⚠ No coordinates in response: ${name}`);
    return null;
  } catch (e) { console.log(`  ⚠ Error: ${name} — ${e.message}`); return null; }
}

async function main() {
  let total = 0, found = 0, skipped = 0;

  for (const file of ALL_FILES) {
    const filePath = path.join(DATA_DIR, file.path);
    const entries = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const dest = file.path.split('/')[1].replace('-eat.json', '').replace('.json', '');
    console.log(`\n── ${file.type}: ${dest} (${entries.length} entries) ──`);

    let changed = false;
    for (const entry of entries) {
      total++;
      if (entry.lat && entry.lng) {
        console.log(`  ${entry.name} — cached (${entry.lat}, ${entry.lng})`);
        skipped++;
        continue;
      }

      console.log(`  ${entry.name}...`);
      const coords = await fetchCoords(entry.name, entry.location);
      if (coords) {
        entry.lat = coords.lat;
        entry.lng = coords.lng;
        changed = true;
        found++;
        console.log(`    → ${coords.lat}, ${coords.lng}`);
      }
      await sleep(DELAY_MS);
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(entries, null, 2) + '\n');
      console.log(`  Updated: ${file.path}`);
    }
  }

  console.log(`\n✓ Done. ${found} coordinates added, ${skipped} cached, ${total - found - skipped} missing.`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
