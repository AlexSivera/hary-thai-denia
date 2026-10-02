import { business as B, services, zones } from './content.mjs';
import manifest from './assets/img/manifest.json' with { type: 'json' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const euro = (n, t) => (t.lang === 'es' ? `${n} €` : `€${n}`);
const waLink = (text) => `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(text)}`;

function pic(name, alt, sizes, { cls = '', eager = false } = {}) {
  const m = manifest[name];
  const set = (ext) => m.widths.map((w) => `/assets/img/${name}-${w}.${ext} ${Math.min(w, m.w)}w`).join(', ');
  const last = m.widths[m.widths.length - 1];
  const h = Math.round((Math.min(last, m.w) * m.h) / m.w);
  return `<picture class="${cls}">
    <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
    <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
    <img src="/assets/img/${name}-${m.widths[1] || m.widths[0]}.jpg" width="${Math.min(last, m.w)}" height="${h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
  </picture>`;
}

const icon = {
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M6.6 3.5h-2a1.3 1.3 0 0 0-1.3 1.4 16 16 0 0 0 15.8 15.8 1.3 1.3 0 0 0 1.4-1.3v-2a1 1 0 0 0-.8-1l-3.4-.8a1 1 0 0 0-1 .3l-1.4 1.6a12.5 12.5 0 0 1-5.8-5.8l1.6-1.4a1 1 0 0 0 .3-1l-.8-3.4a1 1 0 0 0-1-.8Z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-5-5 5 5-5 5"/></svg>',
};

// Borla de las cortinas: cordón, cuenta blanca y fleco rosa
const tassel = `<svg class="tassel" viewBox="0 0 40 120" aria-hidden="true">
  <path d="M4 8c10 6 22 6 32 0M8 10c4 8 4 14 12 18 8-4 8-10 12-18" fill="none" stroke="var(--borla)" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="20" cy="38" r="7.5" fill="#F4ECDD"/><circle cx="17.5" cy="35.5" r="2" fill="#fff" opacity=".8"/>
  <rect x="16" y="45" width="8" height="6" rx="1.5" fill="var(--oro)"/>
  <path d="M14 51h12l5 58H9Z" fill="var(--borla)"/>
  <path d="M14 56v50M17 56v52M20 56v52M23 56v52M26 56v50" stroke="#9c2f5b" stroke-width=".8" opacity=".7"/>
</svg>`;

// Maniquí de espaldas: cada pieza es una zona
function bodySvg(t) {
  const z = t.zonas.names;
  const part = (zone, shape) => `<g class="zone" data-zone="${zone}">${shape}</g>`;
  return `<svg class="body" viewBox="0 0 240 520" role="img" aria-labelledby="body-title">
    <title id="body-title">${esc(t.zonas.hint)}</title>
    <g class="limb" aria-hidden="true">
      <ellipse cx="64" cy="158" rx="11" ry="44" transform="rotate(9 64 158)"/>
      <ellipse cx="176" cy="158" rx="11" ry="44" transform="rotate(-9 176 158)"/>
      <ellipse cx="54" cy="246" rx="9" ry="42" transform="rotate(5 54 246)"/>
      <ellipse cx="186" cy="246" rx="9" ry="42" transform="rotate(-5 186 246)"/>
      <ellipse cx="50" cy="298" rx="8" ry="12"/><ellipse cx="190" cy="298" rx="8" ry="12"/>
    </g>
    ${part('face', '<ellipse cx="120" cy="44" rx="24" ry="29"/>')}
    ${part('neck', '<rect x="109" y="70" width="22" height="24" rx="7"/>')}
    ${part('shoulders', '<ellipse cx="84" cy="106" rx="24" ry="14" transform="rotate(-8 84 106)"/><ellipse cx="156" cy="106" rx="24" ry="14" transform="rotate(8 156 106)"/>')}
    ${part('back', '<path d="M94 102 Q120 96 146 102 L152 152 Q150 192 142 222 L147 262 Q120 273 93 262 L98 222 Q90 192 88 152 Z"/>')}
    ${part('legs', '<ellipse cx="106" cy="320" rx="16" ry="52"/><ellipse cx="134" cy="320" rx="16" ry="52"/><ellipse cx="104" cy="420" rx="12" ry="46"/><ellipse cx="136" cy="420" rx="12" ry="46"/>')}
    ${part('feet', '<ellipse cx="102" cy="480" rx="13" ry="9"/><ellipse cx="138" cy="480" rx="13" ry="9"/>')}
    <g class="sen" aria-hidden="true">
      <path d="M113 104 C111 150 112 200 112 258"/><path d="M127 104 C129 150 128 200 128 258"/>
      <path d="M106 278 C105 320 106 360 104 466"/><path d="M134 278 C135 320 134 360 136 466"/>
    </g>
  </svg>`;
}

function quote([text, who, translated], t, cls = '') {
  return `<blockquote class="note ${cls}">
    <p>“${esc(text)}”</p>
    <footer>${esc(who)} · ${t.quotes.source}${translated ? ` (${t.quotes.translated})` : ''}</footer>
  </blockquote>`;
}

function priceChips(s, t, name) {
  return Object.entries(s.prices)
    .map(([min, eur]) => {
      const label = s.unit === 'sessions' ? `${min} ${t.carta.sessions}` : `${min}′`;
      return `<button type="button" class="chip" data-pick="${s.id}:${min}"><span class="sr-only">${esc(name)}: </span><span class="chip__min">${label}</span><span class="chip__eur">${euro(eur, t)}</span></button>`;
    })
    .join('');
}

function cartaGroup(group, t, extra = '') {
  const rows = services
    .filter((s) => s.group === group)
    .map((s) => {
      const [name, desc] = t.svc[s.id];
      const multi = Object.keys(s.prices).length > 2;
      return `<li class="row${desc ? '' : ' row--short'}${multi ? ' row--multi' : ''}">
        <div class="row__name"><h4>${esc(name)}</h4>${desc ? `<p>${esc(desc)}</p>` : ''}</div>
        <span class="row__lead" aria-hidden="true"></span>
        <div class="row__prices">${priceChips(s, t, name)}</div>
      </li>`;
    })
    .join('');
  return `<section class="carta__group carta__group--${group}" aria-labelledby="g-${group}">
    <h3 id="g-${group}">${esc(t.carta.groups[group])}</h3>
    ${extra}
    <ul>${rows}</ul>
  </section>`;
}

function serviceOptions(t) {
  const groups = ['full', 'two', 'focus', 'bono'];
  return groups
    .map((g) => `<optgroup label="${esc(t.carta.groups[g])}">${services
      .filter((s) => s.group === g)
      .map((s) => `<option value="${s.id}"${s.id === 'thai' ? ' selected' : ''}>${esc(t.svc[s.id][0])}</option>`)
      .join('')}</optgroup>`)
    .join('');
}

function jsonData(t) {
  const data = {
    lang: t.lang,
    wa: B.whatsapp,
    open: B.open,
    close: B.close,
    status: t.status,
    services: Object.fromEntries(services.map((s) => [s.id, { name: t.svc[s.id][0], prices: s.prices, unit: s.unit || 'min' }])),
    zones,
    zoneNames: t.zonas.names,
    zoneNotes: t.zonas.notes,
    msg: t.cita.msg,
    times: t.cita.times,
    min: t.carta.min,
    sessions: t.carta.sessions,
    choose: t.zonas.choose,
    focus: t.zonas.focus,
    full: t.zonas.full,
    levels: Object.fromEntries(Object.entries(t.presion.levels).map(([k, v]) => [k, v[0]])),
    advise: t.cita.pAdvice,
  };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function schema(t) {
  const url = B.site + t.path;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': B.site + '/#business',
    name: B.name,
    description: t.description,
    url,
    telephone: B.phone,
    image: B.site + '/assets/img/og.jpg',
    logo: B.site + '/assets/img/logo.png',
    priceRange: '25 € – 145 €',
    currenciesAccepted: 'EUR',
    address: { '@type': 'PostalAddress', streetAddress: B.street, postalCode: B.postal, addressLocality: B.city, addressRegion: B.region, addressCountry: 'ES' },
    geo: { '@type': 'GeoCoordinates', latitude: B.lat, longitude: B.lng },
    hasMap: B.mapsPlace,
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: B.open, closes: B.close }],
    knowsLanguage: ['es', 'en'],
    makesOffer: services
      .filter((s) => s.group !== 'bono')
      .flatMap((s) => Object.entries(s.prices).map(([min, eur]) => ({
        '@type': 'Offer',
        price: eur,
        priceCurrency: 'EUR',
        itemOffered: { '@type': 'Service', name: `${t.svc[s.id][0]} · ${min} min` },
      }))),
  });
}

