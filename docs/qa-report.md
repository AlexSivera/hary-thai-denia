# Hary Thai — Informe de QA

_2 de octubre de 2026 · Build estático (`npm run build` → `dist/`) · Pruebas con Playwright (Chromium), Lighthouse 12 (Chrome) y html-validate 8._

## 1. Compilación y validación

| Comprobación | Resultado |
|---|---|
| `npm run images` (sharp) | ✅ AVIF/WebP/JPG a 2-3 anchos, logo con transparencia, favicon, OG 1200×630 |
| `npm run build` | ✅ `dist/` con ES (`/`), EN (`/en/`), legal ES/EN, 404, sitemap con hreflang, robots, manifest |
| html-validate (todas las páginas) | ✅ 0 errores (se corrigieron 35: landmarks duplicados, formulario sin submit, teléfonos sin `&nbsp;`, título > 70 caracteres…) |
| Consola del navegador | ✅ 0 errores / 0 avisos en ES y EN, escritorio y móvil |
| Imágenes rotas | ✅ 0 |

## 2. Lighthouse (servidor local)

| | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| Móvil | 95 | 100 | 100 | 100 |
| Escritorio | 100 | 100 | 100 | 100 |

Móvil: LCP 2,7 s (simulado 4G lento), CLS 0,009, TBT 40 ms. Peso total de la primera carga ≈ 455 KB.
Avisos que dependen del hosting, no del código: compresión gzip/brotli y cabeceras de caché largas para `/assets/` (configurar en el servidor definitivo).

## 3. Responsive

| Ancho | Revisado | Notas |
|---|---|---|
| 375 / 390 px | ES y EN completas | Sin scroll horizontal. Cabecera compacta (estado corto «Abierto · hasta 21 h»), dock inferior fijo WhatsApp / Llamar / Llegar, maniquí y zonas lado a lado |
| 768 px | EN completa | Hero en 2 columnas, carta en 2 columnas, ticket en 2 columnas |
| 1440 px | ES completa | Navegación completa + estado + CTA; dock oculto |

## 4. Funcional (probado como usuario)

| Flujo | Resultado |
|---|---|
| Tocar un precio de la carta (p. ej. Ayurvédico 90′) | ✅ Preselecciona servicio y duración en el ticket, marca el precio elegido, desplaza y enfoca el selector |
| Mapa del cuerpo: clic en botón y en la propia silueta SVG | ✅ Resalta zona, muestra focalizado + completo con precios; «Elegir» lleva al ticket |
| Dial de presión ⇄ ticket | ✅ Sincronizado en ambos sentidos; «Que me aconsejen» desmarca el dial |
| Día «Otro día» | ✅ Muestra el selector de fecha (mínimo: hoy) y la formatea («sábado, 10 de octubre») |
| Mensaje de WhatsApp | ✅ Vista previa en vivo y enlace `wa.me/34622459959?text=…` codificado; probado con bonos («5 sesiones») |
| Estado abierto/cerrado | ✅ Calculado con hora de Europe/Madrid (antes de 10 h / abierto / después de 21 h) |
| Menú móvil | ✅ Abre/cierra, `aria-expanded`, se cierra al navegar y con Escape |
| Anclas de navegación | ✅ Compensan la cabecera fija |
| Mapa de Google | ✅ Sólo se carga al pulsar «Cargar mapa» (sin cookies de terceros antes) |
| Cambio de idioma ES ⇄ EN | ✅ |
| Páginas legales y 404 | ✅ 200 / 404 correctos |
| Sin JavaScript | ✅ Contenido completo, cortina recogida (corregido: antes tapaba la foto), botón de WhatsApp con mensaje genérico |
| `prefers-reduced-motion` | ✅ Sin animación de cortina ni transiciones |

## 5. Accesibilidad

