# Hary Thai — Dirección creativa

## Concepto: «Detrás de la cortina»

En Hary Thai entras desde una calle normal del barrio del puerto a una sala con jardín vertical, y de ahí a cabinas separadas por **cortinas de seda berenjena recogidas con borlas rosas**, con colchas de **seda tailandesa roja y dorada**. El logo real es un **loto dorado sobre berenjena**.

La web recorre ese mismo camino: **calle → sala → carta → cabina → reserva**. No es un "spa de lujo" ni un resort tailandés: es un sitio de barrio, cálido, con precio claro y manos fuertes. La identidad sale del propio local y del logo, no de un moodboard de spa genérico (beige, orquídea, piedras calientes — que es justo lo que hace la web actual y toda la competencia).

**Por qué este concepto y no otro**
- El logo y las cortinas comparten el mismo color: es la única seña visual propia que ya tiene el negocio. La web actual la ignora (beige/dorado de plantilla).
- Las reseñas hablan de "sitio bonito y limpio" y de "entrar y que se te vaya el estrés": el umbral (cruzar la cortina) es la experiencia.
- La cortina permite un recurso gráfico **reconocible e inimitable por un competidor** sin caer en Budas, orquídeas o piedras.

## Personalidad

| Es | No es |
|---|---|
| Cercano, de barrio, devoto, honesto con los precios | Resort, lujo, "experiencia sensorial ancestral" |
| Firme (manos fuertes) pero atento ("¿más presión?") | Esotérico, energético, místico |
| Bilingüe de forma natural (cartel del escaparate ES/EN) | Turístico de folleto |

**Tono de copy:** frases cortas, concretas, en segunda persona. Precios y minutos siempre visibles. Nada de "tu bienestar es nuestra prioridad".

## Color

Tomado del logo (muestra exacta del PNG: `#3A1525`) y de las fotos del local.

| Token | Hex | Origen | Uso |
|---|---|---|---|
| `--berenjena` | `#3A1525` | Fondo del logo | Fondo dominante, cabecera, hero |
| `--noche` | `#220C16` | Berenjena en sombra | Fondos profundos, footer |
| `--ciruela` | `#5E2443` | Cortinas de seda | Pliegues, superficies elevadas |
| `--borla` | `#E0538A` | Borlas rosas de las cortinas | Acento puntual (estado activo, marcador). Nunca en bloques |
| `--oro` | `#D8B865` | Loto del logo | Titulares sobre oscuro, precios, filetes |
| `--seda` | `#9E2A2B` | Colchas tailandesas rojas | Cinta de seda (separadores), presión "firme" |
| `--arroz` | `#F4ECDD` | Pared y toallas | Fondo de la carta y del ticket de reserva (papel) |
| `--tinta` | `#2A1220` | — | Texto sobre papel |
| `--hoja` | `#7FB069` | Jardín vertical | Sólo el punto "Abierto ahora" |

Contrastes comprobados (WCAG): oro sobre berenjena 8,3:1 · arroz sobre berenjena 13,6:1 · tinta sobre arroz 14,8:1 · seda sobre arroz 6,3:1 · noche sobre borla 5,1:1 · blanco sobre verde WhatsApp `#167A47` 5,4:1. La borla sobre berenjena (4,4:1) se usa sólo en bordes, rellenos y marcadores, nunca como color de texto.

## Tipografía

- **Taviraj** (Cadson Demak, Bangkok) — display. Serif de alto contraste diseñada en Tailandia, con trazos inspirados en la caligrafía tailandesa. Elegida por origen y porque comparte la sensibilidad caligráfica del logo sin imitarlo. Pesos 300 / 500, cursiva 300.
- **Sarabun** (Cadson Demak) — texto y UI. Humanista, muy legible en móvil, cifras claras para precios. Pesos 400 / 600.
- **Ornamento tailandés:** «นวดแผนไทย» (*nuad phaen thai*, "masaje tradicional tailandés") en Taviraj, en vertical, como firma de sección. Una sola frase, siempre la misma, siempre correcta.
- Ninguna de estas fuentes se ha usado en otros proyectos de la agencia.

## Elementos gráficos propios (diferenciación)

1. **La cortina recogida** — el hero enmarca la foto real de la sala entre dos paños plisados de seda berenjena (degradados verticales que imitan los pliegues) atados con una borla rosa. Al cargar, los paños se recogen una vez (800 ms; sin animación con `prefers-reduced-motion`).
2. **La cinta de seda** — franja SVG con rombos rojo/oro inspirada en el camino de mesa y las colchas del local. Hace de separador entre "estancias" (secciones). Siempre fina (10–14 px). Su rombo se reutiliza como marca de los antetítulos (en lugar de la rayita genérica).
3. **El mapa del cuerpo «¿Dónde lo notas?»** — silueta lineal de espaldas con zonas pulsables (cuello, hombros, espalda, piernas, pies, cara, todo el cuerpo). Cada zona propone el masaje focalizado y el completo, con precio, y lo lleva al ticket de reserva.
4. **El dial de presión** — Suave / Media / Firme representado con anillos concéntricos (una huella que presiona). Responde a la mayor virtud y a la peor reseña del negocio.
5. **La carta del escaparate** — la lista de precios se compone como el cartel real de su escaparate: nombre, minutos en columnas, puntos guía y precio en oro. Papel de arroz sobre fondo berenjena.
6. **Estado en vivo** — "Abierto ahora · cierra a las 21:00" calculado con hora de Madrid en la cabecera.