export function page(t) {
  const N = t.nav;
  const ratingNum = t.lang === 'es' ? B.rating : B.ratingEn;
  const reviewsLink = t.local.reviewsLink.replace('{n}', B.reviews);
  const pressureLevels = Object.entries(t.presion.levels);
  const navLinks = [
    ['#carta', N.carta],
    ['#zonas', N.zonas],
    ['#presion', N.presion],
    ['#local', N.local],
    ['#llegar', N.llegar],
  ];

  return `<!DOCTYPE html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.description)}">
<link rel="canonical" href="${B.site}${t.path}">
<link rel="alternate" hreflang="es" href="${B.site}/">
<link rel="alternate" hreflang="en" href="${B.site}/en/">
<link rel="alternate" hreflang="x-default" href="${B.site}/">
<meta name="theme-color" content="#3A1525">
<meta property="og:type" content="website">
<meta property="og:locale" content="${t.locale}">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.description)}">
<meta property="og:url" content="${B.site}${t.path}">
<meta property="og:image" content="${B.site}/assets/img/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/img/favicon-48.png" type="image/png" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preload" href="/assets/fonts/taviraj-300.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/sarabun-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/styles.css">
<script>document.documentElement.classList.add('js')</script>
<script type="application/ld+json">${schema(t)}</script>
</head>
<body>
<a class="skip" href="#main">${t.skip}</a>

<header class="bar" id="top">
  <a class="bar__logo" href="${t.path}" aria-label="Hary Thai, ${esc(t.footer.tag)}">
    <img src="/assets/img/logo-h.webp" width="${manifest.logoH.w}" height="${manifest.logoH.h}" alt="">
  </a>
  <nav class="bar__nav" aria-label="${t.lang === 'es' ? 'Secciones' : 'Sections'}">
    <ul>${navLinks.map(([h, l]) => `<li><a href="${h}">${esc(l)}</a></li>`).join('')}</ul>
  </nav>
  <p class="status" data-status><span class="status__dot" aria-hidden="true"></span><span class="status__long" data-status-text>10:00–21:00</span><span class="status__short" data-status-short>10–21 h</span></p>
  <a class="bar__lang" href="${t.altPath}" hreflang="${t.altLang}" lang="${t.altLang}" title="${t.altLabel}">${t.altShort}</a>
  <a class="btn btn--gold bar__cta" href="#cita">${icon.wa}<span>${esc(N.cta)}</span></a>
  <button class="bar__menu" type="button" aria-expanded="false" aria-controls="sheet"><span class="bar__menu-lines" aria-hidden="true"></span><span class="bar__menu-label">${esc(N.menu)}</span></button>
</header>

<div class="sheet" id="sheet" hidden>
  <nav aria-label="${esc(N.menu)}">
    <ul>${navLinks.map(([h, l]) => `<li><a href="${h}">${esc(l)}</a></li>`).join('')}<li><a href="#cita">${esc(N.cta)}</a></li></ul>
  </nav>
  <a class="sheet__lang" href="${t.altPath}" hreflang="${t.altLang}" lang="${t.altLang}">${t.altLabel}</a>
</div>

<main id="main">

<section class="hero" id="inicio" aria-labelledby="hero-title">
  <div class="hero__text">
    <p class="kicker">${esc(t.hero.eyebrow)}</p>
    <h1 id="hero-title"><span class="h1a">${esc(t.hero.h1a)}</span> <span class="h1b">${esc(t.hero.h1b)}</span> <em class="h1c">${esc(t.hero.h1c)}</em></h1>
    <p class="hero__lead">${t.hero.lead}</p>
    <div class="hero__actions">
      <a class="btn btn--gold btn--lg" href="#cita">${icon.wa}<span>${esc(t.hero.cta)}</span></a>
      <a class="btn btn--line" href="#carta"><span>${esc(t.hero.cta2)}</span>${icon.arrow}</a>
    </div>
    <a class="hero__rating" href="${B.mapsReviews}" rel="noopener" target="_blank">
      <span class="stars" aria-hidden="true">${icon.star.repeat(5)}</span>
      <strong>${ratingNum}</strong> ${esc(t.hero.rating)} · ${B.reviews} ${esc(t.hero.reviews)}
    </a>
    <p class="ornament"><span lang="th">${t.ornament}</span> ${esc(t.ornamentLabel)}</p>
  </div>
  <figure class="stage">
    <div class="stage__rod" aria-hidden="true"></div>
    <div class="stage__window">
      ${pic('sala-jardin', t.hero.photoAlt, '(min-width: 1100px) 46vw, (min-width: 760px) 50vw, 92vw', { cls: 'stage__photo', eager: true })}
      <div class="drape drape--l" aria-hidden="true"></div>
      <div class="drape drape--r" aria-hidden="true"></div>
      ${tassel.replace('class="tassel"', 'class="tassel tassel--l"')}
      ${tassel.replace('class="tassel"', 'class="tassel tassel--r"')}
    </div>
    <figcaption>${esc(t.hero.caption)}</figcaption>
  </figure>
</section>

<div class="ribbon" aria-hidden="true"></div>

<section class="zonas" id="zonas" aria-labelledby="zonas-title">
  <div class="zonas__grid">
    <div class="sec-head zonas__head">
      <p class="kicker">${esc(t.zonas.kicker)}</p>
      <h2 id="zonas-title">${esc(t.zonas.h2)}</h2>
      <p>${esc(t.zonas.intro)}</p>
    </div>
    <div class="zonas__figure">
      ${bodySvg(t)}
    </div>
    <div class="zonas__side">
      <ul class="zonas__list">
        ${Object.keys(zones).map((z) => `<li><button type="button" class="zbtn" data-zone="${z}" aria-pressed="false" aria-controls="zona-panel">${esc(t.zonas.names[z])}</button></li>`).join('')}
      </ul>
      <div class="zpanel" id="zona-panel" aria-live="polite">
        <p class="zpanel__hint">${esc(t.zonas.hint)}</p>
      </div>
      ${quote(t.quotes.cyclist, t, 'note--small')}
    </div>
  </div>
</section>

<section class="carta" id="carta" aria-labelledby="carta-title">
  <div class="sec-head sec-head--center">
    <p class="kicker">${esc(t.carta.kicker)}</p>
    <h2 id="carta-title">${esc(t.carta.h2)}</h2>
    <p>${esc(t.carta.intro)}</p>
  </div>
  <div class="paper carta__paper">
    <div class="carta__col">
      ${cartaGroup('full', t)}
      ${cartaGroup('two', t)}
      ${quote(t.quotes.couple, t, 'note--paper')}
    </div>
    <div class="carta__col">
      ${cartaGroup('focus', t)}
      ${cartaGroup('bono', t, `<p class="carta__sub">${esc(t.carta.bonoNote)}</p>`)}
    </div>
    <p class="carta__note">${esc(t.carta.note)}</p>
  </div>
</section>

<div class="ribbon" aria-hidden="true"></div>

<section class="presion" id="presion" aria-labelledby="presion-title">
  <div class="presion__text">
    <p class="kicker">${esc(t.presion.kicker)}</p>
    <h2 id="presion-title">${esc(t.presion.h2)}</h2>
    <p>${esc(t.presion.intro)}</p>
  </div>
  <fieldset class="dial">
    <legend class="sr-only">${esc(t.cita.pressure)}</legend>
    ${pressureLevels.map(([k, [label, desc]], i) => `<label class="dial__opt dial__opt--${k}">
      <input type="radio" name="dial" value="${k}"${k === 'medium' ? ' checked' : ''}>
      <span class="dial__rings" aria-hidden="true">${'<i></i>'.repeat(i + 1)}</span>
      <span class="dial__label">${esc(label)}</span>
      <span class="dial__desc">${esc(desc)}</span>
    </label>`).join('')}
  </fieldset>
  <p class="presion__advice">${esc(t.presion.advice)}</p>
  <div class="presion__quotes">
    ${t.quotes.pressure.map((q) => quote(q, t)).join('')}
  </div>
</section>

<section class="local" id="local" aria-labelledby="local-title">
  <div class="local__intro">
    <div class="local__text">
      <p class="kicker">${esc(t.local.kicker)}</p>
      <h2 id="local-title">${esc(t.local.h2)}</h2>
      <p>${esc(t.local.p1)}</p>
      <p>${esc(t.local.p2)}</p>
      ${quote(t.quotes.place, t)}
    </div>
    <figure class="local__photo">
      ${pic('sala-entrada', t.local.photoAlt, '(min-width: 900px) 58vw, 100vw')}
    </figure>
  </div>
  <ul class="panos">
    ${t.local.strip.map(([n, alt]) => `<li class="pano"><figure>${pic(n, alt, '(min-width: 900px) 24vw, 46vw')}<figcaption>${esc(alt)}</figcaption></figure></li>`).join('')}
  </ul>
  <div class="who">
    <p class="kicker">${esc(t.local.whoKicker)}</p>
    <h3>${esc(t.local.whoH)}</h3>
    <p>${esc(t.local.who)}</p>
    <div class="who__quotes">
      ${quote(t.quotes.hary, t)}
      ${quote(t.quotes.team, t)}
    </div>
    <a class="link" href="${B.mapsReviews}" target="_blank" rel="noopener">${esc(reviewsLink)} ${icon.arrow}</a>
  </div>
</section>

<div class="ribbon" aria-hidden="true"></div>

<section class="cita" id="cita" aria-labelledby="cita-title">
  <div class="sec-head">
    <p class="kicker">${esc(t.cita.kicker)}</p>
    <h2 id="cita-title">${esc(t.cita.h2)}</h2>
    <p>${esc(t.cita.intro)}</p>
  </div>
  <div class="ticket paper" id="ticket" role="group" aria-labelledby="cita-title">
    <div class="ticket__fields">
      <div class="field">
        <label for="f-service">${esc(t.cita.service)}</label>
        <select id="f-service" name="service">${serviceOptions(t)}</select>
      </div>
      <fieldset class="field field--inline" id="f-duration">
        <legend>${esc(t.cita.duration)}</legend>
        <div class="seg" data-durations>
          ${Object.entries(services[0].prices).map(([m, e], i) => `<label><input type="radio" name="duration" value="${m}"${i === 1 ? ' checked' : ''}><span>${m}′ · ${euro(e, t)}</span></label>`).join('')}
        </div>
      </fieldset>
      <fieldset class="field field--inline">
        <legend>${esc(t.cita.pressure)}</legend>
        <div class="seg">
          ${pressureLevels.map(([k, [label]]) => `<label><input type="radio" name="pressure" value="${k}"${k === 'medium' ? ' checked' : ''}><span>${esc(label)}</span></label>`).join('')}
          <label><input type="radio" name="pressure" value="advise"><span>${esc(t.cita.pAdvice)}</span></label>
        </div>
      </fieldset>
      <fieldset class="field field--inline">
        <legend>${esc(t.cita.day)}</legend>
        <div class="seg">
          <label><input type="radio" name="day" value="today" checked><span>${esc(t.cita.today)}</span></label>
          <label><input type="radio" name="day" value="tomorrow"><span>${esc(t.cita.tomorrow)}</span></label>
          <label><input type="radio" name="day" value="other"><span>${esc(t.cita.other)}</span></label>
        </div>
        <div class="field__date" hidden>
          <label for="f-date">${esc(t.cita.date)}</label>
          <input type="date" id="f-date" name="date">
        </div>
      </fieldset>
      <div class="field">
        <label for="f-time">${esc(t.cita.time)}</label>
        <select id="f-time" name="time">${Object.entries(t.cita.times).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('')}</select>
      </div>
      <div class="field">
        <label for="f-name">${esc(t.cita.name)} <span class="opt">${esc(t.cita.optional)}</span></label>
        <input type="text" id="f-name" name="name" autocomplete="given-name" maxlength="60">
      </div>
    </div>
    <div class="ticket__out">
      <p class="ticket__label" id="preview-label">${esc(t.cita.preview)}</p>
      <output class="bubble" id="preview" for="f-service f-time f-name" aria-labelledby="preview-label">${esc(t.cita.fallback)}</output>
      <a class="btn btn--wa btn--lg" id="send" href="${waLink(t.cita.fallback)}" target="_blank" rel="noopener">${icon.wa}<span>${esc(t.cita.send)}</span></a>
      <p class="ticket__call">${esc(t.cita.call)} <a href="tel:${B.phone}">${B.phoneDisplay}</a></p>
      <p class="ticket__privacy">${esc(t.cita.privacy)}</p>
    </div>
  </div>
</section>

<section class="llegar" id="llegar" aria-labelledby="llegar-title">
  <div class="llegar__text">
    <p class="kicker">${esc(t.llegar.kicker)}</p>
    <h2 id="llegar-title">${esc(t.llegar.h2)}</h2>
    <address>${esc(t.llegar.address)}</address>
    <dl class="refs">
      ${t.llegar.refs.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}
    </dl>
    <div class="hours">
      <h3>${esc(t.llegar.hoursH)}</h3>
      <p><span>${esc(t.llegar.hours)}</span> <strong>10:00 – 21:00</strong></p>
    </div>
    <a class="btn btn--line" href="${B.mapsDirections}" target="_blank" rel="noopener">${icon.pin}<span>${esc(t.llegar.directions)}</span></a>
  </div>
  <div class="map" data-map="${esc(B.mapsEmbed)}" data-title="${esc(t.llegar.mapTitle)}">
    <div class="map__placeholder">
      <span class="map__pin">${icon.pin}</span>
      <p class="map__addr">${esc(t.llegar.mapTitle)}</p>
      <button type="button" class="btn btn--line map__load">${esc(t.llegar.loadMap)}</button>
      <p class="map__note">${esc(t.llegar.mapNote)}</p>
    </div>
  </div>
</section>

</main>

<footer class="foot">
  <div class="foot__brand">
    <img src="/assets/img/logo.webp" width="${manifest.logo.w}" height="${manifest.logo.h}" alt="Hary Thai" loading="lazy">
  </div>
  <div class="foot__col">
    <p>${esc(B.street)}<br>${B.postal} ${B.city} (${B.region})</p>
    <p>${esc(t.llegar.hours)} · 10:00–21:00</p>
  </div>
  <div class="foot__col">
    <p>${esc(t.footer.phone)}<br><a href="tel:${B.phone}">${B.phoneDisplay}</a></p>
    <p><a href="${t.altPath}" hreflang="${t.altLang}" lang="${t.altLang}">${t.altLabel}</a> · <a href="${t.legalPath}">${esc(t.footer.legal)}</a></p>
  </div>
  <p class="foot__note">${esc(t.footer.note)} © ${new Date().getFullYear()} Hary Thai · Dénia</p>
</footer>

<nav class="dock" aria-label="${t.lang === 'es' ? 'Acciones rápidas' : 'Quick actions'}">
  <a class="dock__wa" href="#cita">${icon.wa}<span>${esc(t.dock.wa)}</span></a>
  <a href="tel:${B.phone}">${icon.phone}<span>${esc(t.dock.call)}</span></a>
  <a href="${B.mapsDirections}" target="_blank" rel="noopener">${icon.pin}<span>${esc(t.dock.go)}</span></a>
</nav>

<script type="application/json" id="data">${jsonData(t)}</script>
<script src="/assets/main.js" defer></script>
</body>
</html>`;
}

