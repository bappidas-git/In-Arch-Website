#!/usr/bin/env node
/* ============================================
   IN-ARCH photograph pipeline — `npm run build:images`
   --------------------------------------------
   Turns the client's photographs (`in-arch images/`, read-only source
   material) into graded, cropped, responsive derivatives in
   `public/images/inarch/` and writes `src/data/imageManifest.json`.

   Crops come from scripts/image-specs.js. Every derivative goes through the
   same steps so the set reads as one body of work:

     extract → resize (Lanczos 3) → saturation × 0.94 → sharpen σ 0.5
     → sRGB, metadata stripped
     → AVIF q50 effort 5 · WebP q74 · JPEG q78 mozjpeg progressive

   Files: `<key>-<width>.<ext>` (`<key>-v<rev>-<width>.<ext>` when the spec
   sets `rev`). `/images/**` is immutable for a year, so the script refuses to
   overwrite an existing file with different bytes unless `--recut` is given.

   The manifest stores, per key:
     { key, width, height, ratio, sources: { avif, webp, jpg: [{ w, src }] },
       placeholder }
   `placeholder` is a 24-px-wide blurred WebP data URI (< 700 bytes).
   `src/data/images.js` adds the alt text.

   Idempotent: a key whose source bytes, crop, widths and settings are
   unchanged is not re-encoded (its hash is in src/lab/imageReport.json,
   which also carries byte sizes for the Design Lab). A second run with no
   change writes nothing.

   Flags
     --only=a,b       re-encode only these keys, even if unchanged (the rest of
                      the manifest is kept)
     --recut          allow overwriting files whose bytes changed
     --preview=DIR    write one 900-px JPEG per key into DIR for review and stop
     --check          verify files, budgets and freshness only; write nothing
     --summary        print the largest file per format and the placeholder size per key

   A fresh build of all 50 keys takes about ten minutes (AVIF effort 5).
   ============================================ */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { COLLAGE_SPLIT_X, SOURCES, DERIVATIVES } = require('./image-specs');

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'in-arch images');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'inarch');
const MANIFEST = path.join(ROOT, 'src', 'data', 'imageManifest.json');
const REPORT = path.join(ROOT, 'src', 'lab', 'imageReport.json');
const PUBLIC_PREFIX = '/images/inarch/';

// Bump when the processing below changes, so every key is re-encoded.
const PIPELINE = {
  version: 1,
  kernel: 'lanczos3',
  saturation: 0.94,
  sharpenSigma: 0.5,
  avif: { quality: 50, effort: 5 },
  webp: { quality: 74 },
  jpeg: { quality: 78, mozjpeg: true, progressive: true },
  placeholder: { width: 24, blur: 0.8, webpQuality: 40 },
};

const BUDGET = {
  avifMaxBytesUpTo1080: 140 * 1024,
  anyFileMaxBytes: 420 * 1024,
  placeholderMaxBytes: 700,
};

const FORMATS = [
  { id: 'avif', ext: 'avif', encode: (p) => p.avif(PIPELINE.avif) },
  { id: 'webp', ext: 'webp', encode: (p) => p.webp(PIPELINE.webp) },
  { id: 'jpg', ext: 'jpg', encode: (p) => p.jpeg(PIPELINE.jpeg) },
];

// ---------- arguments ----------
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
};
const ONLY = option('only') ? new Set(option('only').split(',').map((s) => s.trim())) : null;
const RECUT = flag('recut');
const PREVIEW_DIR = option('preview');
const CHECK_ONLY = flag('check');

// ---------- helpers ----------
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const readJson = (file, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return fallback;
  }
};
const writeIfChanged = (file, content) => {
  const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (prev === content) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return true;
};
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const sourceCache = new Map();
/** Source metadata: pixel size (of the collage half, for ph12a/b) and a content hash. */
const loadSource = async (id) => {
  if (sourceCache.has(id)) return sourceCache.get(id);
  const spec = SOURCES[id];
  if (!spec) throw new Error(`Unknown source "${id}"`);
  const file = path.join(SRC_DIR, spec.file);
  const bytes = fs.readFileSync(file);
  const meta = await sharp(bytes).metadata();
  let offsetX = 0;
  let width = meta.width;
  if (spec.split === 'left') width = COLLAGE_SPLIT_X;
  if (spec.split === 'right') {
    offsetX = COLLAGE_SPLIT_X;
    width = meta.width - COLLAGE_SPLIT_X;
  }
  const info = { id, spec, file, bytes, width, height: meta.height, offsetX, hash: sha(bytes).slice(0, 16) };
  sourceCache.set(id, info);
  return info;
};

