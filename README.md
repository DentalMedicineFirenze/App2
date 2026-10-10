# Dental Medicine Firenze — App Pazienti (PWA) v1.3.0

App web installabile (PWA) per i pazienti dello studio Dental Medicine Firenze.
Motto: «Il tuo sorriso è il miglior biglietto da visita».

## Struttura
```
index.html              pagina unica (splash, bottom bar, routing)
manifest.webmanifest    nome, colori, icone per l'installazione
sw.js                   service worker (offline)
css/app.css             stile (palette adattata al logo: #414456)
js/app.js               logica, schermate, mappa, installazione guidata
content/it.json         TUTTI i testi in italiano  ← si modificano qui
content/en.json         TUTTI i testi in inglese   ← si modificano qui
img/                    logo, foto studio, mappa ufficiale
icons/                  icone 192/512/maskable, apple-touch 180, favicon
```

## Pubblicazione (gratuita, HTTPS incluso)
1. GitHub Pages: crea un repository pubblico, carica il contenuto di questa cartella (index.html deve stare nella radice),
   poi Settings → Pages → "Deploy from a branch" → main / (root). Indirizzo: https://NOMEUTENTE.github.io/NOMEREPO/
2. Facoltativo: collega un sottodominio dello studio (es. app.tuodominio.it) dalle impostazioni DNS.
3. Genera il QR code dell'indirizzo finale (qualsiasi generatore QR) e stampalo per reception e sale d'attesa.

## Aggiornare i contenuti
- Modifica i testi in `content/it.json` e `content/en.json` (**grassetto** con doppio asterisco).
- Dopo ogni modifica incrementa `VERSION` in `sw.js` (es. `dmf-v1.0.1`) così i telefoni scaricano la nuova versione.

## Indirizzi delle schermate
`#/` Home · `#/come-arrivare` · `#/post-intervento` · `#/post-intervento/<slug>` · `#/pillole` · `#/pillole/<slug>` · `#/impostazioni`
(routing con "#" per funzionare su qualsiasi hosting senza configurazioni).

## Da completare (checklist cliente)
- Informativa privacy definitiva (ora bozza GDPR in `privacy`).
- Verifica posizione del pin sulla mappa (coordinate in `js/app.js`, costante `STUDIO`).
- Verifica tariffe parcheggio aggiornate.