export function legalPage(t) {
  const es = t.lang === 'es';
  const body = es
    ? `<h1>Aviso legal y privacidad</h1>
<h2>Titular</h2>
<p>Hary Thai · ${esc(B.street)}, ${B.postal} ${B.city} (${B.region}) · Tel. ${B.phoneDisplay}.</p>
<!-- PENDIENTE: razón social / nombre del titular y NIF, a facilitar por el negocio -->
<p class="pending">Datos fiscales del titular: pendientes de incorporar.</p>
<h2>Qué datos tratamos</h2>
<p>Esta web no tiene formularios que envíen datos a ningún servidor ni usa cookies propias ni de analítica. El apartado «Pedir cita» sólo compone un mensaje en tu navegador; si decides enviarlo, lo haces tú desde WhatsApp y ese mensaje queda sujeto a la política de privacidad de WhatsApp. Usamos los datos que nos envíes (nombre, teléfono, preferencia de cita) únicamente para gestionar tu cita.</p>
<h2>Mapa</h2>
<p>El mapa de Google sólo se carga si pulsas «Cargar mapa». A partir de ese momento Google puede instalar cookies según su propia política.</p>
<h2>Tus derechos</h2>
<p>Puedes pedir acceso, rectificación o supresión de tus datos escribiendo al ${B.phoneDisplay} o en el propio centro.</p>
<p><a href="/">← Volver a la web</a></p>`
    : `<h1>Legal notice &amp; privacy</h1>
<h2>Owner</h2>
<p>Hary Thai · ${esc(B.street)}, ${B.postal} ${B.city} (${B.region}, Spain) · Tel. +34 ${B.phoneDisplay}.</p>
<!-- PENDING: legal name and tax ID, to be provided by the business -->
<p class="pending">Company tax details: pending.</p>
<h2>What data we handle</h2>
<p>This website has no forms that send data to a server and uses no own or analytics cookies. The “Book” section only composes a message in your browser; if you choose to send it, you do so yourself on WhatsApp, under WhatsApp’s privacy policy. We use what you send us (name, phone, booking preference) only to manage your appointment.</p>
<h2>Map</h2>
<p>The Google map only loads if you press “Load map”. From then on Google may set cookies under its own policy.</p>
<h2>Your rights</h2>
<p>You can ask to access, correct or delete your data by contacting +34 ${B.phoneDisplay} or at the centre.</p>
<p><a href="/en/">← Back to the website</a></p>`;
  return `<!DOCTYPE html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${es ? 'Aviso legal y privacidad' : 'Legal notice &amp; privacy'} · Hary Thai</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/assets/img/favicon-48.png" type="image/png">
<link rel="stylesheet" href="/assets/styles.css">
</head>
<body class="legal">
<header class="bar bar--simple"><a class="bar__logo" href="${t.path}"><img src="/assets/img/logo-h.webp" width="${manifest.logoH.w}" height="${manifest.logoH.h}" alt="Hary Thai"></a></header>
<main class="legal__main paper">${body}</main>
</body>
</html>`;
}
