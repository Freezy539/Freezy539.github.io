KOOS KOOLI – GitHub Pages versioon

See versioon on staatiline HTML/CSS/JS ja töötab GitHub Pagesis ilma PHP-ta.
VOCO live-andmed tulevad Cloudflare Workeri kaudu:
https://tunniplaan.worker391.workers.dev

Põhivaade: SRT526 + LOG26.
Tavalise tunniplaani valikus: SRT526, LOG26, INSA26.

Lisafunktsioonid menüüs:
- Muudatuste ajalugu (salvestub brauseri localStorage'i ja võrdleb viimati nähtud tunniplaaniga)
- Homse päeva raskusaste
- Parim / halvim koolipäev
- Hele / tume / automaatne välimus

NB! Muudatuste ajalugu on seadme-põhine. See ei ole serveripoolne pidev monitooring: muudatus leitakse siis, kui leht järgmine kord VOCO andmed laadib ja saab neid varem salvestatud seisuga võrrelda.
