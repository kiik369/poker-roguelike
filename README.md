# Poker Roguelike

Ein Pokerspiel im Browser: Du spielst Pokerhände, sammelst Punkte und schaffst Runde für Runde ein höheres Ziel.
Nach jeder Runde gibt es Geld, im Shop kaufst du Joker mit besonderen Wirkungen. Alle Grafiken sind Pixel-Art,
die beim Start per Code gemalt wird. Es gibt keine Bilddateien, und alles ist eigenes Material.

Spielen: Die Seite läuft direkt über GitHub Pages (`index.html`). Es ist keine Installation nötig.

## Auf dem Handy

Die Seite ist für Handys im Hochformat eingerichtet (getestet in 360 px Breite). Im Querformat erscheint ein Hinweis, das Handy hochkant zu halten.
Zum Startbildschirm hinzufügen: Chrome-Menü (drei Punkte) → „Zum Startbildschirm hinzufügen“ oder „App installieren“. Dann startet das Spiel wie eine App im Vollbild.

## Aufbau

```
index.html            Seitengerüst (Anzeigen, Fenster)
css/style.css         Aussehen
js/config.js          Einstellungen und Handwerte (hier Zahlen ändern)
js/cards.js           Kartengrafik (Spielkarten, 41x56 Pixel)
js/game.js            Spiellogik: Runden, Wertung, Shop, Sammlung, Töne, Effekte
js/jokers/core.js     Joker-Karte: Rahmen, Seltenheit, Zeichenhilfen (62x83 Pixel)
js/jokers/art-*.js    Joker-Motive (je eine Funktion pro Joker)
js/jokers/data.js     Joker-Liste: Name, Seltenheit, Text, Wirkung
manifest.json, sw.js  Installierbare App (Startbildschirm, offline spielbar)
icons/                App-Symbole
```

## Häufige Änderungen

- **Zahlen anpassen** (Hände, Abwürfe, Zielpunkte, Preise, Anzahl Joker-Plätze): `js/config.js`.
- **Joker-Wirkung oder Text ändern:** Eintrag in `js/jokers/data.js`. Dort steht oben eine Anleitung.
- **Neuen Joker hinzufügen:**
  1. Motiv als Funktion in eine `art-*.js` schreiben (Vorlage: ein vorhandenes Motiv) oder eine neue Datei anlegen. Die neue Datei muss in `index.html` vor `data.js` eingebunden werden.
  2. Eintrag mit gleicher `id` in `js/jokers/data.js` ergänzen.
- **Handwerte ändern:** `HAND_TYPES` in `js/config.js`.
- **Hintergrundbild aus dem Repo:** Datei `hintergrund.jpg` ins Repo legen und im Spiel unter „Anzeige“ „Bild aus dem Repo“ wählen.

## Regeln in Kurzform

- Punkte = (Basis + Kartenwerte) × Multiplikator. Joker wirken von links nach rechts.
- Nur Karten, die zur Hand gehören (grüner Rand), zählen.
- Rundenende: Belohnung, übrige Hände und manche Joker bringen Euro. Im Shop kaufst du Joker (bis zu 5), neue Angebote kosten Geld.
- Eigene Joker kannst du antippen und verkaufen.
- Die Sammlung zeigt, welche der 31 Joker du schon gesehen hast.

## Hinweis zu den Grafiken

Die Nordkapp-Karte nutzt Kartendaten von Natural Earth (gemeinfrei). Alle anderen Motive wurden selbst gezeichnet.
