/* Einstellungen: hier kannst du das Spiel leicht anpassen (Zahlen ändern, Seite neu laden). */
window.CONFIG = {
  handSize: 8,          // Karten auf der Hand
  maxSelect: 5,         // maximal ausgewählte Karten
  handsPerRound: 4,     // Hände pro Runde
  discardsPerRound: 3,  // Abwürfe pro Runde
  firstTarget: 300,     // Zielpunkte in Runde 1
  targetGrowth: 1.45,   // Faktor, um den das Ziel pro Runde wächst

  // Joker und Geld
  jokerSlots: 5,        // so viele Joker kannst du gleichzeitig haben
  startMoney: 4,        // Euro am Anfang eines Runs
  roundReward: 3,       // Euro für jede gewonnene Runde
  handReward: 1,        // Euro für jede übrige Hand am Rundenende
  shopSlots: 3,         // Joker im Angebot
  rerollCost: 2,        // Kosten für neue Angebote
  rarityCost: [4, 6, 8, 11]   // Preis nach Seltenheit (gewöhnlich, ungewöhnlich, selten, legendär)
};

window.HAND_TYPES = {
  high:          { name: 'Hohe Karte',     chips: 5,   mult: 1 },
  pair:          { name: 'Paar',           chips: 10,  mult: 2 },
  twoPair:       { name: 'Zwei Paare',     chips: 20,  mult: 2 },
  three:         { name: 'Drilling',       chips: 30,  mult: 3 },
  straight:      { name: 'Straße',         chips: 30,  mult: 4 },
  flush:         { name: 'Flush',          chips: 35,  mult: 4 },
  fullHouse:     { name: 'Full House',     chips: 40,  mult: 4 },
  four:          { name: 'Vierling',       chips: 60,  mult: 7 },
  straightFlush: { name: 'Straight Flush', chips: 100, mult: 8 }
};
