/* Joker-Liste: Name, Seltenheit, Beschreibung und Wirkung.
   So fügst du einen Joker hinzu: Motiv in einer art-*.js zeichnen (Funktion mit gleicher id),
   dann hier einen Eintrag ergänzen. Nichts anderes ist nötig.

   score(c)    wird für jede gespielte Hand aufgerufen und gibt { chips, mult, xmult, money } zurück (alles optional).
   roundEnd(c) gibt Euro am Rundenende zurück.
   mods        Dauerhafte Boni: hands, discards, handSize, shopSlots.
   Der Kontext c enthält: type (Handart), played (gespielte Karten), scoring (gewertete Karten),
   handsLeft, discardsLeft, handCards (Karten auf der Hand), roundsWon, data (Zähler dieses Jokers).
   Seltenheit: 0 gewöhnlich, 1 ungewöhnlich, 2 selten, 3 legendär. */
(function () {
  const BLACK = [0, 2], RED = [1, 3];            // Farbindex: 0 Pik, 1 Herz, 2 Kreuz, 3 Karo
  const count = (cards, f) => cards.filter(f).length;

  const JOKERS = [
    // ---- gewöhnlich ----
    { id: 'ruckelschutz', name: 'Ruckelschutz', rarity: 0, text: '+1 Hand pro Runde', mods: { hands: 1 } },
    { id: 'sechs_gigabyte', name: 'Sechs Gigabyte', rarity: 0, text: 'Jede gewertete 6: +6 Mult',
      score: c => ({ mult: 6 * count(c.scoring, k => k.rank === 6) }) },
    { id: 'lampenwechsel', name: 'Lampenwechsel', rarity: 0, text: 'Erste Hand der Runde: +40 Chips',
      score: c => c.firstHand ? { chips: 40 } : null },
    { id: 'rosa_theme', name: 'Rosa Theme', rarity: 0, text: 'Jedes gewertete Herz: +4 Mult',
      score: c => ({ mult: 4 * count(c.scoring, k => k.suit === 1) }) },
    { id: 'rettungsschwimmer', name: 'Rettungsschwimmer', rarity: 0, text: '+1 Abwurf pro Runde', mods: { discards: 1 } },
    { id: 'zeche', name: 'Zeche', rarity: 0, text: 'Rundenende: +3 €', roundEnd: () => 3 },
    { id: 'kassenschicht', name: 'Kassenschicht', rarity: 0, text: 'Jede gespielte Hand: +1 €',
      score: () => ({ money: 1 }) },
    { id: 'chip_melodie', name: 'Chip-Melodie', rarity: 0, text: 'Jede gewertete Karte: +5 Chips',
      score: c => ({ chips: 5 * c.scoring.length }) },
    { id: 'goldene_muenze', name: 'Goldene Münze', rarity: 0, text: 'Jedes gewertete Karo: +1 €',
      score: c => ({ money: count(c.scoring, k => k.suit === 3) }) },
    { id: 'schlafen_mit_musik', name: 'Schlafen mit Musik', rarity: 0, text: 'Rundenende: +1 € pro übrigem Abwurf',
      roundEnd: c => c.discardsLeft },

    // ---- ungewöhnlich ----
    { id: 'pinguin', name: 'Der Pinguin', rarity: 1, text: 'Jede gewertete schwarze Karte (♠ ♣): +3 Mult',
      score: c => ({ mult: 3 * count(c.scoring, k => BLACK.includes(k.suit)) }) },
    { id: 'schlafzimmer_server', name: 'Schlafzimmer-Server', rarity: 1, text: '+1 Mult, jede gewonnene Runde +1 mehr',
      score: c => ({ mult: c.data.mult || 0 }), onRoundWon: d => { d.mult = (d.mult || 0) + 1; }, initData: { mult: 0 } },
    { id: 'tropfender_rohling', name: 'Tropfender Rohling', rarity: 1, text: 'Pro übrigem Abwurf: +3 Mult',
      score: c => ({ mult: 3 * c.discardsLeft }) },
    { id: 'denoising_regler', name: 'Denoising-Regler', rarity: 1, text: 'Hohe Karte: +30 Chips und +4 Mult',
      score: c => c.type === 'high' ? { chips: 30, mult: 4 } : null },
    { id: 'zwei_naechte_regel', name: 'Zwei-Nächte-Regel', rarity: 1, text: 'Zwei Paare: +8 Mult',
      score: c => c.type === 'twoPair' ? { mult: 8 } : null },
    { id: 'hantelbank', name: 'Hantelbank', rarity: 1, text: 'Drilling oder Vierling: +40 Chips',
      score: c => (c.type === 'three' || c.type === 'four') ? { chips: 40 } : null },
    { id: 'waechter', name: 'Der Wächter', rarity: 1, text: 'Pro Karte, die du auf der Hand behältst: +1 Mult',
      score: c => ({ mult: c.handCards }) },
    { id: 'neusprech', name: 'Neusprech', rarity: 1, text: 'Jede gewertete 2, 3, 4 oder 5: +10 Chips',
      score: c => ({ chips: 10 * count(c.scoring, k => k.rank <= 5) }) },
    { id: 'reiseziel_malta', name: 'Reiseziel Malta', rarity: 1, text: 'Rundenende: +2 € pro übriger Hand',
      roundEnd: c => 2 * c.handsLeft },
    { id: 'gluecksklee', name: 'Glücksklee', rarity: 1, text: '1 zu 4: +20 Mult',
      score: () => Math.random() < 0.25 ? { mult: 20 } : null },
    { id: 'kartenfaecher', name: 'Kartenfächer', rarity: 1, text: 'Hand mit 5 Karten: +20 Chips und +3 Mult',
      score: c => c.played.length === 5 ? { chips: 20, mult: 3 } : null },
    { id: 'wuerfel_paar', name: 'Würfelpaar', rarity: 1, text: 'Zwei Würfel: +2 bis +12 Mult',
      score: () => ({ mult: 2 + Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) }) },

    // ---- selten ----
    { id: 'reaktorkuehler', name: 'Reaktorkühler', rarity: 2, text: 'Flush oder Straight Flush: ×2 Mult',
      score: c => (c.type === 'flush' || c.type === 'straightFlush') ? { xmult: 2 } : null },
    { id: 'nordkapp', name: 'Nordkapp-Wanderer', rarity: 2, text: '+2 Mult für jede gewonnene Runde',
      score: c => ({ mult: 2 * c.roundsWon }) },
    { id: 'sternenkrieger', name: 'Sternenkrieger', rarity: 2, text: 'Jedes gewertete Ass: +8 Mult',
      score: c => ({ mult: 8 * count(c.scoring, k => k.rank === 14) }) },
    { id: 'gelenkte_demokratie', name: 'Gelenkte Demokratie', rarity: 2, text: 'Hand mit genau 3 Karten: ×2 Mult',
      score: c => c.played.length === 3 ? { xmult: 2 } : null },
    { id: 'pixel_orchester', name: 'Pixel-Orchester', rarity: 2, text: 'Straße: +50 Chips und +5 Mult',
      score: c => (c.type === 'straight' || c.type === 'straightFlush') ? { chips: 50, mult: 5 } : null },
    { id: 'sanduhr', name: 'Sanduhr', rarity: 2, text: 'Letzte Hand der Runde: ×2 Mult',
      score: c => c.handsLeft === 0 ? { xmult: 2 } : null },
    { id: 'schluessel', name: 'Schlüssel', rarity: 2, text: '+1 Karte auf der Hand', mods: { handSize: 1 } },
    { id: 'kristallkugel', name: 'Kristallkugel', rarity: 2, text: '+1 Angebot im Shop', mods: { shopSlots: 1 } },

    // ---- legendär ----
    { id: 'frostherrin', name: 'Die Frostherrin', rarity: 3, text: 'Jede Hand: ×1,5 Mult',
      score: () => ({ xmult: 1.5 }) }
  ];

  const RARITY_NAME = ['Gewöhnlich', 'Ungewöhnlich', 'Selten', 'Legendär'];
  const RARITY_WEIGHT = [60, 28, 10, 2];
  const byId = {};
  JOKERS.forEach(j => { byId[j.id] = j; });

  function weightedPick(pool) {
    const total = pool.reduce((s, j) => s + RARITY_WEIGHT[j.rarity], 0);
    let r = Math.random() * total;
    for (const j of pool) { r -= RARITY_WEIGHT[j.rarity]; if (r <= 0) return j; }
    return pool[pool.length - 1];
  }

  window.JokerData = {
    list: JOKERS,
    byId,
    rarityName: RARITY_NAME,
    cost: j => window.CONFIG.rarityCost[j.rarity],
    sellValue: j => Math.max(1, Math.floor(window.CONFIG.rarityCost[j.rarity] / 2)),
    /* Neue Instanz fuer den Run (mit eigenem Zaehler) */
    make: id => ({ id, data: Object.assign({}, byId[id].initData || {}) }),
    /* Zufaellige Angebote (ohne Joker, die man schon hat) */
    offers(count, ownedIds) {
      const pool = JOKERS.filter(j => !ownedIds.includes(j.id));
      const out = [];
      while (out.length < count && pool.length) {
        const j = weightedPick(pool);
        pool.splice(pool.indexOf(j), 1);
        out.push(j.id);
      }
      return out;
    },
    /* Summe der Dauerboni aller Joker */
    mods(owned) {
      const m = { hands: 0, discards: 0, handSize: 0, shopSlots: 0 };
      owned.forEach(o => { const mm = byId[o.id].mods; if (mm) for (const k in mm) m[k] += mm[k]; });
      return m;
    }
  };
})();
