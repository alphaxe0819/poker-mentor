/**
 * gen-icons.mjs
 * Generates icon-192.png and icon-512.png using only Node.js built-in modules.
 * Each PNG is a solid #0d0d14 background with a white spade (♠) rendered via
 * a hand-crafted bitmap font approach — but since text rendering without canvas
 * is extremely complex, we embed the spade shape as a scaled vector-path rasterised
 * pixel-by-pixel at both resolutions.
 *
 * PNG structure:
 *   Signature | IHDR | IDAT (zlib-deflated scanlines) | IEND
 */

import { deflateSync } from 'zlib';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function u32be(n) {
  const b = Buffer.allocUnsafe(4);
  b.writeUInt32BE(n >>> 0, 0);
  return b;
}

function crc32(buf) {
  // Build table once
  if (!crc32._table) {
    crc32._table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      crc32._table[i] = c;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = crc32._table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = u32be(data.length);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crc = u32be(crc32(crcInput));
  return Buffer.concat([len, typeBytes, data, crc]);
}

function buildPNG(width, height, pixelFn) {
  // PNG signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.concat([
    u32be(width),
    u32be(height),
    Buffer.from([
      8,   // bit depth
      2,   // colour type: RGB truecolour
      0,   // compression: deflate
      0,   // filter: adaptive
      0,   // interlace: none
    ]),
  ]);
  const ihdr = pngChunk('IHDR', ihdrData);

  // Raw scanlines: filter byte 0x00 (None) + R,G,B per pixel
  const rawRows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.allocUnsafe(1 + width * 3);
    row[0] = 0; // filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b] = pixelFn(x, y, width, height);
      row[1 + x * 3 + 0] = r;
      row[1 + x * 3 + 1] = g;
      row[1 + x * 3 + 2] = b;
    }
    rawRows.push(row);
  }
  const raw = Buffer.concat(rawRows);
  const compressed = deflateSync(raw, { level: 9 });
  const idat = pngChunk('IDAT', compressed);

  // IEND
  const iend = pngChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// ---------------------------------------------------------------------------
// Spade shape — defined as normalised path segments, rasterised with point-in-
// polygon / distance tests so it scales to any resolution.
//
// The classic spade is composed of:
//   1. A large circle (the top bulge)
//   2. Two mirrored smaller circles on the left/right sides
//   3. An inverted triangle for the handle
//
// All coordinates are in [0,1] space; we scale to the icon size.
// ---------------------------------------------------------------------------

function inCircle(px, py, cx, cy, r) {
  return (px - cx) ** 2 + (py - cy) ** 2 <= r * r;
}

/**
 * Returns true if point (px,py) in [0,1]² is inside the spade symbol.
 */
function inSpade(px, py) {
  // --- geometry (tuned for a clean spade look) ---
  const topCX = 0.5, topCY = 0.38, topCR = 0.27;    // large top circle
  const leftCX = 0.27, leftCY = 0.52, leftCR = 0.185; // left lobe
  const rightCX = 0.73, rightCY = 0.52, rightCR = 0.185; // right lobe (mirror)

  // Stalk: a narrow rounded rectangle at the bottom centre
  const stalkX0 = 0.40, stalkX1 = 0.60;
  const stalkY0 = 0.72, stalkY1 = 0.88;

  // Base triangle / trapezoid that widens the stalk base
  // Vertices: (0.25, 0.88), (0.75, 0.88), (0.5, 0.72)
  // We approximate it as a trapezoid: y in [stalkY0, stalkY1], x widens linearly
  const baseY0 = 0.72, baseY1 = 0.89;
  const baseHalfWidthAtBottom = 0.28; // half-width at y=baseY1
  const baseHalfWidthAtTop = 0.10;    // half-width at y=baseY0

  function inBase(bx, by) {
    if (by < baseY0 || by > baseY1) return false;
    const t = (by - baseY0) / (baseY1 - baseY0);
    const hw = baseHalfWidthAtTop + t * (baseHalfWidthAtBottom - baseHalfWidthAtTop);
    return bx >= 0.5 - hw && bx <= 0.5 + hw;
  }

  const inTop   = inCircle(px, py, topCX, topCY, topCR);
  const inLeft  = inCircle(px, py, leftCX, leftCY, leftCR);
  const inRight = inCircle(px, py, rightCX, rightCY, rightCR);
  const inStalk = px >= stalkX0 && px <= stalkX1 && py >= stalkY0 && py <= stalkY1;
  const baseHit = inBase(px, py);

  return inTop || inLeft || inRight || inStalk || baseHit;
}

// ---------------------------------------------------------------------------
// Pixel function
// ---------------------------------------------------------------------------

// Background: #0d0d14
const BG = [0x0d, 0x0d, 0x14];
// Spade: white
const FG = [0xff, 0xff, 0xff];

// We add a small margin so the spade doesn't touch edges.
const MARGIN = 0.10; // 10% margin on each side

function pixelFn(x, y, w, h) {
  // Map pixel to [0,1] inside the margin box
  const nx = (x / (w - 1) - MARGIN) / (1 - 2 * MARGIN);
  const ny = (y / (h - 1) - MARGIN) / (1 - 2 * MARGIN);

  // Anti-alias: sample a tiny neighbourhood
  const SAMPLES = 3;
  let hit = 0;
  for (let si = 0; si < SAMPLES; si++) {
    for (let sj = 0; sj < SAMPLES; sj++) {
      const sx = nx + (si / (SAMPLES - 1) - 0.5) * (1 / (w * (1 - 2 * MARGIN)));
      const sy = ny + (sj / (SAMPLES - 1) - 0.5) * (1 / (h * (1 - 2 * MARGIN)));
      if (sx >= 0 && sx <= 1 && sy >= 0 && sy <= 1 && inSpade(sx, sy)) hit++;
    }
  }
  const alpha = hit / (SAMPLES * SAMPLES);
  if (alpha === 0) return BG;
  if (alpha === 1) return FG;
  // blend
  return [
    Math.round(BG[0] + alpha * (FG[0] - BG[0])),
    Math.round(BG[1] + alpha * (FG[1] - BG[1])),
    Math.round(BG[2] + alpha * (FG[2] - BG[2])),
  ];
}

// ---------------------------------------------------------------------------
// Generate files
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = `${__dirname}/../public`;

mkdirSync(outDir, { recursive: true });

for (const size of [192, 512]) {
  console.log(`Generating ${size}x${size} PNG…`);
  const png = buildPNG(size, size, pixelFn);
  const outPath = `${outDir}/icon-${size}.png`;
  writeFileSync(outPath, png);
  console.log(`  Written: ${outPath} (${png.length} bytes)`);
}

console.log('Done.');