## Fotografía

- **Sólo fotos reales del local.** Fuente principal: las 2 fotos de la sala de espera de su web actual (activo del cliente). Secundarias: 3 fotos de cabinas publicadas en su ficha de Dénia.com (⚠ confirmar permiso con el cliente; son de baja resolución → se muestran pequeñas).
- **Prohibido:** piedras calientes, orquídeas de stock, modelos sonriendo con toalla. La foto hero de la web actual (stock con piedras) se descarta.
- **Tratamiento:** cálido, ligeramente oscurecido en bordes; las fotos de baja resolución se recortan en **franjas verticales estrechas** (formato "paño de cortina"), donde la falta de resolución no se nota y el recorte refuerza el concepto. Cuelgan de una barra dorada, como la cortina del hero.
- Las técnicas (pindas, aceite, estiramientos) **no se ilustran con stock**: se explican con texto y con el mapa del cuerpo.

## Composición

- Fondo oscuro berenjena como "interior del local"; la carta y el ticket son **piezas de papel** (arroz) sobre ese fondo: objetos que se leen, no tarjetas flotantes. Sin sombras difusas genéricas; los papeles llevan un borde fino y una ligera rotación nula (planos), como un menú apoyado.
- Rejilla de 12 columnas en escritorio con asimetría deliberada (texto 5 col / imagen 7 col; carta centrada a 8 col). Columna única en móvil con jerarquía rehecha (no apilado automático).
- Ornamento vertical «นวดแผนไทย» en el margen izquierdo de escritorio; desaparece en móvil.

## Navegación

- **Escritorio:** barra fina berenjena: logo · Carta · Por zonas · Presión · El local · Cómo llegar · ES/EN · estado "Abierto" · botón **Pedir cita** (WhatsApp).
- **Móvil:** cabecera mínima (logo + estado). **Dock inferior fijo** en la zona del pulgar con 3 acciones: **WhatsApp** (principal, oro), Llamar, Cómo llegar. Menú de secciones en hoja desplegable.
- Sin carruseles. Sin popups.

## Interacción y animación

- Cortina: una vez al cargar.
- Mapa del cuerpo: hover/focus resalta la zona en borla; clic muestra la recomendación (sin saltos de layout).
- Dial de presión: los anillos crecen al elegir.
- Filas de la carta: clic → preselecciona el servicio en el ticket y desplaza hasta él.
- Ticket: vista previa en vivo del mensaje de WhatsApp.
- Todo con `prefers-reduced-motion` respetado. Sin librerías de animación. JS vanilla < 10 KB.

## Estructura (arquitectura)

Una sola página por idioma (ES `/`, EN `/en/`) + página legal. Justificación: negocio de un único local, una sola acción (pedir cita), visitantes mayoritariamente en móvil y con prisa (turistas, ciclistas, gente que sale del trabajo). Separar en páginas obligaría a navegar para ver el precio.

1. **Calle** (hero) — qué es + horario + acción. Foto real dentro de la cortina.
2. **¿Dónde lo notas?** — mapa del cuerpo → recomendación.
3. **La carta** — completa, con precios, por familias: completos · para dos · focalizados · bonos.
4. **Tú marcas la presión** — dial + reseñas reales sobre fuerza y técnica.
5. **La sala** — fotos reales + quién te atiende (Hary y equipo) + reseñas en contexto.
6. **Pedir cita** — ticket → WhatsApp.
7. **Cómo llegar** — puntos de referencia reales (puerto, iglesia de Sant Antoni, estación), mapa bajo demanda.
8. Pie — NAP, horario, idiomas, legal.

## Referencias del sector y qué tomamos / mejoramos

| Referencia | Qué tiene | Qué tomamos | Qué mejoramos |
|---|---|---|---|
| Antara Spa (Awwwards HM 2025) | Wordmark gigante, filetes finos, "menú" | Confianza tipográfica, la idea de *carta* | Ellos esconden precios y reserva; nosotros los ponemos delante |
| Divana Spa (Bangkok) | Identidad tailandesa contemporánea, foto propia | Usar el propio espacio como imagen | Sin modelos ni lujo impostado |
| Health Land (Bangkok) | Dorado + oscuro, sobriedad | Paleta oscura cálida | Más calor y menos corporativo |
| Buathai / Ban Thai (Dénia) | WhatsApp como canal | WhatsApp como acción principal | Mensaje prellenado con presión, duración y hora |
