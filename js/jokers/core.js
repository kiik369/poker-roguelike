// J3 - "16-Bit-Rollenspiel-Item": kraeftige Farben, grosses Motiv mittig, dunkle Kontur, Glanzpunkte, Funkel-Sterne ab Seltenheit 2
(function () {
  const W = 62, H = 83;   // Jokerkarte: 62 x 83 Pixel
  const OL = '#160e26';       // Kontur
  const WH = '#ffffff';

  // ---------- Pixel-Layer-Helfer ----------
  const layer = () => new Array(W * H).fill(null);
  function put(L, x, y, c) { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; L[y * W + x] = c; }
  function get(L, x, y) { if (x < 0 || y < 0 || x >= W || y >= H) return null; return L[y * W + x]; }
  function rect(L, x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(L, x + i, y + j, c); }
  function disc(L, cx, cy, r, c) {
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
      if ((x - cx) * (x - cx) + (y - cy) * (y - cy) <= r * r) put(L, x, y, c);
  }
  function ell(L, cx, cy, rx, ry, c) {
    for (let y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry + 1); y++) for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx + 1); x++) {
      const nx = (x - cx) / (rx + 0.4), ny = (y - cy) / (ry + 0.4);
      if (nx * nx + ny * ny <= 1) put(L, x, y, c);
    }
  }
  // schattierte Ellipse: Licht oben links, klare Stufen
  function sell(L, cx, cy, rx, ry, pal, cut) {
    for (let y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry + 1); y++) for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx + 1); x++) {
      const nx = (x - cx) / (rx + 0.4), ny = (y - cy) / (ry + 0.4);
      if (nx * nx + ny * ny > 1) continue;
      const l = -(nx * 0.6 + ny * 0.8);
      put(L, x, y, l > (cut ? cut[0] : 0.45) ? pal[1] : (l < (cut ? cut[1] : -0.3) ? pal[2] : pal[0]));
    }
  }
  function line(L, x0, y0, x1, y1, c, r) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      if (r) disc(L, x0, y0, r, c); else put(L, x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  function poly(L, pts, c) {
    let miny = 1e9, maxy = -1e9;
    pts.forEach(p => { miny = Math.min(miny, p[1]); maxy = Math.max(maxy, p[1]); });
    for (let y = Math.floor(miny); y <= Math.ceil(maxy); y++) {
      const yy = y + 0.5, xs = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        if ((a[1] <= yy && b[1] > yy) || (b[1] <= yy && a[1] > yy)) xs.push(a[0] + (yy - a[1]) / (b[1] - a[1]) * (b[0] - a[0]));
      }
      xs.sort((p, q) => p - q);
      for (let i = 0; i + 1 < xs.length; i += 2)
        for (let x = Math.round(xs[i]); x < Math.round(xs[i + 1]); x++) put(L, x, y, c);
    }
  }
  function outline(L, c) {
    const add = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (L[y * W + x]) continue;
      if (get(L, x - 1, y) || get(L, x + 1, y) || get(L, x, y - 1) || get(L, x, y + 1)) add.push([x, y]);
    }
    add.forEach(p => put(L, p[0], p[1], c));
  }
  function shine(L, x, y) { put(L, x, y, WH); put(L, x + 1, y, WH); put(L, x, y + 1, WH); }
  function bands(L, x0, y0, x1, y1, list) {
    for (let y = y0; y <= y1; y++) {
      let c = list[0][1];
      for (const b of list) if (y >= b[0]) c = b[1];
      for (let x = x0; x <= x1; x++) put(L, x, y, c);
    }
  }
  function star5(L, cx, cy, R, c) {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? R * 0.42 : R;
      pts.push([cx + 0.5 + Math.cos(a) * r, cy + 0.5 + Math.sin(a) * r]);
    }
    poly(L, pts, c);
  }
  // kleines Pluszeichen-Sternchen (Hintergrunddeko)
  function plus(L, x, y, c, big) {
    put(L, x, y, c); put(L, x - 1, y, c); put(L, x + 1, y, c); put(L, x, y - 1, c); put(L, x, y + 1, c);
    if (big) { put(L, x - 2, y, c); put(L, x + 2, y, c); put(L, x, y - 2, c); put(L, x, y + 2, c); }
  }

  // ---------- Motive ----------
  function rettungsschwimmer(F, S) {
    bands(F, 4, 4, 57, 78, [[4, '#2f9cf0'], [14, '#52b8f6'], [26, '#7ccffa'], [36, '#a6e4fc'],
      [45, '#1f86e0'], [54, '#1a6cc8'], [64, '#1558ac'], [72, '#104692']]);
    // Sonne
    disc(F, 47, 15, 6, '#ffe23a'); disc(F, 46, 14, 4, '#fff49a'); disc(F, 45, 13, 2, WH);
    // Wolken
    ell(F, 14, 20, 6, 2, WH); ell(F, 10, 21, 4, 2, WH); ell(F, 18, 18, 3, 3, WH); rect(F, 8, 23, 14, 1, '#c8e8fc');
    ell(F, 50, 33, 5, 1.5, WH); ell(F, 53, 32, 3, 2, WH);
    // Horizont-Glitzer und Wellen
    rect(F, 4, 45, 54, 1, '#7ad0ff');
    [[6, 50, 7], [44, 51, 9], [10, 66, 6], [47, 62, 8], [8, 74, 8], [40, 73, 9], [26, 76, 6], [50, 69, 5]]
      .forEach(w => rect(F, w[0], w[1], w[2], 1, '#7ac8fa'));
    // Schaum unter dem Ring
    ell(F, 31, 61, 22, 3, '#d8f2ff'); ell(F, 31, 62, 18, 2, WH);

    const cx = 31.5, cy = 39.5, ro = 21, ri = 9.5;
    const WHT = ['#f4f6fa', '#ffffff', '#a9b6d4'], RED = ['#e42a36', '#ff7466', '#98142c'];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = Math.hypot(dx, dy);
      if (d > ro || d < ri) continue;
      const t = (d - ri) / (ro - ri), u = (t - 0.5) * 2;
      const ang = (Math.atan2(dy, dx) * 180 / Math.PI + 360 + 22.5) % 360;
      const sec = Math.floor(ang / 45);
      const pal = sec % 2 === 0 ? WHT : RED;
      const nx = (dx / d) * u, ny = (dy / d) * u, nz = Math.sqrt(Math.max(0, 1 - u * u));
      const lit = -nx * 0.5 - ny * 0.6 + nz * 0.62;
      put(S, x, y, lit > 0.68 ? pal[1] : (lit < 0.12 ? pal[2] : pal[0]));
    }
    // Seil: 4 Schlaufen aussen, Knoten auf den weissen Feldern
    const ROPE = '#d6a860', ROPEL = '#f6dc9c';
    for (let k = 0; k < 4; k++) {
      let px = null, py = null;
      for (let s = 0; s <= 24; s++) {
        const a = (k * 90 + 90 * s / 24) * Math.PI / 180, r = ro + 0.2 + 2.4 * Math.sin(Math.PI * s / 24);
        const x = cx + Math.cos(a) * r - 0.5, y = cy + Math.sin(a) * r - 0.5;
        if (px !== null) line(S, px, py, x, y, ROPE);
        px = x; py = y;
      }
    }
    for (let k = 0; k < 4; k++) {
      const a = k * 90 * Math.PI / 180, r = (ro + ri) / 2;
      const x = Math.round(cx + Math.cos(a) * r - 0.5), y = Math.round(cy + Math.sin(a) * r - 0.5);
      rect(S, x - 1, y - 1, 3, 3, ROPE); put(S, x - 1, y - 1, ROPEL);
    }
    outline(S, OL);
    shine(S, 17, 24); put(S, 15, 27, WH); shine(S, 40, 54);
    // Glanz auf dem Rot (unten rechts im Loch-Rand)
  }

  function zeche(F, S) {
    bands(F, 4, 4, 57, 78, [[4, '#2a1f66'], [13, '#4c2a86'], [22, '#8a3694'], [31, '#d2467c'], [40, '#f0693c'], [48, '#ff923a'], [55, '#ffbb48'], [61, '#ffdf80']]);
    // Wolkenstreifen
    ell(F, 14, 30, 9, 1.5, '#a63a8c'); ell(F, 46, 38, 8, 1.5, '#e45a64'); ell(F, 12, 44, 7, 1, '#ff7a40'); ell(F, 50, 26, 6, 1.5, '#7a3490');
    // Sonne
    disc(F, 46, 62, 8, '#fff2a4'); disc(F, 46, 62, 5, '#fffad0');
    // Boden
    rect(F, 4, 66, 54, 13, '#2e1a3e'); rect(F, 4, 66, 54, 1, '#4a2a52'); rect(F, 4, 73, 54, 6, '#20122e');
    // ferne Silhouetten
    poly(F, [[4, 66], [4, 57], [9, 54], [16, 60], [22, 66]], '#3e2250'); poly(F, [[40, 66], [48, 58], [57, 56], [57, 66]], '#3e2250');

    const ST = '#8fa4c4', STL = '#c6d6ec', STD = '#4c5a86', ROPEC = '#2a2036';
    // Schornstein (hinten rechts)
    rect(S, 51, 28, 5, 20, '#b8482c'); rect(S, 51, 28, 1, 20, '#d86a3c'); rect(S, 55, 28, 1, 20, '#8a3020');
    rect(S, 50, 26, 7, 3, '#d8c8b8'); rect(S, 50, 26, 7, 1, WH);
    rect(S, 51, 32, 5, 2, '#f0e8e0'); rect(S, 51, 38, 5, 2, '#f0e8e0');
    // Rauch
    sell(S, 52, 21, 3, 3, ['#d8c8dc', '#f0e6f4', '#a898c0']); sell(S, 47, 16, 4, 3, ['#d8c8dc', '#f0e6f4', '#a898c0']); sell(S, 41, 12, 3, 2, ['#d8c8dc', '#f0e6f4', '#a898c0']);
    // Stuetzen unter den Seilscheiben
    rect(S, 16, 19, 2, 9, STD); rect(S, 28, 19, 2, 9, STD);
    // Beine
    const xl = y => 15 - 7 * (y - 29) / 38, xr = y => 31 + 7 * (y - 29) / 38;
    line(S, 15, 29, 8, 67, STD, 0); line(S, 16, 29, 9, 67, ST, 0); line(S, 31, 29, 38, 67, STD, 0); line(S, 30, 29, 37, 67, ST, 0);
    line(S, 14, 29, 7, 67, STL, 0);
    // Streben (X-Gitter)
    [29, 41, 53, 65].forEach(y => rect(S, Math.round(xl(y)) + 1, y, Math.round(xr(y) - xl(y)), 1, STD));
    for (let i = 0; i < 3; i++) {
      const y1 = [29, 41, 53][i], y2 = [41, 53, 65][i];
      line(S, xl(y1) + 2, y1, xr(y2) - 1, y2, ST); line(S, xr(y1) - 1, y1, xl(y2) + 2, y2, ST);
    }
    rect(S, 12, 26, 22, 3, ST); rect(S, 12, 26, 22, 1, STL); rect(S, 12, 28, 22, 1, STD);
    // Seilscheiben
    [[17, 19], [29, 19]].forEach(w => {
      const cx = w[0], cy = w[1];
      for (let y = cy - 7; y <= cy + 7; y++) for (let x = cx - 7; x <= cx + 7; x++) {
        const d = Math.hypot(x - cx, y - cy);
        if (d <= 6.2 && d >= 4.4) put(S, x, y, (x - cx) + (y - cy) < -2 ? STL : ((x - cx) + (y - cy) > 3 ? STD : ST));
      }
      line(S, cx - 4, cy, cx + 4, cy, STD); line(S, cx, cy - 4, cx, cy + 4, STD);
      line(S, cx - 3, cy - 3, cx + 3, cy + 3, STD); line(S, cx - 3, cy + 3, cx + 3, cy - 3, STD);
      disc(S, cx, cy, 1.5, '#ffd040'); put(S, cx - 1, cy - 1, WH);
    });
    // Seile
    line(S, 17, 25, 17, 66, ROPEC); line(S, 29, 25, 29, 66, ROPEC);
    line(S, 35, 17, 44, 47, ROPEC); line(S, 34, 21, 43, 48, ROPEC);
    // Maschinenhaus
    rect(S, 40, 50, 16, 17, '#b8482c');
    for (const y of [52, 55, 58, 61, 64]) rect(S, 40, y, 16, 1, '#8a3020');
    rect(S, 40, 50, 1, 17, '#d86a3c');
    poly(S, [[38, 51], [47, 43], [57, 51]], '#4a5470'); line(S, 38, 51, 47, 43, '#8a98bc'); rect(S, 39, 50, 17, 1, '#2e3452');
    rect(S, 43, 54, 4, 5, '#ffe070'); rect(S, 43, 54, 4, 1, '#fff6c0'); rect(S, 45, 54, 1, 5, '#b8842c');
    rect(S, 50, 59, 4, 8, '#3a2216'); rect(S, 50, 59, 4, 1, '#6a4428');
    outline(S, OL);
    shine(S, 15, 15); shine(S, 27, 15); put(S, 43, 55, WH);
  }

  function pinguin(F, S) {
    bands(F, 4, 4, 57, 78, [[4, '#1c8fd8'], [16, '#36aee8'], [30, '#62c8f4'], [44, '#8ee0fa'], [66, '#d8f0fa'], [76, '#b8d8ec']]);
    rect(F, 4, 66, 54, 1, '#ffffff');
    // Eisberge im Hintergrund
    poly(F, [[4, 54], [10, 44], [16, 50], [22, 40], [30, 54]], '#d8f6ff'); poly(F, [[22, 40], [30, 54], [24, 54]], '#a6dcf4');
    // Serverschrank
    const RX = 35, RY = 28;
    rect(S, RX, RY, 21, 42, '#3a4466'); rect(S, RX, RY, 21, 1, '#6a78a8'); rect(S, RX, RY, 1, 42, '#6a78a8'); rect(S, RX + 20, RY, 1, 42, '#242c48');
    rect(S, RX + 2, RY + 2, 17, 38, '#252c48');
    const ledc = ['#3cff78', '#38b8ff'];
    for (let i = 0; i < 5; i++) {
      const y = RY + 3 + i * 7;
      rect(S, RX + 2, y, 17, 6, '#4c587e'); rect(S, RX + 2, y, 17, 1, '#7a88b8'); rect(S, RX + 2, y + 5, 17, 1, '#2e3656');
      rect(S, RX + 4, y + 2, 7, 1, '#1c2238'); rect(S, RX + 4, y + 4, 7, 1, '#1c2238');
      const a = (i % 2) ? 1 : 0;
      rect(S, RX + 13, y + 2, 2, 2, ledc[a]); put(S, RX + 13, y + 2, WH);
      rect(S, RX + 16, y + 2, 2, 2, (i === 2) ? '#1c2238' : ledc[1 - a]);
      if (i !== 2) put(S, RX + 16, y + 2, WH);
    }
    rect(S, RX + 1, RY + 40, 19, 2, '#242c48'); rect(S, RX + 1, RY + 42, 3, 1, '#242c48'); rect(S, RX + 17, RY + 42, 3, 1, '#242c48');
    // Pinguin
    const BK = ['#232c52', '#4a5c94', '#121830'];
    sell(S, 21, 49, 13, 19, BK, [0.5, -0.4]);
    sell(S, 21, 31, 10, 9, BK, [0.5, -0.4]);
    // Flossen
    poly(S, [[10, 40], [5, 54], [8, 58], [12, 52], [13, 44]], BK[2]); poly(S, [[10, 41], [6, 53], [8, 55], [11, 51]], BK[0]);
    poly(S, [[32, 40], [37, 54], [34, 58], [30, 52], [29, 44]], BK[2]); poly(S, [[32, 41], [36, 53], [34, 55], [31, 51]], BK[0]);
    // Bauch
    sell(S, 21, 52, 8, 14, ['#f4f6fa', '#ffffff', '#b8c4e0'], [0.62, -0.5]);
    // Gesicht
    ell(S, 21, 33, 7, 5, '#f4f6fa'); rect(S, 14, 31, 14, 2, '#f4f6fa');
    rect(S, 15, 29, 4, 4, WH); rect(S, 23, 29, 4, 4, WH);
    rect(S, 17, 30, 2, 3, '#121830'); rect(S, 23, 30, 2, 3, '#121830'); put(S, 17, 30, WH); put(S, 23, 30, WH);
    poly(S, [[18, 35], [24, 35], [21, 40]], '#ff9a1c'); rect(S, 19, 35, 4, 1, '#ffc060');
    // Fuesse
    ell(S, 15, 70, 5, 2, '#ff9a1c'); ell(S, 27, 70, 5, 2, '#ff9a1c'); rect(S, 11, 69, 3, 1, '#ffc060');
    outline(S, OL);
    shine(S, 14, 25); put(S, 16, 41, '#8aa2d8');
  }

  function frostherrin(F, S) {
    bands(F, 4, 4, 57, 78, [[4, '#162266'], [20, '#1f3a96'], [40, '#2c52bc'], [60, '#3c6ad0']]);
    // Heiligenschein-Ringe
    ell(F, 31, 32, 24, 24, '#2c4cb4'); ell(F, 31, 32, 19, 19, '#3c64cc'); ell(F, 31, 32, 14, 14, '#5684e0');
    // Schneeflocken
    const flake = (x, y) => { plus(F, x, y, '#d8f4ff'); put(F, x - 1, y - 1, '#a6dcf8'); put(F, x + 1, y - 1, '#a6dcf8'); put(F, x - 1, y + 1, '#a6dcf8'); put(F, x + 1, y + 1, '#a6dcf8'); };
    flake(10, 24); flake(53, 40); flake(9, 58); flake(52, 62); flake(11, 40);

    const HR = ['#9fe0ff', '#d6f6ff', '#58a6e4'], SK = '#f4e6de', SKD = '#d8c0bc';
    // Haar hinten
    sell(S, 31, 31, 13, 15, HR, [0.55, -0.4]);
    rect(S, 17, 24, 29, 18, HR[0]);
    poly(S, [[18, 36], [44, 36], [49, 54], [50, 70], [44, 75], [18, 75], [12, 70], [13, 54]], HR[0]);
    poly(S, [[44, 36], [49, 54], [50, 70], [44, 75], [43, 60]], HR[2]);
    poly(S, [[18, 40], [15, 54], [14, 68], [16, 70], [18, 56]], HR[1]);
    // Kragen hinten
    const col = (m) => { // m = Spiegel
      const X = x => m ? 62 - x : x;
      poly(S, [[X(19), 31], [X(25), 40], [X(28), 49], [X(20), 53], [X(16), 44]], '#eaf8ff');
      poly(S, [[X(19), 31], [X(23), 41], [X(26), 49], [X(22), 48], [X(18), 40]], m ? '#8ccaf4' : '#ffffff');
      poly(S, [[X(25), 40], [X(28), 49], [X(24), 51], [X(23), 44]], '#7ab8ec');
    };
    // Mantel
    poly(S, [[26, 46], [36, 46], [45, 51], [49, 60], [52, 78], [10, 78], [13, 60], [17, 51]], '#2c62d0');
    poly(S, [[17, 51], [13, 60], [10, 78], [16, 78], [17, 62], [20, 52]], '#5c94f2');
    poly(S, [[45, 51], [49, 60], [52, 78], [46, 78], [45, 62], [43, 52]], '#1c3e94');
    // Pelzbesatz Mitte
    poly(S, [[24, 46], [38, 46], [36, 54], [34, 64], [34, 78], [28, 78], [28, 64], [26, 54]], '#e6f6ff');
    rect(S, 31, 56, 1, 22, '#a6d4f4'); rect(S, 28, 56, 1, 22, WH);
    // Schulterpelz
    ell(S, 20, 52, 6, 3, '#f2fbff'); ell(S, 42, 52, 6, 3, '#d6ecfa'); rect(S, 15, 54, 10, 1, '#a6d4f4'); rect(S, 37, 54, 10, 1, '#8cc0ea');
    col(0); col(1);
    // Spange
    rect(S, 29, 48, 5, 4, '#c8dcf8'); rect(S, 30, 49, 3, 2, '#2ad0ff'); put(S, 30, 49, WH);
    // Hals + Gesicht
    rect(S, 28, 40, 7, 4, '#e2cec8'); ell(S, 31, 45, 6, 2, '#f2fbff');
    sell(S, 31, 32, 7, 9, [SK, '#fff4ee', SKD], [0.7, -0.62]);
    rect(S, 28, 41, 7, 1, '#c8aea8'); rect(S, 37, 28, 1, 9, SKD); rect(S, 36, 37, 1, 2, SKD); rect(S, 25, 36, 1, 2, '#fff4ee');
    // Augen: halb geschlossen, herabblickend
    rect(S, 25, 30, 5, 1, '#241638'); rect(S, 33, 30, 5, 1, '#241638');
    rect(S, 26, 31, 3, 2, '#34b4f4'); rect(S, 34, 31, 3, 2, '#34b4f4');
    rect(S, 27, 32, 2, 1, '#18305c'); rect(S, 34, 32, 2, 1, '#18305c'); put(S, 26, 31, WH); put(S, 36, 31, WH);
    // Brauen: schraeg nach innen unten
    line(S, 24, 27, 29, 29, '#4a7cc0'); line(S, 38, 27, 33, 29, '#4a7cc0'); put(S, 24, 28, '#4a7cc0'); put(S, 38, 28, '#4a7cc0');
    put(S, 31, 35, '#c4a8a8'); put(S, 31, 36, '#c4a8a8');
    rect(S, 28, 38, 5, 1, '#8c5a60'); put(S, 33, 37, '#8c5a60'); put(S, 27, 39, SKD);
    // Pony
    poly(S, [[22, 21], [40, 21], [41, 29], [38, 25], [34, 28], [31, 24], [28, 28], [24, 25], [22, 29]], HR[0]);
    poly(S, [[22, 21], [31, 21], [28, 28], [24, 25], [22, 29]], HR[1]);
    // Strähnen vorne
    poly(S, [[19, 34], [23, 34], [24, 52], [21, 70], [16, 70], [18, 54]], HR[0]);
    poly(S, [[43, 34], [39, 34], [38, 52], [41, 70], [46, 70], [44, 54]], HR[2]);
    rect(S, 20, 38, 1, 28, HR[1]);
    // Krone
    poly(S, [[24, 22], [23, 12], [27, 17], [31, 6], [35, 17], [39, 12], [38, 22]], '#e6fbff');
    poly(S, [[31, 6], [35, 17], [38, 22], [31, 22]], '#8ee0ff');
    rect(S, 24, 20, 14, 3, '#6cc4f0'); rect(S, 24, 20, 14, 1, WH);
    rect(S, 30, 20, 3, 3, '#2a6cff'); put(S, 30, 20, WH);
    // Zepter
    rect(S, 50, 22, 3, 56, '#a0e4ff'); rect(S, 50, 22, 1, 56, WH); rect(S, 52, 22, 1, 56, '#4a9ee0');
    poly(S, [[51.5, 7], [56, 16], [51.5, 25], [47, 16]], '#6ad0ff');
    poly(S, [[51.5, 7], [47, 16], [51.5, 25]], '#d8f8ff'); poly(S, [[51.5, 16], [56, 16], [51.5, 25]], '#2a8ee0');
    rect(S, 49, 25, 5, 2, '#d8f4ff');
    // Aermel + Handschuh
    poly(S, [[44, 56], [49, 58], [50, 70], [46, 71]], '#1c3e94'); rect(S, 49, 64, 5, 5, '#f2fbff'); rect(S, 49, 64, 5, 1, WH); rect(S, 49, 68, 5, 1, '#a6d4f4');
    outline(S, OL);
    shine(S, 26, 14); put(S, 33, 9, WH); shine(S, 48, 12); put(S, 23, 36, WH);
  }

  function hantelbank(F, S) {
    bands(F, 4, 4, 57, 78, [[4, '#e8782a'], [20, '#f09034'], [38, '#f8aa44'], [62, '#6a3e22'], [72, '#4a2a18']]);
    rect(F, 4, 62, 54, 1, '#c8803a'); rect(F, 4, 63, 54, 1, '#8a5430');
    // Wandstreifen / Fenster
    rect(F, 8, 12, 14, 18, '#ffd878'); rect(F, 8, 12, 14, 2, '#c85a20'); rect(F, 8, 28, 14, 2, '#c85a20'); rect(F, 14, 12, 2, 18, '#c85a20');
    rect(F, 10, 15, 3, 4, '#fff0b8'); rect(F, 17, 15, 3, 4, '#fff0b8');
    rect(F, 40, 14, 14, 3, '#c85a20'); rect(F, 40, 22, 14, 3, '#c85a20');
    rect(F, 12, 74, 40, 1, '#5e361e');

    const PL = ['#3c4260', '#7a86b4', '#222640'], YL = ['#f2b81c', '#ffe27a', '#b07a10'];
    // Rack-Staender hinter der Bank (halten die Stange)
    rect(S, 16, 41, 3, 29, '#9aa6c4'); rect(S, 16, 41, 1, 29, '#dce6fa'); rect(S, 18, 41, 1, 29, '#5a6688');
    rect(S, 43, 41, 3, 29, '#9aa6c4'); rect(S, 43, 41, 1, 29, '#dce6fa'); rect(S, 45, 41, 1, 29, '#5a6688');
    rect(S, 14, 69, 9, 3, '#6a7698'); rect(S, 14, 69, 9, 1, '#a8b4d4'); rect(S, 39, 69, 9, 3, '#6a7698'); rect(S, 39, 69, 9, 1, '#a8b4d4');
    rect(S, 14, 41, 5, 2, '#6a7698'); rect(S, 43, 41, 5, 2, '#6a7698');
    // Bank: Beine
    rect(S, 22, 59, 3, 11, '#7a86a8'); rect(S, 22, 59, 1, 11, '#c0cce8'); rect(S, 37, 59, 3, 11, '#7a86a8'); rect(S, 37, 59, 1, 11, '#c0cce8');
    rect(S, 20, 69, 7, 3, '#5a6688'); rect(S, 20, 69, 7, 1, '#a8b4d4'); rect(S, 34, 69, 7, 3, '#5a6688'); rect(S, 34, 69, 7, 1, '#a8b4d4');
    // Polster
    rect(S, 17, 51, 29, 8, '#2a58d0'); rect(S, 17, 51, 29, 2, '#6a98f8'); rect(S, 17, 57, 29, 2, '#1a3a94');
    rect(S, 17, 51, 2, 8, '#3a68e0'); rect(S, 44, 51, 2, 8, '#1a3a94');
    put(S, 17, 51, null); put(S, 45, 51, null); put(S, 17, 58, null); put(S, 45, 58, null);
    rect(S, 31, 53, 1, 4, '#1a3a94');
    // Hantelstange (ragt ueber die Scheiben hinaus)
    rect(S, 5, 39, 52, 3, '#c8d2e8'); rect(S, 5, 39, 52, 1, WH); rect(S, 5, 41, 52, 1, '#7a86a8');
    const plate = (x, w, y0, h, pal) => { rect(S, x, y0, w, h, pal[0]); rect(S, x, y0, 1, h, pal[1]); rect(S, x + w - 1, y0, 1, h, pal[2]); rect(S, x, y0, w, 1, pal[1]); };
    plate(8, 4, 26, 28, PL); plate(12, 3, 29, 22, YL);
    plate(50, 4, 26, 28, PL); plate(47, 3, 29, 22, YL);
    rect(S, 15, 37, 1, 7, '#a8b4d4'); rect(S, 46, 37, 1, 7, '#a8b4d4');
    put(S, 8, 26, null); put(S, 8, 53, null); put(S, 53, 26, null); put(S, 53, 53, null);
    outline(S, OL);
    shine(S, 9, 28); shine(S, 51, 28); put(S, 12, 32, WH); put(S, 19, 53, '#b0c8ff'); put(S, 20, 52, WH); put(S, 6, 39, WH);
  }

  function waechter(F, S) {
    bands(F, 4, 4, 57, 78, [[4, '#101a44'], [22, '#1a2c6c'], [44, '#27468e'], [64, '#1f5a4a'], [68, '#1a4a3c']]);
    disc(F, 46, 20, 10, '#3c5eb0'); disc(F, 46, 20, 8, '#fff2b8'); disc(F, 49, 18, 5, '#ffe488'); disc(F, 43, 17, 2, '#fffbe0');
    plus(F, 12, 12, '#fff2b8', 1); plus(F, 24, 22, '#d8e6ff'); plus(F, 10, 34, '#d8e6ff'); plus(F, 33, 10, '#d8e6ff'); plus(F, 54, 40, '#d8e6ff');
    rect(F, 4, 64, 54, 1, '#38a070'); rect(F, 4, 72, 54, 6, '#143a30');
    // Gras-Zacken (deko, regelmaessig platziert)
    [[8, 3], [15, 2], [41, 3], [52, 2]].forEach(g => { rect(F, g[0], 63 - g[1], 1, g[1], '#38a070'); rect(F, g[0] + 1, 63 - g[1] + 1, 1, g[1] - 1, '#2a8860'); });

    const FUR = ['#f6f6fa', '#ffffff', '#b4c0dc'], K = '#1c1a2c';
    // Schwanz
    poly(S, [[44, 64], [49, 66], [54, 62], [56, 56], [53, 57], [50, 61], [45, 61]], FUR[0]);
    poly(S, [[54, 62], [56, 56], [53, 57], [52, 60]], K);
    // Rumpf
    poly(S, [[19, 37], [27, 32], [37, 38], [44, 48], [46, 62], [40, 70], [24, 70], [21, 56]], FUR[0]);
    // Keule
    sell(S, 40, 59, 9, 11, FUR, [0.5, -0.3]);
    for (let a = 100; a <= 265; a += 3) { const r = 9.2; put(S, 40 + Math.cos(a * Math.PI / 180) * r, 59 - Math.sin(a * Math.PI / 180) * 11.2 * -1, FUR[2]); }
    // Hinterpfote
    ell(S, 34, 69, 7, 2, FUR[0]); rect(S, 27, 69, 3, 2, FUR[1]); rect(S, 31, 69, 1, 2, FUR[2]);
    // Hals
    poly(S, [[13, 31], [24, 28], [32, 37], [27, 50], [19, 48], [17, 39]], FUR[0]);
    // Vorderbeine
    rect(S, 25, 50, 5, 20, '#d4dcf0'); ell(S, 27, 70, 4, 2, '#d4dcf0'); rect(S, 29, 52, 1, 18, FUR[2]);
    rect(S, 19, 48, 6, 22, FUR[0]); rect(S, 19, 48, 1, 22, FUR[1]); ell(S, 21, 70, 5, 2, FUR[0]); rect(S, 17, 70, 2, 2, FUR[1]);
    rect(S, 24, 56, 1, 14, FUR[2]); put(S, 21, 71, FUR[2]); put(S, 23, 71, FUR[2]); put(S, 27, 71, FUR[2]);
    // Kopf
    ell(S, 20, 25, 7, 6, FUR[0]);
    poly(S, [[8, 26], [15, 22], [20, 28], [20, 33], [9, 32]], FUR[0]);
    rect(S, 9, 31, 11, 2, FUR[2]);
    // Ohr
    poly(S, [[22, 19], [28, 23], [28, 34], [24, 36], [21, 29]], '#34324c'); rect(S, 22, 20, 1, 12, '#5a5880');
    // Nase + Maul
    rect(S, 7, 26, 3, 4, K); put(S, 8, 26, '#6a6890'); rect(S, 10, 31, 8, 1, K); put(S, 18, 30, K);
    // Auge + Brauen (ernst)
    rect(S, 16, 24, 3, 3, K); put(S, 16, 24, WH); line(S, 19, 21, 16, 21, K); put(S, 15, 22, K);
    // Halsband
    poly(S, [[21, 35], [28, 34], [31, 40], [24, 42]], '#e0303a'); rect(S, 22, 35, 5, 1, '#ff7c80'); rect(S, 25, 42, 3, 3, '#ffd040'); put(S, 25, 42, WH);
    // Flecken
    const FS = [FUR[0], FUR[1], FUR[2]];
    const spot = (cx, cy, r) => { for (let y = cy - 3; y <= cy + 3; y++) for (let x = cx - 3; x <= cx + 3; x++) {
      const nx = (x - cx) / (r * 1.25 + 0.3), ny = (y - cy) / (r * 0.85 + 0.3); if (nx * nx + ny * ny <= 1) { const c = get(S, x, y); if (c && FS.indexOf(c) >= 0) put(S, x, y, K); } } };
    spot(40, 51, 2.2); spot(37, 60, 2); spot(44, 62, 1.7); spot(31, 43, 2); spot(34, 52, 1.5); spot(27, 38, 1.5);
    spot(21, 56, 1.5); spot(25, 22, 1); spot(41, 67, 1.5); spot(24, 28, 1);
    outline(S, OL);
    shine(S, 14, 22); rect(S, 20, 52, 1, 8, FUR[1]); put(S, 36, 53, null); shine(S, 33, 46);
    put(S, 36, 53, FUR[1]);
  }

  function sternenkrieger(F, S) {
    bands(F, 4, 4, 57, 78, [[4, '#0a0a2e'], [26, '#12124a'], [50, '#1c1a62']]);
    // Planet
    sell(F, 8, 25, 6, 6, ['#a04ae0', '#d490ff', '#5a2aa8'], [0.5, -0.2]); rect(F, 4, 24, 12, 2, '#7a38c8');
    sell(F, 11, 66, 4, 4, ['#40c8e8', '#a0f0ff', '#1c78b0']);
    plus(F, 12, 14, '#ffe680', 1); plus(F, 9, 44, '#d8e6ff'); plus(F, 54, 50, '#ffe680'); plus(F, 28, 8, '#d8e6ff'); plus(F, 52, 66, '#d8e6ff');
    // Boden: Felsplattform
    rect(F, 4, 75, 54, 4, '#3a3a6a'); rect(F, 4, 75, 54, 1, '#6a6ab0');

    const AR = ['#3c6ee2', '#86b0ff', '#223a9a'], WT = ['#e8eefc', '#ffffff', '#9eaed8'];
    // Umhang
    poly(S, [[22, 30], [40, 30], [51, 50], [57, 70], [46, 66], [31, 70], [16, 66], [5, 70], [11, 50]], '#d02e42');
    poly(S, [[40, 30], [51, 50], [57, 70], [46, 66], [43, 46]], '#8c1630');
    poly(S, [[22, 30], [11, 50], [5, 70], [10, 67], [17, 50]], '#f0606a');
    // Beine
    rect(S, 22, 54, 8, 9, AR[0]); rect(S, 33, 54, 8, 9, AR[0]); rect(S, 22, 54, 1, 9, AR[1]); rect(S, 33, 54, 1, 9, AR[1]); rect(S, 29, 54, 1, 9, AR[2]); rect(S, 40, 54, 1, 9, AR[2]);
    rect(S, 22, 62, 8, 3, WT[0]); rect(S, 33, 62, 8, 3, WT[0]); rect(S, 22, 62, 8, 1, WT[1]); rect(S, 33, 62, 8, 1, WT[1]);
    rect(S, 23, 65, 6, 6, AR[2]); rect(S, 34, 65, 6, 6, AR[2]); rect(S, 23, 65, 1, 6, AR[0]); rect(S, 34, 65, 1, 6, AR[0]);
    rect(S, 20, 71, 10, 4, WT[2]); rect(S, 33, 71, 10, 4, WT[2]); rect(S, 20, 71, 10, 1, WT[1]); rect(S, 33, 71, 10, 1, WT[1]); rect(S, 20, 74, 10, 1, '#5a6aa0'); rect(S, 33, 74, 10, 1, '#5a6aa0');
    // Arme (Haende in den Huefte)
    line(S, 16, 37, 11, 46, AR[2], 2.5); line(S, 11, 46, 19, 55, AR[0], 2.5); line(S, 47, 37, 52, 46, AR[2], 2.5); line(S, 52, 46, 44, 55, AR[2], 2.5);
    line(S, 11, 46, 19, 55, AR[0], 2); line(S, 15, 38, 11, 46, AR[0], 2); line(S, 47, 38, 52, 46, AR[0], 2); line(S, 52, 46, 44, 55, AR[0], 2);
    disc(S, 20, 55, 2.5, WT[0]); disc(S, 43, 55, 2.5, WT[0]); put(S, 19, 54, WH);
    // Torso
    poly(S, [[23, 32], [40, 32], [42, 44], [40, 55], [23, 55], [21, 44]], AR[0]);
    poly(S, [[23, 32], [27, 32], [26, 55], [23, 55], [21, 44]], AR[1]);
    poly(S, [[38, 32], [40, 32], [42, 44], [40, 55], [37, 55]], AR[2]);
    rect(S, 23, 50, 17, 3, AR[2]); rect(S, 23, 53, 17, 2, '#e2b030'); rect(S, 29, 52, 5, 4, '#ffd840'); put(S, 29, 52, WH);
    // Stern-Emblem
    star5(S, 31, 41, 7, '#8c1630'); star5(S, 31, 41, 6, '#ffd830');
    poly(S, [[31.5, 43.5], [35, 47], [31.5, 45.5]], '#e2a010'); put(S, 29, 39, WH);
    // Schulterpanzer
    sell(S, 18, 34, 7, 5, WT, [0.4, -0.3]); sell(S, 45, 34, 7, 5, WT, [0.4, -0.3]);
    rect(S, 12, 36, 14, 1, '#7a8cc4'); rect(S, 38, 36, 14, 1, '#7a8cc4');
    // Hals
    rect(S, 27, 27, 9, 6, AR[2]);
    // Helm
    sell(S, 31, 17, 10, 10, WT, [0.5, -0.3]);
    rect(S, 23, 21, 17, 6, WT[0]); rect(S, 23, 26, 17, 1, WT[2]);
    rect(S, 30, 7, 3, 9, AR[0]); rect(S, 30, 7, 1, 9, AR[1]);
    poly(S, [[23, 15], [40, 15], [39, 23], [24, 23]], '#1a1038');
    poly(S, [[24, 16], [39, 16], [38, 22], [25, 22]], '#ffb830');
    poly(S, [[24, 16], [39, 16], [38, 18], [25, 18]], '#ffe27a'); rect(S, 30, 16, 2, 7, '#ffb830');
    rect(S, 30, 16, 2, 7, '#e07a10'); rect(S, 27, 24, 9, 1, '#9eaed8');
    outline(S, OL);
    shine(S, 25, 11); shine(S, 15, 31); shine(S, 42, 31);
  }

  function kassenschicht(F, S) {
    bands(F, 4, 4, 57, 78, [[4, '#124c3c'], [26, '#1a6a52'], [50, '#268668'], [63, '#8e5c30'], [74, '#5e3a1e']]);
    rect(F, 4, 63, 54, 1, '#c28a4c'); rect(F, 4, 64, 54, 1, '#b27a40');
    rect(F, 6, 10, 10, 20, '#2a9a78'); rect(F, 6, 10, 10, 1, '#58d0a4'); rect(F, 8, 13, 6, 14, '#14584a');
    rect(F, 46, 8, 10, 3, '#58d0a4'); rect(F, 46, 14, 10, 3, '#58d0a4');
    rect(F, 10, 72, 38, 1, '#46280e');

    const BR = ['#d8a030', '#f8d460', '#8c5a16'];
    // Bon (gebogen, mit Rolle)
    rect(S, 24, 14, 8, 10, '#f6f4ee'); rect(S, 24, 14, 1, 10, WH); rect(S, 31, 14, 1, 10, '#c4c8d8');
    rect(S, 26, 17, 4, 1, '#9aa0b8'); rect(S, 26, 20, 3, 1, '#9aa0b8');
    rect(S, 26, 11, 8, 4, '#f6f4ee'); rect(S, 26, 11, 1, 4, WH); rect(S, 33, 11, 1, 4, '#c4c8d8');
    rect(S, 28, 12, 3, 1, '#9aa0b8');
    sell(S, 32, 8, 4, 2.5, ['#f6f4ee', '#ffffff', '#b4bcd4']); rect(S, 31, 8, 2, 1, '#9aa0b8');
    // Oberkasten
    poly(S, [[11, 36], [11, 29], [16, 22], [41, 22], [46, 29], [46, 36]], BR[0]);
    poly(S, [[11, 36], [11, 29], [16, 22], [24, 22], [20, 36]], BR[1]);
    rect(S, 11, 34, 36, 2, BR[2]);
    rect(S, 17, 25, 24, 8, '#2a1a08'); rect(S, 18, 26, 22, 6, '#ffb830'); rect(S, 18, 26, 22, 2, '#ffe27a'); rect(S, 18, 31, 22, 1, '#e07a10');
    rect(S, 20, 27, 3, 1, WH);
    // Tastenkoerper
    rect(S, 9, 36, 40, 22, '#c4902a'); rect(S, 9, 36, 40, 1, BR[1]); rect(S, 9, 36, 2, 22, BR[1]); rect(S, 47, 36, 2, 22, BR[2]); rect(S, 9, 56, 40, 2, BR[2]);
    rect(S, 14, 39, 30, 15, '#3a2410');
    const kc = ['#f6ecd0', '#f6ecd0', '#e84040', '#f6ecd0', '#40c870'];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) {
      const x = 16 + c * 5.4 | 0, y = 41 + r * 4;
      const col = r === 0 && c === 4 ? '#40c870' : (c === 2 && r === 2 ? '#e84040' : '#f6ecd0');
      rect(S, x, y, 4, 3, col); rect(S, x, y, 4, 1, WH); rect(S, x, y + 2, 4, 1, '#b8a070');
    }
    // Kurbel
    rect(S, 49, 40, 4, 2, BR[2]); rect(S, 52, 36, 2, 6, '#f0c050'); disc(S, 53, 35, 2, '#e84040'); put(S, 52, 34, WH);
    // Schublade (halb offen)
    poly(S, [[13, 58], [45, 58], [49, 66], [9, 66]], '#3a2210');
    rect(S, 17, 59, 1, 6, '#6a4420'); rect(S, 26, 59, 1, 6, '#6a4420'); rect(S, 36, 59, 1, 6, '#6a4420');
    const coin = (cx, cy) => { ell(S, cx, cy, 3, 1.4, '#ffe060'); ell(S, cx, cy, 1.5, 0.5, '#d8a020'); put(S, cx - 2, cy - 1, WH); };
    coin(15, 63); coin(22, 63); coin(31, 63); coin(41, 63); ell(S, 22, 61, 3, 1.4, '#e8e8f0'); put(S, 20, 60, WH); coin(31, 61);
    rect(S, 9, 66, 40, 6, BR[0]); rect(S, 9, 66, 40, 1, BR[1]); rect(S, 9, 71, 40, 1, BR[2]); rect(S, 25, 68, 8, 2, '#5a3a10'); rect(S, 25, 68, 8, 1, '#3a2208');
    // Muenzen daneben (euro-aehnlich: Silberkern, goldener Ring)
    const eu = (cx, cy, r, flat) => {
      if (flat) { ell(S, cx, cy + 1, r, 2, '#a07018'); ell(S, cx, cy, r, 2, '#ffd44a'); ell(S, cx, cy, r - 2, 1, '#e8eaf2'); put(S, cx - r + 1, cy - 1, WH); }
      else { disc(S, cx, cy, r, '#d89a20'); disc(S, cx, cy, r - 1, '#ffd44a'); disc(S, cx, cy, r - 3, '#e8eaf2'); disc(S, cx + 1, cy + 1, 1, '#a8b0cc'); put(S, cx - r + 2, cy - r + 2, WH); }
    };
    eu(53, 66, 3.5, 1); eu(53, 62, 3.5, 1); eu(7, 75, 3.5, 1);
    outline(S, OL);
    shine(S, 14, 25); shine(S, 12, 38);
  }

  const MOTIFS = { rettungsschwimmer, zeche, pinguin, frostherrin, hantelbank, waechter, sternenkrieger, kassenschicht };
  window.JK = { W, H, OL, WH, layer, put, get, rect, disc, ell, sell, line, poly, outline, shine, bands, star5, plus, MOTIFS };

  // ---------- Karte ----------
  const FRAMES = [
    { l: '#dce4f0', b: '#9aa6bc', d: '#566180' },   // gewoehnlich: Stahl
    { l: '#a0f4a8', b: '#34c85c', d: '#16783a' },   // ungewoehnlich: Gruen
    { l: '#e8b8ff', b: '#a050e8', d: '#5a1ea0' },   // selten: Violett + Gold
    { l: '#fff2a0', b: '#f4b820', d: '#a86a0c' }    // legendaer: Gold
  ];
  function inRR(x, y, x0, y0, w, h, r) {
    const px = x + 0.5, py = y + 0.5;
    if (px < x0 || py < y0 || px > x0 + w || py > y0 + h) return false;
    const cx = Math.min(Math.max(px, x0 + r), x0 + w - r), cy = Math.min(Math.max(py, y0 + r), y0 + h - r);
    return (px - cx) * (px - cx) + (py - cy) * (py - cy) <= r * r;
  }
  function sparkle(L, cx, cy, rar, big) {
    const a = rar === 3 ? '#fff2a0' : '#f0d8ff';
    const n = big ? 3 : 2;
    for (let i = 1; i <= n; i++) { put(L, cx - i, cy, i === n ? a : WH); put(L, cx + i, cy, i === n ? a : WH); put(L, cx, cy - i, i === n ? a : WH); put(L, cx, cy + i, i === n ? a : WH); }
    put(L, cx, cy, WH); put(L, cx - 1, cy - 1, a); put(L, cx + 1, cy - 1, a); put(L, cx - 1, cy + 1, a); put(L, cx + 1, cy + 1, a);
  }

  window.paintJoker = function (id, rarity) {
    rarity = rarity | 0;
    const F = layer(), S = layer(), SP = layer();
    (MOTIFS[id] || (window.JOKER_EXTRA && window.JOKER_EXTRA[id]) || MOTIFS.pinguin)(F, S);
    if (rarity >= 2) { sparkle(SP, 10, 10, rarity, rarity === 3); sparkle(SP, 51, 72, rarity, rarity === 3); }
    if (rarity === 3) { sparkle(SP, 51, 10, rarity, false); sparkle(SP, 10, 72, rarity, false); }
    outline(SP, OL);
    const fr = FRAMES[rarity];
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (!inRR(x, y, 0, 0, W, H, 6)) continue;
      let c;
      if (inRR(x, y, 4, 4, W - 8, H - 8, 2)) {
        c = get(SP, x, y) || get(S, x, y) || get(F, x, y) || '#222';
        // Innenkante: Zierlinie
        if (rarity >= 2 && !inRR(x, y, 5, 5, W - 10, H - 10, 1.5)) c = rarity === 3 ? '#fff2a0' : '#f0c040';
      } else if (inRR(x, y, 3, 3, W - 6, H - 6, 3)) c = OL;
      else if (inRR(x, y, 1, 1, W - 2, H - 2, 5)) {
        const e = Math.min(x, y, W - 1 - x, H - 1 - y);
        const tl = Math.min(x, y) < Math.min(W - 1 - x, H - 1 - y);
        c = tl ? (e <= 1 ? fr.l : fr.b) : (e <= 1 ? fr.b : fr.d);
      } else c = OL;
      ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1);
    }
    // Edelstein oben Mitte (ab ungewoehnlich) + Ecknieten
    if (rarity >= 1) {
      const gem = ['#ffffff', fr.l, rarity === 3 ? '#e03030' : (rarity === 2 ? '#ffd040' : '#ffffff')];
      ctx.fillStyle = OL; ctx.fillRect(28, 0, 6, 4);
      ctx.fillStyle = gem[2]; ctx.fillRect(29, 1, 4, 2);
      ctx.fillStyle = gem[0]; ctx.fillRect(29, 1, 1, 1);
      ctx.fillStyle = fr.d; ctx.fillRect(32, 2, 1, 1);
    }
    return cv;
  };
})();
