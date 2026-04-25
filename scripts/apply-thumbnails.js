#!/usr/bin/env node
/**
 * apply-thumbnails.js — Writes selected thumbnail paths into JSON data files.
 *
 * Usage:
 *   1. Run fetch-thumbnails.js first
 *   2. Open thumbnail-preview.html, pick the best photo for each entry
 *   3. Click "Save Selections" to download thumbnail-selections.json
 *   4. Move thumbnail-selections.json into scripts/
 *   5. Run: node scripts/apply-thumbnails.js
 *
 * This adds a "thumbnail" field to matching entries in the eat and sleep JSON files.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

const ALL_FILES = [
  'restaurants/big-sur-eat.json',
  'restaurants/joshua-tree-eat.json',
  'restaurants/kauai-eat.json',
  'restaurants/olympic-peninsula-eat.json',
  'restaurants/vancouver-island-eat.json',
  'restaurants/zion-eat.json',
  'accommodations/big-sur.json',
  'accommodations/joshua-tree.json',
  'accommodations/kauai.json',
  'accommodations/olympic-peninsula.json',
  'accommodations/vancouver-island.json',
  'accommodations/zion.json',
];

// Load selections
const selectionsPath = path.join(__dirname, 'thumbnail-selections.json');
if (!fs.existsSync(selectionsPath)) {
  console.error('❌ thumbnail-selections.json not found in scripts/');
  console.error('   Run fetch-thumbnails.js first, pick photos in the preview, then save selections.');
  process.exit(1);
}

const selections = JSON.parse(fs.readFileSync(selectionsPath, 'utf8'));
console.log(`Loaded ${Object.keys(selections).length} selections\n`);

let updated = 0;

for (const file of ALL_FILES) {
  const filePath = path.join(DATA_DIR, file);
  const entries = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = false;

  for (const entry of entries) {
    if (selections[entry.id]) {
      entry.thumbnail = selections[entry.id];
      changed = true;
      updated++;
      console.log(`  ✓ ${entry.name} → ${entry.thumbnail}`);
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(entries, null, 2) + '\n');
    console.log(`  Updated: ${file}`);
  }
}

console.log(`\n✓ Done. ${updated} entries updated with thumbnails.`);