/** Resolve a crop spec to integer pixels within the (half-)frame. */
const resolveCrop = (crop, src) => {
  const W = src.width;
  const H = src.height;
  const within = crop.within || {};
  const [wx0, wx1] = (within.x || [0, 100]).map((p) => (p / 100) * W);
  const [wy0, wy1] = (within.y || [0, 100]).map((p) => (p / 100) * H);

  let left;
  let top;
  let width;
  let height;
  if (crop.box) {
    const [l, t, w, h] = crop.box;
    left = (l / 100) * W;
    top = (t / 100) * H;
    width = (w / 100) * W;
    height = (h / 100) * H;
  } else if (crop.ratio) {
    const r = crop.ratio[0] / crop.ratio[1];
    if (crop.width) {
      width = (crop.width / 100) * W;
      height = width / r;
    } else {
      width = Math.min(wx1 - wx0, (wy1 - wy0) * r);
      height = width / r;
    }
    const [fx, fy] = crop.focal || [((wx0 + wx1) / 2 / W) * 100, ((wy0 + wy1) / 2 / H) * 100];
    left = clamp((fx / 100) * W - width / 2, wx0, wx1 - width);
    top = clamp((fy / 100) * H - height / 2, wy0, wy1 - height);
  } else {
    left = wx0;
    top = wy0;
    width = wx1 - wx0;
    height = wy1 - wy0;
  }
  const box = {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(width),
    height: Math.round(height),
  };
  if (box.left < 0 || box.top < 0 || box.left + box.width > W || box.top + box.height > H) {
    throw new Error(`crop ${JSON.stringify(box)} falls outside the ${W}×${H} frame`);
  }
  return box;
};

const outputHeight = (crop, box, w) =>
  crop.ratio ? Math.round((w * crop.ratio[1]) / crop.ratio[0]) : Math.round((w * box.height) / box.width);

const fileStem = (d) => (d.rev && d.rev > 1 ? `${d.key}-v${d.rev}` : d.key);

/** The extract + grade pipeline, before resizing. */
const base = (src, box) =>
  sharp(src.bytes).extract({ left: box.left + src.offsetX, top: box.top, width: box.width, height: box.height });

const grade = (pipeline, w, h) =>
  pipeline
    .resize(w, h, { fit: 'cover', position: 'centre', kernel: PIPELINE.kernel })
    .modulate({ saturation: PIPELINE.saturation })
    .sharpen({ sigma: PIPELINE.sharpenSigma })
    .toColourspace('srgb');

const placeholderFor = async (src, box, crop) => {
  const w = PIPELINE.placeholder.width;
  const h = outputHeight(crop, box, w);
  const buf = await grade(base(src, box), w, h)
    .blur(PIPELINE.placeholder.blur)
    .webp({ quality: PIPELINE.placeholder.webpQuality })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
};

