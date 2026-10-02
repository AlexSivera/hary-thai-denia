// Genera dist/: ES en /, EN en /en/, páginas legales, sitemap, robots, 404.
import { mkdir, writeFile, cp, rm, readFile } from 'node:fs/promises';
import { es, en, business } from '../src/content.mjs';
import { page, legalPage } from '../src/template.mjs';

const OUT = 'dist';

// Publicación en otra URL (p. ej. GitHub Pages en /repo/): SITE_URL fija la URL pública y la ruta base.
// Una vista previa (SITE_URL distinta del dominio real) se marca noindex para no competir con la web definitiva.
const REAL = business.site;
const SITE_URL = (process.env.SITE_URL || REAL + '/').replace(/\/?$/, '/');
const BASE = new URL(SITE_URL).pathname;
const PREVIEW = !SITE_URL.startsWith(REAL + '/');
business.site = SITE_URL.slice(0, -1);
const rebase = (txt) =>
  BASE === '/'
    ? txt
    : txt
        .replace(/((?:href|src)=")\/(?!\/)/g, `$1${BASE}`)
        .replace(/srcset="[^"]*"/g, (m) => m.replace(/(srcset="|, )\/assets\//g, `$1${BASE}assets/`))
        .replace(/url\(\/assets\//g, `url(${BASE}assets/`);
const tidy = (h) => h.replace(/[ \t]+$/gm, '');
const html = (h) => {
  let out = rebase(tidy(h));
  if (PREVIEW && !out.includes('name="robots"')) out = out.replace('<meta name="viewport"', '<meta name="robots" content="noindex">\n<meta name="viewport"');
  return out;
};

await rm(OUT, { recursive: true, force: true });
await mkdir(`${OUT}/en/legal`, { recursive: true });
await mkdir(`${OUT}/aviso-legal`, { recursive: true });
await mkdir(`${OUT}/assets`, { recursive: true });

await cp('src/assets/img', `${OUT}/assets/img`, { recursive: true, filter: (f) => !f.endsWith('manifest.json') });
await cp('src/assets/fonts', `${OUT}/assets/fonts`, { recursive: true });
// CSS y JS: minificado ligero (sin dependencias)
const css = (await readFile('src/styles.css', 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}').trim();
await writeFile(`${OUT}/assets/styles.css`, rebase(css));
await cp('src/main.js', `${OUT}/assets/main.js`);

await writeFile(`${OUT}/index.html`, html(page(es)));
await writeFile(`${OUT}/en/index.html`, html(page(en)));
await writeFile(`${OUT}/aviso-legal/index.html`, html(legalPage(es)));
await writeFile(`${OUT}/en/legal/index.html`, html(legalPage(en)));

await cp('src/assets/img/favicon-48.png', `${OUT}/favicon.ico`);
await writeFile(`${OUT}/favicon.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#3A1525"/><g fill="none" stroke="#D8B865" stroke-width="3" stroke-linejoin="round"><path d="M32 14c6 6 8 13 0 26-8-13-6-20 0-26Z"/><path d="M32 40c-6-9-14-12-20-11 2 7 10 11 20 11Zm0 0c6-9 14-12 20-11-2 7-10 11-20 11Z"/><path d="M14 44h36"/></g></svg>`);
await writeFile(`${OUT}/manifest.webmanifest`, JSON.stringify({
  name: 'Hary Thai · masaje tailandés', short_name: 'Hary Thai', start_url: BASE, display: 'browser',
  background_color: '#3A1525', theme_color: '#3A1525',
  icons: [{ src: `${BASE}assets/img/icon-192.png`, sizes: '192x192', type: 'image/png' }],
}, null, 2));
await writeFile(`${OUT}/robots.txt`, PREVIEW ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${business.site}/sitemap.xml\n`);
const today = new Date().toISOString().slice(0, 10);
await writeFile(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>${business.site}/</loc><lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="es" href="${business.site}/"/><xhtml:link rel="alternate" hreflang="en" href="${business.site}/en/"/></url>
  <url><loc>${business.site}/en/</loc><lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="es" href="${business.site}/"/><xhtml:link rel="alternate" hreflang="en" href="${business.site}/en/"/></url>
</urlset>
`);
await writeFile(`${OUT}/404.html`, html(`<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Página no encontrada · Hary Thai</title><meta name="robots" content="noindex"><link rel="icon" href="/assets/img/favicon-48.png" type="image/png"><link rel="stylesheet" href="/assets/styles.css"></head><body class="legal"><main class="legal__main paper"><h1>Esta página no existe</h1><p>Pero el centro sí: Carrer del Temple de Sant Telm, 19, Dénia. Todos los días de 10:00 a 21:00.</p><p><a href="/">Ir a la web de Hary Thai</a> · <a href="/en/">English</a></p></main></body></html>`));
// GitHub Pages: servir tal cual, sin Jekyll
await writeFile(`${OUT}/.nojekyll`, '');
console.log(`dist/ listo → ${SITE_URL}${PREVIEW ? ' (vista previa, noindex)' : ''}`);
