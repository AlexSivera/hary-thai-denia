(() => {
  const D = JSON.parse(document.getElementById('data').textContent);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const euro = (n) => (D.lang === 'es' ? `${n} €` : `€${n}`);

  /* ---------- Cortina: se recoge una vez ---------- */
  const stage = $('.stage');
  if (stage) requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add('is-open')));

  /* ---------- Estado abierto / cerrado (hora de Madrid) ---------- */
  const status = $('[data-status]');
  function madridNow() {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const h = +parts.find((p) => p.type === 'hour').value % 24;
    const m = +parts.find((p) => p.type === 'minute').value;
    return h * 60 + m;
  }
  const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  function updateStatus() {
    if (!status) return;
    const now = madridNow();
    const open = toMin(D.open), close = toMin(D.close);
    let key = 'open';
    if (now < open) key = 'before';
    else if (now >= close) key = 'after';
    status.dataset.state = key === 'open' ? 'open' : 'closed';
    $('[data-status-text]', status).textContent = D.status[key];
    $('[data-status-short]', status).textContent = D.status['short' + key[0].toUpperCase() + key.slice(1)];
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- Menú móvil ---------- */
  const menuBtn = $('.bar__menu');
  const sheet = $('#sheet');
  if (menuBtn && sheet) {
    const label = $('.bar__menu-label', menuBtn);
    const labels = [label.textContent, D.lang === 'es' ? 'Cerrar' : 'Close'];
    const setOpen = (open) => {
      sheet.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
      label.textContent = labels[open ? 1 : 0];
    };
    menuBtn.addEventListener('click', () => setOpen(sheet.hidden));
    sheet.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) { setOpen(false); menuBtn.focus(); } });
  }

  /* ---------- Ticket de cita ---------- */
  const form = $('#ticket');
  const fService = $('#f-service');
  const durBox = $('[data-durations]');
  const fDate = $('#f-date');
  const dateWrap = $('.field__date');
  const fTime = $('#f-time');
  const fName = $('#f-name');
  const preview = $('#preview');
  const send = $('#send');

  const svc = (id) => D.services[id];
  const unitLabel = (s, n) => (s.unit === 'sessions' ? `${n} ${D.sessions}` : `${n}′`);

  function renderDurations(id, wanted) {
    const s = svc(id);
    const keys = Object.keys(s.prices);
    const pick = wanted && keys.includes(String(wanted)) ? String(wanted) : (keys.includes('60') ? '60' : keys[0]);
    durBox.innerHTML = keys.map((k) => `<label><input type="radio" name="duration" value="${k}"${k === pick ? ' checked' : ''}><span>${unitLabel(s, k)} · ${euro(s.prices[k])}</span></label>`).join('');
  }

  function fmtDate(v) {
    if (!v) return '';
    const d = new Date(v + 'T12:00:00');
    return new Intl.DateTimeFormat(D.lang === 'es' ? 'es-ES' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  }

  function compose() {
    const id = fService.value;
    const s = svc(id);
    const dur = ($('input[name="duration"]:checked', form) || {}).value;
    const pressure = ($('input[name="pressure"]:checked', form) || {}).value;
    const day = ($('input[name="day"]:checked', form) || {}).value;
    const M = D.msg;
    const lines = [M.hello];
    const unit = s.unit === 'sessions' ? `${dur} ${D.sessions}` : `${dur} ${D.min}`;
    lines.push(`• ${s.name} · ${unit} (${euro(s.prices[dur])})`);
    if (pressure) lines.push(`• ${M.pressure}: ${M.p[pressure]}`);
    let dayTxt = day === 'today' ? M.today : day === 'tomorrow' ? M.tomorrow : fmtDate(fDate.value);
    if (dayTxt) lines.push(`• ${M.day}: ${dayTxt}`);
    lines.push(`• ${M.time}: ${D.times[fTime.value].toLowerCase()}`);
    const name = fName.value.trim();
    if (name) lines.push(`• ${M.name}: ${name}`);
    lines.push('', M.ask);
    const text = lines.join('\n');
    preview.textContent = text;
    send.href = `https://wa.me/${D.wa}?text=${encodeURIComponent(text)}`;
  }

  if (form) {
    // Fecha mínima: hoy
    const today = new Date();
    const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    fDate.min = iso;

    fService.addEventListener('change', () => { renderDurations(fService.value); compose(); markPicked(); });
    form.addEventListener('change', (e) => {
      if (e.target.name === 'day') dateWrap.hidden = e.target.value !== 'other';
      if (e.target.name === 'pressure') syncDial(e.target.value);
      if (e.target.name === 'duration') markPicked();
      compose();
    });
    form.addEventListener('input', compose);
    renderDurations(fService.value, 60);
    compose();
  }

  /* ---------- Selección desde la carta y el mapa del cuerpo ---------- */
  function pick(id, dur, scroll = true) {
    if (!form || !svc(id)) return;
    fService.value = id;
    renderDurations(id, dur);
    compose();
    markPicked();
    if (scroll) {
      $('#cita').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      setTimeout(() => fService.focus({ preventScroll: true }), 450);
    }
  }
  function markPicked() {
    const id = fService.value;
    const dur = ($('input[name="duration"]:checked', form) || {}).value;
    $$('.chip').forEach((c) => {
      const on = c.dataset.pick === `${id}:${dur}`;
      c.classList.toggle('is-picked', on);
      c.setAttribute('aria-pressed', String(on));
    });
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pick]');
    if (!b) return;
    const [id, dur] = b.dataset.pick.split(':');
    pick(id, dur);
  });
  markPicked();

  /* ---------- Dial de presión ⇄ ticket ---------- */
  function syncDial(v) {
    const r = $(`input[name="dial"][value="${v}"]`);
    if (r) r.checked = true;
    else $$('input[name="dial"]').forEach((x) => (x.checked = false));
  }
  $$('input[name="dial"]').forEach((r) => r.addEventListener('change', () => {
    const t = $(`input[name="pressure"][value="${r.value}"]`, form);
    if (t) { t.checked = true; compose(); }
  }));

  /* ---------- Mapa del cuerpo ---------- */
  const panel = $('#zona-panel');
  const zoneBtns = $$('.zbtn');
  const zoneShapes = $$('.zone');
  function optRow(kind, id) {
    const s = svc(id);
    const entries = Object.entries(s.prices);
    const [min, eur] = entries.find(([k]) => k === '60') || entries[0];
    const range = entries.length > 1 ? entries.map(([k, v]) => `${k}′ ${euro(v)}`).join(' · ') : `${min}′ · ${euro(eur)}`;
    return `<div class="zopt">
      <span class="zopt__k">${kind}</span>
      <span class="zopt__name">${s.name} <small>${range}</small></span>
      <button type="button" class="btn btn--line" data-pick="${id}:${min}">${D.choose}</button>
    </div>`;
  }
  function showZone(z, focusPanel) {
    zoneBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.zone === z)));
    zoneShapes.forEach((g) => g.classList.toggle('is-active', g.dataset.zone === z || z === 'all'));
    const [focus, full] = D.zones[z];
    panel.innerHTML = `<h3>${D.zoneNames[z]}</h3><p class="zpanel__note">${D.zoneNotes[z]}</p>` +
      (z === 'all' ? optRow(D.full, focus) + optRow(D.full, full) : optRow(D.focus, focus) + optRow(D.full, full));
    if (focusPanel) panel.querySelector('button')?.focus({ preventScroll: true });
  }
  if (panel) showZone('back');
  zoneBtns.forEach((b) => b.addEventListener('click', () => showZone(b.dataset.zone)));
  zoneShapes.forEach((g) => {
    g.addEventListener('click', () => showZone(g.dataset.zone));
    g.addEventListener('mouseenter', () => $(`.zbtn[data-zone="${g.dataset.zone}"]`)?.classList.add('is-hover'));
    g.addEventListener('mouseleave', () => $(`.zbtn[data-zone="${g.dataset.zone}"]`)?.classList.remove('is-hover'));
  });

  /* ---------- Mapa de Google bajo demanda ---------- */
  const map = $('.map');
  const loadBtn = $('.map__load');
  if (map && loadBtn) loadBtn.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = map.dataset.map;
    f.title = map.dataset.title;
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    map.querySelector('.map__placeholder').remove();
    map.appendChild(f);
  });
})();
