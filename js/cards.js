/* Kartengrafik: Pixel-Art-Spielkarten, per Code gemalt.
   paintCard(rank, suitIndex) / paintBack() -> 41x56 canvas */
(function () {
  const W = 41, H = 56;

  // ---------- Grundpalette ----------
  const C = {
    ink: '#2b1b33',
    edge: '#4a3256',          // Aussenkontur oben/links
    edgeHi: '#fffdf0',        // helle Kartonkante oben/links (2 px)
    edgeHi2: '#fff6dc',
    edgeLo: '#d9bf8c',        // Kartonkante unten/rechts (innere Stufe)
    edgeLo2: '#a98a58',       // aeussere Stufe
    edgeSh: '#160c22',        // Schlagschatten unten/rechts
    p0: '#faedd0', grain: '#f4e5c4',
    // Haut
    h: '#fddcba', s: '#f1b68e', S: '#c9806c', b: '#ec8a8c', m: '#9c3d4d', r: '#d4485a',
    e: '#2b1b33', w: '#fffaf0',
    // Gold
    y: '#fff1a6', g: '#f2b93c', G: '#b5702a',
    // Pelz / Stahl / Holz / Gruen
    W: '#fdf8f0', V: '#c4bcdc', j: '#f4f6ff', i: '#aeb9d6', I: '#68709a',
    n: '#a0643a', N: '#6a3d2a', u: '#58b050', U: '#2d7040',
  };
  // Haarfarben (a=Basis, A=Schatten, B=Licht)
  const HAIR = {
    black: { a: '#2f2845', A: '#16111f', B: '#5a5080' },
    brown: { a: '#74402e', A: '#431f22', B: '#a86a42' },
    ginger: { a: '#c8582a', A: '#8a3020', B: '#f09050' },
    blond: { a: '#ecc65e', A: '#b88838', B: '#fff0a8' },
    grey: { a: '#d6d4e6', A: '#9692b6', B: '#ffffff' },
  };
  // Farbschemata je Farbe
  const SCH = [
    { // Pik: Nachtblau-Schwarz / Silber
      pip: ['#2c2a4e', '#14122a', '#4a4a86', '#b8b8ee'], txt: '#25234a',
      c: '#3f5ab0', C: '#27367e', L: '#7e9ce8', p: '#d0d8f0', P: '#8e9ac4', q: '#ffffff',
      x: '#6ae4ec', X: '#2a9aa8', bg: ['#cfd8f0', '#b6c4e6'], fr: '#27367e', fr2: '#8e9ac4' },
    { // Herz: Karmesin / Rosa
      pip: ['#d0123e', '#7a0a2a', '#f0507a', '#ffffff'], txt: '#c4103a',
      c: '#cc163c', C: '#740a28', L: '#ff6c88', p: '#f8d4d8', P: '#c07a90', q: '#ffffff',
      x: '#ff2c58', X: '#a80e3a', bg: ['#f8c4d0', '#ec9eb2'], fr: '#740a28', fr2: '#e0607c' },
    { // Kreuz: Smaragd / Ocker
      pip: ['#2f9a50', '#115a30', '#52b672', '#d8ffd8'], txt: '#1e7a42',
      c: '#3e9a58', C: '#1e5a3c', L: '#84d490', p: '#d49a3c', P: '#8c5a28', q: '#f6d070',
      x: '#fff0a0', X: '#e0b040', bg: ['#cde8bc', '#b0d49c'], fr: '#1e5a3c', fr2: '#d49a3c' },
    { // Karo: Orange / Petrol
      pip: ['#f6a010', '#b86406', '#fcc030', '#fff8c8'], txt: '#d27800',
      c: '#f6b01e', C: '#b8700a', L: '#ffe070', p: '#2eb6a8', P: '#1c7a82', q: '#7aeedc',
      x: '#40e4d2', X: '#1c9aa0', bg: ['#fdf0b0', '#f6d878'], fr: '#b8700a', fr2: '#2eb6a8' },
  ];

  // ---------- Buffer-Helfer ----------
  const nb = (w, h) => ({ w, h, d: new Array(w * h).fill(null) });
  const gp = (b, x, y) => (x < 0 || y < 0 || x >= b.w || y >= b.h) ? null : b.d[y * b.w + x];
  const sp = (b, x, y, c) => { if (x >= 0 && y >= 0 && x < b.w && y < b.h) b.d[y * b.w + x] = c; };
  function stamp(b, rows, x0, y0, pal) {
    for (let y = 0; y < rows.length; y++) {
      const r = rows[y];
      for (let x = 0; x < r.length; x++) {
        const ch = r[x];
        if (ch === '.' || ch === ' ') continue;
        const col = pal[ch];
        if (col) sp(b, x0 + x, y0 + y, col);
      }
    }
  }
  function rect(b, x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) sp(b, x + i, y + j, c); }
  function rot180(b) { const o = nb(b.w, b.h); for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) o.d[(b.h - 1 - y) * b.w + (b.w - 1 - x)] = b.d[y * b.w + x]; return o; }
  function over(dst, src, dx, dy) { for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) { const c = src.d[y * src.w + x]; if (c) sp(dst, dx + x, dy + y, c); } }
  function flipRows(rows) { return rows.slice().reverse().map(r => r.split('').reverse().join('')); }
  const ctr = (s, w) => { w = w || 21; const pad = (w - s.length) >> 1; return '.'.repeat(pad) + s + '.'.repeat(w - s.length - pad); };

  // ---------- Kartenbasis ----------
  const inMask = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return false;
    const dx = Math.min(x, W - 1 - x), dy = Math.min(y, H - 1 - y);
    return dx + dy >= 2;
  };
  let baseCache = null;
  function baseCard() {
    if (baseCache) return baseCache;
    const b = nb(W, H);
    const isOut = (x, y) => inMask(x, y) && (!inMask(x - 1, y) || !inMask(x + 1, y) || !inMask(x, y - 1) || !inMask(x, y + 1));
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (!inMask(x, y)) continue;
      if (isOut(x, y)) { sp(b, x, y, (x > 20 || y > 28) ? C.edgeSh : C.edge); continue; }
      // Karton: 2 px hell oben/links, 2 px gestuft dunkler unten/rechts
      if (isOut(x + 1, y) || isOut(x, y + 1)) { sp(b, x, y, C.edgeLo2); continue; }
      if (isOut(x - 1, y) || isOut(x, y - 1)) { sp(b, x, y, C.edgeHi); continue; }
      if (isOut(x + 2, y) || isOut(x, y + 2)) { sp(b, x, y, C.edgeLo); continue; }
      if (isOut(x - 2, y) || isOut(x, y - 2)) { sp(b, x, y, C.edgeHi2); continue; }
      // gleichmaessiger Papierton, feines regelmaessiges Korn
      sp(b, x, y, ((x + 2 * y) % 5 === 0 && x > 3 && y > 3 && x < W - 4 && y < H - 4) ? C.grain : C.p0);
    }
    baseCache = b; return b;
  }

  // ---------- Schrift (4x6) ----------
  const FONT = {
    '0': ['0110', '1001', '1001', '1001', '1001', '0110'], '1': ['0010', '0110', '0010', '0010', '0010', '0111'],
    '2': ['0110', '1001', '0001', '0010', '0100', '1111'], '3': ['1111', '0001', '0110', '0001', '1001', '0110'],
    '4': ['0011', '0101', '1001', '1111', '0001', '0001'], '5': ['1111', '1000', '1110', '0001', '1001', '0110'],
    '6': ['0011', '0100', '1110', '1001', '1001', '0110'], '7': ['1111', '0001', '0010', '1110', '0100', '0100'],
    '8': ['0110', '1001', '0110', '1001', '1001', '0110'], '9': ['0110', '1001', '1001', '0111', '0001', '0110'],
    'J': ['0011', '0001', '0001', '0001', '1001', '0110'], 'Q': ['0110', '1001', '1001', '1001', '1011', '0111'],
    'K': ['1001', '1010', '1100', '1100', '1010', '1001'], 'A': ['0110', '1001', '1001', '1111', '1001', '1001'],
  };
  const ONE2 = ['01', '11', '01', '01', '01', '01'];
  function glyph(b, rows, x, y, col) { for (let j = 0; j < rows.length; j++) for (let i = 0; i < rows[j].length; i++) if (rows[j][i] === '1') sp(b, x + i, y + j, col); }

  // ---------- Pips ----------
  const PIP = [
    // Pik 7x9
    ['...o...', '..ooo..', '.ooooo.', 'ooooooo', 'ooooooo', 'ooooooo', '.oo.oo.', '...o...', '..ooo..'],
    // Herz 7x8
    ['.oo.oo.', 'ooooooo', 'ooooooo', 'ooooooo', 'ooooooo', '.ooooo.', '..ooo..', '...o...'],
    // Kreuz 7x8
    ['..ooo..', '.ooooo.', '..ooo..', 'ooooooo', 'ooooooo', 'oo.o.oo', '...o...', '..ooo..'],
    // Karo 7x9
    ['...o...', '..ooo..', '.ooooo.', 'ooooooo', 'ooooooo', 'ooooooo', '.ooooo.', '..ooo..', '...o...'],
  ];
  const SMALL = [
    ['...o...', '..ooo..', '.ooooo.', 'ooooooo', 'ooooooo', '.oo.oo.', '...o...', '..ooo..'],
    ['oo..oo', 'oooooo', 'oooooo', '.oooo.', '.oooo.', '..oo..'],
    ['..oo..', '.oooo.', '..oo..', 'oooooo', 'oooooo', '..oo..'],
    ['..oo..', '.oooo.', 'oooooo', 'oooooo', '.oooo.', '..oo..'],
  ];
  // Maske -> farbige Pixel (plastisch: Licht oben links, Schatten unten rechts)
  function shadeMask(rows, pc, spec, big) {
    const h = rows.length, w = rows[0].length;
    const o = nb(w, h);
    let minx = 99, miny = 99, maxx = 0, maxy = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (rows[y][x] === 'o') { minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y); }
    const has = (x, y) => x >= 0 && y >= 0 && x < w && y < h && rows[y][x] === 'o';
    let specDone = false;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (!has(x, y)) continue;
      const t = ((x - minx) + (y - miny)) / ((maxx - minx) + (maxy - miny));
      let col = pc[0];
      const rimBR = !has(x + 1, y) || !has(x, y + 1);
      const rimTL = !has(x - 1, y) || !has(x, y - 1);
      if (t > 0.68 || (rimBR && t > 0.55)) col = pc[1];
      else if (t < 0.3 || (rimTL && t < 0.4)) col = pc[2];
      if (big) { const rim = rimBR || rimTL || !has(x - 1, y - 1) || !has(x + 1, y + 1) || !has(x + 1, y - 1) || !has(x - 1, y + 1); if (rim) col = pc[1]; else if ((!has(x - 2, y - 1) || !has(x - 1, y - 2) || !has(x - 2, y - 2)) && t < 0.55) col = pc[2]; else if (t > 0.58) col = pc[1] === col ? col : pc[0]; }
      sp(o, x, y, col);
    }
    // Glanzpunkt
    if (spec) {
      let best = null, bt = 9;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        if (!has(x, y)) continue;
        if (has(x - 1, y) && has(x, y - 1) && has(x - 1, y - 1)) {
          const t = x + y; if (t < bt) { bt = t; best = [x, y]; }
        }
      }
      if (best) sp(o, best[0], best[1], pc[3]);
    }
    return o;
  }
  const pipCache = {};
  function pipImg(s, flip) {
    const key = s + (flip ? 'f' : 'n');
    if (pipCache[key]) return pipCache[key];
    const rows = flip ? flipRows(PIP[s]) : PIP[s];
    return (pipCache[key] = shadeMask(rows, SCH[s].pip, true));
  }

  // Layouts: [spalte, top, flip]
  const LC = { L: 13, C: 20, R: 27 };
  const LAY = {
    2: [['C', 6, 0], ['C', 43, 1]],
    3: [['C', 6, 0], ['C', 24, 0], ['C', 43, 1]],
    4: [['L', 6, 0], ['R', 6, 0], ['L', 43, 1], ['R', 43, 1]],
    5: [['L', 6, 0], ['R', 6, 0], ['C', 24, 0], ['L', 43, 1], ['R', 43, 1]],
    6: [['L', 6, 0], ['R', 6, 0], ['L', 24, 0], ['R', 24, 0], ['L', 43, 1], ['R', 43, 1]],
    7: [['L', 6, 0], ['R', 6, 0], ['C', 15, 0], ['L', 24, 0], ['R', 24, 0], ['L', 43, 1], ['R', 43, 1]],
    8: [['L', 6, 0], ['R', 6, 0], ['C', 15, 0], ['L', 24, 0], ['R', 24, 0], ['C', 34, 1], ['L', 43, 1], ['R', 43, 1]],
    9: [['L', 6, 0], ['R', 6, 0], ['L', 18, 0], ['R', 18, 0], ['C', 24, 0], ['L', 31, 1], ['R', 31, 1], ['L', 43, 1], ['R', 43, 1]],
    10: [['L', 6, 0], ['R', 6, 0], ['C', 12, 0], ['L', 18, 0], ['R', 18, 0], ['L', 31, 1], ['R', 31, 1], ['C', 37, 1], ['L', 43, 1], ['R', 43, 1]],
  };

  // ---------- grosse Symbole (Ass) ----------
  // Grosse Symbole fuer die Asse: Pik und Kreuz von Hand konstruiert (klare Form), Herz/Karo mathematisch
  const SPADE_BODY = 19, SPADE_STEM = 4;
  const SPADE_HW = [0, 1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 8, 7, 6, 4, 2, 1, 1, 1, 1, 1, 1, 2, 3, 4];
  // Profile: [aussen, luecke] je Zeile (Luecke = innerste ausgelassene Spalte, -1 = keine)
  const HEART_P = [[6, 2], [8, 1], [9, 1], [9, 0], [9, 0], [9, -1], [9, -1], [9, -1], [9, -1], [9, -1], [9, -1], [8, -1], [8, -1], [7, -1], [7, -1], [6, -1], [6, -1], [6, -1], [5, -1], [5, -1], [4, -1], [4, -1], [3, -1], [3, -1], [2, -1], [2, -1], [1, -1], [1, -1], [1, -1], [0, -1]];
  function mirrorRows(P, w) {
    const c = (w - 1) / 2, rows = [];
    for (const [o, g] of P) { let r = ''; for (let x = 0; x < w; x++) { const dx = Math.abs(x - c); r += (dx <= o && dx > g) ? 'o' : '.'; } rows.push(r); }
    return rows;
  }
  // Herzkurve (klassisch): innen wenn (X^2+Y^2-1)^3 - X^2 Y^3 <= 0
  const inHeart = (X, Y) => Math.pow(X * X + Y * Y - 1, 3) - X * X * Y * Y * Y <= 0;
  function heartRows(w, h, flip, extra) {
    const rows = [], c = (w - 1) / 2;
    for (let py = 0; py < h; py++) {
      let r = '';
      for (let px = 0; px < w; px++) {
        const X = (px - c) / (w / 2) * 1.12;
        const t = (flip ? Math.pow((py + 0.5) / h, 1.16) : (py + 0.5) / h) * 2.23;
        r += inHeart(X, flip ? -1.0 + t : 1.23 - t) ? 'o' : '.';
      }
      rows.push(r);
    }
    return rows;
  }
  function bigMask(s) {
    const w = s === 0 ? 19 : s === 1 ? 19 : s === 2 ? 19 : 15;
    if (s === 0) {
      const body = heartRows(w, SPADE_BODY, true), rows = [], c = 9;
      const H = SPADE_BODY + SPADE_STEM;
      for (let py = 0; py < H; py++) {
        let r = body[py] || '.'.repeat(w);
        const sh = py - (H - 4); // Fuss
        const hw = sh >= 0 ? [1, 2, 3, 4][Math.min(3, sh + 0)] : 1;
        const out = r.split('');
        const kk = py - (SPADE_BODY - 4);
        if (kk >= 0) for (let x = 0; x < w; x++) { const dx = Math.abs(x - c); if (dx > 1 && dx <= Math.round((kk + 1) * 0.75) + 1 && py < SPADE_BODY) out[x] = '.'; }
        if (py >= SPADE_BODY - 5) for (let x = 0; x < w; x++) if (Math.abs(x - c) <= (sh >= 0 ? [2, 3, 3, 3][sh] : 1)) out[x] = 'o';
        rows.push(out.join(''));
      }
      return rows;
    }
    if (s === 1) return heartRows(w, 18, false);
    if (s === 3) { // schlanke Raute mit leicht gewoelbten Seiten
      const rows = [], h = 25, c = (h - 1) / 2;
      for (let y = 0; y < h; y++) { const t = Math.abs(y - c) / (c + 0.6); const hw = Math.round(7.2 * Math.pow(1 - t, 0.9)); const P = [hw, -1]; rows.push(mirrorRows([P], w)[0]); }
      return rows;
    }
    // Kreuz: drei schlanke Blaetter, schmale Taille, duenner Stiel mit Fuss
    const rows = [], h = 23, cx = 9;
    const dd = (px, py, x, y, r) => (px - x) * (px - x) + (py - y) * (py - y) <= r * r;
    const HUB = { 6: 2, 7: 2, 8: 2, 9: 2, 10: 2, 11: 2, 12: 2 };
    const FOOT = { 20: 2, 21: 3, 22: 4 };
    for (let py = 0; py < h; py++) {
      let r = '';
      for (let px = 0; px < w; px++) {
        const dx = Math.abs(px - cx);
        let on = dd(px, py, cx, 3.8, 3.8) || dd(px, py, cx - 4.6, 9.6, 3.8) || dd(px, py, cx + 4.6, 9.6, 3.8);
        if (HUB[py] !== undefined && dx <= HUB[py]) on = true;
        if (py >= 12 && py <= 19 && dx <= 1) on = true;
        if (FOOT[py] !== undefined && dx <= FOOT[py]) on = true;
        r += on ? 'o' : '.';
      }
      rows.push(r);
    }
    return rows;
  }

  // ---------- Ecken-Index ----------
  function drawIndex(b, rank, s) {
    const lab = rank === 14 ? 'A' : rank === 13 ? 'K' : rank === 12 ? 'Q' : rank === 11 ? 'J' : String(rank);
    const col = SCH[s].txt;
    const lay = nb(W, H);
    if (lab === '10') { glyph(lay, ONE2, 3, 4, col); glyph(lay, FONT['0'], 5, 4, col); }
    else glyph(lay, FONT[lab], 4, 4, col);
    const sm = shadeMask(SMALL[s], SCH[s].pip, true);
    over(lay, sm, 3, 11);
    over(b, lay, 0, 0);
    over(b, rot180(lay), 0, 0);
  }

  // ---------- Hofkarten ----------
  // Figur-Buffer 21x22. Paletten-Schluessel siehe oben.
  function figPal(s, hair, extra) {
    const sc = SCH[s];
    return Object.assign({}, C, HAIR[hair], { c: sc.c, C: sc.C, L: sc.L, p: sc.p, P: sc.P, q: sc.q, x: sc.x, X: sc.X }, extra || {});
  }

  // Koerper: Breiten je Zeile (Zeilen 15..21)
  const BW = [11, 15, 17, 17, 17, 17, 17];
  function bodyRows(role, v) {
    const rows = [];
    for (let k = 0; k < 7; k++) {
      const w = BW[k];
      let r = [];
      for (let i = 0; i < w; i++) {
        let ch = 'c';
        if (i <= 1) ch = 'L'; else if (i >= w - 3) ch = 'C';
        if (role === 'J') {
          if (i >= (w >> 1)) ch = (i >= w - 3) ? 'P' : 'p'; else ch = (i <= 1) ? 'L' : 'c';
          if (i === (w >> 1)) ch = 'g';
        }
        r.push(ch);
      }
      rows.push(r);
    }
    const mid = (k) => BW[k] >> 1;
    if (role === 'K') {
      for (let k = 0; k < 3; k++) { const w = BW[k]; for (let i = 1; i < w - 1; i++) { if (Math.abs(i - mid(k)) <= (k === 0 ? 4 : 6)) rows[k][i] = ((i + k) % 4 === 0) ? 'I' : (i > mid(k) + 2 ? 'V' : 'W'); } }
      for (let k = 3; k < 7; k++) { rows[k][mid(k)] = 'g'; rows[k][mid(k) - 1] = (k % 2) ? 'y' : 'G'; rows[k][mid(k) + 1] = 'G'; }
      for (let i = 1; i < BW[5] - 1; i++) rows[5][i] = (i < 3 || i > BW[5] - 4) ? 'G' : (((i % 3) === 0) ? 'y' : 'g');
      for (const k of [5, 6]) { rows[k][1] = 'W'; rows[k][2] = 'V'; rows[k][BW[k] - 3] = 'W'; rows[k][BW[k] - 2] = 'V'; }
    } else if (role === 'Q') {
      for (let k = 0; k < 3; k++) { const w = BW[k]; for (let i = 1; i < w - 1; i++) { if (Math.abs(i - mid(k)) <= 2 + k) rows[k][i] = ((Math.abs(i - mid(k)) + k) % 2 === 0) ? 'W' : 'V'; } }
      for (let k = 0; k < 3; k++) { rows[k][mid(k)] = 's'; if (k > 0) { rows[k][mid(k) - 1] = 's'; rows[k][mid(k) + 1] = 'S'; } }
      rows[2][mid(2) - 2] = 'g'; rows[2][mid(2) + 2] = 'g'; rows[3][mid(3) - 1] = 'g'; rows[3][mid(3) + 1] = 'g'; rows[3][mid(3)] = 'x'; rows[2][mid(2)] = 's';
      rows[3][mid(3) - 2] = 'W'; rows[3][mid(3) + 2] = 'V';
      for (let k = 3; k < 7; k++) for (let i = 2; i < BW[k] - 2; i++) {
        if (rows[k][i] === 'c' || rows[k][i] === 'L' || rows[k][i] === 'C') {
          if (k >= 5 && (i + k) % 5 === 0) rows[k][i] = 'C';
          if (k >= 5 && (i + k) % 5 === 2) rows[k][i] = 'L';
        }
      }
      for (let i = 2; i < BW[4] - 2; i++) rows[4][i] = (Math.abs(i - mid(4)) < 2) ? 'y' : 'p';
      rows[4][mid(4)] = 'x';
      for (const k of [5, 6]) { rows[k][1] = 'p'; rows[k][BW[k] - 2] = 'p'; }
    } else {
      for (let k = 0; k < 2; k++) { const w = BW[k]; for (let i = 1; i < w - 1; i++) if (Math.abs(i - mid(k)) <= 2 + k) rows[k][i] = (i < mid(k)) ? 'W' : 'V'; }
      rows[2][mid(2)] = 'g'; rows[3][mid(3)] = 'g';
      for (let k = 2; k < 7; k++) { rows[k][mid(k)] = (k % 2) ? 'y' : 'g'; }
      for (let i = 1; i < BW[5] - 1; i++) rows[5][i] = (i === mid(5)) ? 'y' : 'G';
      rows[5][mid(5) - 1] = 'N'; rows[5][mid(5) + 1] = 'N';
      for (let k = 3; k < 7; k++) for (let i = mid(k) + 2; i < BW[k] - 3; i++) if ((i + k) % 3 === 0 && k !== 5) rows[k][i] = 'q';
      for (const k of [6]) { for (let i = 1; i < BW[k] - 1; i++) rows[k][i] = (i < mid(k)) ? (i <= 1 ? 'L' : 'C') : 'P'; rows[k][mid(k)] = 'G'; }
    }
    return rows.map((r) => ctr(r.join(''), 21));
  }

  // ---------- Koepfe (15 breit x 15 hoch, prozedural) ----------
  const ROLEDEF = {
    // [haar, objekt]
    K: [['grey', 'sword'], ['brown', 'scepter'], ['ginger', 'orb'], ['blond', 'axe']],
    Q: [['black', 'mirror'], ['ginger', 'rose'], ['blond', 'lily'], ['brown', 'gem']],
    J: [['black', 'spear'], ['brown', 'feather'], ['ginger', 'staff'], ['blond', 'shield']],
  };
  const HATS = [ // Jack-Huete (13 breit, 5 Zeilen), je Farbe
    ['...........xx', '....cLccc..xX', '...cLcccCc.xX', '..cLccccccCxX', '..CgCCCCCCCX.'],
    ['.....cccc..xX', '...cLcccccxXX', '..cLccccccCX.', '.cLcccccccCC.', '..CCCCgCCCC..'],
    ['.....cLcc....', '...cLcccCc...', '..cLccccccC..', '.CcccccccccC.', '..CCCCgCCCC..'],
    ['....ggyg.....', '...gyggggg...', '..pPppppppP..', '..ppqppqppP..', '..PPPPPPPPP..'],
  ];
  const KCROWN = [
    '...x...y...x...',
    '...gy.ygy.yg...',
    '..ggggggggggg..',
    '..gxgGgxgGgxg..',
    '..GGGGGGGGGGG..',
  ];
  const QTIARA = [ // je Farbe: 4 Zeilen (Zeile 0..3)
    ['.......y.......', '......ygy......', '....gggxggg....', '...GGGGGGGGG...'],
    ['....y.....y....', '...ygy...ygy...', '....gxgggxg....', '...GGGGGGGGG...'],
    ['......y.y......', '....y.ygy.y....', '....gxgxgxg....', '...GGGGGGGGG...'],
    ['......ygy......', '....y.gxg.y....', '...ggxgyg xgg...'.replace(' ', ''), '...GGGGGGGGG...'],
  ];
  function buildHead(role, s, P) {
    const hb = nb(15, 15), hr = HAIR[ROLEDEF[role][s][0]];
    const set = (x, y, c) => sp(hb, x, y, c);
    const row = (y, x0, x1, c) => { for (let x = x0; x <= x1; x++) set(x, y, c); };
    const a = hr.a, A = hr.A, B = hr.B;
    // --- Haar hinten (lang) ---
    if (role === 'Q') {
      const dd = [[1, 13], [1, 13], [1, 13], [1, 13], [1, 13], [1, 13], [1, 13], [2, 12], [2, 12]];
      for (let k = 0; k < dd.length; k++) { row(4 + k, dd[k][0], dd[k][1], a); }
      for (let y = 4; y <= 13; y++) { set(1, y, A); set(13, y, A); }
      if (s === 1) { for (let y = 5; y <= 12; y += 3) { set(0, y, a); set(0, y + 1, a); set(14, y + 1, a); set(14, y + 2, a); } row(13, 1, 2, a); row(13, 12, 13, a); }
      if (s === 2) { /* Zopf rechts */ for (let y = 9; y <= 14; y++) { row(y, 11, 13, (y % 2) ? a : B); } set(12, 14, 'y'); set(11, 14, A); set(13, 14, A); row(13, 11, 13, a); set(12, 13, C.g); }
      if (s === 3) { /* Dutt (oben seitlich) */ }
      if (s === 0) { for (let y = 4; y <= 13; y++) set(2, y, B); }
    }
    // --- Gesicht ---
    const faceRows = [[4, 4, 10], [5, 3, 11], [6, 3, 11], [7, 3, 11], [8, 3, 11], [9, 3, 11], [10, 3, 11], [11, 4, 10], [12, 4, 10], [13, 5, 9]];
    for (const [y, x0, x1] of faceRows) for (let x = x0; x <= x1; x++) {
      let c = 'h';
      if (x >= 9 && y >= 7) c = 's'; if (x === x1 && y >= 6) c = 's'; if (y >= 12) c = 's';
      if (x === x1 && y >= 10) c = 'S'; if (y === 13) c = 'S';
      set(x, y, P[c]);
    }
    // Hals
    row(14, 6, 8, P.S); set(6, 14, P.s);
    // Augen
    set(4, 8, P.w); set(5, 8, P.e); set(9, 8, P.e); set(10, 8, P.w);
    set(4, 9, P.s); set(10, 9, P.s);
    // Brauen
    const bc = role === 'K' ? A : A;
    row(7, 4, 5, bc); row(7, 9, 10, bc);
    if (role === 'K') { set(4, 6, bc); set(10, 6, bc); }
    // Wangen, Nase, Mund
    set(3, 10, P.b); set(4, 10, P.b); set(10, 10, P.b); set(11, 10, P.b);
    set(7, 9, P.S); set(7, 10, P.s);
    if (role === 'J') { row(11, 6, 8, P.m); set(5, 11, P.s); set(9, 11, P.s); }
    else { row(11, 6, 8, P.r); set(6, 11, P.m); set(8, 11, P.m); }
    // --- Haar vorne / Frisuren ---
    if (role === 'K' || role === 'J') {
      row(5, 2, 12, a); row(6, 2, 3, a); row(6, 11, 12, a);
      row(4, 3, 11, a);
      for (let y = 7; y <= 9; y++) { set(2, y, a); set(12, y, a); }
      set(3, 6, a); set(11, 6, a);
      row(5, 4, 6, B); set(3, 5, A); set(11, 5, A); set(2, 6, A); set(12, 6, A);
      for (let y = 7; y <= 9; y++) { set(2, y, A); }
      for (let y = 7; y <= 11; y++) set(12, y, A);
      row(6, 5, 9, a); row(6, 4, 4, A); row(6, 10, 10, A); // Pony
      set(7, 6, B);
    } else {
      // Koenigin: Stirnfransen/Scheitel
      row(4, 3, 11, a); row(5, 2, 12, a); row(6, 2, 4, a); row(6, 10, 12, a);
      set(7, 6, a); set(6, 5, B); set(5, 5, B); set(4, 4, B);
      for (let x = 5; x <= 9; x++) set(x, 6, ((x + s) & 1) ? a : A);
      row(6, 5, 9, a); set(7, 6, P.h); set(8, 6, a);
      for (let y = 7; y <= 10; y++) { set(2, y, a); set(12, y, a); }
      for (let y = 7; y <= 10; y++) { set(3, y, A); set(11, y, A); } // Haarstraehnen rahmen
      for (let y = 7; y <= 10; y++) { set(3, y, y > 7 ? A : a); set(11, y, y > 7 ? A : a); }
      set(3, 10, P.b); set(11, 10, P.b); // Wangen bleiben
      if (s === 3) { row(2, 5, 9, a); row(3, 4, 10, a); set(7, 2, B); set(6, 2, B); } // Dutt
    }
    // --- Bart (Koenige) ---
    if (role === 'K') {
      if (s === 0) { // grauer Vollbart
        row(10, 3, 4, a); row(10, 10, 11, a); row(11, 3, 5, a); row(11, 9, 11, a); row(12, 4, 10, a); row(13, 5, 9, A); row(14, 6, 8, A);
        row(10, 5, 9, 'W' === 0 ? a : a); set(7, 10, a); row(10, 5, 6, a); row(10, 8, 9, a); set(7, 10, P.S);
        row(11, 6, 8, P.m); set(5, 12, B); set(9, 12, B); set(7, 13, B);
        set(3, 10, a); set(11, 10, a);
      } else if (s === 1) { // Spitzbart
        row(10, 4, 6, A); row(10, 8, 10, A); set(7, 10, P.S);
        row(12, 5, 9, a); row(13, 6, 8, A); set(7, 14, A); set(7, 12, B);
      } else if (s === 2) { // Backenbart + Schnurrbart
        for (let y = 8; y <= 12; y++) { set(3, y, a); set(11, y, a); }
        for (let y = 8; y <= 11; y++) { set(4, y, y > 9 ? a : P.h); set(10, y, y > 9 ? a : P.s); }
        row(10, 4, 6, A); row(10, 8, 10, A); set(4, 9, B); set(10, 10, A);
        row(11, 4, 10, a); row(11, 6, 8, P.m); set(7, 12, a); set(7, 13, A);
        set(3, 13, A); set(11, 13, A); set(3, 8, B); set(11, 8, B);
      } else { // blond, glatt, mit Schnurrbart
        row(10, 5, 6, a); row(10, 8, 9, a); set(5, 10, B);
      }
    }
    // --- Kopfbedeckung ---
    if (role === 'K') {
      for (let y = 0; y < 5; y++) for (let x = 0; x < 15; x++) { const ch = KCROWN[y][x]; if (ch === '.') continue; let c = P[ch]; if (ch === 'x') c = P.x; set(x, y, c); }
      if (s === 1) { set(7, 0, P.X); set(3, 0, P.y); set(11, 0, P.y); }
      if (s === 2) { set(7, 1, P.x); }
      if (s === 3) { row(5, 3, 3, a); }
    } else if (role === 'Q') {
      const t = QTIARA[s];
      for (let y = 0; y < 4; y++) for (let x = 0; x < 15; x++) { const ch = t[y][x]; if (ch === '.') continue; set(x, y + 1, ch === 'x' ? P.x : P[ch]); }
      if (s === 3) { row(5, 3, 11, a); }
    } else {
      const hat = HATS[s];
      for (let y = 0; y < 5; y++) for (let x = 0; x < 13; x++) { const ch = hat[y][x]; if (ch === '.') continue; set(x + 1, y, P[ch]); }
    }
    return hb;
  }

  function buildFigure(role, s) {
    const [hair, obj] = ROLEDEF[role][s];
    const pal = figPal(s, hair);
    const fb = nb(21, 22);
    stamp(fb, bodyRows(role), 0, 15, pal);
    over(fb, buildHead(role, s, pal), 3, 0);
    drawObject(fb, role, s, obj, pal);
    const o = nb(21, 22);
    for (let y = 0; y < 22; y++) for (let x = 0; x < 21; x++) {
      const c = gp(fb, x, y);
      if (c) { sp(o, x, y, c); continue; }
      if (gp(fb, x - 1, y) || gp(fb, x + 1, y) || gp(fb, x, y - 1) || gp(fb, x, y + 1)) sp(o, x, y, C.ink);
    }
    return o;
  }

  // Haende (3x3) und Gegenstaende
  function drawObject(fb, role, s, obj, P) {
    const hand = (x, y) => { stamp(fb, ['hhs', 'hSs', 'sSS'], x, y, P); sp(fb, x, y, P.w); };
    const handL = (x, y) => { stamp(fb, ['shh', 'sSh', 'SSs'], x, y, P); sp(fb, x + 2, y, P.w); };
    const cuffR = (y) => { for (let k = 0; k < 2; k++) { sp(fb, 17, y + k, P.W); sp(fb, 18, y + k, P.V); } };
    // freie linke Hand (liegt am Guertel) – ausser beim Schwert
    if (obj !== 'sword') { handL(0, 19); }
    if (obj === 'sword') {
      for (let y = 5; y <= 18; y++) { sp(fb, 1, y, P.j); sp(fb, 2, y, P.i); }
      sp(fb, 1, 4, P.j); sp(fb, 2, 4, P.I); sp(fb, 2, 18, P.I);
      for (let x = -1; x <= 4; x++) sp(fb, x, 19, x % 2 ? P.g : P.y);
      handL(0, 20); sp(fb, 2, 20, P.n);
      hand(17, 19);
    } else if (obj === 'scepter') {
      for (let y = 8; y <= 21; y++) sp(fb, 19, y, (y % 3) ? P.g : P.G);
      stamp(fb, ['.xx.', 'xyxX', 'xxXX', '.XX.'], 17, 4, P);
      stamp(fb, ['.g.', 'ggg'], 18, 8, P);
      hand(17, 18);
    } else if (obj === 'orb') {
      stamp(fb, ['..y..', '.yyy.', '..y..'], 15, 8, P);
      stamp(fb, ['.ggg.', 'gyggG', 'ggggG', 'gggGG', '.GGG.'], 15, 10, P);
      hand(17, 17);
    } else if (obj === 'axe') {
      for (let y = 4; y <= 21; y++) sp(fb, 19, y, (y % 2) ? P.n : P.N);
      stamp(fb, ['.jii', 'jiiI', 'jiiI', 'jiII', '.iII', '..iI'], 16, 4, P);
      hand(17, 18);
    } else if (obj === 'mirror') {
      for (let y = 14; y <= 21; y++) sp(fb, 19, y, (y % 2) ? P.g : P.G);
      stamp(fb, ['.ggg.', 'gjiIg', 'gjiIg', 'giiIg', '.ggg.'], 17, 9, P);
      hand(17, 18);
    } else if (obj === 'rose') {
      for (let y = 12; y <= 21; y++) sp(fb, 19, y, P.u);
      stamp(fb, ['.xx.', 'xXxx', 'xxXx', '.xx.'], 17, 8, P);
      stamp(fb, ['u.', 'uu'], 17, 14, P); sp(fb, 20, 15, P.u);
      hand(17, 18);
    } else if (obj === 'lily') {
      for (let y = 12; y <= 21; y++) sp(fb, 19, y, P.U);
      stamp(fb, ['W.W.W', '.WyW.', 'WWyWW', '.WVW.'], 17, 8, P);
      stamp(fb, ['uu'], 17, 15, P);
      hand(17, 18);
    } else if (obj === 'gem') {
      for (let y = 14; y <= 21; y++) sp(fb, 19, y, P.g);
      stamp(fb, ['..x..', '.xyx.', 'xxxxX', '.xXX.', '..X..'], 17, 9, P);
      hand(17, 18);
    } else if (obj === 'spear') {
      for (let y = 4; y <= 21; y++) sp(fb, 19, y, (y % 2) ? P.n : P.N);
      stamp(fb, ['.j.', 'jij', 'jii', '.iI', '.I.'], 18, -1, P);
      stamp(fb, ['xX', 'xX'], 20, 5, P);
      hand(17, 18);
    } else if (obj === 'feather') {
      stamp(fb, ['..ii', '.iiI', 'iiI.', 'iI..'], 17, 10, P);
      sp(fb, 17, 14, P.G);
      hand(17, 17);
    } else if (obj === 'staff') {
      for (let y = 6; y <= 21; y++) sp(fb, 19, y, (y % 2) ? P.n : P.N);
      stamp(fb, ['.uu', 'uuU', '.uU'], 18, 3, P);
      hand(17, 18);
    } else if (obj === 'shield') {
      stamp(fb, ['gggggg', 'gxyxxG', 'gxxxXG', '.gxXG.', '..gG..'], 13, 14, P);
      hand(17, 19);
    }
  }

  function drawCourt(rank, s) {
    const role = rank === 11 ? 'J' : rank === 12 ? 'Q' : 'K';
    const sc = SCH[s];
    const t = nb(W, H);
    // Hintergrund im Rahmen (x 10..30, y 5..26) – Verlauf mit Dithering
    for (let y = 5; y <= 26; y++) for (let x = 10; x <= 30; x++) {
      const k = y - 5;
      let col = sc.bg[0];
      if (k > 14) col = sc.bg[1];
      else if (k > 11 && ((x + y) & 1)) col = sc.bg[1];
      // feines Rautenmuster
      if (((x + y * 1) % 6 === 0) && k % 2 === 0 && k < 16) col = sc.bg[1];
      sp(t, x, y, col);
    }
    // Figur
    const fig = buildFigure(role, s);
    over(t, fig, 10, 5);
    // Rahmen
    for (let x = 9; x <= 31; x++) sp(t, x, 4, sc.fr);
    for (let y = 4; y <= 27; y++) { sp(t, 9, y, sc.fr); sp(t, 31, y, sc.fr); }
    for (let x = 9; x <= 31; x++) sp(t, x, 27, sc.fr);
    for (let x = 10; x <= 30; x++) sp(t, x, 26, (x % 2) ? sc.fr2 : sc.fr);
    return t;
  }

  // ---------- Ass ----------
  // lokale Paletten: [Kontur, Schatten, Basis, Licht, Glanz]
  const AP = [
    ['#0e0c22', '#1f1d40', '#34326a', '#5a5aa8', '#c8c8f6'],
    ['#5a0620', '#a80c34', '#d4163f', '#f2587c', '#ffc0d0'],
    ['#0a3a20', '#17703c', '#2f9a50', '#5cc27a', '#d4ffd4'],
    ['#8a4604', '#cc7408', '#f6a010', '#fcc838', '#fff8c8'],
  ];
  const TINT = ['#e9edf9', '#fbe6e8', '#e6f1d8', '#fdf1c6'];
  function shadeAce(rows, pal, s) {
    const h = rows.length, w = rows[0].length, o = nb(w, h);
    const has = (x, y) => x >= 0 && y >= 0 && x < w && y < h && rows[y][x] === 'o';
    const cxm = (w - 1) / 2, cym = (h - 1) / 2;
    const dist = new Array(w * h).fill(0);
    for (let k = 1; k < 12; k++) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (has(x, y) && dist[y * w + x] === 0 && (k === 1 ? (!has(x - 1, y) || !has(x + 1, y) || !has(x, y - 1) || !has(x, y + 1)) : (dist[y * w + x - 1] === k - 1 || dist[y * w + x + 1] === k - 1 || dist[(y - 1) * w + x] === k - 1 || dist[(y + 1) * w + x] === k - 1))) dist[y * w + x] = k;
    const DS = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? 0 : Math.min(dist[y * w + x], 4);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (!has(x, y)) continue;
      const edge4 = !has(x - 1, y) || !has(x + 1, y) || !has(x, y - 1) || !has(x, y + 1);
      if (edge4) { sp(o, x, y, pal[0]); continue; }
      const gx = DS(x + 2, y) - DS(x - 2, y), gy = DS(x, y + 2) - DS(x, y - 2);
      const v = 0.5 + (gx + gy) * 0.11 + (cxm - x) * 0.022 + (cym - y) * 0.012;
      const ch = ((x + y) & 1) === 0;
      let col;
      if (v < 0.2) col = pal[1];
      else if (v < 0.36) col = ch ? pal[1] : pal[2];
      else if (v < 0.64) col = pal[2];
      else if (v < 0.8) col = ch ? pal[3] : pal[2];
      else col = pal[3];
      sp(o, x, y, col);
    }
    if (s === 3) { // Facetten der Raute: Mittelgrat und Guertel
      const c = (h - 1) / 2;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        if (!has(x, y) || o.d[y * w + x] === pal[0]) continue;
        const dxs = x - cxm, dys = y - c;
        let col = null;
        if (dxs === 0) col = dys < 0 ? pal[3] : pal[1];
        else if (dxs < 0 && dys < 0) col = pal[3];
        else if (dxs > 0 && dys > 0) col = pal[1];
        else col = pal[2];
        if (Math.abs(dys) <= 1 && Math.abs(dxs) > 0) col = pal[2];
        if (o.d[y * w + x] === pal[1] && !(dxs > 0 && dys > 0) && Math.abs(dxs) <= 1) col = pal[1];
        sp(o, x, y, col);
      }
    }
    // Glanzstrich (2 Pixel) oben links
    let best = null;
    for (let y = 1; y < h - 1 && !best; y++) for (let x = 1; x < w - 1; x++) if (o.d[y * w + x] && o.d[y * w + x] !== pal[0] && o.d[y * w + x + 1] && o.d[y * w + x + 1] !== pal[0] && has(x, y + 1) && x < cxm - 1 && y > h * 0.28) { best = [x, y]; break; }
    if (best) { sp(o, best[0], best[1], pal[4]); sp(o, best[0], best[1] + 1, pal[4]); }
    return o;
  }
  function drawAce(b, s) {
    const sc = SCH[s], pal = AP[s];
    const cx = 20, cy = 27.5, HW = 15, HH = 21;
    const ins = (x, y) => Math.abs(x - cx) / HW + Math.abs(y - cy) / HH <= 1.0001;
    const edge = (f, x, y) => !f(x - 1, y) || !f(x + 1, y) || !f(x, y - 1) || !f(x, y + 1);
    const inner = (x, y) => ins(x, y) && !edge(ins, x, y);
    for (let y = 3; y < 53; y++) for (let x = 3; x < 38; x++) {
      if (!ins(x, y)) continue;
      let col = TINT[s];
      if (edge(ins, x, y)) col = sc.fr;
      else if (edge(inner, x, y)) col = sc.fr2;
      sp(b, x, y, col);
    }
    // eigenes Detail je Farbe
    const pt = (x, y, c) => sp(b, x, y, c);
    const spark = (x, y, a, c) => { pt(x, y, c); pt(x - 1, y, a); pt(x + 1, y, a); pt(x, y - 1, a); pt(x, y + 1, a); };
    if (s === 0) { spark(7, 27, '#8e9ac4', '#ffffff'); spark(33, 27, '#8e9ac4', '#ffffff'); pt(20, 8, '#27367e'); pt(20, 47, '#27367e'); }
    else if (s === 1) { for (const dx of [-1, 1]) { pt(20 + dx * 12, 27, sc.fr); pt(20 + dx * 10, 27, sc.fr2); pt(20 + dx * 14, 27, sc.fr2); } pt(20, 8, sc.fr); pt(20, 47, sc.fr); }
    else if (s === 2) { for (const y of [8, 47]) { pt(20, y, sc.fr2); pt(19, y + (y < 20 ? 1 : -1), sc.fr); pt(21, y + (y < 20 ? 1 : -1), sc.fr); } pt(7, 27, sc.fr2); pt(33, 27, sc.fr2); }
    else { for (const y of [8, 47]) spark(20, y, sc.fr2, sc.x); pt(7, 27, sc.fr2); pt(33, 27, sc.fr2); }
    // Symbol
    const rows = bigMask(s);
    const img = shadeAce(rows, pal, s);
    const x0 = 20 - ((img.w - 1) >> 1), y0 = [17, 19, 17, 15][s];
    over(b, img, x0, y0);
  }

  // ---------- oeffentlich ----------
  function mkCanvas() { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; }
  function flush(b, c) {
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
    const im = g.createImageData(W, H);
    const cache = {};
    for (let i = 0; i < W * H; i++) {
      const col = b.d[i]; if (!col) continue;
      let v = cache[col];
      if (!v) { v = cache[col] = [parseInt(col.substr(1, 2), 16), parseInt(col.substr(3, 2), 16), parseInt(col.substr(5, 2), 16)]; }
      im.data[i * 4] = v[0]; im.data[i * 4 + 1] = v[1]; im.data[i * 4 + 2] = v[2]; im.data[i * 4 + 3] = 255;
    }
    g.putImageData(im, 0, 0);
  }

  window.paintCard = function (rank, s) {
    const b = nb(W, H);
    over(b, baseCard(), 0, 0);
    if (rank >= 11 && rank <= 13) {
      const t = drawCourt(rank, s);
      for (let y = 4; y <= 27; y++) for (let x = 9; x <= 31; x++) { const c = gp(t, x, y); if (c) sp(b, x, y, c); }
      for (let y = 28; y <= 51; y++) for (let x = 9; x <= 31; x++) { const c = gp(t, 40 - x, 55 - y); if (c) sp(b, x, y, c); }
    } else if (rank === 14) {
      drawAce(b, s);
    } else {
      const lay = LAY[rank];
      for (const [col, top, fl] of lay) {
        const img = pipImg(s, fl);
        over(b, img, LC[col] - 3, top);
      }
    }
    drawIndex(b, rank, s);
    const c = mkCanvas(); flush(b, c); return c;
  };

  window.paintBack = function () {
    const b = nb(W, H);
    over(b, baseCard(), 0, 0);
    const V = ['#170a30', '#2c1860', '#46288c', '#6c46b8', '#a07ae0'];
    const GD = ['#9a5c1c', '#f0b830', '#fff0a0'];
    const X0 = 4, X1 = 36, Y0 = 4, Y1 = 51;
    // Feld: dichtes Rautengitter mit Goldknoten
    for (let y = Y0; y <= Y1; y++) for (let x = X0; x <= X1; x++) {
      const a = (x + y) % 6, c = (x - y + 120) % 6;
      let col = V[1];
      if (a === 0 || c === 0) col = V[3];
      else if (a === 3 && c === 3) col = V[4];
      else if (a === 1 && c === 1 || a === 5 && c === 5 || a === 1 && c === 5 || a === 5 && c === 1) col = V[2];
      if (a === 0 && c === 0) col = GD[1];
      sp(b, x, y, col);
    }
    // kraeftiger Rahmen: dunkel / gold / dunkel / hellgold-Perlen / dunkel
    const frame = (i, col) => { for (let x = X0 + i; x <= X1 - i; x++) { sp(b, x, Y0 + i, col); sp(b, x, Y1 - i, col); } for (let y = Y0 + i; y <= Y1 - i; y++) { sp(b, X0 + i, y, col); sp(b, X1 - i, y, col); } };
    frame(0, V[0]); frame(1, GD[1]); frame(2, GD[0]); frame(3, V[0]);
    for (let x = X0 + 1; x <= X1 - 1; x++) { if (x % 2) { sp(b, x, Y0 + 1, GD[2]); sp(b, x, Y1 - 1, GD[2]); } }
    for (let y = Y0 + 1; y <= Y1 - 1; y++) { if (y % 2) { sp(b, X0 + 1, y, GD[2]); sp(b, X1 - 1, y, GD[2]); } }
    // Eck-Rauten
    const gem = (x, y) => { sp(b, x, y, GD[2]); sp(b, x - 1, y, GD[1]); sp(b, x + 1, y, GD[1]); sp(b, x, y - 1, GD[1]); sp(b, x, y + 1, GD[1]); sp(b, x - 1, y - 1, V[0]); sp(b, x + 1, y - 1, V[0]); sp(b, x - 1, y + 1, V[0]); sp(b, x + 1, y + 1, V[0]); };
    gem(9, 9); gem(31, 9); gem(9, 46); gem(31, 46);
    // Medaillon: Superellipse (Raute mit weichen Seiten)
    const cx = 20, cy = 27.5, RX = 12.2, RY = 17.6;
    const dd = (x, y) => Math.pow(Math.abs(x - cx) / RX, 1.5) + Math.pow(Math.abs(y - cy) / RY, 1.5);
    for (let y = 8; y < 48; y++) for (let x = 7; x < 34; x++) {
      const d = dd(x, y); if (d > 1.0) continue;
      let col;
      if (d > 0.9) col = GD[0];
      else if (d > 0.8) col = (x + y < cx + cy) ? GD[2] : GD[1];
      else if (d > 0.74) col = V[0];
      else if (d > 0.68) col = V[3];
      else col = V[0];
      sp(b, x, y, col);
    }
    // zentraler Stern (8 Zacken) mit Kern
    const stp = (x, y, c) => sp(b, x, y, c);
    for (let k = -9; k <= 9; k++) { const w = Math.max(0, 1 - Math.abs(k) / 9); if (w > 0.1 || k === 0) { stp(20, 28 + k, k < 0 ? GD[2] : GD[1]); } }
    for (let k = -6; k <= 6; k++) stp(20 + k, 28, k < 0 ? GD[2] : GD[1]);
    for (let k = -3; k <= 3; k++) { if (k) { stp(20 + k, 28 + k, GD[1]); stp(20 + k, 28 - k, GD[1]); } }
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (Math.abs(dx) + Math.abs(dy) <= 2) stp(20 + dx, 28 + dy, Math.abs(dx) + Math.abs(dy) === 2 ? GD[0] : (dx + dy < 0 ? GD[2] : GD[1]));
    stp(20, 28, '#ffffff');
    for (const [x, y] of [[14, 22], [26, 22], [14, 34], [26, 34]]) { stp(x, y, GD[2]); stp(x + 1, y, V[4]); stp(x, y + 1, V[4]); stp(x - 1, y, V[4]); stp(x, y - 1, V[4]); }
    const c = mkCanvas(); flush(b, c); return c;
  };
})();
