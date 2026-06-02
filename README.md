# OutDoorSauna veebileht

See kaust sisaldab valmis HTML/CSS/JS veebilehte.

## Failid

- `index.html` – lehe sisu, tekstid, pildid, nupud ja vorm
- `style.css` – kogu kujundus, värvid, suurused, mobiilivaade
- `script.js` – vaadete vahetamine, keelevahetus ja vormi käitumine
- `assets/` – kõik pildid

## Kuidas teksti muuta?

Ava `index.html` ja otsi soovitud tekst üles.

Kui tekstil on juures näiteks:

```html
data-i18n="hero_title"
```

siis muuda sama teksti ka `script.js` failis `translations` osa sees.

## Kuidas pilti muuta?

Pane uus pilt `assets` kausta ja muuda HTML-is näiteks:

```html
<img src="assets/torusaun-valmis.jpg">
```

uue pildi nimeks.

## Kuidas värve muuta?

Ava `style.css` ja muuda faili alguses `:root` ploki sees olevaid värve.

## Kuidas lisada uus menüü vaade?

Kõige lihtsam on kopeerida üks olemasolev `<section id="...">` plokk `index.html` failis,
anda sellele uus id ja lisada ülemisse menüüsse nupp:

```html
<button onclick="showPage('uusvaade')">Uus vaade</button>
```

## Vorm

Kontaktivorm asub `index.html` faili lõpus.

Vorm saadab päringu `script.js` faili kaudu Google Apps Scripti Web App URL-ile.
Google Apps Script salvestab päringu Google Sheetsi tabelisse, saadab firma Gmailile teavituse ning kliendile automaatvastuse.

Kui `GOOGLE_SCRIPT_URL` väärtus on `script.js` failis tühi, kasutatakse varuvariandina mailto-linki ehk avaneb kasutaja e-posti rakendus.