(() => {
  'use strict';

  /* ------------------------------------------------------------------
     Einstellungen (hier kannst du leicht Werte ändern)
  ------------------------------------------------------------------ */
  const CONFIG = window.CONFIG, HAND_TYPES = window.HAND_TYPES;

  // order = Reihenfolge beim Sortieren nach Farbe
  const SUITS = [
    { key: 'spade',   sym: '♠', red: false, order: 0 },
    { key: 'heart',   sym: '♥', red: true,  order: 1 },
    { key: 'club',    sym: '♣', red: false, order: 2 },
    { key: 'diamond', sym: '♦', red: true,  order: 3 }
  ];
  const RANK_LABEL = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' };

  /* ------------------------------------------------------------------
     Hilfsfunktionen
  ------------------------------------------------------------------ */
  const $ = id => document.getElementById(id);
  const rankLabel = r => RANK_LABEL[r] || String(r);
  const chipValue = r => (r === 14 ? 11 : r >= 11 ? 10 : r);
  const fmt = n => n.toLocaleString('de-DE');
  const wait = ms => new Promise(res => setTimeout(res, ms));
  const canAnimate = typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function newDeck() {
    const deck = [];
    let id = 0;
    for (let s = 0; s < SUITS.length; s++) {
      for (let r = 2; r <= 14; r++) deck.push({ id: id++, rank: r, suit: s });
    }
    return shuffle(deck);
  }

  function targetFor(round) {
    return Math.round((CONFIG.firstTarget * Math.pow(CONFIG.targetGrowth, round - 1)) / 10) * 10;
  }

  /* ------------------------------------------------------------------
     Pixel-Art: Kartenbilder werden einmal pro Karte per Code gemalt.
     Jede Karte ist 41 x 56 Pixel gross (ungerade Breite, damit alles
     genau in der Mitte sitzt) und wird mit "pixelated" vergroessert.
  ------------------------------------------------------------------ */
  const CARD_W = 41, CARD_H = 56;

  const paintCard = window.paintCard, paintBack = window.paintBack;

  const spriteCache = {};
  function getSprite(rank, suitIndex) {
    const key = rank + '-' + suitIndex;
    if (!spriteCache[key]) spriteCache[key] = paintCard(rank, suitIndex);
    return spriteCache[key];
  }


  /* ------------------------------------------------------------------
     Kartengroesse und Layout
  ------------------------------------------------------------------ */
  // Karten werden immer in ganzzahligen Pixelgroessen angezeigt, damit nichts verwaschen wirkt
  function applyCardScale() {
    const root = document.documentElement;
    const main = $('main');
    const portrait = window.matchMedia('(max-width: 860px), (max-aspect-ratio: 1/1)').matches;
    const W = Math.max(280, main.clientWidth - 24);
    // Querformat: Hoehe der Spielflaeche. Hochformat: Bildschirmhoehe minus Infospalte und Knoepfe.
    let H;
    if (portrait) {
      const used = $('side').offsetHeight + document.querySelector('.controls').offsetHeight + 60;
      H = window.innerHeight - used;
    } else {
      H = main.clientHeight;
    }
    let s = 2;
    const jokerH = n => 83 * n + 34;   // Jokerleiste: Joker in n-facher Groesse plus Rand
    for (let k = 4; k >= 2; k--) {
      const cw = CARD_W * k, ch = CARD_H * k;
      const needW = cw * (portrait ? 1.9 : 1.3) + (handSize() - 1) * cw * 0.42 + (portrait ? 0 : cw + 50);
      const needH = (portrait ? 142 * k + 90 : 2 * ch + 270) + jokerH(1);
      if (needW <= W && needH <= H) { s = k; break; }
    }
    // Joker gross anzeigen, wenn noch Platz ist
    const needBigJ = (portrait ? 142 * s + 90 : 2 * CARD_H * s + 270) + jokerH(2) - 110;
    const jpx = needBigJ <= H && (5 * (62 * 2 + 12)) <= W ? 2 : 1;
    root.style.setProperty('--jpx', jpx + 'px');
    const cw = CARD_W * s;
    const availW = W - (portrait ? 0 : cw + 50) - cw * (portrait ? 0.9 : 0.4);
    const step = Math.min(cw * 0.8, (availW - cw) / (handSize() - 1));
    root.style.setProperty('--card-w', cw + 'px');
    root.style.setProperty('--px', s + 'px');
    root.style.setProperty('--step', Math.max(18, step) + 'px');
    fanCards();
  }

  /* ------------------------------------------------------------------
     Hintergrund (bewegtes Pixelmuster) und Effekte an/aus
  ------------------------------------------------------------------ */
  const FX_KEY = 'poker-roguelike-fx';
  let fxOn = true, linesOn = true, curveOn = true;
  try {
    if (localStorage.getItem(FX_KEY) === 'off') fxOn = false;
    if (localStorage.getItem(FX_KEY + '-lines') === 'off') linesOn = false;
    if (localStorage.getItem(FX_KEY + '-curve') === 'off') curveOn = false;
  } catch (e) { /* ignorieren */ }

  const BG_W = 128, BG_H = 72;
  // Farbpaletten je Runde (dunkel -> hell), sie blenden weich ineinander ueber
  const BG_PALETTES = [
    [[22,13,51],[60,38,122]], [[10,36,48],[30,110,128]], [[48,12,32],[132,38,78]],
    [[14,40,26],[46,120,70]], [[44,30,10],[128,92,30]], [[18,18,56],[56,70,160]]
  ];
  const BG_LEVELS = 8;
  let bgCur = [22,13,51,60,38,122];
  function bgPaletteTick() {
    const r = (typeof state !== 'undefined' && state.round ? state.round : 1) - 1;
    const tgt = BG_PALETTES[r % BG_PALETTES.length];
    const goal = [tgt[0][0], tgt[0][1], tgt[0][2], tgt[1][0], tgt[1][1], tgt[1][2]];
    for (let i = 0; i < 6; i++) bgCur[i] += (goal[i] - bgCur[i]) * 0.04;
  }
  const bgCanvas = $('bg');
  const bgCtx = bgCanvas.getContext('2d');
  const bgImg = bgCtx.createImageData(BG_W, BG_H);
  function drawBg(t) {
    bgPaletteTick();
    const d = bgImg.data, c = bgCur;
    const pal = [];
    for (let k = 0; k < BG_LEVELS; k++) {
      const f = k / (BG_LEVELS - 1);
      pal.push([c[0] + (c[3] - c[0]) * f, c[1] + (c[4] - c[1]) * f, c[2] + (c[5] - c[2]) * f]);
    }
    let i = 0;
    for (let y = 0; y < BG_H; y++) {
      for (let x = 0; x < BG_W; x++) {
        // verwirbelte Wellen: jede Welle wird von einer anderen verzerrt
        const wx = x + Math.sin(y * 0.11 + t * 0.35) * 7;
        const wy = y + Math.sin(x * 0.09 - t * 0.3) * 5;
        const v = Math.sin(wx * 0.085 + t * 0.5) + Math.sin(wy * 0.14 - t * 0.4) +
                  Math.sin((wx + wy) * 0.06 + t * 0.3) +
                  Math.sin(Math.hypot(wx - 64, wy - 36) * 0.13 - t * 0.7);
        const p = pal[Math.max(0, Math.min(BG_LEVELS - 1, Math.floor((v + 4) / 8 * BG_LEVELS)))];
        d[i++] = p[0]; d[i++] = p[1]; d[i++] = p[2]; d[i++] = 255;
      }
    }
    bgCtx.putImageData(bgImg, 0, 0);
  }
  let lastBg = 0;
  function bgLoop(now) {
    if (fxOn && !reduceMotion && now - lastBg > 50) { lastBg = now; drawBg(now / 1000); }
    requestAnimationFrame(bgLoop);
  }

  /* Eigenes Hintergrundbild: aus dem Repo (Dateiname) oder vom Geraet (bleibt nur im Browser) */
  const BG_KEY = 'poker-roguelike-bg';
  let bgMode = 'plasma', bgName = 'hintergrund.jpg', bgData = '';
  try {
    bgMode = localStorage.getItem(BG_KEY + '-mode') || 'plasma';
    bgName = localStorage.getItem(BG_KEY + '-name') || bgName;
    bgData = localStorage.getItem(BG_KEY + '-data') || '';
  } catch (e) { /* ignorieren */ }
  function applyBgImage() {
    const cl = document.documentElement.classList, el = $('bgImg'), hint = $('bgHint');
    $('bgMode').value = bgMode; $('bgName').value = bgName;
    $('bgNameRow').style.display = bgMode === 'repo' ? '' : 'none';
    $('bgPickRow').style.display = bgMode === 'device' ? '' : 'none';
    hint.textContent = bgMode === 'repo' ? 'Lege die Datei in den Hauptordner des Repos, neben index.html.' :
      bgMode === 'device' ? 'Das Bild bleibt nur auf diesem Gerät gespeichert.' : '';
    let url = '';
    if (bgMode === 'repo' && bgName.trim()) url = encodeURI(bgName.trim());
    if (bgMode === 'device' && bgData) url = bgData;
    if (!url) { cl.remove('has-bgimg'); return; }
    const img = new Image();
    img.onload = () => {
      el.style.backgroundImage = 'linear-gradient(rgba(10,5,30,.35),rgba(10,5,30,.35)), url("' + url + '")';
      cl.add('has-bgimg');
    };
    img.onerror = () => { cl.remove('has-bgimg'); hint.textContent = 'Bild nicht gefunden oder nicht lesbar. Es läuft das Muster.'; };
    img.src = url;
  }
  function saveBg() {
    try {
      localStorage.setItem(BG_KEY + '-mode', bgMode);
      localStorage.setItem(BG_KEY + '-name', bgName);
      localStorage.setItem(BG_KEY + '-data', bgData);
    } catch (e) { /* ignorieren, z. B. zu gross */ }
  }
  $('bgMode').addEventListener('change', e => { bgMode = e.target.value; saveBg(); applyBgImage(); });
  $('bgName').addEventListener('change', e => { bgName = e.target.value; saveBg(); applyBgImage(); });
  $('bgPick').addEventListener('click', () => $('bgFile').click());
  $('bgFile').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f), img = new Image();
    img.onload = () => {
      // verkleinern, damit es in den Browserspeicher passt
      const sc = Math.min(1, 1600 / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      bgData = c.toDataURL('image/jpeg', 0.82);
      URL.revokeObjectURL(url);
      saveBg(); applyBgImage();
      try { if (localStorage.getItem(BG_KEY + '-data') !== bgData) $('bgHint').textContent = 'Gilt nur bis zum Neuladen (Speicher voll).'; } catch (err) { /* ignorieren */ }
    };
    img.onerror = () => { $('bgHint').textContent = 'Bild nicht lesbar.'; };
    img.src = url;
  });

  /* ------------------------------------------------------------------
     Toene (im Browser erzeugt) und Partikel
  ------------------------------------------------------------------ */
  const SND_KEY = 'poker-roguelike-snd';
  let soundOn = true;
  try { if (localStorage.getItem(SND_KEY) === 'off') soundOn = false; } catch (e) { /* ignorieren */ }
  let actx = null;
  function tone(freq, dur, type, vol, slideTo, delay) {
    if (!soundOn) return;
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      const t0 = actx.currentTime + (delay || 0);
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type || 'square';
      o.frequency.setValueAtTime(freq, t0);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol || 0.06, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(actx.destination);
      o.start(t0); o.stop(t0 + dur + 0.02);
    } catch (e) { /* kein Ton moeglich */ }
  }
  const NOTES = [0, 2, 4, 7, 9, 12, 14, 16];   // Pentatonik-Leiter, steigt mit jeder gezaehlten Karte
  const sndSelect = on => tone(on ? 520 : 380, 0.07, 'square', 0.04);
  const sndDeal = () => tone(300 + Math.random() * 80, 0.05, 'triangle', 0.035);
  const sndCard = i => tone(330 * Math.pow(2, NOTES[Math.min(i, NOTES.length - 1)] / 12), 0.16, 'square', 0.06);
  const sndMult = () => { tone(180, 0.3, 'sawtooth', 0.07, 90); tone(360, 0.2, 'square', 0.05, 720, 0.04); };
  const sndBig = () => { [0, 4, 7, 12].forEach((n, k) => tone(262 * Math.pow(2, n / 12), 0.3, 'square', 0.05, 0, k * 0.07)); };
  const sndWin = () => { [0, 4, 7, 12, 16].forEach((n, k) => tone(330 * Math.pow(2, n / 12), 0.28, 'square', 0.055, 0, k * 0.09)); };
  const sndLose = () => { [7, 4, 0, -5].forEach((n, k) => tone(260 * Math.pow(2, n / 12), 0.35, 'sawtooth', 0.05, 0, k * 0.14)); };

  const pCanvas = $('fxCanvas'), pCtx = pCanvas.getContext('2d');
  let parts = [], pRunning = false, pLast = 0;
  function sizeParticleCanvas() { pCanvas.width = window.innerWidth; pCanvas.height = window.innerHeight; }
  sizeParticleCanvas();
  window.addEventListener('resize', sizeParticleCanvas);
  function burst(x, y, color, n, speed) {
    if (!fxOn || reduceMotion) return;
    const px = Math.max(2, Math.round(window.innerWidth / 260));
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = (0.3 + Math.random()) * (speed || 220);
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, life: 0.5 + Math.random() * 0.5, age: 0, c: color, s: px * (1 + Math.floor(Math.random() * 2)) });
    }
    if (!pRunning) { pRunning = true; pLast = performance.now(); requestAnimationFrame(stepParts); }
  }
  function stepParts(now) {
    const dt = Math.min(0.05, (now - pLast) / 1000); pLast = now;
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    parts = parts.filter(p => (p.age += dt) < p.life);
    for (const p of parts) {
      p.vy += 520 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      pCtx.globalAlpha = Math.max(0, 1 - p.age / p.life);
      pCtx.fillStyle = p.c;
      pCtx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
    }
    pCtx.globalAlpha = 1;
    if (parts.length) requestAnimationFrame(stepParts); else pRunning = false;
  }
  function burstAt(el, color, n, speed) {
    const r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, color, n, speed);
  }
  function flash(strength) {
    if (!fxOn || reduceMotion || !canAnimate) return;
    $('flash').animate([{ opacity: strength }, { opacity: 0 }], { duration: 420, easing: 'ease-out' });
  }

  function applyFx() {
    const cl = document.documentElement.classList;
    cl.toggle('no-fx', !fxOn);
    cl.toggle('no-lines', !linesOn);
    cl.toggle('no-curve', !curveOn);
    $('fxBgBtn').textContent = fxOn ? 'an' : 'aus';
    $('fxLinesBtn').textContent = linesOn ? 'an' : 'aus';
    $('sndBtn').textContent = soundOn ? 'an' : 'aus';
    $('fxCurveBtn').textContent = curveOn ? 'an' : 'aus';
    drawBg(fxOn ? performance.now() / 1000 : 0);
    applyBgImage();
  }

  /* ------------------------------------------------------------------
     Pokerhand erkennen
  ------------------------------------------------------------------ */
  function evaluate(cards) {
    const n = cards.length;
    if (n === 0) return null;

    const counts = {};
    cards.forEach(c => { counts[c.rank] = (counts[c.rank] || 0) + 1; });
    const groups = Object.keys(counts)
      .map(r => ({ rank: +r, count: counts[r] }))
      .sort((a, b) => b.count - a.count || b.rank - a.rank);

    const isFlush = n === 5 && cards.every(c => c.suit === cards[0].suit);
    let isStraight = false;
    if (n === 5 && groups.length === 5) {
      const rs = cards.map(c => c.rank).sort((a, b) => a - b);
      if (rs[4] - rs[0] === 4) isStraight = true;
      else if (rs.join(',') === '2,3,4,5,14') isStraight = true; // Ass als 1
    }

    let type;
    if (isStraight && isFlush) type = 'straightFlush';
    else if (groups[0].count === 4) type = 'four';
    else if (groups[0].count === 3 && groups[1] && groups[1].count === 2) type = 'fullHouse';
    else if (isFlush) type = 'flush';
    else if (isStraight) type = 'straight';
    else if (groups[0].count === 3) type = 'three';
    else if (groups[0].count === 2 && groups[1] && groups[1].count === 2) type = 'twoPair';
    else if (groups[0].count === 2) type = 'pair';
    else type = 'high';

    // Welche Karten zählen zur Hand?
    let scoring;
    if (['straightFlush', 'fullHouse', 'flush', 'straight'].includes(type)) {
      scoring = cards.slice();
    } else if (type === 'high') {
      scoring = [cards.reduce((best, c) => (c.rank > best.rank ? c : best), cards[0])];
    } else {
      const ranks = groups.filter(g => g.count >= 2).map(g => g.rank);
      scoring = cards.filter(c => ranks.includes(c.rank));
    }

    const base = HAND_TYPES[type];
    const cardChips = scoring.reduce((sum, c) => sum + chipValue(c.rank), 0);
    const chips = base.chips + cardChips;
    return {
      type,
      name: base.name,
      chips,
      mult: base.mult,
      total: chips * base.mult,
      scoringIds: new Set(scoring.map(c => c.id))
    };
  }

  /* ------------------------------------------------------------------
     Speichern (nur Bestwerte, ohne Fehler wenn Speicher gesperrt ist)
  ------------------------------------------------------------------ */
  const STORE_KEY = 'poker-roguelike-v1';
  function loadBest() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return Object.assign({ round: 0, hand: 0 }, JSON.parse(raw));
    } catch (e) { /* ignorieren */ }
    return { round: 0, hand: 0 };
  }
  function saveBest(best) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(best)); } catch (e) { /* ignorieren */ }
  }

  /* ------------------------------------------------------------------
     Spielzustand
  ------------------------------------------------------------------ */
  const state = {
    round: 1,
    target: 0,
    score: 0,
    handsLeft: 0,
    discardsLeft: 0,
    deck: [],
    hand: [],
    selected: new Set(),
    sortMode: 'rank',  // 'rank' | 'suit'
    busy: false,
    scoring: false,    // waehrend der Wertungsanimation zeigt die Anzeige nicht die Vorschau
    best: loadBest(),
    money: 0,
    jokers: [],        // gekaufte Joker: { id, data }
    shop: null,        // { offers: [id|null] }
    handsPlayed: 0     // gespielte Haende in dieser Runde
  };

  const J = window.JokerData;
  const mods = () => J.mods(state.jokers);
  const handSize = () => CONFIG.handSize + mods().handSize;

  function startRound() {
    state.target = targetFor(state.round);
    state.score = 0;
    state.handsLeft = CONFIG.handsPerRound + mods().hands;
    state.discardsLeft = CONFIG.discardsPerRound + mods().discards;
    state.handsPlayed = 0;
    state.deck = newDeck();
    state.hand = [];
    state.selected.clear();
    state.busy = false;
    state.scoring = false;
    cardEls.forEach(el => el.remove());
    cardEls.clear();
    $('playedRow').innerHTML = '';
    shownScore = 0; lastScoreTarget = 0; scoreToken++;
    $('score').textContent = '0';
    drawCards(handSize());
    sortHand();
    render();
    renderJokers();
    applyCardScale();
  }

  function newRun() {
    state.round = 1;
    state.money = CONFIG.startMoney;
    state.jokers = [];
    closeOverlay($('shopOverlay'));
    closeOverlay($('endOverlay'));
    startRound();
  }

  function drawCards(count) {
    for (let i = 0; i < count && state.deck.length > 0; i++) {
      state.hand.push(state.deck.pop());
    }
  }

  function sortHand() {
    if (state.sortMode === 'rank') {
      state.hand.sort((a, b) => b.rank - a.rank || SUITS[a.suit].order - SUITS[b.suit].order);
    } else {
      state.hand.sort((a, b) => SUITS[a.suit].order - SUITS[b.suit].order || b.rank - a.rank);
    }
  }

  function selectedCards() {
    return state.hand.filter(c => state.selected.has(c.id));
  }

  /* ------------------------------------------------------------------
     Anzeige
  ------------------------------------------------------------------ */
  // Karten-Elemente bleiben erhalten, damit Uebergaenge fliessend laufen
  const cardEls = new Map();

  function createCardEl(card) {
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.id = card.id;

    const fan = document.createElement('div');
    fan.className = 'fan';
    const lift = document.createElement('div');
    lift.className = 'lift';
    const cv = document.createElement('canvas');
    cv.width = CARD_W; cv.height = CARD_H;
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(getSprite(card.rank, card.suit), 0, 0);
    lift.appendChild(cv);
    fan.appendChild(lift);
    el.appendChild(fan);

    el.addEventListener('click', () => toggleCard(card.id));
    // leichtes Neigen zur Maus
    el.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || el.classList.contains('played')) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', (-ny * 16) + 'deg');
      el.style.setProperty('--ry', (nx * 16) + 'deg');
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
    return el;
  }

  // Faechert die Handkarten leicht auf
  function fanCards() {
    const n = state.hand.length;
    const mid = (n - 1) / 2;
    const px = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--px')) || 3;
    state.hand.forEach((card, i) => {
      const el = cardEls.get(card.id);
      if (!el) return;
      const off = i - mid;
      el.style.setProperty('--rot', (off * 2.4) + 'deg');
      el.style.setProperty('--dy', (off * off * px * 0.28) + 'px');
    });
  }

  function updateHand(scoringIds) {
    const handEl = $('hand');

    // Positionen vor der Aenderung merken (fuer das gleitende Umsortieren)
    const before = new Map();
    cardEls.forEach((el, id) => { before.set(id, el.getBoundingClientRect()); });

    // Karten entfernen, die nicht mehr auf der Hand sind
    const wanted = new Set(state.hand.map(c => c.id));
    cardEls.forEach((el, id) => {
      if (!wanted.has(id)) { el.remove(); cardEls.delete(id); }
    });

    // Neue Karten anlegen, Auswahl-Zustand setzen
    const fresh = [];
    state.hand.forEach(card => {
      let el = cardEls.get(card.id);
      if (!el) { el = createCardEl(card); cardEls.set(card.id, el); fresh.push(el); }
      el.classList.toggle('selected', state.selected.has(card.id));
      el.classList.toggle('scoring', !!(scoringIds && scoringIds.has(card.id)));
    });

    // Reihenfolge im DOM nur dann aendern, wenn noetig
    state.hand.forEach((card, i) => {
      const el = cardEls.get(card.id);
      if (handEl.children[i] !== el) handEl.insertBefore(el, handEl.children[i] || null);
    });
    fanCards();

    if (!canAnimate || reduceMotion) return;

    // Vorhandene Karten gleiten an ihre neue Position
    cardEls.forEach((el, id) => {
      const b = before.get(id);
      if (!b || fresh.includes(el)) return;
      const a = el.getBoundingClientRect();
      const dx = b.left - a.left, dy = b.top - a.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      el.animate(
        [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'translate(0,0)' }],
        { duration: 420, easing: 'cubic-bezier(.2,.9,.3,1)' }
      );
    });

    // Neue Karten fliegen nacheinander vom Stapel in die Hand
    const deckRect = $('deck').getBoundingClientRect();
    fresh.forEach((el, i) => {
      const a = el.getBoundingClientRect();
      let dx = 0, dy = 70;
      if (deckRect.width > 0) {
        dx = deckRect.left + deckRect.width / 2 - (a.left + a.width / 2);
        dy = deckRect.top + deckRect.height / 2 - (a.top + a.height / 2);
      }
      el.animate(
        [
          { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.8)', opacity: 0 },
          { transform: 'translate(' + dx * 0.6 + 'px,' + dy * 0.6 + 'px) scale(.9)', opacity: 1, offset: 0.2 },
          { transform: 'translate(0,0) scale(1)', opacity: 1 }
        ],
        { duration: 520, delay: i * 70, easing: 'cubic-bezier(.2,.9,.3,1)', fill: 'backwards' }
      );
    });
  }

  // Punktestand zaehlt weich hoch
  let shownScore = 0, lastScoreTarget = 0, scoreToken = 0;
  function setScoreDisplay(target) {
    if (target === lastScoreTarget) return;
    lastScoreTarget = target;
    const el = $('score');
    const from = shownScore;
    const token = ++scoreToken;
    if (reduceMotion) { shownScore = target; el.textContent = fmt(target); return; }
    const start = performance.now(), dur = 700;
    const step = now => {
      if (token !== scoreToken) return;
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      shownScore = Math.round(from + (target - from) * e);
      el.textContent = fmt(shownScore);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function setBox(chips, mult) {
    $('chipsBox').textContent = fmt(chips);
    $('multBox').textContent = fmt(mult);
  }
  function popEl(el, strength) {
    if (!canAnimate || reduceMotion) return;
    const k = 1 + (strength || 0.25);
    const rot = (strength || 0.25) > 0.3 ? 4 : 2;
    el.animate([{ transform: 'scale(1) rotate(0deg)' }, { transform: 'scale(' + k + ') rotate(-' + rot + 'deg)', offset: 0.35 },
      { transform: 'scale(' + (1 + (k - 1) * 0.4) + ') rotate(' + rot * 0.6 + 'deg)', offset: 0.7 }, { transform: 'scale(1) rotate(0deg)' }],
      { duration: 340, easing: 'ease-out' });
  }

  function render() {
    $('banner').textContent = 'Runde ' + state.round;
    $('target').textContent = fmt(state.target);
    $('handsLeft').textContent = state.handsLeft;
    $('discardsLeft').textContent = state.discardsLeft;
    setScoreDisplay(state.score);
    $('deckCount').textContent = state.deck.length + '/52';
    $('bar').style.width = Math.min(100, (state.score / state.target) * 100) + '%';
    $('moneyVal').textContent = fmt(state.money) + ' €';
    $('best').innerHTML = 'Beste Runde: <b>' + state.best.round + '</b><br>Beste Hand: <b>' + fmt(state.best.hand) + '</b>';

    const sel = selectedCards();
    const result = evaluate(sel);
    updateHand(result ? result.scoringIds : null);

    $('selCount').textContent = sel.length + '/' + CONFIG.maxSelect;
    $('handCount').textContent = state.hand.length + '/' + handSize();

    if (!state.scoring) {
      if (result) {
        $('handName').textContent = result.name;
        setBox(result.chips, result.mult);
      } else {
        $('handName').innerHTML = '&nbsp;';
        setBox(0, 0);
      }
    }

    const canAct = !state.busy && sel.length > 0;
    $('playBtn').disabled = !(canAct && state.handsLeft > 0);
    $('discardBtn').disabled = !(canAct && state.discardsLeft > 0 && state.deck.length > 0);
    $('playSub').textContent = 'Hände: ' + state.handsLeft;
    $('discardSub').textContent = 'Abwürfe: ' + state.discardsLeft;
    $('sortSub').textContent = state.sortMode === 'rank' ? 'nach Rang' : 'nach Farbe';
  }

  function toggleCard(id) {
    if (state.busy) return;
    if (state.selected.has(id)) {
      state.selected.delete(id);
      sndSelect(false);
    } else if (state.selected.size < CONFIG.maxSelect) {
      state.selected.add(id);
      sndSelect(true);
    }
    render();
  }

  function showPopup(html) {
    const p = $('popup');
    p.innerHTML = html;
    p.classList.remove('show');
    void p.offsetWidth; // Animation neu starten
    p.classList.add('show');
  }

  // kleine Zahl, die ueber einer Karte nach oben schwebt
  function floaterAt(el, text, color) {
    const r = el.getBoundingClientRect();
    const f = document.createElement('div');
    f.className = 'floater';
    f.textContent = text;
    if (color) f.style.color = color;
    f.style.left = (r.left + r.width / 2 - 14) + 'px';
    f.style.top = (r.top - 6) + 'px';
    document.body.appendChild(f);
    if (canAnimate) {
      f.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-40px)', opacity: 0 }],
        { duration: 700, easing: 'ease-out', fill: 'forwards' }).finished.then(() => f.remove()).catch(() => f.remove());
    } else {
      setTimeout(() => f.remove(), 700);
    }
  }

  function shake() {
    if (!fxOn || reduceMotion) return;
    const m = $('main');
    m.classList.remove('shake');
    void m.offsetWidth;
    m.classList.add('shake');
  }

  function openOverlay(el) { el.classList.add('open'); }
  function closeOverlay(el) { el.classList.remove('open'); }

  /* ------------------------------------------------------------------
     Aktionen
  ------------------------------------------------------------------ */
  async function animateOut(els) {
    if (!canAnimate || reduceMotion) { await wait(150); return; }
    const anims = [];
    els.forEach((el, i) => {
      if (!el) return;
      const a = el.animate(
        [
          { transform: 'translateY(0) scale(1)', opacity: 1 },
          { transform: 'translateY(-70px) scale(.92)', opacity: 0 }
        ],
        { duration: 380, delay: i * 40, easing: 'cubic-bezier(.5,0,.9,.6)', fill: 'forwards' }
      );
      anims.push(a.finished.catch(() => {}));
    });
    await Promise.all(anims);
  }

  function bump(el) {
    if (!canAnimate || reduceMotion) return;
    el.animate(
      [
        { transform: 'translateY(0) scale(1)' },
        { transform: 'translateY(-16px) scale(1.12)', offset: 0.4 },
        { transform: 'translateY(0) scale(1)' }
      ],
      { duration: 360, easing: 'cubic-bezier(.2,.9,.3,1.2)' }
    );
  }

  async function playHand() {
    if (state.busy || state.handsLeft <= 0) return;
    const sel = selectedCards();
    const result = evaluate(sel);
    if (!result) return;

    state.busy = true;
    state.scoring = true;

    // Ausgewaehlte Karten wandern von der Hand in die Spielzone
    const els = sel.map(c => cardEls.get(c.id));
    const beforeRects = els.map(el => el.getBoundingClientRect());
    sel.forEach(c => cardEls.delete(c.id));
    state.hand = state.hand.filter(c => !state.selected.has(c.id));
    state.selected.clear();
    state.handsLeft -= 1;

    const row = $('playedRow');
    row.innerHTML = '';
    els.forEach(el => {
      el.classList.remove('selected', 'scoring');
      el.classList.add('played');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      row.appendChild(el);
    });

    const base = HAND_TYPES[result.type];
    $('handName').textContent = result.name;
    setBox(base.chips, base.mult);
    render(); // Restkarten schliessen die Luecke, Anzeigen werden aktualisiert

    if (canAnimate && !reduceMotion) {
      els.forEach((el, i) => {
        const a = el.getBoundingClientRect();
        const dx = beforeRects[i].left - a.left, dy = beforeRects[i].top - a.top;
        el.animate(
          [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'translate(0,0)' }],
          { duration: 480, delay: i * 40, easing: 'cubic-bezier(.2,.9,.3,1)', fill: 'backwards' }
        );
      });
    }
    await wait(canAnimate && !reduceMotion ? 700 : 100);

    // Karte fuer Karte werten: Chips zaehlen hoch
    let chips = base.chips, scoredCount = 0;
    let mult = base.mult;
    for (let i = 0; i < sel.length; i++) {
      if (!result.scoringIds.has(sel[i].id)) continue;
      const v = chipValue(sel[i].rank);
      chips += v;
      bump(els[i]);
      floaterAt(els[i], '+' + v);
      burstAt(els[i], '#22c7d6', 10, 200);
      sndCard(scoredCount++);
      setBox(chips, mult);
      popEl($('chipsBox'), 0.18);
      await wait(canAnimate && !reduceMotion ? 380 : 40);
    }

    // Joker wirken von links nach rechts
    const jctx = {
      type: result.type, played: sel, scoring: sel.filter(c => result.scoringIds.has(c.id)),
      handsLeft: state.handsLeft, discardsLeft: state.discardsLeft, handCards: state.hand.length,
      roundsWon: state.round - 1, firstHand: state.handsPlayed === 0
    };
    state.handsPlayed += 1;
    const fx = x => fmt(Math.round(x * 100) / 100);
    for (let ji = 0; ji < state.jokers.length; ji++) {
      const o = state.jokers[ji], def = J.byId[o.id];
      if (!def.score) continue;
      const e = def.score(Object.assign({ data: o.data }, jctx));
      if (!e) continue;
      const jel = jokerEls[ji]; let hit = false;
      if (e.chips) { chips += e.chips; hit = true; if (jel) floaterAt(jel, '+' + fx(e.chips) + ' Chips', '#22c7d6'); }
      if (e.mult) { mult += e.mult; hit = true; if (jel) floaterAt(jel, '+' + fx(e.mult) + ' Mult', '#ff7a45'); }
      if (e.xmult) { mult *= e.xmult; hit = true; if (jel) floaterAt(jel, '×' + fx(e.xmult) + ' Mult', '#ff5fa8'); }
      if (e.money) { state.money += e.money; hit = true; if (jel) floaterAt(jel, '+' + e.money + ' €', '#ffd34d'); }
      if (!hit) continue;
      if (jel) { bump(jel); burstAt(jel, '#ffd34d', 10, 200); }
      sndCard(scoredCount++);
      setBox(chips, mult);
      popEl($('chipsBox'), 0.15); popEl($('multBox'), 0.2);
      render();
      await wait(canAnimate && !reduceMotion ? 420 : 40);
    }

    // Multiplikator greift: Chips x Multiplikator
    await wait(canAnimate && !reduceMotion ? 220 : 40);
    popEl($('multBox'), 0.35);
    popEl($('chipsBox'), 0.12);
    const total = Math.round(chips * mult);
    burstAt($('multBox'), '#ff7a45', 18, 300);
    sndMult();
    if (total >= state.target * 0.25) { sndBig(); flash(0.35); burstAt($('playedRow'), '#ffd34d', 36, 420); }
    state.score += total;
    if (total > state.best.hand) { state.best.hand = total; saveBest(state.best); }
    showPopup('+' + fmt(total) + '<small>' + result.name + '</small>');
    if (total >= state.target * 0.25) shake();
    render();
    await wait(canAnimate && !reduceMotion ? 700 : 100);

    // Gespielte Karten verschwinden
    await animateOut(els);
    row.innerHTML = '';
    state.scoring = false;

    if (state.score >= state.target) {
      render();
      await wait(300);
      roundWon();
      return;
    }
    if (state.handsLeft <= 0) {
      render();
      await wait(300);
      runLost();
      return;
    }

    drawCards(handSize() - state.hand.length);
    sortHand();
    state.busy = false;
    render();
  }

  async function discardCards() {
    if (state.busy || state.discardsLeft <= 0) return;
    const sel = selectedCards();
    if (sel.length === 0) return;

    state.busy = true;
    render();
    await animateOut(sel.map(c => cardEls.get(c.id)));

    state.discardsLeft -= 1;
    state.hand = state.hand.filter(c => !state.selected.has(c.id));
    state.selected.clear();
    drawCards(handSize() - state.hand.length);
    sortHand();
    state.busy = false;
    render();
  }

  function toggleSort() {
    if (state.busy) return;
    state.sortMode = state.sortMode === 'rank' ? 'suit' : 'rank';
    sortHand();
    render();
  }

  function roundWon() {
    if (state.round > state.best.round) { state.best.round = state.round; saveBest(state.best); }
    const next = state.round + 1;

    // Geld am Rundenende: Grundbelohnung, uebrige Haende, Joker
    const lines = [['Runde geschafft', CONFIG.roundReward], ['Übrige Hände (' + state.handsLeft + ')', state.handsLeft * CONFIG.handReward]];
    const ectx = { handsLeft: state.handsLeft, discardsLeft: state.discardsLeft };
    state.jokers.forEach(o => {
      const def = J.byId[o.id];
      if (def.roundEnd) { const v = def.roundEnd(ectx); if (v) lines.push([def.name, v]); }
    });
    state.jokers.forEach(o => { const def = J.byId[o.id]; if (def.onRoundWon) def.onRoundWon(o.data); });
    const earned = lines.reduce((sum, l) => sum + l[1], 0);
    state.money += earned;

    $('endDialog').innerHTML =
      '<h2>Runde ' + state.round + ' geschafft!</h2>' +
      '<div class="big">' + fmt(state.score) + '</div>' +
      '<p>Ziel war ' + fmt(state.target) + '.</p>' +
      '<table class="hands">' + lines.map(l => '<tr><td>' + l[0] + '</td><td>+' + l[1] + ' €</td></tr>').join('') +
      '<tr><td><b>Geld jetzt</b></td><td><b>' + fmt(state.money) + ' €</b></td></tr></table>' +
      '<p>Nächstes Ziel: <b>' + fmt(targetFor(next)) + '</b></p>' +
      '<button class="primary" id="nextBtn">Zum Shop</button>';
    sndWin(); flash(0.5); burst(window.innerWidth / 2, window.innerHeight / 2, '#ffd34d', 60, 520);
    render();
    openOverlay($('endOverlay'));
    $('nextBtn').addEventListener('click', () => {
      closeOverlay($('endOverlay'));
      state.round = next;
      openShop(true);
    });
  }

  function runLost() {
    const reached = state.round;
    if (reached > state.best.round) { state.best.round = reached; saveBest(state.best); }
    $('endDialog').innerHTML =
      '<h2>Run vorbei</h2>' +
      '<p>Du hast Runde <b>' + reached + '</b> erreicht.</p>' +
      '<div class="big">' + fmt(state.score) + ' / ' + fmt(state.target) + '</div>' +
      '<p>Beste Runde: ' + state.best.round + ' · Beste Hand: ' + fmt(state.best.hand) + '</p>' +
      '<button class="primary" id="againBtn">Neuer Run</button>';
    sndLose();
    openOverlay($('endOverlay'));
    $('againBtn').addEventListener('click', newRun);
  }

  /* ------------------------------------------------------------------
     Joker: Leiste, Detailansicht, Shop, Sammlung
  ------------------------------------------------------------------ */
  const SEEN_KEY = 'poker-roguelike-seen';
  let seen = [];
  try { seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch (e) { seen = []; }
  function markSeen(id) {
    if (seen.includes(id)) return;
    seen.push(id);
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch (e) { /* ignorieren */ }
  }

  let jokerEls = [];
  function jokerCanvas(id) {
    const cv = window.paintJoker(id, J.byId[id].rarity);
    cv.className = 'jcv';
    return cv;
  }
  // kleine Joker-Karte (Groesse folgt --jpx) oder feste Vergroesserung
  function jokerEl(id, scale) {
    const el = document.createElement('div');
    el.className = 'jk r' + J.byId[id].rarity;
    const cv = jokerCanvas(id);
    if (scale) { el.style.width = (62 * scale) + 'px'; el.style.height = (83 * scale) + 'px'; }
    el.appendChild(cv);
    return el;
  }

  function renderJokers() {
    const row = $('jokerRow');
    row.innerHTML = '';
    jokerEls = [];
    for (let i = 0; i < CONFIG.jokerSlots; i++) {
      const o = state.jokers[i];
      if (!o) {
        const empty = document.createElement('div');
        empty.className = 'jk empty';
        row.appendChild(empty);
        continue;
      }
      const el = jokerEl(o.id);
      el.addEventListener('click', () => showJokerDetail(i));
      row.appendChild(el);
      jokerEls[i] = el;
      markSeen(o.id);
    }
    $('jokerInfo').textContent = 'Joker ' + state.jokers.length + '/' + CONFIG.jokerSlots;
  }

  function jokerText(id) {
    const d = J.byId[id];
    return '<div class="jname">' + d.name + '</div>' +
      '<div class="jrar r' + d.rarity + '">' + J.rarityName[d.rarity] + '</div>' +
      '<div class="jtext">' + d.text + '</div>';
  }

  function showJokerDetail(i) {
    const o = state.jokers[i];
    if (!o) return;
    const d = J.byId[o.id];
    const box = $('jokerDialog');
    box.innerHTML = '';
    const big = jokerEl(o.id, 3);
    box.appendChild(big);
    const info = document.createElement('div');
    info.innerHTML = jokerText(o.id) +
      (o.data && o.data.mult ? '<p>Aktuell: +' + o.data.mult + ' Mult</p>' : '') +
      '<button class="danger" id="sellBtn">Verkaufen: +' + J.sellValue(d) + ' €</button>' +
      '<button class="primary" id="jokerClose">Schließen</button>';
    box.appendChild(info);
    openOverlay($('jokerOverlay'));
    $('jokerClose').addEventListener('click', () => closeOverlay($('jokerOverlay')));
    $('sellBtn').addEventListener('click', () => {
      state.money += J.sellValue(d);
      state.jokers.splice(i, 1);
      closeOverlay($('jokerOverlay'));
      sndSelect(true);
      renderJokers(); render();
      if ($('shopOverlay').classList.contains('open')) renderShop();
      applyCardScale();
    });
  }

  /* ---------- Shop ---------- */
  function openShop(fresh) {
    if (fresh) {
      const n = CONFIG.shopSlots + mods().shopSlots;
      state.shop = { offers: J.offers(n, state.jokers.map(o => o.id)) };
    }
    renderShop();
    openOverlay($('shopOverlay'));
  }

  function renderShop() {
    const box = $('shopDialog');
    const owned = state.jokers.map(o => o.id);
    box.innerHTML = '<h2>Shop</h2><p>Geld: <b>' + fmt(state.money) + ' €</b> · Joker ' + state.jokers.length + '/' + CONFIG.jokerSlots + '</p><div class="offers" id="offers"></div>' +
      '<button id="rerollBtn">Neue Angebote: ' + CONFIG.rerollCost + ' €</button>' +
      '<p class="hint">Eigene Joker: antippen zum Ansehen oder Verkaufen.</p><div class="ownedrow" id="ownedRow"></div>' +
      '<button class="primary" id="shopNext">Weiter zu Runde ' + state.round + '</button>';
    const offers = $('offers');
    state.shop.offers.forEach((id, idx) => {
      const cell = document.createElement('div');
      cell.className = 'offer';
      if (!id) { cell.classList.add('sold'); cell.innerHTML = '<div class="jtext">Verkauft</div>'; offers.appendChild(cell); return; }
      markSeen(id);
      const d = J.byId[id], cost = J.cost(d);
      cell.appendChild(jokerEl(id, 2));
      const t = document.createElement('div');
      t.innerHTML = jokerText(id);
      cell.appendChild(t);
      const b = document.createElement('button');
      b.textContent = 'Kaufen: ' + cost + ' €';
      const full = state.jokers.length >= CONFIG.jokerSlots;
      if (state.money < cost || full) { b.disabled = true; if (full) b.textContent = 'Kein Platz'; }
      b.addEventListener('click', () => {
        if (state.money < cost || state.jokers.length >= CONFIG.jokerSlots) return;
        state.money -= cost;
        state.jokers.push(J.make(id));
        state.shop.offers[idx] = null;
        sndWin();
        renderJokers(); render(); renderShop(); applyCardScale();
      });
      cell.appendChild(b);
      offers.appendChild(cell);
    });
    const ownedRow = $('ownedRow');
    state.jokers.forEach((o, i) => {
      const el = jokerEl(o.id, 1);
      el.addEventListener('click', () => showJokerDetail(i));
      ownedRow.appendChild(el);
    });
    const rr = $('rerollBtn');
    if (state.money < CONFIG.rerollCost) rr.disabled = true;
    rr.addEventListener('click', () => {
      if (state.money < CONFIG.rerollCost) return;
      state.money -= CONFIG.rerollCost;
      const n = CONFIG.shopSlots + mods().shopSlots;
      state.shop = { offers: J.offers(n, state.jokers.map(o => o.id)) };
      sndSelect(true);
      render(); renderShop();
    });
    $('shopNext').addEventListener('click', () => {
      closeOverlay($('shopOverlay'));
      startRound();
    });
  }

  /* ---------- Sammlung ---------- */
  function buildCollection() {
    const grid = $('collGrid');
    grid.innerHTML = '';
    J.list.forEach(d => {
      const known = seen.includes(d.id);
      const cell = document.createElement('div');
      cell.className = 'offer' + (known ? '' : ' unknown');
      cell.appendChild(jokerEl(d.id, 2));
      const t = document.createElement('div');
      t.innerHTML = known ? jokerText(d.id) : '<div class="jname">???</div><div class="jtext">Noch nicht entdeckt</div>';
      cell.appendChild(t);
      grid.appendChild(cell);
    });
    $('collCount').textContent = seen.length + ' von ' + J.list.length + ' Jokern entdeckt';
  }

  /* ------------------------------------------------------------------
     Hilfe-Tabelle
  ------------------------------------------------------------------ */
  function buildHelp() {
    let html = '<tr><th>Hand</th><th>Basis</th><th>Mult.</th></tr>';
    const order = ['high', 'pair', 'twoPair', 'three', 'straight', 'flush', 'fullHouse', 'four', 'straightFlush'];
    order.forEach(k => {
      const t = HAND_TYPES[k];
      html += '<tr><td>' + t.name + '</td><td>' + t.chips + '</td><td>× ' + t.mult + '</td></tr>';
    });
    $('handsTable').innerHTML = html;
  }

  /* ------------------------------------------------------------------
     Start
  ------------------------------------------------------------------ */
  $('playBtn').addEventListener('click', playHand);
  $('discardBtn').addEventListener('click', discardCards);
  $('sortBtn').addEventListener('click', toggleSort);
  $('collBtn').addEventListener('click', () => { buildCollection(); openOverlay($('collOverlay')); });
  $('collClose').addEventListener('click', () => closeOverlay($('collOverlay')));
  $('helpBtn').addEventListener('click', () => openOverlay($('helpOverlay')));
  $('helpClose').addEventListener('click', () => closeOverlay($('helpOverlay')));
  $('restartBtn').addEventListener('click', () => {
    if (confirm('Aktuellen Run wirklich abbrechen und neu starten?')) newRun();
  });
  $('fxBtn').addEventListener('click', () => openOverlay($('fxOverlay')));
  $('fxClose').addEventListener('click', () => closeOverlay($('fxOverlay')));
  function toggleFx(key, get, set) {
    set(!get());
    try { localStorage.setItem(key, get() ? 'on' : 'off'); } catch (e) { /* ignorieren */ }
    applyFx();
  }
  $('fxBgBtn').addEventListener('click', () => toggleFx(FX_KEY, () => fxOn, v => { fxOn = v; }));
  $('fxLinesBtn').addEventListener('click', () => toggleFx(FX_KEY + '-lines', () => linesOn, v => { linesOn = v; }));
  $('sndBtn').addEventListener('click', () => { toggleFx(SND_KEY, () => soundOn, v => { soundOn = v; }); if (soundOn) sndSelect(true); });
  $('fxCurveBtn').addEventListener('click', () => toggleFx(FX_KEY + '-curve', () => curveOn, v => { curveOn = v; }));
  window.addEventListener('resize', applyCardScale);

  // Kartenrueckseite fuer den Stapel
  const deckCtx = $('deckCanvas').getContext('2d');
  deckCtx.imageSmoothingEnabled = false;
  deckCtx.drawImage(paintBack(), 0, 0);

  applyFx();
  requestAnimationFrame(bgLoop);
  applyCardScale();
  buildHelp();
  state.money = CONFIG.startMoney;
  startRound();
  applyCardScale(); // nach dem ersten Layout nochmal, damit die gemessene Groesse stimmt
})();