// ---------- main ----------
(async () => {
  const problems = [];
  const keys = new Set();
  DERIVATIVES.forEach((d) => {
    if (keys.has(d.key)) problems.push(`duplicate key ${d.key}`);
    keys.add(d.key);
  });
  if (ONLY) {
    ONLY.forEach((k) => {
      if (!keys.has(k)) problems.push(`--only names an unknown key: ${k}`);
    });
  }
  if (problems.length) throw new Error(problems.join('\n'));

  if (PREVIEW_DIR) {
    fs.mkdirSync(PREVIEW_DIR, { recursive: true });
    for (const d of DERIVATIVES) {
      if (ONLY && !ONLY.has(d.key)) continue;
      const src = await loadSource(d.source);
      const box = resolveCrop(d.crop, src);
      const w = Math.min(900, box.width);
      await grade(base(src, box), w, outputHeight(d.crop, box, w))
        .jpeg({ quality: 85 })
        .toFile(path.join(PREVIEW_DIR, `${d.key}.jpg`));
      const pct = (v, t) => ((v / t) * 100).toFixed(1);
      console.log(
        `${d.key.padEnd(24)} ${d.source.padEnd(5)} box ${pct(box.left, src.width)}, ${pct(box.top, src.height)}, ` +
          `${pct(box.width, src.width)}, ${pct(box.height, src.height)} %  (${box.width}×${box.height} px)`
      );
    }
    return;
  }

  const prevManifest = readJson(MANIFEST, {});
  const prevReport = readJson(REPORT, {});
  const manifest = {};
  const report = {};
  const expectedFiles = new Set();
  let encoded = 0;
  let written = 0;

  for (const d of DERIVATIVES) {
    const src = await loadSource(d.source);
    const box = resolveCrop(d.crop, src);
    const sharpTo = src.spec.sharpTo;

    // Width limits: never above the source's sharp-to width or the crop's own pixels.
    d.widths.forEach((w) => {
      if (w > sharpTo) problems.push(`${d.key}: width ${w} exceeds ${d.source} sharp-to ${sharpTo}`);
      if (w > box.width) problems.push(`${d.key}: width ${w} exceeds the crop's ${box.width} px (upscale)`);
    });
    const widths = [...d.widths].sort((a, b) => a - b);
    const stem = fileStem(d);
    widths.forEach((w) => FORMATS.forEach((f) => expectedFiles.add(`${stem}-${w}.${f.ext}`)));

    const hash = sha(JSON.stringify({ src: src.hash, split: src.spec.split || null, box, crop: d.crop, widths, stem, PIPELINE })).slice(0, 16);
    const prev = prevReport[d.key];
    const allExist = widths.every((w) => FORMATS.every((f) => fs.existsSync(path.join(OUT_DIR, `${stem}-${w}.${f.ext}`))));
    const reuse = prev && prev.hash === hash && allExist && prevManifest[d.key] && (!ONLY || !ONLY.has(d.key));
    const skip = ONLY && !ONLY.has(d.key) && prevManifest[d.key];

    if (reuse || skip || CHECK_ONLY) {
      if (!prevManifest[d.key]) {
        problems.push(`${d.key}: not built yet`);
        continue;
      }
      if (!reuse && !skip && CHECK_ONLY) problems.push(`${d.key}: out of date (spec changed since the last build)`);
      manifest[d.key] = prevManifest[d.key];
      report[d.key] = prev || {};
      continue;
    }

    // Encode.
    const files = {};
    const sources = { avif: [], webp: [], jpg: [] };
    for (const w of widths) {
      const h = outputHeight(d.crop, box, w);
      for (const f of FORMATS) {
        const name = `${stem}-${w}.${f.ext}`;
        const buf = await f.encode(grade(base(src, box), w, h)).toBuffer();
        encoded += 1;
        const target = path.join(OUT_DIR, name);
        if (fs.existsSync(target)) {
          const existing = fs.readFileSync(target);
          if (!existing.equals(buf)) {
            if (!RECUT) {
              problems.push(
                `${name}: exists with different bytes. Deployed files are immutable — set rev or rename the key, or pass --recut if it was never deployed`
              );
              continue;
            }
            fs.writeFileSync(target, buf);
            written += 1;
          }
        } else {
          fs.mkdirSync(OUT_DIR, { recursive: true });
          fs.writeFileSync(target, buf);
          written += 1;
        }
        files[name] = buf.length;
        sources[f.id].push({ w, src: `${PUBLIC_PREFIX}${name}` });
      }
    }
    const top = widths[widths.length - 1];
    const placeholder = await placeholderFor(src, box, d.crop);
    manifest[d.key] = {
      key: d.key,
      width: top,
      height: outputHeight(d.crop, box, top),
      ratio: Number((top / outputHeight(d.crop, box, top)).toFixed(4)),
      sources,
      placeholder,
    };
    report[d.key] = {
      hash,
      source: d.source,
      file: src.spec.file,
      crop: box,
      cropPercent: [
        Number(((box.left / src.width) * 100).toFixed(2)),
        Number(((box.top / src.height) * 100).toFixed(2)),
        Number(((box.width / src.width) * 100).toFixed(2)),
        Number(((box.height / src.height) * 100).toFixed(2)),
      ],
      files,
      placeholderBytes: placeholder.length,
    };
    console.log(`encoded ${d.key} (${widths.join(', ')})`);
  }

  // ---------- budgets and consistency ----------
  for (const d of DERIVATIVES) {
    const entry = manifest[d.key];
    const rep = report[d.key];
    if (!entry || !rep || !rep.files) continue;
    if (rep.placeholderBytes > BUDGET.placeholderMaxBytes) {
      problems.push(`${d.key}: placeholder ${rep.placeholderBytes} B ≥ ${BUDGET.placeholderMaxBytes}`);
    }
    for (const [name, bytes] of Object.entries(rep.files)) {
      const onDisk = path.join(OUT_DIR, name);
      if (!fs.existsSync(onDisk)) {
        problems.push(`${name}: missing`);
        continue;
      }
      const size = fs.statSync(onDisk).size;
      if (size !== bytes) problems.push(`${name}: ${size} B on disk, ${bytes} B in the report`);
      if (size > BUDGET.anyFileMaxBytes) problems.push(`${name}: ${kb(size)} > ${kb(BUDGET.anyFileMaxBytes)}`);
      const w = Number(name.match(/-(\d+)\.\w+$/)[1]);
      if (name.endsWith('.avif') && w <= 1080 && size >= BUDGET.avifMaxBytesUpTo1080) {
        problems.push(`${name}: AVIF ${kb(size)} ≥ ${kb(BUDGET.avifMaxBytesUpTo1080)}`);
      }
    }
  }
  if (!CHECK_ONLY) {
    // Pixel sizes in the manifest must match the largest files.
    for (const d of DERIVATIVES) {
      const entry = manifest[d.key];
      if (!entry) continue;
      const largest = entry.sources.jpg[entry.sources.jpg.length - 1];
      const meta = await sharp(path.join(ROOT, 'public', largest.src)).metadata();
      if (meta.width !== entry.width || meta.height !== entry.height) {
        problems.push(`${d.key}: manifest ${entry.width}×${entry.height}, file ${meta.width}×${meta.height}`);
      }
    }
  }

  // ---------- orphans: derivatives no spec produces any more ----------
  const orphans = fs.existsSync(OUT_DIR)
    ? fs.readdirSync(OUT_DIR).filter((f) => /\.(avif|webp|jpg)$/.test(f) && !expectedFiles.has(f))
    : [];

  if (CHECK_ONLY) {
    orphans.forEach((f) => problems.push(`${f}: no spec produces it`));
  } else {
    orphans.forEach((f) => {
      fs.unlinkSync(path.join(OUT_DIR, f));
      console.log(`removed orphan ${f}`);
    });
    const m = writeIfChanged(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
    const r = writeIfChanged(REPORT, `${JSON.stringify(report, null, 2)}\n`);
    console.log(
      `${Object.keys(manifest).length} keys · ${encoded} encodes · ${written} files written · ` +
        `${orphans.length} orphans removed · manifest ${m ? 'written' : 'unchanged'} · report ${r ? 'written' : 'unchanged'}`
    );
  }

  // ---------- summary table ----------
  if (args.includes('--summary') || CHECK_ONLY) {
    for (const d of DERIVATIVES) {
      const rep = report[d.key];
      if (!rep || !rep.files) continue;
      const byFormat = { avif: 0, webp: 0, jpg: 0 };
      let maxAvif1080 = 0;
      Object.entries(rep.files).forEach(([name, bytes]) => {
        const ext = name.split('.').pop();
        byFormat[ext] = Math.max(byFormat[ext], bytes);
        if (ext === 'avif' && Number(name.match(/-(\d+)\.avif$/)[1]) <= 1080) maxAvif1080 = Math.max(maxAvif1080, bytes);
      });
      console.log(
        `${d.key.padEnd(24)} max avif ${kb(byFormat.avif).padStart(9)} webp ${kb(byFormat.webp).padStart(9)} ` +
          `jpg ${kb(byFormat.jpg).padStart(9)} · avif≤1080 ${kb(maxAvif1080).padStart(9)} · placeholder ${rep.placeholderBytes} B`
      );
    }
  }

  if (problems.length) {
    console.error(`\n${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
    process.exit(1);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
