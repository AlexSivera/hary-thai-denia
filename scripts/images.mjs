// Prepara las imágenes: fotos reales del local en AVIF/WebP/JPG a varios anchos,
// logo con fondo transparente (a partir del PNG sobre berenjena), favicon y OG.
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const SRC = 'src/img-src';
const OUT = 'src/assets/img';
await mkdir(OUT, { recursive: true });

// Fotos: [nombre, anchos, recorte opcional {left, top, width, height}]
const photos = [
  ['sala-jardin', [480, 800, 1200], null],
  ['sala-entrada', [480, 800, 1280], null],
  // Fotos de baja resolución de origen: se sirven estrechas (paños verticales)
  ['cortinas', [360, 560], { left: 900, top: 0, width: 760, height: 1166 }],
  ['cabina-seda', [480, 760], { left: 0, top: 0, width: 1500, height: 1166 }],
  ['cabina-pareja', [360, 560], { left: 1180, top: 0, width: 800, height: 1166 }],
  ['cabina-elefante', [480, 760], { left: 140, top: 0, width: 1500, height: 1166 }],
];

const manifest = {};
for (const [name, widths, crop] of photos) {
  const file = `${SRC}/${name}.${name.startsWith('sala') ? 'jpg' : 'png'}`;
  let base = sharp(file).rotate();
  if (crop) base = base.extract(crop);
  const buf = await base.toBuffer();
  const meta = await sharp(buf).metadata();
  manifest[name] = { w: meta.width, h: meta.height, widths };
  for (const w of widths) {
    const img = sharp(buf).resize({ width: w, withoutEnlargement: true }).modulate({ saturation: 1.04 });
    await img.clone().avif({ quality: 52, effort: 5 }).toFile(`${OUT}/${name}-${w}.avif`);
    await img.clone().webp({ quality: 74 }).toFile(`${OUT}/${name}-${w}.webp`);
    await img.clone().jpeg({ quality: 76, mozjpeg: true }).toFile(`${OUT}/${name}-${w}.jpg`);
  }
}

// Logo: el PNG original tiene fondo plano #3A1525. Recuperamos alfa por distancia
// al color de fondo y deshacemos la mezcla para obtener color limpio.
const BG = [58, 21, 37];
const { data, info } = await sharp(`${SRC}/logo.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const out = Buffer.alloc(data.length);
for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  // máximo canal relativo al fondo => alfa
  const a = Math.min(1, Math.max((r - BG[0]) / (255 - BG[0]), (g - BG[1]) / (255 - BG[1]), (b - BG[2]) / (255 - BG[2]), 0) * 1.08);
  if (a < 0.04) { out[i + 3] = 0; continue; }
  const un = (c, k) => Math.max(0, Math.min(255, Math.round((c - BG[k] * (1 - a)) / a)));
  out[i] = un(r, 0); out[i + 1] = un(g, 1); out[i + 2] = un(b, 2); out[i + 3] = Math.round(a * 255);
}
const logo = sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
const trimmed = await logo.png().toBuffer().then(b => sharp(b).trim({ threshold: 1 }).png().toBuffer());
await sharp(trimmed).resize({ width: 520 }).png({ compressionLevel: 9 }).toFile(`${OUT}/logo.png`);
await sharp(trimmed).resize({ width: 320 }).webp({ quality: 88, alphaQuality: 90 }).toFile(`${OUT}/logo.webp`);
const lm = await sharp(trimmed).metadata();
manifest.logo = { w: lm.width, h: lm.height };

// Loto (parte superior del logo) para favicon
const lotus = await sharp(trimmed).extract({ left: Math.round(lm.width * 0.2), top: 0, width: Math.round(lm.width * 0.6), height: Math.round(lm.height * 0.4) }).trim({ threshold: 1 }).png().toBuffer();
const lotusSq = await sharp(lotus).resize(140, 140, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
const favBuf = await sharp({ create: { width: 192, height: 192, channels: 4, background: '#3A1525' } }).composite([{ input: lotusSq, gravity: 'center' }]).png().toBuffer();
const fav = sharp(favBuf);
await fav.clone().png().toFile(`${OUT}/icon-192.png`);
await fav.clone().resize(180).png().toFile(`${OUT}/apple-touch-icon.png`);
await fav.clone().resize(48).png().toFile(`${OUT}/favicon-48.png`);

// OG 1200x630: foto de la sala + velo berenjena + logo
const ogPhoto = await sharp(`${SRC}/sala-entrada.jpg`).resize(1200, 630, { fit: 'cover', position: 'centre' }).toBuffer();
const veil = Buffer.from(`<svg width="1200" height="630"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#220C16" stop-opacity=".94"/><stop offset=".55" stop-color="#3A1525" stop-opacity=".72"/><stop offset="1" stop-color="#3A1525" stop-opacity=".15"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`);
const ogLogo = await sharp(trimmed).resize({ width: 360 }).png().toBuffer();
const ogText = Buffer.from(`<svg width="1200" height="630"><text x="80" y="450" font-family="Georgia, serif" font-size="38" fill="#F4ECDD">Dénia · todos los días 10–21 h</text><text x="80" y="505" font-family="Georgia, serif" font-size="30" fill="#D8B865">622 45 99 59</text></svg>`);
await sharp(ogPhoto).composite([{ input: veil }, { input: ogLogo, left: 70, top: 80 }, { input: ogText }]).jpeg({ quality: 82 }).toFile(`${OUT}/og.jpg`);

await writeFile(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2));
console.log('Imágenes listas', manifest);

// Variante horizontal para la cabecera: loto + «Hary Thai» (sin subtítulo)
async function bboxTrim(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  return sharp(buf).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }).png().toBuffer();
}
{
  const full = await sharp(`${OUT}/logo.png`).toBuffer();
  const fm = await sharp(full).metadata();
  const lotusPart = await sharp(full).extract({ left: 0, top: 0, width: fm.width, height: 158 }).png().toBuffer().then(bboxTrim);
  const wordPart = await sharp(full).extract({ left: 0, top: 174, width: fm.width, height: 124 }).png().toBuffer().then(bboxTrim);
  const wm = await sharp(wordPart).metadata();
  const lotusH = Math.round(wm.height * 0.95);
  const lotusR = await sharp(lotusPart).resize({ height: lotusH }).png().toBuffer();
  const lm2 = await sharp(lotusR).metadata();
  const gap = 22;
  const W = lm2.width + gap + wm.width, H = Math.max(lotusH, wm.height);
  const lockup = await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: lotusR, left: 0, top: Math.round((H - lotusH) / 2) }, { input: wordPart, left: lm2.width + gap, top: Math.round((H - wm.height) / 2) }])
    .png().toBuffer();
  // 2× la altura máxima mostrada (34 px)
  const small = await sharp(lockup).resize({ height: 72 }).png().toBuffer();
  const sm = await sharp(small).metadata();
  await sharp(small).png({ compressionLevel: 9, palette: true }).toFile(`${OUT}/logo-h.png`);
  await sharp(small).webp({ quality: 88, alphaQuality: 90 }).toFile(`${OUT}/logo-h.webp`);
  manifest.logoH = { w: sm.width, h: sm.height };
  await writeFile(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2));
  console.log('logo-h', W, H);
}
