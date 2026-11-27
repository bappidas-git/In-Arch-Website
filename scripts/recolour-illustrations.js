#!/usr/bin/env node
/* ============================================
   IN-ARCH illustrations — recolour four unDraw SVGs to the brand
   --------------------------------------------
   unDraw (https://undraw.co, licence read 2026-11-27: free for commercial
   use, modification allowed, no attribution required; no redistribution in
   packs, no competing service, no AI training). The originals are not
   committed: download the four files listed in ILLUSTRATIONS from unDraw
   into a folder by hand, then run

     node scripts/recolour-illustrations.js --from=<that folder>

   What changes (and nothing else):
   - unDraw's primary #6C63FF → terracotta-500 #B5653F;
   - darks (#3F3D56, #2F2E41, #090814) → espresso #231B15;
   - light fills: #F2F2F2 / #F0F0F0 → sand #E9E3D8; #E6E6E6 / #E4E4E4 /
     #CCC / #CACACA / #D6D6E3 → stone #DAD3C6; white → paper #FAF7F2;
   - shapes drawn as translucent black (a 10–20 % opacity overlay, no fill)
     become stone #DAD3C6 at full opacity, so only brand colours remain;
   - root id / data-name removed. No gradients, filters or drop shadows are
     present in these four (the script fails if one appears).
   ============================================ */

const fs = require('fs');
const path = require('path');

const OUT = path.resolve(__dirname, '..', 'public', 'images', 'inarch', 'illustrations');

const ILLUSTRATIONS = [
  { out: 'not-found.svg', from: 'page-not-found_6wni.svg', title: 'Page not found' },
  { out: 'enquiry-sent.svg', from: 'message-sent_iyz6.svg', title: 'Message Sent' },
  { out: 'nothing-here.svg', from: 'no-data_ig65.svg', title: 'No data' },
  { out: 'something-broke.svg', from: 'connection-lost_am29.svg', title: 'Connection lost' },
];

const MAP = {
  '#6c63ff': '#B5653F',
  '#3f3d56': '#231B15',
  '#2f2e41': '#231B15',
  '#090814': '#231B15',
  '#f2f2f2': '#E9E3D8',
  '#f0f0f0': '#E9E3D8',
  '#e6e6e6': '#DAD3C6',
  '#e4e4e4': '#DAD3C6',
  '#ccc': '#DAD3C6',
  '#cccccc': '#DAD3C6',
  '#cacaca': '#DAD3C6',
  '#d6d6e3': '#DAD3C6',
  '#fff': '#FAF7F2',
  '#ffffff': '#FAF7F2',
};
const BRAND = new Set(['#B5653F', '#231B15', '#E9E3D8', '#DAD3C6', '#FAF7F2']);

const fromArg = process.argv.find((a) => a.startsWith('--from='));
if (!fromArg) {
  console.error('usage: node scripts/recolour-illustrations.js --from=<folder with the unDraw originals>');
  process.exit(1);
}
const FROM = path.resolve(fromArg.slice('--from='.length));

let failed = 0;
fs.mkdirSync(OUT, { recursive: true });
for (const item of ILLUSTRATIONS) {
  let svg = fs.readFileSync(path.join(FROM, item.from), 'utf8');
  if (/<(linearGradient|radialGradient|filter|mask|image)\b/.test(svg)) {
    console.error(`${item.from}: contains a gradient, filter, mask or bitmap — handle it by hand`);
    failed += 1;
    continue;
  }
  svg = svg
    .replace(/<\?xml[^>]*>\s*/g, '')
    .replace(/^<svg([^>]*?)\s+id="[^"]*"/, '<svg$1')
    .replace(/^<svg([^>]*?)\s+data-name="[^"]*"/, '<svg$1')
    // Translucent black overlays (no fill attribute) → stone, opaque.
    .replace(/<(path|ellipse|circle|rect|polygon)\b((?:(?!fill=)[^>])*?)\s+opacity="0?\.\d+"((?:(?!fill=)[^>])*?)(\/?)>/g, '<$1$2$3 fill="#DAD3C6"$4>')
    .replace(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g, (hex) => MAP[hex.toLowerCase()] || hex.toUpperCase());

  // Every remaining colour must be a brand colour, and nothing may fall back to black.
  const colours = new Set((svg.match(/#[0-9A-Fa-f]{3,6}\b/g) || []).map((c) => c.toUpperCase()));
  const off = [...colours].filter((c) => !BRAND.has(c));
  const unfilled = (svg.match(/<(path|ellipse|circle|rect|polygon)\b(?:(?!fill=)[^>])*>/g) || []).length;
  const opacity = /opacity="/.test(svg);
  const bytes = Buffer.byteLength(svg);
  const problems = [];
  if (off.length) problems.push(`non-brand colours ${off.join(', ')}`);
  if (unfilled) problems.push(`${unfilled} shapes without a fill`);
  if (opacity) problems.push('opacity left');
  if (bytes >= 30 * 1024) problems.push(`${bytes} B ≥ 30 KB`);
  fs.writeFileSync(path.join(OUT, item.out), svg.endsWith('\n') ? svg : `${svg}\n`);
  console.log(`${problems.length ? 'FAIL' : 'ok  '} ${item.out.padEnd(20)} ← ${item.from.padEnd(26)} ${bytes} B  ${[...colours].join(' ')}${problems.length ? `  → ${problems.join('; ')}` : ''}`);
  failed += problems.length ? 1 : 0;
}
process.exit(failed ? 1 : 0);
