// Divide una captura completa en trozos legibles: node scripts/split.cjs <tag> [alto] [ancho]
const sharp = require('sharp');
const [tag, step = 1800, w = 900] = process.argv.slice(2);
(async () => {
  const f = `.playwright-mcp/${tag}-full.jpg`;
  const m = await sharp(f).metadata();
  const n = Math.ceil(m.height / step);
  for (let i = 0; i < n; i++) {
    const top = i * step, h = Math.min(+step, m.height - top);
    await sharp(f).extract({ left: 0, top, width: m.width, height: h }).resize({ width: Math.min(+w, m.width) }).toFile(`.playwright-mcp/${tag}-p${i}.jpg`);
  }
  console.log(tag, m.width, m.height, n);
})();
