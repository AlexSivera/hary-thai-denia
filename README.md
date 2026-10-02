# Hary Thai — web

Web estática de Hary Thai (masaje tailandés, Carrer del Temple de Sant Telm 19, Dénia). ES en `/`, EN en `/en/`.

```bash
npm install
npm run images   # sólo si cambian las fotos de src/img-src
npm run dev      # build + servidor en http://localhost:4321
```

- `src/content.mjs` — datos del negocio, precios y todo el texto ES/EN.
- `src/template.mjs` — HTML. `src/styles.css`, `src/main.js` — sin dependencias.
- `scripts/build.mjs` genera `dist/` (lo que se sube al hosting).
- `docs/` — business brief, dirección creativa e informe de QA (incluye lo pendiente de confirmar).
- `research/` — material de investigación (no se publica).

## Publicar la vista previa en GitHub Pages

```bash
SITE_URL=https://alexsivera.github.io/hary-thai-denia/ node scripts/build.mjs
```

Con una `SITE_URL` distinta del dominio real (`business.site`), el build reescribe las rutas a `/hary-thai-denia/` y marca todo como `noindex`. El contenido de `dist/` se sube a la rama `gh-pages`.
