FIVEM MONEY DASHBOARD - SETUP
=============================

Selles pakis on valmis GitHub Pages dashboard + Apps Script JSON API.

MIS FAILID ON MIS?
------------------
index.html  -> dashboardi põhileht
style.css   -> välimus
app.js      -> laeb andmed Apps Scriptist ja täidab dashboardi
config.js   -> siia paned oma Apps Script URL-i
assets/logo.png -> siia pane oma logo fail nimega logo.png
apps-script/Code.gs -> pane see Google Sheetsi Apps Scripti sisse

1) LOGO
-------
Pane oma logo faili nimega:
logo.png

ja tõsta see kausta:
assets/

Kui logo puudub, näitab leht F tähte.

2) APPS SCRIPT GOOGLE SHEETSIS
------------------------------
Ava oma Google Sheet.
Mine: Extensions -> Apps Script
Kustuta vana sisu ära.
Ava fail apps-script/Code.gs siit pakist.
Kopeeri kogu selle faili sisu Apps Scripti.
Salvesta.

Seejärel tee deploy:
- vajuta ülevalt Deploy
- New deployment
- tüüp: Web app
- Execute as: Me
- Who has access: Anyone with the link
- Deploy

Kopeeri sealt antud /exec link.

3) CONFIG.JS
------------
Ava config.js
Asenda see rida:
apiUrl: "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE"

oma päris /exec lingiga.

Näide:
apiUrl: "https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec"

4) GITHUBI PANEMINE
-------------------
Lisa need failid oma GitHub repo juurkausta või sinna kohta, kust su Pages leht jookseb:
- index.html
- style.css
- app.js
- config.js
- assets/logo.png

Siis commit + push.

5) KUI LEHT EI TÖÖTA
--------------------
Kontrolli neid asju:
- Apps Script deploy on tehtud Web Appina
- access on Anyone with the link
- config.js sees on õige /exec link
- Google Sheeti lehe nimi on täpselt Paevik
- Seaded leht võib olemas olla, aga kui ei ole, kasutab süsteem vaikimisi eesmärki 1000000

6) MIDA DASHBOARD NÄITAB
------------------------
- Current Balance
- Remaining
- Progress %
- Projected Goal Date
- Avg Daily Growth
- Best Day
- Worst Day
- Profit Streak
- Hoiatused
- Viimased 30 kirjet
- Milestone'id 100k / 250k / 500k / 750k / 1M

7) MIS EELDUS ON SINU SHEETI KOHTA
----------------------------------
Paevik lehel võiksid veerud olla nii:
A = kuupäev
B = päeva lõpu raha
C = muutus
D = allikas
E = märkus

Kui sul C, D või E on osaliselt tühjad, leht töötab ikkagi.

8) IPHONE PEALE
---------------
Kui GitHub Pages töötab:
- ava leht Safaris
- Share
- Add to Home Screen

Siis on see sul nagu app.

9) KUI TAHAKSID HILJEM JUURDE
-----------------------------
Saab hiljem lisada:
- top 5 päevad
- source pie chart
- net worth
- mitu eraldi eesmärki
- custom RP nimed
- full sidebar / forms