- Contrastes calculados (WCAG): oro/berenjena 8,3:1 · arroz/berenjena 13,6:1 · tinta/arroz 14,8:1 · seda/arroz 6,3:1 · blanco/verde WhatsApp 5,4:1 (se oscureció el verde: el original daba 4,1:1).
- Orden de tabulación lógico, enlace «Saltar al contenido», foco visible en todos los controles.
- Radios del ticket y del dial con `fieldset`/`legend`; precios de la carta con nombre accesible que incluye el masaje («Masaje tailandés: 60′ 50 €»).
- Objetivos táctiles ≥ 44 px en móvil (excepto enlaces dentro de texto, permitidos por WCAG 2.5.8).
- `lang="th"` en el ornamento «นวดแผนไทย» con su traducción visible.

## 6. Autocrítica y correcciones aplicadas

| Problema detectado | Corrección |
|---|---|
| Ornamento tailandés en vertical: ilegible | Pasado a línea horizontal con traducción |
| Cortina con cortes rectos, poco textil | Polígono de 11 puntos con curva hasta el punto de atado; borlas fuera del recorte |
| Maniquí de 800 px de alto y panel vacío al cargar | Tamaño contenido, cabecera de sección en la columna derecha, zona «Espalda» preseleccionada; en móvil figura y botones lado a lado |
| Kicker con rayita: patrón de plantilla | Sustituido por el rombo de la cinta de seda |
| Croquis de calles del mapa inventado | Eliminado (podía parecer un plano real) |
| Fotos con arco sin relación con el local | Cuelgan de una barra dorada como la cortina del hero |
| Pie de foto «camillas juntas» sobre una foto con una sola camilla | Texto corregido a lo que se ve |
| Botón «Cargar mapa» con texto invisible | Fondo transparente por defecto en `.btn` |
| Cabecera móvil desbordando (511 px) | Estado corto + menú icónico < 400 px |
| Nombre del servicio estrangulado cuando hay 3 precios | Filas `row--multi` apiladas |
| «Abierto también en domingo» repetía «Lunes a domingo» | Eliminado |

**¿Podría confundirse con otra web de la agencia?** No: paleta berenjena/oro sacada del logo real, tipografías de fundición tailandesa no usadas antes, y cuatro piezas que sólo tienen sentido aquí (cortina con borlas del local, maniquí por zonas, dial de presión, carta del escaparate).
**¿Con un competidor?** Tampoco: ninguno usa su propio color de marca ni enseña la presión, el horario hasta las 21 h o los masajes de 20 min como argumento.

## 7. Pendiente de confirmar con el cliente (⚠ antes de publicar)

1. **Precios.** Se publican los de su web actual y el escaparate. Dudas: pindas 30′ (35 € en la web, 30 € en Dénia.com en 2023); relajante sólo aparece a 60′ (no se ha supuesto 30′/90′); los bonos de la web actual tienen «precios antes» que no cuadran — sólo se muestra el precio del bono.
2. **Fotos de cabinas** (cortinas, mural del elefante, camilla de seda): proceden de su ficha en Dénia.com. Confirmar que son suyas. Las dos de la sala de espera son de su web actual.
3. **Dominio.** Canonical, OG, sitemap y schema usan `https://www.harythai.com` (el email publicado es `@harythai.com`). Cambiar `business.site` en `src/content.mjs` si es otro.
4. **Datos legales** (titular y NIF) en `/aviso-legal/`: marcados como pendientes.
5. **Copy a validar:** «la puedes cambiar en cualquier momento de la sesión» (presión) y que Laura y Ana siguen en el equipo.
6. **Email** `info@harythai.com`: no se muestra en la web hasta confirmar que existe.

## 8. Recomendaciones fuera de la web

- Enlazar la web en Google Business Profile (ahora no tiene ninguna).
- Cambiar la categoría de Google de «Tienda de artículos para masajes tailandeses» a «Masajista tailandés».
- Responder a la reseña de 1★ sobre la presión: la nueva web ya ofrece la solución (elegir presión antes de llegar).
- Hacer fotos nuevas en buena resolución de las cabinas (las de Dénia.com son pequeñas) y de manos trabajando, para sustituir las franjas.
