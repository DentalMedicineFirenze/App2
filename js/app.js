/* Dental Medicine Firenze — App Pazienti (PWA)
   Vanilla JS, routing via hash (#/come-arrivare), testi in /content/{it,en}.json */
(() => {
  'use strict';
  const VERSION = '1.4.1';
  const STUDIO = { lat: 43.7816466, lng: 11.2530101, query: 'Viale Spartaco Lavagnini 47, 50129 Firenze', garage: 'Garage Indipendenza, Via Enrico Poggi 12r, 50129 Firenze' };

  /* ---------- storage sicuro ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- icone lineari ---------- */
  const P = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
  const TOOTH = '<path d="M12 5.5c-1.6-1.4-3.4-2-5-1.4C4.8 5 4 7.6 4.6 10.3c.4 1.8 1 3.2 1.3 5 .4 2.4.9 4.9 2.4 4.9 1.4 0 1.5-2.3 2-4 .3-1.1.8-1.6 1.7-1.6s1.4.5 1.7 1.6c.5 1.7.6 4 2 4 1.5 0 2-2.5 2.4-4.9.3-1.8.9-3.2 1.3-5 .6-2.7-.2-5.3-2.4-6.2-1.6-.6-3.4 0-5 1.4z"/>';
  const I = {
    pin: P('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    tooth: P(TOOTH),
    'tooth-out': P(TOOTH.replace('M12 5.5', 'M12 7.5').replace(/4\.6 10\.3/, '4.6 12.3') + '<path d="M12 2v3M9.5 3.2 10.6 5M14.5 3.2 13.4 5"/>'),
    implant: P('<path d="M7.5 3.5h9c1 0 1.6 1 1.2 1.9L16.5 8h-9L6.3 5.4c-.4-.9.2-1.9 1.2-1.9z"/><path d="M8.5 10h7M9 12.5h6M9.5 15h5M10 17.5h4M11 20h2"/>'),
    root: P('<path d="M7 4.5c1.7-1 3.3-.5 5 .5 1.7-1 3.3-1.5 5-.5 1.8 1.1 1.7 4 .6 6.5L16 21c-.3 1-1.4 1-1.6 0L13 14h-2l-1.4 7c-.2 1-1.3 1-1.6 0L6.4 11C5.3 8.5 5.2 5.6 7 4.5z"/><path d="M12 5v6"/>'),
    gum: P('<path d="M3 9c2 1.5 4 2 9 2s7-.5 9-2"/><path d="M5.5 10.5v3.5c0 1.5 1 2.5 2.2 2.5s1.8-1 1.8-2.5v-3M9.5 11v3.5c0 1.5 1 2.5 2.5 2.5s2.5-1 2.5-2.5V11M14.5 11v3c0 1.5.6 2.5 1.8 2.5s2.2-1 2.2-2.5v-3.5"/>'),
    crown: P('<path d="M4 8.5 7.5 11 12 5l4.5 6L20 8.5l-1.5 8h-13z"/><path d="M6 19.5h12"/>'),
    denture: P('<path d="M3.5 8c0 6 3.8 10 8.5 10s8.5-4 8.5-10"/><path d="M6.5 9.5v2M9.2 10.3v2.4M12 10.5V13M14.8 10.3v2.4M17.5 9.5v2"/>'),
    sparkle: P('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>'),
    sun: P('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"/>'),
    child: P('<circle cx="12" cy="7" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/><path d="M10.5 7.2h.01M13.5 7.2h.01"/>'),
    brush: P('<path d="M4 20 14 10"/><rect x="13" y="3.5" width="6" height="8" rx="1.5" transform="rotate(45 16 7.5)"/>'),
    apple: P('<path d="M12 7c-1.2-1-3-1.5-4.5-.8C5 7.3 4.4 10.4 5.4 13.6 6.5 17.3 8.6 20 10.5 20c.7 0 1-.4 1.5-.4s.8.4 1.5.4c1.9 0 4-2.7 5.1-6.4 1-3.2.4-6.3-2.1-7.4C15 5.5 13.2 6 12 7z"/><path d="M12 7c0-2 1-3.5 3-4"/>'),
    question: P('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.8-2.5 2.2-2.5 3.8M12 17h.01"/>'),
    chip: P('<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2.5v3M15 2.5v3M9 18.5v3M15 18.5v3M2.5 9h3M2.5 15h3M18.5 9h3M18.5 15h3"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/>'),
    drop: P('<path d="M12 3c3.8 5.2 6 8.6 6 11.3a6 6 0 0 1-12 0C6 11.6 8.2 8.2 12 3z"/>'),
    bone: P('<path d="M8.5 15.5l7-7"/><path d="M8.5 15.5a2.3 2.3 0 1 0-3 2.9 2.3 2.3 0 1 0 2.9-3"/><path d="M15.5 8.5a2.3 2.3 0 1 1 3-2.9 2.3 2.3 0 1 1-2.9 3"/>'),
    glucose: P('<rect x="5" y="6" width="14" height="13" rx="2.5"/><path d="M9 3.5V8M15 3.5V8M5 11h14"/><path d="M12 13.5v3M10.5 15h3"/>'),
    heart: P('<path d="M12 20s-7.5-4.5-7.5-10A4 4 0 0 1 12 8a4 4 0 0 1 7.5 2c0 5.5-7.5 10-7.5 10z"/><path d="M6 12.5h3.5l1.5-2 2 4 1.5-2H18"/>'),
    shield: P('<path d="M12 3l7.5 3v5.5c0 4.5-3 8.2-7.5 9.5-4.5-1.3-7.5-5-7.5-9.5V6z"/>'),
    pill: P('<rect x="3.2" y="8.6" width="17.6" height="6.8" rx="3.4" transform="rotate(-35 12 12)"/><path d="M9.9 9 14.1 15"/>'),
    people: P('<circle cx="9" cy="8" r="3.2"/><path d="M3 19.5v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1"/><circle cx="17" cy="9" r="2.6"/><path d="M16.5 13.6a4.3 4.3 0 0 1 4.5 4.3v1"/>'),
    star: P('<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.8z"/>'),
    bulb: P('<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>'),
    chev: P('<path d="m9 6 6 6-6 6"/>', 'class="chev"'),
    back: P('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    home: P('<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/>'),
    grid: P('<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>'),
    gear: P('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    phone: P('<path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.8 2 2 0 0 1 3.1 1.5h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.1 9.4a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>'),
    car: P('<path d="M5 16.5V12l1.8-4.6A2 2 0 0 1 8.7 6h6.6a2 2 0 0 1 1.9 1.4L19 12v4.5"/><path d="M3.5 16.5h17v2.5h-3v-1.5h-11V19h-3z"/><path d="M5 12h14"/><circle cx="8" cy="14.3" r=".6"/><circle cx="16" cy="14.3" r=".6"/>'),
    train: P('<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 10.5h14M9 20.5l1.5-3.5M15 20.5 13.5 17"/><circle cx="9" cy="14" r=".7"/><circle cx="15" cy="14" r=".7"/>'),
    tram: P('<path d="M9 2.5h6M12 2.5v3"/><rect x="5.5" y="5.5" width="13" height="12" rx="3"/><path d="M5.5 11.5h13M8 21l2-3.5M16 21l-2-3.5"/><circle cx="9" cy="14.5" r=".7"/><circle cx="15" cy="14.5" r=".7"/>'),
    walk: P('<circle cx="13" cy="4.5" r="1.8"/><path d="m9.5 21 2.2-6.2 2.8 2.7V21M8 12.5l1.3-4.3 3.4-.7 2.3 3.2 2.5 1.3M11.7 14.8 12.7 9"/>'),
    parking: P('<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M9.5 17V7.5h3.3a2.8 2.8 0 0 1 0 5.6H9.5"/>'),
    info: P('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8h.01"/>'),
    alert: P('<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4.5M12 17h.01"/>'),
    check: P('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 'class="check"'),
    ok: P('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 'stroke-width="2.5"'),
    no: P('<path d="M6 6l12 12M18 6 6 18"/>', 'stroke-width="2.5"'),
    globe: P('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>'),
    lock: P('<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>'),
    mail: P('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/>'),
    share: P('<path d="M12 15V3M7.5 7.5 12 3l4.5 4.5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>'),
    plus: P('<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/>'),
    nav: P('<path d="M3 11 21 3l-8 18-2-8z"/>'),
    close: P('<path d="M6 6l12 12M18 6 6 18"/>'),
    clock: P('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    map: P('<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>')
  };

  /* ---------- i18n ---------- */
  const T = { it: null, en: null };
  let lang = 'it';
  const L = () => T[lang];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const fmt = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k] ?? '');

  function pickInitialLang() {
    const saved = store.get('dmf.lang');
    if (saved === 'it' || saved === 'en') return saved;
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'it';
    return /^en\b/i.test(nav) ? 'en' : 'it';
  }
  function setLang(l, rerender = true) {
    lang = l; store.set('dmf.lang', l);
    document.documentElement.lang = l;
    renderBar();
    if (rerender) render({ keepScroll: true });
  }

  /* ---------- helpers UI ---------- */
  const $ = s => document.querySelector(s);
  const main = () => $('#view');
  const mapsGoogle = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  const mapsApple = q => 'https://maps.apple.com/?q=' + encodeURIComponent(q);
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const header = (title, sub, bg) => `
    <header class="phead${bg ? ' img' : ''}"${bg ? ` style="--bgimg:url('${new URL(bg, document.baseURI).href}')"` : ''}>
      <button class="back" data-back aria-label="${esc(L().ui.back)}">${I.back}</button>
      <h1>${esc(title)}</h1>${sub ? `<p>${esc(sub)}</p>` : ''}
    </header>`;
  const card = (href, icon, title, sub, compact) => `
    <a class="card${compact ? ' compact' : ''}" href="${href}">
      <span class="ico">${I[icon] || I.tooth}</span>
      <span class="txt"><h3>${esc(title)}</h3>${sub ? `<p>${esc(sub)}</p>` : ''}</span>${I.chev}
    </a>`;
  const callBtn = (cls = 'btn primary') => `<a class="${cls}" href="${L().studio.phone_href}">${I.phone}<span>${esc(L().ui.call)} · ${esc(L().studio.phone_label)}</span></a>`;
  const linkPhone = text => esc(text).replace(/(\+39 )?055 483706/, m => `<a href="${L().studio.phone_href}">${m}</a>`);

  function toast(msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2600);
  }

  /* ---------- views ---------- */
  // ordine dello staff: chi è "fisso" resta in testa, gli altri cambiano ordine a ogni apertura dell'app
  const shuffleKeys = {};
  function staffGroups() {
    return L().staff.map((g, gi) => {
      const fixed = g.fixed || 0;
      if (!fixed) return g;
      const rest = g.people.slice(fixed);
      if (!shuffleKeys[gi]) shuffleKeys[gi] = rest.map(() => Math.random());
      const order = rest.map((p, i) => [shuffleKeys[gi][i], p]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
      return { ...g, people: g.people.slice(0, fixed).concat(order) };
    });
  }

  function staffCard() {
    const u = L().ui;
    const faces = staffGroups().flatMap(g => g.people).slice(0, 5);
    return `<a class="card staff-card" href="#/staff">
      <span class="ico">${I.people}</span>
      <span class="txt"><h3>${esc(u.staff_title)}</h3><p>${esc(u.card_staff_sub)}</p>
        <span class="faces" aria-hidden="true">${faces.map(([id]) => `<img src="img/staff/${id}.webp" alt="" width="40" height="40">`).join('')}<i>+${staffGroups().reduce((n, g) => n + g.people.length, 0) - faces.length}</i></span></span>${I.chev}
    </a>`;
  }

  function vStaff() {
    const u = L().ui;
    return `${header(u.staff_title, u.staff_sub, 'img/studio-1.webp')}
      <div class="content">
      ${staffGroups().map(g => `<section class="staff-g" aria-label="${esc(g.group)}">
        <h2 class="sec-title">${esc(g.group)}</h2>
        <ul class="staff-grid">${g.people.map(([id, name]) => `<li class="person">
          <img src="img/staff/${id}.webp" alt="" loading="lazy" width="360" height="480">
          <b>${esc(name)}</b></li>`).join('')}</ul>
      </section>`).join('')}
      </div>`;
  }

  function vHome() {
    const u = L().ui, st = L().studio;
    return `
      <section class="hero">
        <img class="logo" src="img/logo.png" alt="Dental Medicine Firenze" width="1220" height="422">
        <p class="motto">${esc(u.motto)}</p>
      </section>
      <div class="cards">${card('#/come-arrivare', 'pin', u.card_howto_title, u.card_howto_sub)}${staffCard()}</div>
      <div class="contact-wrap"><a class="btn primary contact-btn" href="${st.phone_href}">${I.phone}${esc(u.contact_btn)}</a><a class="phone-big" href="${st.phone_href}"><small>${esc(u.phone_word)}</small><span>${esc(st.phone_label)}</span></a></div>
      <a class="review-btn" href="${st.review_url}" target="_blank" rel="noopener">${I.star}<span><b>${esc(u.review_btn)}</b><small>${esc(u.review_sub)}</small></span>${I.chev}</a>
      ${isStandalone() ? '' : `<button class="add-home" data-inst-open>${I.plus}${esc(u.install_settings)}</button>`}`;
  }

  function vSections() {
    const u = L().ui;
    return `<header class="phead img sections-head" style="--bgimg:url('${new URL('img/studio-4.webp', document.baseURI).href}')"><h1 style="margin-top:22px">${esc(u.sections_title)}</h1><p>${esc(u.sections_sub)}</p></header>
      <div class="cards">
        ${card('#/post-intervento', 'tooth', u.card_after_title, u.card_after_sub)}
        ${card('#/pillole', 'bulb', u.card_pills_title, u.card_pills_sub)}
        ${card('#/farmaci', 'pill', u.card_meds_title, u.card_meds_sub)}
      </div>`;
  }

  /* ---------- Farmaci e cure dentali ---------- */
  function medsCall() {
    const m = L().meds, st = L().studio;
    return `<section class="meds-cta"><h2>${esc(m.cta_title)}</h2><p>${esc(m.cta_text)}</p>${callBtn()}</section>
      <div class="notice">${I.info}<span>${linkPhone(m.disclaimer)}</span></div>`;
  }
  function vMedsList() {
    const m = L().meds;
    return `${header(m.title, m.sub, 'img/studio-2.webp')}
      <div class="content">
        <p class="meds-intro">${esc(m.intro)}</p>
        <div class="cards" style="padding:0">${m.items.map(it => card('#/farmaci/' + it.slug, it.icon, it.title, it.sub, true)).join('')}</div>
        <section class="panel meds-key"><h2>${esc(m.key_title)}</h2><ol class="steps">${m.key.map(x => `<li>${md(x)}</li>`).join('')}</ol></section>
        ${medsCall()}
      </div>`;
  }
  function medPart(x) {
    const ul = a => `<ul class="bullets">${a.map(i => `<li>${md(i)}</li>`).join('')}</ul>`;
    switch (x.t) {
      case 'p': return `<p>${md(x.p)}</p>`;
      case 'small': return `<p class="m-small">${md(x.p)}</p>`;
      case 'drugs': return `<p class="m-drugs">${md(x.p)}</p>`;
      case 'never': return `<p class="m-never">${I.alert}<span>${md(x.p)}</span></p>`;
      case 'onco': return `<p class="m-onco">${md(x.p)}</p>`;
      case 'note': return `<p class="m-note">${md(x.p)}</p>`;
      case 'blk': return `<div class="m-blk ${x.k}"><h3>${esc(x.h)}</h3>${x.p ? `<p>${md(x.p)}</p>` : ''}${x.ul ? ul(x.ul) : ''}</div>`;
      case 'steps': return `<div class="m-steps">${x.items.map(([k, t, hi]) => `<div class="m-step${hi ? ' hi' : ''}"><span>${esc(k)}</span>${md(t)}</div>`).join('')}</div>`;
      case 'stats': return `<div class="m-stats">${x.items.map(([v, d, hi]) => `<div class="m-stat${hi ? ' hi' : ''}"><b>${esc(v)}</b><span>${esc(d)}</span></div>`).join('')}</div>`;
      case 'time': return `<ol class="timeline">${x.items.map(([d, t]) => `<li><span class="day">${esc(d)}</span><p>${md(t)}</p></li>`).join('')}</ol>`;
      case 'todo': return `<ol class="steps">${x.items.map(([b, t]) => `<li><b>${esc(b)}</b><br><span class="m-muted">${md(t)}</span></li>`).join('')}</ol>`;
      case 'card': return `<section class="panel m-card">${x.h ? `<h2>${esc(x.h)}</h2>` : ''}${x.parts.map(medPart).join('')}</section>`;
      case 'alert': return `<section class="alarm" role="note"><h2>${I.alert}${esc(x.h)}</h2>${ul(x.ul)}${callBtn('btn')}</section>`;
    }
    return '';
  }
  function vMedDetail(slug) {
    const m = L().meds, it = m.items.find(x => x.slug === slug);
    if (!it) return vNotFound();
    return `${header(it.title, it.lead || it.sub)}
      <div class="content">${it.parts.map(medPart).join('')}${medsCall()}</div>`;
  }

  function vHowto() {
    const h = L().howto, s = L().studio, pk = h.parking;
    const tab = store.get('dmf.tab') || 'car';
    const tabs = [['car', 'car'], ['train', 'train'], ['tram', 'tram'], ['walk', 'walk']];
    return `
      ${header(h.title, h.sub, 'img/mappa-studio.webp')}
      <div class="content">
        <div class="map-wrap"><div id="map" role="img" aria-label="${esc(s.name)} – ${esc(s.address)}"></div></div>
        <div class="map-actions">
          <a class="btn primary" href="${mapsGoogle(STUDIO.query)}" target="_blank" rel="noopener">${I.nav}${esc(h.open_google)}</a>
          <a class="btn" href="${mapsApple(STUDIO.query)}" target="_blank" rel="noopener">${I.map}${esc(h.open_apple)}</a>
        </div>

        <div class="panel addr">
          <a class="addr-row" href="${mapsGoogle(STUDIO.query)}" target="_blank" rel="noopener">${I.pin}<span><small>${esc(h.address_label)}</small><b>${esc(s.address)}</b><br>${esc(s.city)}</span></a>
          <a class="addr-row" href="${s.phone_href}">${I.phone}<span><small>${esc(h.phone_label)}</small><span class="tel">${esc(s.phone_label)}</span></span></a>
        </div>

        ${parkingBox()}

        <div class="tabs" role="tablist" aria-label="${esc(h.title)}">
          ${tabs.map(([k, ic]) => `<button class="tab" role="tab" id="tab-${k}" aria-controls="tp" aria-selected="${k === tab}" data-tab="${k}">${I[ic]}<span>${esc(h.tabs[k])}</span></button>`).join('')}
        </div>
        <div id="tp" class="panel tabpanel" role="tabpanel" aria-labelledby="tab-${tab}">${tabPanel(tab)}</div>

        <section id="other-parking"${tab === 'car' ? '' : ' hidden'}>
        <h2 class="sec-title">${esc(h.other_parking.title)}</h2>
        <p class="sec-sub">${esc(h.other_parking.sub)}</p>
        <div class="panel"><ul class="plist">
          ${h.other_parking.items.map(p => `<li><span class="pcode">${p.code}</span><span class="pn"><b>${esc(p.name)}</b><small>${esc(p.note)}</small></span><span class="pw">${esc(p.walk)}</span></li>`).join('')}
        </ul></div>
        </section>

        <button class="map-wrap map-fallback" data-lightbox="img/mappa-studio.webp" aria-label="${esc(h.title)}" style="width:100%;border:1px solid var(--line)">
          <img src="img/mappa-studio.webp" alt="${lang === 'it' ? 'Mappa dello studio con fermate del tram, percorso a piedi dalla stazione e parcheggi' : 'Map of the practice with tram stops, walking route from the station and car parks'}" loading="lazy" width="1476" height="896">
        </button>
      </div>`;
    function parkingBox() {
      return `
        <section class="parking" aria-labelledby="pk-t">
          <span class="badge">${I.parking}${esc(pk.badge)}</span>
          <h2 id="pk-t">${esc(pk.title)}</h2>
          <p class="g-name">${esc(pk.garage)}</p>
          <p class="g-addr">${esc(pk.garage_addr)}</p>
          <p class="g-dist">${esc(pk.garage_dist)}</p>
          <p class="rates-lbl">${esc(pk.rates_label)}</p>
          <div class="rates">${pk.rates.map(r => `<div class="rate"><b>${esc(r.value)}</b><span>${esc(r.unit)}</span><small>${esc(r.label)}</small></div>`).join('')}</div>
          <div class="how">${I.info}<span>${esc(pk.how)}</span></div>
          <a class="btn light" href="${mapsGoogle(STUDIO.garage)}" target="_blank" rel="noopener">${I.nav}${esc(pk.nav)}</a>
        </section>`;
    }
  }

  function tabPanel(k) {
    const h = L().howto, d = h[k];
    const list = arr => `<ul>${arr.map(x => `<li>${md(x)}</li>`).join('')}</ul>`;
    if (k === 'car') return `<h2>${esc(d.title)}</h2>${d.text.map(p => `<p>${md(p)}</p>`).join('')}`;
    if (k === 'train') return `<h2>${esc(d.title)}</h2><p>${esc(d.intro)}</p>${list(d.list)}<p>${esc(d.outro)}</p>`;
    if (k === 'walk') return `<h2>${esc(d.title)}</h2><p>${esc(d.intro)}</p>${list(d.list)}`;
    return `<h2>${esc(d.title)}</h2><p>${esc(d.intro)}</p>
      <table class="ttable"><thead><tr><th>${esc(d.col_stop)}</th><th>${esc(d.col_line)}</th><th>${esc(d.col_walk)}</th></tr></thead><tbody>
      ${d.stops.map(s => `<tr><td>${s.note ? `<b>${esc(s.name)}</b><small>${esc(s.note)}</small>` : esc(s.name)}</td><td>${s.lines.map(l => `<span class="line ${l}">${l}</span>`).join('')}</td><td>${esc(s.walk)}</td></tr>`).join('')}
      </tbody></table><p>${md(d.lines)}</p><p>${md(d.outro)}</p>`;
  }

  function vAfterList() {
    const a = L().aftercare;
    return `${header(a.title, a.sub, 'img/studio-2.webp')}
      <div class="content">
        <div class="notice">${I.info}<span>${linkPhone(a.disclaimer)}</span></div>
        <div class="cards" style="padding:0">${a.items.map(it => card('#/post-intervento/' + it.slug, it.icon, it.title, a.item_sub, true)).join('')}</div>
      </div>`;
  }

  function vAfterDetail(slug) {
    const a = L().aftercare, it = a.items.find(x => x.slug === slug);
    if (!it) return vNotFound();
    const ul = (arr, cls = 'bullets') => `<ul class="${cls}">${arr.map(x => `<li>${md(x)}</li>`).join('')}</ul>`;
    return `${header(it.title, a.item_sub)}
      <div class="content">
        <div class="done-box"><h2>${esc(a.h_done)}</h2><p>${md(it.done)}</p></div>
        <section class="panel"><h2>${esc(a.h_first)}</h2><ol class="steps">${it.first.map(x => `<li>${md(x)}</li>`).join('')}</ol></section>
        <section class="panel"><h2>${esc(a.h_diet)}</h2><ol class="timeline">${it.diet.map(([d, t]) => `<li><span class="day">${esc(d)}</span><p>${md(t)}</p></li>`).join('')}</ol></section>
        <div class="foods">
          <section class="food yes"><h3><span class="mk">${I.ok}</span>${esc(a.h_yes)}</h3>${ul(it.yes, 'chips')}</section>
          <section class="food no"><h3><span class="mk">${I.no}</span>${esc(a.h_no)}</h3>${ul(it.no, 'chips')}</section>
        </div>
        <section class="alarm" role="note"><h2>${I.alert}${esc(a.h_alarm)}</h2>${ul(it.alarm)}${callBtn('btn')}</section>
        <section class="panel"><h2>${esc(a.h_hygiene)}</h2>${ul(it.hygiene)}</section>
        <div class="notice">${I.info}<span>${linkPhone(a.disclaimer)}</span></div>
      </div>`;
  }

  function vPillsList() {
    const p = L().insights;
    return `${header(p.title, p.sub, 'img/studio-3.webp')}
      <div class="content">
        <div class="cards" style="padding:0">${p.items.map(it => card('#/pillole/' + it.slug, it.icon, it.title, it.subtitle, true)).join('')}</div>
        <div class="notice" style="margin-top:16px">${I.info}<span>${linkPhone(p.disclaimer)}</span></div>
      </div>`;
  }

  function vPillDetail(slug) {
    const p = L().insights, it = p.items.find(x => x.slug === slug);
    if (!it) return vNotFound();
    const words = JSON.stringify(it).split(/\s+/).length;
    const mins = Math.max(2, Math.round(words / 200));
    let body = '';
    if (it.myths) {
      body = it.myths.map(([m, r], i) => `<div class="myth"><q>${i + 1}. ${esc(m)}</q><span class="fx">${esc(it.myth_label)}</span><p>${esc(r)}</p></div>`).join('');
    } else {
      body = it.blocks.map(b => `<h2>${esc(b.h)}</h2>${b.p ? `<p>${md(b.p)}</p>` : ''}${b.ul ? `<ul>${b.ul.map(x => `<li>${md(x)}</li>`).join('')}</ul>` : ''}${b.ol ? `<ol>${b.ol.map(x => `<li>${md(x)}</li>`).join('')}</ol>` : ''}`).join('');
    }
    return `${header(it.title, it.subtitle)}
      <div class="content">
        <p class="meta">${esc(fmt(L().ui.read_time, { n: mins }))}</p>
        <p class="question">${esc(it.question)}</p>
        <article class="panel article">${body}</article>
        <section class="takeaway"><h2>${esc(p.h_takeaway)}</h2><p>${md(it.takeaway)}</p></section>
        <div class="notice">${I.info}<span>${linkPhone(p.disclaimer)}</span></div>
      </div>`;
  }

  function vSettings() {
    const s = L().settings;
    return `<header class="phead"><h1 style="margin-top:22px">${esc(s.title)}</h1></header>
      <div class="content">
        <div class="list">
          <a class="row" href="#/impostazioni/lingua">${I.globe}<span class="lbl">${esc(s.language)}</span><span class="val">${esc(s.language_value)}</span>${I.chev}</a>
          <a class="row" href="#/impostazioni/informazioni">${I.info}<span class="lbl">${esc(s.info)}</span><span class="val">${esc(fmt(s.info_value, { v: VERSION }))}</span>${I.chev}</a>
          <a class="row" href="#/impostazioni/privacy">${I.lock}<span class="lbl">${esc(s.privacy)}</span>${I.chev}</a>
          <a class="row" href="#/impostazioni/contatti">${I.mail}<span class="lbl">${esc(s.contacts)}</span>${I.chev}</a>
          ${isStandalone() ? '' : `<button class="row" data-inst-open>${I.plus}<span class="lbl">${esc(L().ui.install_settings)}</span>${I.chev}</button>`}
        </div>
        <button class="btn" data-share style="width:100%">${I.share}${esc(s.share)}</button>
      </div>`;
  }

  function vLanguage() {
    const s = L().settings;
    const opt = (code, label) => `<button class="row" role="radio" aria-checked="${lang === code}" data-lang="${code}"><span class="lbl">${label}</span>${I.check}</button>`;
    return `${header(s.language, s.choose_language)}
      <div class="content"><div class="list" role="radiogroup" aria-label="${esc(s.language)}">${opt('it', 'Italiano')}${opt('en', 'English')}</div></div>`;
  }

  function vInfo() {
    const x = L().info;
    return `${header(x.title)}<div class="content"><div class="panel legal">
      <img src="img/logo.png" alt="" style="width:180px;margin:4px 0 16px">
      ${x.body.map(p => `<p>${md(fmt(p, { v: VERSION }))}</p>`).join('')}</div></div>`;
  }

  function vPrivacy() {
    const x = L().privacy;
    return `${header(x.title)}<div class="content"><div class="panel legal">
      ${x.body.map(p => `<p>${md(p)}</p>`).join('')}<p class="draft">${esc(x.draft)}</p></div></div>`;
  }

  function vContacts() {
    const c = L().contacts, s = L().studio;
    return `${header(c.title)}<div class="content">
      <div class="panel addr">
        <a class="addr-row" href="${s.phone_href}">${I.phone}<span><small>${esc(c.phone)}</small><span class="tel">${esc(s.phone_label)}</span></span></a>
        <a class="addr-row" href="${mapsGoogle(STUDIO.query)}" target="_blank" rel="noopener">${I.pin}<span><small>${esc(c.address)}</small><b>${esc(s.address)}</b><br>${esc(s.city)}</span></a>
      </div>
      <a class="btn primary contact-btn" href="${s.phone_href}">${I.phone}${esc(c.contact_btn)}</a>
      <a class="btn" href="#/come-arrivare" style="width:100%">${I.map}${esc(c.map)}</a>
    </div>`;
  }

  function vNotFound() { location.replace('#/'); return ''; }

  /* ---------- router ---------- */
  const routes = [
    [/^\/?$/, vHome, 'home'],
    [/^\/sezioni$/, vSections, 'sections'],
    [/^\/come-arrivare$/, vHowto, 'home'],
    [/^\/staff$/, vStaff, 'home'],
    [/^\/post-intervento$/, vAfterList, 'sections'],
    [/^\/post-intervento\/([\w-]+)$/, vAfterDetail, 'sections'],
    [/^\/farmaci$/, vMedsList, 'sections'],
    [/^\/farmaci\/([\w-]+)$/, vMedDetail, 'sections'],
    [/^\/pillole$/, vPillsList, 'sections'],
    [/^\/pillole\/([\w-]+)$/, vPillDetail, 'sections'],
    [/^\/impostazioni$/, vSettings, 'settings'],
    [/^\/impostazioni\/lingua$/, vLanguage, 'settings'],
    [/^\/impostazioni\/informazioni$/, vInfo, 'settings'],
    [/^\/impostazioni\/privacy$/, vPrivacy, 'settings'],
    [/^\/impostazioni\/contatti$/, vContacts, 'settings']
  ];
  let currentTab = 'home';
  const path = () => (location.hash.replace(/^#/, '') || '/').split('?')[0];

  function render(opts = {}) {
    const p = path();
    const y = window.scrollY;
    for (const [re, fn, tab] of routes) {
      const m = p.match(re);
      if (m) {
        currentTab = tab;
        const html = fn(...m.slice(1));
        const v = main();
        v.innerHTML = `<div class="view">${html}</div>`;
        document.title = pageTitle(p);
        renderBar();
        if (opts.keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
        if (/come-arrivare/.test(p)) initMap();
        const h1 = v.querySelector('h1'); if (h1 && !opts.keepScroll && opts.focus) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
        return;
      }
    }
    location.replace('#/');
  }

  function pageTitle(p) {
    const h1 = main().querySelector('h1');
    return (h1 && p !== '/' ? h1.textContent + ' · ' : '') + 'Dental Medicine Firenze';
  }

  function renderBar() {
    const u = L().ui;
    const item = (href, ic, label, key) => `<a href="${href}" ${currentTab === key ? 'aria-current="page"' : ''}>${I[ic]}<span>${esc(label)}</span></a>`;
    $('#bbar').innerHTML = item('#/', 'home', u.nav_home, 'home') + item('#/sezioni', 'grid', u.nav_sections, 'sections') + item('#/impostazioni', 'gear', u.nav_settings, 'settings');
    $('#bbar').setAttribute('aria-label', 'Menu');
  }

  /* ---------- mappa (Leaflet, caricata al bisogno) ---------- */
  let leafletPromise = null;
  function loadLeaflet() {
    if (window.L && window.L.map) return Promise.resolve(window.L);
    if (leafletPromise) return leafletPromise;
    leafletPromise = new Promise((res, rej) => {
      const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'; document.head.appendChild(css);
      const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      s.onload = () => res(window.L); s.onerror = () => { leafletPromise = null; rej(); };
      document.head.appendChild(s);
    });
    return leafletPromise;
  }
  function mapFallback(el) {
    const h = L().howto;
    const dup = document.querySelector('.content > .map-fallback'); if (dup) dup.remove();
    el.outerHTML = `<button class="map-fallback" data-lightbox="img/mappa-studio.webp" style="border:0;width:100%;display:block"><img src="img/mappa-studio.webp" alt="${esc(h.map_offline)}"></button>`;
  }
  function initMap() {
    const el = document.getElementById('map'); if (!el) return;
    if (!navigator.onLine) return mapFallback(el);
    const timer = setTimeout(() => { if (document.getElementById('map') && !el._leaflet_id) mapFallback(el); }, 8000);
    loadLeaflet().then(Lf => {
      clearTimeout(timer);
      if (!document.body.contains(el)) return;
      const s = L().studio;
      const map = Lf.map(el, { scrollWheelZoom: false, tap: true, zoomControl: true }).setView([STUDIO.lat, STUDIO.lng], 16);
      Lf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap contributors' }).addTo(map);
      const icon = Lf.divIcon({ className: '', html: '<div class="pin"></div>', iconSize: [22, 22], iconAnchor: [4, 26], popupAnchor: [7, -24] });
      const popup = `<b>${esc(s.name)}</b>${esc(s.address)}, Firenze<br><a href="${mapsGoogle(STUDIO.query)}" target="_blank" rel="noopener">${esc(L().howto.open_google)}</a> · <a href="${mapsApple(STUDIO.query)}" target="_blank" rel="noopener">${esc(L().howto.open_apple)}</a>`;
      Lf.marker([STUDIO.lat, STUDIO.lng], { icon, title: s.name }).addTo(map).bindPopup(popup).openPopup();
    }).catch(() => { clearTimeout(timer); mapFallback(el); });
  }

  /* ---------- lightbox ---------- */
  function lightbox(src) {
    const d = document.createElement('div'); d.className = 'lightbox'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
    d.innerHTML = `<div class="lb-top"><button aria-label="${esc(L().ui.install_close)}">${I.close}</button></div><div class="lb-img"><img src="${src}" alt=""></div>`;
    d.querySelector('button').onclick = () => d.remove();
    document.body.appendChild(d);
    const box = d.querySelector('.lb-img'); setTimeout(() => { box.scrollLeft = box.scrollWidth * 0.18; }, 50);
  }

  /* ---------- condivisione ---------- */
  async function shareApp() {
    const s = L().settings;
    const url = location.origin + location.pathname.replace(/index\.html$/, '');
    if (navigator.share) { try { await navigator.share({ title: 'Dental Medicine Firenze', text: s.share_text, url }); } catch (e) {} return; }
    try { await navigator.clipboard.writeText(url); toast(s.copied); }
    catch (e) { prompt(s.share, url); }
  }

  /* ---------- aggiungi alla schermata Home ---------- */
  let deferredPrompt = null;
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isAndroid = () => /android/i.test(navigator.userAgent);
  function platform() {
    const ua = navigator.userAgent;
    if (isIOS()) {
      if (/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(ua)) return 'iosother';
      const v = +((ua.match(/Version\/(\d+)/) || [])[1] || 0);
      return v >= 26 ? 'ios26' : 'ios';
    }
    if (deferredPrompt) return 'prompt';
    if (isAndroid()) return 'android';
    return 'desktop';
  }
  // mostrata in automatico al primo avvio; se chiusa, ricompare dopo 7 giorni (massimo 3 volte)
  function autoInstallAllowed() {
    if (isStandalone()) return false;
    const n = +store.get('dmf.installShown') || 0;
    const t = +store.get('dmf.installDismissed') || 0;
    return n < 3 && Date.now() - t > 1000 * 60 * 60 * 24 * 7;
  }
  function closeInstall() {
    const o = $('.inst-ov'); if (!o) return;
    o.classList.add('out'); setTimeout(() => o.remove(), 220);
    store.set('dmf.installDismissed', Date.now());
  }
  function showInstall(manual) {
    if ($('.inst-ov')) return;
    const u = L().ui;
    if (isStandalone()) { if (manual) toast(u.install_done); return; }
    if (!manual) { if (!autoInstallAllowed()) return; store.set('dmf.installShown', (+store.get('dmf.installShown') || 0) + 1); }
    const kind = platform();
    const chip = (ic, cls = '') => `<span class="chip-ic ${cls}">${ic}</span>`;
    const DOTS = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>`;
    const VDOTS = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="19" r="2" fill="currentColor"/></svg>`;
    const fill = t => t.replace('{dots}', chip(DOTS)).replace('{vdots}', chip(VDOTS)).replace('{share}', chip(I.share, 'blue')).replace('{plus}', chip(I.plus));
    let body;
    if (kind === 'prompt') {
      body = `<button class="btn primary inst-main" data-inst-go>${I.plus}${esc(u.install_btn)}</button>
        <button class="btn inst-later" data-inst-close>${esc(u.install_later)}</button>`;
    } else {
      const steps = u.install_steps[kind] || u.install_steps.desktop;
      body = `<ol class="inst-steps">${steps.map(x => `<li>${fill(x)}</li>`).join('')}</ol>
        <div class="inst-btns"><button class="btn primary" data-inst-close>${esc(u.install_ok)}</button><button class="btn" data-inst-close>${esc(u.install_later)}</button></div>`;
    }
    const hint = (kind === 'ios26' || kind === 'ios') ? `<div class="inst-hint bottom ${kind === 'ios' ? 'center' : 'right'}" aria-hidden="true"><span>${esc(u.install_hint_bottom)}</span>${I.back}</div>`
      : (kind === 'android' || kind === 'iosother') ? `<div class="inst-hint top right" aria-hidden="true">${I.back}<span>${esc(u.install_hint_top)}</span></div>` : '';
    const o = document.createElement('div'); o.className = 'inst-ov';
    o.innerHTML = `${hint}<div class="inst-sheet" role="dialog" aria-modal="true" aria-labelledby="inst-t">
        <button class="x" data-inst-close aria-label="${esc(u.install_close)}">${I.close}</button>
        <div class="inst-head"><img src="icons/apple-touch-icon.png" alt="" width="64" height="64"><div><h2 id="inst-t">${esc(u.install_title)}</h2><p>${esc(u.install_sub)}</p></div></div>
        ${body}</div>`;
    o.addEventListener('click', async e => {
      if (e.target === o || e.target.closest('[data-inst-close]')) return closeInstall();
      if (e.target.closest('[data-inst-go]') && deferredPrompt) {
        deferredPrompt.prompt(); try { await deferredPrompt.userChoice; } catch (err) {} deferredPrompt = null; closeInstall();
      }
    });
    document.body.appendChild(o);
    const first = o.querySelector('.inst-sheet .btn'); if (first) first.focus({ preventScroll: true });
  }
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; });
  window.addEventListener('appinstalled', () => { const o = $('.inst-ov'); if (o) o.remove(); store.set('dmf.installShown', 9); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('.inst-ov')) closeInstall(); });

  /* ---------- online / offline ---------- */
  function updateOnline() {
    let bar = $('.offline-bar');
    if (!navigator.onLine) { if (!bar) { bar = document.createElement('div'); bar.className = 'offline-bar'; bar.setAttribute('role', 'status'); $('#app').prepend(bar); } bar.textContent = L().ui.offline; }
    else if (bar) bar.remove();
  }

  /* ---------- eventi globali ---------- */
  document.addEventListener('click', e => {
    if (e.target.closest('[data-inst-open]')) { e.preventDefault(); return showInstall(true); }
    const t = e.target.closest('[data-back],[data-tab],[data-lang],[data-share],[data-lightbox]');
    if (!t) return;
    if (t.hasAttribute('data-back')) {
      e.preventDefault();
      if (navigated && history.length > 1) history.back();
      else { const p = path().split('/').slice(0, -1).join('/'); location.hash = '#' + (p || '/'); }
    } else if (t.dataset.tab) {
      const k = t.dataset.tab; store.set('dmf.tab', k);
      document.querySelectorAll('.tab').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === k));
      const tp = $('#tp'); tp.innerHTML = tabPanel(k); tp.setAttribute('aria-labelledby', 'tab-' + k);
      const op = $('#other-parking'); if (op) op.hidden = k !== 'car';
    } else if (t.dataset.lang) {
      setLang(t.dataset.lang);
    } else if (t.hasAttribute('data-share')) {
      shareApp();
    } else if (t.dataset.lightbox) {
      lightbox(t.dataset.lightbox);
    }
  });
  let navigated = false;
  window.addEventListener('hashchange', () => { navigated = true; render({ focus: true }); });
  window.addEventListener('online', updateOnline);
  window.addEventListener('offline', updateOnline);

  /* ---------- avvio ---------- */
  async function loadContent() {
    const get = l => fetch('content/' + l + '.json').then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });
    const [it, en] = await Promise.all([get('it'), get('en')]);
    T.it = it; T.en = en;
  }

  async function boot() {
    const t0 = Date.now();
    lang = pickInitialLang();
    document.documentElement.lang = lang;
    try { await loadContent(); }
    catch (e) { $('#view').innerHTML = '<p style="padding:24px">Errore di caricamento. Controlla la connessione e riprova.</p>'; return; }
    render();
    updateOnline();
    // splash: 2,2 s totali, fade-out 300 ms
    const wait = Math.max(0, 2200 - (Date.now() - t0));
    setTimeout(() => {
      const sp = $('#splash'); sp.classList.add('out'); setTimeout(() => sp.remove(), 320);
      // al primo avvio: istruzioni per aggiungere l'app alla Home (attende il prompt di Android)
      setTimeout(() => showInstall(false), 1800);
    }, wait);
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      // quando arriva una nuova versione dell'app, ricarica una sola volta per mostrarla
      let reloaded = false;
      const hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!hadController || reloaded) return; reloaded = true; location.reload();
      });
      navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(r => r.update()).catch(() => {});
    }
  }
  boot();
})();
