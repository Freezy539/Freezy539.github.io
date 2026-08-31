KOOS KOOLI — PAIGALDUS

MIS SEE ZIP ON?
---------------
Valmis veebilehe kaust:
- index.html              põhileht
- assets/styles.css       kujundus
- assets/app.js           lehe loogika
- api/voco.php            serveripoolne tunniplaani API/proxy
- api/config.php          VOCO ühenduse seaded
- api/cache/              ajutine cache
- .htaccess               väike turvaseadistus

OLULINE
------
Praegu töötab leht kohe pärast üleslaadimist DEMOANDMETEGA.

VOCO live-andmed ei ole meelega "välja mõeldud". VOCO avalik tunniplaani leht
näitab valikut ja "Loading", aga päris tunnid tuuakse JavaScriptiga eraldi
päringust. Selle päringu täpset aadressi ei õnnestunud avalikust HTML-ist
kindlalt tuvastada.

Seega:
1) veebileht ise on valmis;
2) PHP proxy/cache on valmis;
3) vaja on veel ainult VOCO päris andmepäringu URL ja vajadusel vastuse väljade
   nimede sobitamine api/voco.php failis.

KUIDAS ZONE'I / SERVERISSE PANNA
--------------------------------
1. Paki ZIP enda arvutis lahti.
2. Ava Zone failihaldur või FTP.
3. Mine selle domeeni alamkausta, kus leht peab avanema.
   Näiteks:
     public_html/tunniplaan/
   või
     htdocs/tunniplaan/
   Täpne nimi sõltub sinu virtuaalserverist.

4. Laadi KOGU "koos-kooli-veeb" kausta SISU sinna:
     index.html
     .htaccess
     assets/
     api/

   Ära pane nii:
     /tunniplaan/koos-kooli-veeb/index.html
   kui tahad, et aadress oleks:
     sinu-domeen.ee/tunniplaan/

   Pane nii:
     /tunniplaan/index.html
     /tunniplaan/assets/...
     /tunniplaan/api/...

5. Veendu, et serveris töötab PHP.
6. Ava:
     https://sinu-domeen.ee/tunniplaan/

7. Kontrolli eraldi ka API-d:
     https://sinu-domeen.ee/tunniplaan/api/voco.php?action=groups

   Kui näed JSON-i gruppidega, on PHP osa korras.

MIS JÄRJEKORRAS?
----------------
Serverisse laadimise järjekord pole tegelikult oluline.
Kõige lihtsam:
1. tee /tunniplaan/ kaust;
2. laadi ZIP-i kogu sisu sinna;
3. ava veebileht;
4. kontrolli API linki;
5. alles pärast seda ühendame VOCO live-andmed.

KUIDAS VOCO LIVE-ANDMED KÜLGE PANNA
-----------------------------------
Kõige parem lahendus on:
VOCO -> sinu api/voco.php -> 10 min cache -> sinu veebileht

Nii ei tee iga lehe avamine VOCO serverisse uut päringut.

Kui VOCO päringu aadress on teada:
1. ava api/config.php
2. muuda:
     'LIVE_MODE' => true
3. lisa:
     'GROUPS_URL' => 'PÄRIS_GRUPPIDE_URL'
     'SCHEDULE_URL' => 'PÄRIS_TUNNIPLAANI_URL?group={group}&week={week}'
4. salvesta.

Kui VOCO JSON formaat on teistsugune, tuleb api/voco.php failis muuta ainult:
- normalizeGroups()
- normalizeSchedule()

KUIDAS MULLE VOCO PÄRING KÄTTE ANDA
-----------------------------------
Kui tahad, et ma ühenduse sinu eest lõpuni valmis teen, on vaja VOCO tunniplaani
võrgupäringut.

Arvutis Chrome/Edge:
1. ava voco.ee/tunniplaan/
2. F12
3. Network
4. vali VOCO lehel SRT526
5. Networkis vaata uusi Fetch/XHR päringuid
6. kliki sellel, mille Response sisaldab tunniplaani infot
7. paremklikk -> Copy -> Copy as cURL
8. saada see cURL mulle vestlusesse

Kui saadad selle ühe päringu, saab connectori tavaliselt lõpuni ära teha ilma,
et peaksid ise PHP-d muutma.

TURVALISUS / KOORMUS
--------------------
- api/voco.php kasutab cache'i (vaikimisi 10 min).
- Ära tee VOCO serverisse päringut iga sekundi või iga kasutaja klikiga.
- Avaliku tunniplaani kasutamine enda mugavusvaates ei tähenda, et VOCO API
  kasutustingimused oleks automaatselt teada; kui endpointil on eraldi piirangud,
  tuleb neid järgida.

FAILIDE MUUTMINE HILJEM
-----------------------
Kujundus: assets/styles.css
Tekstid ja arvutused: assets/app.js
VOCO ühendus: api/config.php + api/voco.php

PÕHIGRUPID
----------
Koos-sõidu põhivaates:
SRT526 + LOG26

Neid saab muuta api/config.php failis.
