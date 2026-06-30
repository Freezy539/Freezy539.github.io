/*
  OutDoorSauna veebileht
  FAIL: script.js
  SIIN MUUDAD: keelevahetust, vaadete avamist ja vormi käitumist.
*/

const translations = {
  "et": {
    "meta_title": "OutDoorSauna | Toru-, ovaal- ja kandilised saunad",
    "meta_description": "OutDoorSauna valmistab toru-, ovaal- ja kandilisi välisaunu otse tootjalt. Küsi pakkumist termopuidust või kuusepuust saunale üle Eesti.",
    "meta_og_title": "OutDoorSauna | Välisaunad otse tootjalt",
    "meta_og_description": "Kvaliteetsed toru-, ovaal- ja kandilised saunad. Transport üle Eesti ja Euroopa.",
    "brand_aria": "OutDoorSauna avaleht",
    "prev_image": "Eelmine pilt",
    "next_image": "Järgmine pilt",
    "close_image": "Sulge suurem pilt",
    "lang_button": "Keel: Eesti",
    "topbar": "🇪🇪 Toru-, ovaal- ja kandilised saunad otse tootjalt • Transport üle Eesti ja Euroopa",
    "nav_home": "Avaleht",
    "nav_products": "Valik",
    "nav_gallery": "Galerii",
    "nav_production": "Tootmine",
    "nav_about": "Meist",
    "nav_contact": "Küsi pakkumist",
    "hero_pill": "🔥 Otse tootjalt Tartumaalt",
    "hero_title": "Toru-, ovaal- ja kandilised saunad",
    "hero_text": "Valmistame kvaliteetseid termopuidust ja kuusepuust välisaunu. Saunad tarnitakse kokkupanduna ning vajadusel aitame transpordiga üle Eesti ja Euroopa.",
    "hero_btn1": "Vaata valikut",
    "hero_btn2": "Küsi pakkumist",
    "quick_1_title": "Materjal",
    "quick_1_text": "Kasutame kvaliteetset kuuse- ja termopuitu, mis tagavad vastupidavuse, hea soojapidavuse ning elegantse välimuse igas ilmastikus.",
    "quick_2_title": "Erinevad mudelid",
    "quick_2_text": "Valikus on toru-, ovaal- ja kandilised saunad erinevates mõõtudes ning lahendustes. Võimalik tellida ka täiesti eritellimusel valmistatud saun.",
    "quick_3_title": "Värvivalikud",
    "quick_3_text": "Vali oma saunale sobiv toon ja viimistlus – saadaval erinevad puidu-, katuse- ja detailivärvide kombinatsioonid, et saun sobiks ideaalselt sinu kodu või suvilaga.",
    "quick_4_title": "Transport",
    "quick_4_text": "Pakume turvalist ja mugavat transporti üle Eesti ning kokkuleppel ka üle Euroopa. Vajadusel aitame ka paigaldusega.",
    "home_eyebrow": "Miks meie saunad?",
    "home_title": "Leil, mis kestab aastaid — kvaliteetne välisaun otse tootjalt.",
    "home_text": "Iga saun valmib kvaliteetsetest materjalidest ning tarnitakse täielikult kokkupanduna ja kasutusvalmina. Sobib ideaalselt koduhoovi, suvilasse, veekogu äärde või majutusettevõttele.",
    "home_li1": "Täiskomplektne lahendus – keris, korsten ja kerisekivid saadaval komplektis",
    "home_li2": "Vastupidavad kuuse- ja termopuidust saunad",
    "home_li3": "Võimalik tellida erinevate mõõtude, värvide ja lahendustega",
    "home_li4": "Transport ja vajadusel paigaldusabi üle Eesti ja Euroopa",
    "products_eyebrow": "Valik",
    "products_title": "Vali sobiv saun või küsi eritellimust",
    "products_text": "Allolevad mudelid annavad ülevaate meie põhilistest lahendustest. Kõiki saunu saab kohandada vastavalt soovile.",
    "product1_badge": "Populaarne",
    "product1_title": "2-ruumiline torusaun",
    "product1_text": "Ruumikas torusaun praktilise eesruumi ja leiliruumiga. Sobib hästi perele või sõprade seltskonnale.",
    "product2_badge": "Väga ruumikas",
    "product2_title": "2-ruumiline ovaalsaun",
    "product2_text": "Hea disainiga ovaalsaun, millel on praktiline eesruum ja mugav leiliruum.",
    "product3_badge": "Kompaktne",
    "product3_title": "Terrassiga torusaun",
    "product3_text": "Kompaktne termopuidust torusaun väiksemasse aeda, veekogu äärde või haagisele paigaldamiseks.",
    "product4_badge": "Minimalistlik",
    "product4_title": "1-ruumiline torusaun",
    "product4_text": "Kompaktne 1-ruumiline torusaun neile, kes soovivad lihtsat ja praktilist lahendust koduhoovi, suvilasse või veekogu äärde.",
    "ask_offer": "Küsi pakkumist",
    "vat": "+ KM",
    "spec1_1": "📏 3.8 m × 2.1 m",
    "spec1_2": "🔥 Keris Harvia M3",
    "spec_water": "💧 35L veepaak",
    "spec1_4": "🚪 Lukustatav välisuks",
    "spec2_1": "📏 4 m × 2.4 m",
    "spec2_2": "🪵 Lepast lavad",
    "spec2_4": "🌲 Kuusepuust või termopuidust",
    "spec3_1": "🏕 Sobib ideaalselt haagisele",
    "spec3_2": "🪵 Valmistatud termopuidust",
    "spec3_3": "🔥 Võimalik valida seest või väljast köetav keris",
    "spec3_4": "📏 2,5 m × 2,1 m",
    "spec4_1": "🚚 Katusekatteks kvaliteetne Icopal",
    "spec4_2": "🎨 Soovi korral saab ka enda valitud mõõdus",
    "spec4_3": "⚡ Pingutusvitsad on roostevabast terasest",
    "spec4_4": "📐 2,1 m x 2 m",
    "included_title": "Võimalik lisada komplekti",
    "inc1": "🔥 Harvia M3, Harvia M2 või Stoveman 13M kvaliteetne puuküttega keris",
    "inc2": "🏠 Vastupidav Icopal või kärgruberoid katusekate aastaringseks kasutuseks",
    "inc3": "💧 Vastupidav roostevabast terasest veepaak mugavaks kasutamiseks",
    "inc4": "⚡ Võimalus valida kaasaegne ja mugav elektrikeris",
    "inc5": "🪨 Kvaliteetsed kerisekivid parema ja pehmema leili jaoks",
    "inc6": "🧱 Kuumakindlad ja tuleohutud kaitseplaadid kerise ümbruses",
    "inc7": "🌬 Õhuvahetust parandavad ventilatsiooniavad meeldivaks leiliks",
    "inc8": "🪟 Karastatud pronksitooni klaasuks",
    "inc9": "🔐 Tugev lukustatav välisuks koos kolme võtmega",
    "gallery_eyebrow": "Galerii",
    "gallery_title": "Valminud projektid ja interjöör",
    "gallery_text": "Vaata lähemalt meie saunade disaini, sisevaateid ja viimistluslahendusi.",
    "gal1": "Uue lahendusega torusaun",
    "gal2": "Harvia puukeris",
    "gal4": "Lepast lava",
    "gal5": "Kaks Harvia puukerist",
    "gal6": "Erivärvi ovaalsaun",
    "gal7": "Termopuidust sauna sisu",
    "gal8": "Elektrikeris",
    "gal9": "Saun kliendi juures haagisel",
    "prod_eyebrow": "Tootmine ja transport",
    "prod_title": "Iga saun valmib hoolega algusest lõpuni",
    "prod_text": "Siia oleme lisanud pildid töökojast, ehitusprotsessist ja transpordist, et näha, kuidas saunad päriselt valmivad.",
    "prod1_title": "Puit ja korpus",
    "prod1_text": "Sauna seinad valmistatakse vastupidavast 40 mm puidust ning otsa- ja vaheseinad ehitatakse vastavalt valitud mudelile.",
    "prod2_title": "Sisemus ja lavad",
    "prod2_text": "Lavad, istumispingid ja põrandarestid valmistatakse lepast, mis sobib hästi sauna sisemusse.",
    "prod3_title": "Päris tootmine. Päris kvaliteet.",
    "prod3_text": "Kõik saunad valmivad meie enda töökojas käsitööna ja suure tähelepanuga igale detailile.",
    "prod4_title": "Materjal",
    "prod4_text": "Kasutame hoolikalt valitud ja kuivatatud puitu, et tagada sauna vastupidavus, stabiilsus ja ilus lõpptulemus.",
    "prod5_title": "Aluskonstruktsioon",
    "prod5_text": "Sauna alusraam valmistatakse väga tugev, mis tagab kindla toe ja pika kasutusea igal pinnasel.",
    "prod6_title": "Tõstukiga paigaldus",
    "prod6_text": "Vajadusel aitame sauna tõsta täpselt õigesse kohta, et saaksid uut sauna nautima hakata ilma lisamureta.",
    "prod7_title": "Tule ise järele",
    "prod7_text": "Soovi korral saad sauna ise järele tulla. Aitame tehase juures selle turvaliselt haagisele või transpordivahendile peale laadida.",
    "about_eyebrow": "Meist",
    "about_title": "OutDoorSauna — kvaliteetsed välisaunad otse tootjalt",
    "about_intro": "OutDoorSauna valmistab Tartumaal torusaunu, ovaalsaunu ja kandilisi välisaunu inimestele, kes hindavad korralikku käsitööd, vastupidavat materjali ja mugavat leili.",
    "about_subtitle": "Saunad, mis on tehtud päriselt kasutamiseks",
    "about_p1": "Meie eesmärk on pakkuda välisaunu, mis näevad head välja, peavad Eesti kliimas vastu ja on kasutusvalmis kohe pärast kohaletoimetamist. Valmistame saunu kvaliteetsest kuusepuidust ja termopuidust ning pöörame tähelepanu igale detailile — alates tugeva alusraami ehitusest kuni lava, kerise, korstna ja viimistluseni.",
    "about_p2": "Valikus on populaarsed torusaunad, praktilised ovaalsaunad ja kandilised saunad erinevates mõõtudes. Soovi korral saab sauna kohandada vastavalt kliendi vajadustele: valida mõõdud, puidutüüp, värvitoon, kerise lahendus, katusekate ja lisavarustus. Nii sobib saun hästi nii koduhoovi, suvilasse, veekogu äärde kui ka majutusettevõttele.",
    "about_p3": "Asume Tartu kandis Reolas ning aitame vajadusel transpordiga üle Eesti ja kokkuleppel ka mujale Euroopasse. Kui klient tuleb saunale ise järele, saame tehase juures aidata sauna turvaliselt haagisele või transpordivahendile peale laadida.",
    "about_h1": "Toru-, ovaal- ja kandilised saunad",
    "about_h1_text": "Erinevad mudelid ja mõõdud vastavalt soovile.",
    "about_h2": "Kuusepuit ja termopuit",
    "about_h2_text": "Vastupidavad materjalid Eesti ilmastikku.",
    "about_h3": "Transport üle Eesti",
    "about_h3_text": "Saun tarnitakse kokkupanduna ja kasutusvalmina.",
    "about_caption": "Pilt meie tootmisest või valminud saunast",
    "contact_eyebrow": "Pakkumine",
    "contact_title": "Küsi personaalset pakkumist",
    "contact_text": "Kirjuta, millist sauna soovid. Märgi võimalusel mudel, mõõdud, puidutüüp, värv, asukoht ja kas vajad transporti.",
    "contact_loc": "Asume Tartu kandis, Reolas",
    "contact_transport": "Transport üle Eesti ja Euroopa",
    "form_title": "Taotluse vorm",
    "form_name": "Nimi",
    "form_phone": "Telefon",
    "form_email": "E-mail",
    "form_model": "Soovitud saun",
    "form_transport_question": "Kas soovite transporti?",
    "form_location": "Asukoht",
    "form_message": "Kirjelda soovi",
    "form_submit": "Saada taotlus",
    "opt_barrel": "1-ruumiline torusaun",
    "opt_oval": "2-ruumiline torusaun",
    "opt_square": "2-ruumiline ovaalsaun",
    "opt_custom": "Eritellimus",
    "opt_other": "Muu",
    "opt_choose": "Vali...",
    "opt_yes": "Jah",
    "opt_no": "Ei",
    "opt_unsure": "Pole kindel",
    "location_placeholder": "Näiteks Tallinn, Tartu, Pärnu",
    "message_placeholder": "Näiteks: soovin 2-ruumilist torusauna, termopuidust, transpordiga Harjumaale.",
    "footer_text": "© 2026 OutDoorSauna. Kõik õigused kaitstud.",
    "status_mail": "E-kiri avaneb. Päringu saatmiseks vajuta seal Send/Saada.",
    "status_wait": "Palun oota...",
    "status_sent_btn": "Saadetud ✓",
    "status_success": "Aitäh! Võtame teiega ühendust esimesel võimalusel.",
    "status_error": "Vormi automaatne saatmine ei õnnestunud. Ava e-kiri ja vajuta Send/Saada.",
    "toast_success": "✓ Päring edukalt saadetud",
    "mail_subject": "Sauna pakkumise taotlus",
    "mail_name": "Nimi",
    "mail_phone": "Telefon",
    "mail_email": "E-mail",
    "mail_model": "Soovitud saun",
    "mail_transport": "Transport",
    "mail_location": "Asukoht",
    "mail_description": "Kirjeldus",
    "gal10": "Valgustusega torusaun, mis on valmistatud eritellimusel",
    "gal11": "Tellija soovide järgi valmistatud valgustusega torusaun",
    "prod8_title": "Turvaline peale laadimine",
    "prod8_text": "Valmis saun tõstetakse kraanaga ettevaatlikult transpordivahendile. Kasutame turvalisi tõstevahendeid, et saun jõuaks kliendini täpselt samas seisukorras nagu meie töökojast lahkudes.",
    "prod9_title": "Valmis saun kliendile",
    "prod9_text": "Toimetame saunad turvaliselt klientideni üle Eesti ning kokkuleppel ka Euroopasse."
  },
  "en": {
    "meta_title": "OutDoorSauna | Barrel, oval and square saunas",
    "meta_description": "OutDoorSauna builds barrel, oval and square outdoor saunas directly from the manufacturer. Ask for an offer for a thermowood or spruce sauna across Estonia.",
    "meta_og_title": "OutDoorSauna | Outdoor saunas direct from the manufacturer",
    "meta_og_description": "High-quality barrel, oval and square saunas. Delivery across Estonia and Europe.",
    "brand_aria": "OutDoorSauna home",
    "prev_image": "Previous image",
    "next_image": "Next image",
    "close_image": "Close enlarged image",
    "lang_button": "Language: English",
    "topbar": "🇪🇪 Barrel, oval and square saunas direct from the manufacturer • Delivery across Estonia and Europe",
    "nav_home": "Home",
    "nav_products": "Models",
    "nav_gallery": "Gallery",
    "nav_production": "Production",
    "nav_about": "About us",
    "nav_contact": "Request an offer",
    "hero_pill": "🔥 Direct from the manufacturer in Tartu County",
    "hero_title": "Barrel, oval and square saunas",
    "hero_text": "We build high-quality outdoor saunas from thermowood and spruce. The saunas are delivered fully assembled, and we can help with transport across Estonia and Europe.",
    "hero_btn1": "View models",
    "hero_btn2": "Request an offer",
    "quick_1_title": "Material",
    "quick_1_text": "We use high-quality spruce and thermowood for durability, good heat retention and an elegant look in every season.",
    "quick_2_title": "Different models",
    "quick_2_text": "Choose from barrel, oval and square saunas in different sizes and layouts. A fully custom-made sauna is also possible.",
    "quick_3_title": "Colour options",
    "quick_3_text": "Choose the tone and finish for your sauna – different combinations for wood, roofing and details are available so the sauna fits your home or summer house perfectly.",
    "quick_4_title": "Transport",
    "quick_4_text": "We offer safe and convenient delivery across Estonia and, by agreement, across Europe. Installation assistance is also available if needed.",
    "home_eyebrow": "Why our saunas?",
    "home_title": "Steam that lasts for years — a quality outdoor sauna direct from the manufacturer.",
    "home_text": "Every sauna is built from quality materials and delivered fully assembled and ready to use. Perfect for a home garden, summer house, lakeside location or accommodation business.",
    "home_li1": "Complete solution – heater, chimney and sauna stones available as a set",
    "home_li2": "Durable spruce and thermowood saunas",
    "home_li3": "Available in different sizes, colours and layouts",
    "home_li4": "Transport and installation assistance across Estonia and Europe",
    "products_eyebrow": "Models",
    "products_title": "Choose a sauna or ask for a custom solution",
    "products_text": "The models below give an overview of our main solutions. Every sauna can be customised according to your wishes.",
    "product1_badge": "Popular",
    "product1_title": "2-room barrel sauna",
    "product1_text": "A spacious barrel sauna with a practical changing room and steam room. A good fit for family or friends.",
    "product2_badge": "Very spacious",
    "product2_title": "2-room oval sauna",
    "product2_text": "A well-designed oval sauna with a practical changing room and comfortable steam room.",
    "product3_badge": "Compact",
    "product3_title": "Barrel sauna with terrace",
    "product3_text": "A compact thermowood barrel sauna for a smaller garden, lakeside location or trailer installation.",
    "product4_badge": "Minimalist",
    "product4_title": "1-room barrel sauna",
    "product4_text": "A compact 1-room barrel sauna for those who want a simple and practical solution for a garden, summer house or lakeside location.",
    "ask_offer": "Request an offer",
    "vat": "+ VAT",
    "spec1_1": "📏 3.8 m × 2.1 m",
    "spec1_2": "🔥 Harvia M3 heater",
    "spec_water": "💧 35L water tank",
    "spec1_4": "🚪 Lockable exterior door",
    "spec2_1": "📏 4 m × 2.4 m",
    "spec2_2": "🪵 Alder benches",
    "spec2_4": "🌲 Spruce or thermowood",
    "spec3_1": "🏕 Ideal for a trailer",
    "spec3_2": "🪵 Made from thermowood",
    "spec3_3": "🔥 Choice of internal or external wood-fired heater",
    "spec3_4": "📏 2,5 m × 2,1 m",
    "spec4_1": "🚚 Quality Icopal roofing",
    "spec4_2": "🎨 Custom size available on request",
    "spec4_3": "⚡ Stainless steel tightening bands",
    "spec4_4": "📐 2,1 m x 2 m",
    "included_title": "Available additions",
    "inc1": "🔥 Quality wood-fired Harvia M3, Harvia M2 or Stoveman 13M heater",
    "inc2": "🏠 Durable Icopal or bitumen shingle roofing for year-round use",
    "inc3": "💧 Durable stainless-steel water tank for convenient use",
    "inc4": "⚡ Option for a modern and convenient electric heater",
    "inc5": "🪨 Quality sauna stones for softer, better steam",
    "inc6": "🧱 Heat-resistant and fire-safe protective boards around the heater",
    "inc7": "🌬 Ventilation openings for better air exchange and pleasant steam",
    "inc8": "🪟 Tempered bronze-tinted glass door",
    "inc9": "🔐 Strong lockable exterior door with three keys",
    "gallery_eyebrow": "Gallery",
    "gallery_title": "Completed projects and interiors",
    "gallery_text": "Take a closer look at our sauna designs, interior views and finish options.",
    "gal1": "Barrel sauna with a new solution",
    "gal2": "Harvia wood-fired heater",
    "gal4": "Alder sauna bench",
    "gal5": "Two Harvia wood-fired heaters",
    "gal6": "Oval sauna in a custom colour",
    "gal7": "Thermowood sauna interior",
    "gal8": "Electric heater",
    "gal9": "Sauna on a trailer at the client’s site",
    "prod_eyebrow": "Production and transport",
    "prod_title": "Every sauna is carefully built from start to finish",
    "prod_text": "Here you can see photos from the workshop, the building process and transport, showing how the saunas are actually made.",
    "prod1_title": "Wood and body",
    "prod1_text": "The sauna walls are made from durable 40 mm wood, and the end and partition walls are built according to the selected model.",
    "prod2_title": "Interior and benches",
    "prod2_text": "The benches, seating and floor grates are made from alder, which suits sauna interiors very well.",
    "prod3_title": "Real production. Real quality.",
    "prod3_text": "All saunas are handcrafted in our own workshop with great attention to every detail.",
    "prod4_title": "Material",
    "prod4_text": "We use carefully selected and dried wood to ensure durability, stability and a beautiful final result.",
    "prod5_title": "Base construction",
    "prod5_text": "The sauna base frame is built very strong, ensuring solid support and a long service life on any surface.",
    "prod6_title": "Crane installation",
    "prod6_text": "If needed, we help lift the sauna exactly into place so you can start enjoying it without extra worries.",
    "prod7_title": "Pick it up yourself",
    "prod7_text": "You can also pick up the sauna yourself. At the factory, we help load it safely onto your trailer or transport vehicle.",
    "about_eyebrow": "About us",
    "about_title": "OutDoorSauna — quality outdoor saunas direct from the manufacturer",
    "about_intro": "OutDoorSauna builds barrel saunas, oval saunas and square outdoor saunas in Tartu County for people who value proper craftsmanship, durable materials and comfortable steam.",
    "about_subtitle": "Saunas made for real everyday use",
    "about_p1": "Our goal is to offer outdoor saunas that look good, withstand the Estonian climate and are ready to use after delivery. We build saunas from quality spruce and thermowood and pay attention to every detail, from the strong base frame to the benches, heater, chimney and finish.",
    "about_p2": "Our selection includes popular barrel saunas, practical oval saunas and square saunas in different sizes. The sauna can be customised by dimensions, wood type, colour, heater solution, roofing and extras. This makes it suitable for a home garden, summer house, lakeside property or accommodation business.",
    "about_p3": "We are located near Tartu in Reola and can help with transport across Estonia and, by agreement, elsewhere in Europe. If the client picks up the sauna themselves, we can help load it safely onto a trailer or transport vehicle at the factory.",
    "about_h1": "Barrel, oval and square saunas",
    "about_h1_text": "Different models and sizes according to your wishes.",
    "about_h2": "Spruce and thermowood",
    "about_h2_text": "Durable materials for Estonian weather.",
    "about_h3": "Delivery across Estonia",
    "about_h3_text": "The sauna is delivered assembled and ready to use.",
    "about_caption": "Photo from our production or a completed sauna",
    "contact_eyebrow": "Offer",
    "contact_title": "Request a personal offer",
    "contact_text": "Write what kind of sauna you would like. If possible, include the model, dimensions, wood type, colour, location and whether you need transport.",
    "contact_loc": "We are located near Tartu, in Reola",
    "contact_transport": "Transport across Estonia and Europe",
    "form_title": "Request form",
    "form_name": "Name",
    "form_phone": "Phone",
    "form_email": "E-mail",
    "form_model": "Desired sauna",
    "form_transport_question": "Do you need transport?",
    "form_location": "Location",
    "form_message": "Describe your request",
    "form_submit": "Send request",
    "opt_barrel": "1-room barrel sauna",
    "opt_oval": "2-room barrel sauna",
    "opt_square": "2-room oval sauna",
    "opt_custom": "Custom order",
    "opt_other": "Other",
    "opt_choose": "Choose...",
    "opt_yes": "Yes",
    "opt_no": "No",
    "opt_unsure": "Not sure",
    "location_placeholder": "For example Tallinn, Tartu, Pärnu",
    "message_placeholder": "For example: I would like a 2-room barrel sauna, made from thermowood, with delivery to Harju County.",
    "footer_text": "© 2026 OutDoorSauna. All rights reserved.",
    "status_mail": "Your email app will open. To send the request, press Send there.",
    "status_wait": "Please wait...",
    "status_sent_btn": "Sent ✓",
    "status_success": "Thank you! We will contact you as soon as possible.",
    "status_error": "Automatic form sending failed. Open the email and press Send.",
    "toast_success": "✓ Request sent successfully",
    "mail_subject": "Sauna offer request",
    "mail_name": "Name",
    "mail_phone": "Phone",
    "mail_email": "E-mail",
    "mail_model": "Desired sauna",
    "mail_transport": "Transport",
    "mail_location": "Location",
    "mail_description": "Description",
    "gal10": "Custom-made barrel sauna with lighting",
    "gal11": "Barrel sauna with lighting, built according to the customer’s wishes",
    "prod8_title": "Safe loading",
    "prod8_text": "The finished sauna is carefully lifted onto the transport vehicle with a crane. We use safe lifting equipment so the sauna reaches the client in exactly the same condition as when it leaves our workshop.",
    "prod9_title": "Finished sauna delivered to the client",
    "prod9_text": "We deliver saunas safely to clients across Estonia and, by agreement, across Europe."
  },
  "ru": {
    "meta_title": "OutDoorSauna | Бани-бочки, овальные и прямоугольные бани",
    "meta_description": "OutDoorSauna изготавливает бани-бочки, овальные и прямоугольные уличные бани напрямую от производителя. Запросите предложение на баню из термодревесины или ели по всей Эстонии.",
    "meta_og_title": "OutDoorSauna | Уличные бани напрямую от производителя",
    "meta_og_description": "Качественные бани-бочки, овальные и прямоугольные бани. Доставка по Эстонии и Европе.",
    "brand_aria": "Главная OutDoorSauna",
    "prev_image": "Предыдущее изображение",
    "next_image": "Следующее изображение",
    "close_image": "Закрыть увеличенное изображение",
    "lang_button": "Язык: Русский",
    "topbar": "🇪🇪 Бани-бочки, овальные и прямоугольные бани напрямую от производителя • Доставка по Эстонии и Европе",
    "nav_home": "Главная",
    "nav_products": "Модели",
    "nav_gallery": "Галерея",
    "nav_production": "Производство",
    "nav_about": "О нас",
    "nav_contact": "Запросить предложение",
    "hero_pill": "🔥 Напрямую от производителя в Тартумаа",
    "hero_title": "Бани-бочки, овальные и прямоугольные бани",
    "hero_text": "Мы изготавливаем качественные уличные бани из термодревесины и ели. Бани поставляются полностью собранными, при необходимости поможем с доставкой по Эстонии и Европе.",
    "hero_btn1": "Смотреть модели",
    "hero_btn2": "Запросить предложение",
    "quick_1_title": "Материал",
    "quick_1_text": "Мы используем качественную ель и термодревесину, которые обеспечивают прочность, хорошее удержание тепла и элегантный вид в любую погоду.",
    "quick_2_title": "Разные модели",
    "quick_2_text": "В наличии бани-бочки, овальные и прямоугольные бани разных размеров и планировок. Возможен полностью индивидуальный заказ.",
    "quick_3_title": "Выбор цветов",
    "quick_3_text": "Выберите подходящий оттенок и отделку — доступны разные сочетания цветов древесины, кровли и деталей, чтобы баня идеально подошла к дому или даче.",
    "quick_4_title": "Доставка",
    "quick_4_text": "Предлагаем безопасную и удобную доставку по Эстонии, а по договоренности и по Европе. При необходимости поможем с установкой.",
    "home_eyebrow": "Почему наши бани?",
    "home_title": "Пар, который служит годами — качественная уличная баня напрямую от производителя.",
    "home_text": "Каждая баня изготавливается из качественных материалов и поставляется полностью собранной и готовой к использованию. Отлично подходит для двора, дачи, берега водоема или гостевого комплекса.",
    "home_li1": "Полное решение — печь, дымоход и камни доступны в комплекте",
    "home_li2": "Прочные бани из ели и термодревесины",
    "home_li3": "Возможность заказать разные размеры, цвета и решения",
    "home_li4": "Доставка и помощь с установкой по Эстонии и Европе",
    "products_eyebrow": "Модели",
    "products_title": "Выберите подходящую баню или запросите индивидуальный заказ",
    "products_text": "Модели ниже дают обзор наших основных решений. Каждую баню можно адаптировать под ваши пожелания.",
    "product1_badge": "Популярная",
    "product1_title": "2-комнатная баня-бочка",
    "product1_text": "Просторная баня-бочка с практичной раздевалкой и парной. Хорошо подходит для семьи или компании друзей.",
    "product2_badge": "Очень просторная",
    "product2_title": "2-комнатная овальная баня",
    "product2_text": "Овальная баня с продуманным дизайном, практичной раздевалкой и удобной парной.",
    "product3_badge": "Компактная",
    "product3_title": "Баня-бочка с террасой",
    "product3_text": "Компактная баня-бочка из термодревесины для небольшого сада, берега водоема или установки на прицеп.",
    "product4_badge": "Минималистичная",
    "product4_title": "1-комнатная баня-бочка",
    "product4_text": "Компактная 1-комнатная баня-бочка для тех, кто хочет простое и практичное решение для двора, дачи или берега водоема.",
    "ask_offer": "Запросить предложение",
    "vat": "+ НДС",
    "spec1_1": "📏 3.8 m × 2.1 m",
    "spec1_2": "🔥 Печь Harvia M3",
    "spec_water": "💧 Бак для воды 35 л",
    "spec1_4": "🚪 Запираемая наружная дверь",
    "spec2_1": "📏 4 m × 2.4 m",
    "spec2_2": "🪵 Полки из ольхи",
    "spec2_4": "🌲 Ель или термодревесина",
    "spec3_1": "🏕 Идеально подходит для прицепа",
    "spec3_2": "🪵 Изготовлена из термодревесины",
    "spec3_3": "🔥 Можно выбрать печь с топкой изнутри или снаружи",
    "spec3_4": "📏 2,5 m × 2,1 m",
    "spec4_1": "🚚 Качественная кровля Icopal",
    "spec4_2": "🎨 По желанию можно заказать свой размер",
    "spec4_3": "⚡ Обручи из нержавеющей стали",
    "spec4_4": "📐 2,1 m x 2 m",
    "included_title": "Можно добавить в комплект",
    "inc1": "🔥 Качественная дровяная печь Harvia M3, Harvia M2 или Stoveman 13M",
    "inc2": "🏠 Прочная кровля Icopal или битумная черепица для круглогодичного использования",
    "inc3": "💧 Прочный бак для воды из нержавеющей стали для удобного использования",
    "inc4": "⚡ Возможность выбрать современную и удобную электрическую печь",
    "inc5": "🪨 Качественные камни для более мягкого и приятного пара",
    "inc6": "🧱 Жаростойкие и пожаробезопасные защитные плиты вокруг печи",
    "inc7": "🌬 Вентиляционные отверстия для лучшего воздухообмена и приятного пара",
    "inc8": "🪟 Закаленная стеклянная дверь бронзового оттенка",
    "inc9": "🔐 Прочная запираемая наружная дверь с тремя ключами",
    "gallery_eyebrow": "Галерея",
    "gallery_title": "Готовые проекты и интерьер",
    "gallery_text": "Посмотрите дизайн наших бань, виды интерьера и варианты отделки.",
    "gal1": "Баня-бочка с новым решением",
    "gal2": "Дровяная печь Harvia",
    "gal4": "Полок из ольхи",
    "gal5": "Две дровяные печи Harvia",
    "gal6": "Овальная баня в другом цвете",
    "gal7": "Интерьер бани из термодревесины",
    "gal8": "Электрическая печь",
    "gal9": "Баня у клиента на прицепе",
    "prod_eyebrow": "Производство и доставка",
    "prod_title": "Каждая баня тщательно создается от начала до конца",
    "prod_text": "Здесь добавлены фотографии из мастерской, процесса сборки и доставки, чтобы было видно, как бани создаются на самом деле.",
    "prod1_title": "Дерево и корпус",
    "prod1_text": "Стены бани изготавливаются из прочной древесины толщиной 40 мм, а торцевые и перегородочные стены строятся по выбранной модели.",
    "prod2_title": "Интерьер и полки",
    "prod2_text": "Полки, сиденья и напольные решетки изготавливаются из ольхи, которая хорошо подходит для интерьера бани.",
    "prod3_title": "Настоящее производство. Настоящее качество.",
    "prod3_text": "Все бани изготавливаются вручную в нашей мастерской с большим вниманием к каждой детали.",
    "prod4_title": "Материал",
    "prod4_text": "Мы используем тщательно отобранную и высушенную древесину, чтобы обеспечить прочность, стабильность и красивый итоговый результат.",
    "prod5_title": "Основание",
    "prod5_text": "Основание бани делается очень прочным, что обеспечивает надежную опору и долгий срок службы на любой поверхности.",
    "prod6_title": "Установка подъемником",
    "prod6_text": "При необходимости поможем поднять баню точно на нужное место, чтобы вы могли пользоваться ею без лишних забот.",
    "prod7_title": "Самовывоз",
    "prod7_text": "При желании вы можете забрать баню сами. На производстве мы поможем безопасно погрузить ее на прицеп или транспорт.",
    "about_eyebrow": "О нас",
    "about_title": "OutDoorSauna — качественные уличные бани напрямую от производителя",
    "about_intro": "OutDoorSauna изготавливает в Тартумаа бани-бочки, овальные и прямоугольные уличные бани для тех, кто ценит качественную работу, прочные материалы и хороший пар.",
    "about_subtitle": "Бани, созданные для реального использования",
    "about_p1": "Наша цель — предлагать уличные бани, которые хорошо выглядят, выдерживают климат Эстонии и готовы к использованию после доставки. Мы используем качественную ель и термодревесину и уделяем внимание каждой детали — от прочного основания до полков, печи, дымохода и отделки.",
    "about_p2": "В ассортименте есть популярные бани-бочки, практичные овальные бани и прямоугольные бани разных размеров. Баню можно адаптировать под пожелания клиента: выбрать размеры, тип древесины, цвет, печь, кровлю и дополнительное оснащение.",
    "about_p3": "Мы находимся рядом с Тарту, в Реола, и при необходимости помогаем с доставкой по Эстонии и по договоренности в другие страны Европы. Если клиент забирает баню сам, мы можем помочь безопасно погрузить ее на прицеп или транспорт.",
    "about_h1": "Бани-бочки, овальные и прямоугольные бани",
    "about_h1_text": "Разные модели и размеры по желанию.",
    "about_h2": "Ель и термодревесина",
    "about_h2_text": "Прочные материалы для климата Эстонии.",
    "about_h3": "Доставка по Эстонии",
    "about_h3_text": "Баня поставляется собранной и готовой к использованию.",
    "about_caption": "Фото производства или готовой бани",
    "contact_eyebrow": "Предложение",
    "contact_title": "Запросите персональное предложение",
    "contact_text": "Напишите, какую баню вы хотите. По возможности укажите модель, размеры, тип древесины, цвет, место и нужна ли доставка.",
    "contact_loc": "Мы находимся рядом с Тарту, в Реола",
    "contact_transport": "Доставка по Эстонии и Европе",
    "form_title": "Форма запроса",
    "form_name": "Имя",
    "form_phone": "Телефон",
    "form_email": "E-mail",
    "form_model": "Желаемая баня",
    "form_transport_question": "Нужна ли доставка?",
    "form_location": "Местоположение",
    "form_message": "Опишите пожелание",
    "form_submit": "Отправить запрос",
    "opt_barrel": "1-комнатная баня-бочка",
    "opt_oval": "2-комнатная баня-бочка",
    "opt_square": "2-комнатная овальная баня",
    "opt_custom": "Индивидуальный заказ",
    "opt_other": "Другое",
    "opt_choose": "Выберите...",
    "opt_yes": "Да",
    "opt_no": "Нет",
    "opt_unsure": "Не уверен(а)",
    "location_placeholder": "Например Таллинн, Тарту, Пярну",
    "message_placeholder": "Например: хочу 2-комнатную баню-бочку из термодревесины с доставкой в Харьюмаа.",
    "footer_text": "© 2026 OutDoorSauna. Все права защищены.",
    "status_mail": "Откроется e-mail. Чтобы отправить запрос, нажмите Send/Отправить.",
    "status_wait": "Пожалуйста, подождите...",
    "status_sent_btn": "Отправлено ✓",
    "status_success": "Спасибо! Мы свяжемся с вами при первой возможности.",
    "status_error": "Автоматическая отправка формы не удалась. Откройте e-mail и нажмите Send/Отправить.",
    "toast_success": "✓ Запрос успешно отправлен",
    "mail_subject": "Запрос предложения на баню",
    "mail_name": "Имя",
    "mail_phone": "Телефон",
    "mail_email": "E-mail",
    "mail_model": "Желаемая баня",
    "mail_transport": "Доставка",
    "mail_location": "Местоположение",
    "mail_description": "Описание",
    "gal10": "Баня-бочка с подсветкой, изготовленная по индивидуальному заказу",
    "gal11": "Баня-бочка с подсветкой, изготовленная по пожеланиям заказчика",
    "prod8_title": "Безопасная погрузка",
    "prod8_text": "Готовую баню аккуратно поднимают краном на транспортное средство. Мы используем безопасные подъемные средства, чтобы баня дошла до клиента в таком же состоянии, как при отправке из нашей мастерской.",
    "prod9_title": "Готовая баня клиенту",
    "prod9_text": "Мы безопасно доставляем бани клиентам по всей Эстонии и по договоренности также в Европу."
  },
  "sv": {
    "meta_title": "OutDoorSauna | Tunn-, oval- och fyrkantiga bastur",
    "meta_description": "OutDoorSauna tillverkar tunn-, oval- och fyrkantiga utomhusbastur direkt från tillverkaren. Be om offert på en bastu i thermoträ eller gran i hela Estland.",
    "meta_og_title": "OutDoorSauna | Utomhusbastur direkt från tillverkaren",
    "meta_og_description": "Högkvalitativa tunn-, oval- och fyrkantiga bastur. Transport i Estland och Europa.",
    "brand_aria": "OutDoorSauna startsida",
    "prev_image": "Föregående bild",
    "next_image": "Nästa bild",
    "close_image": "Stäng förstorad bild",
    "lang_button": "Språk: Svenska",
    "topbar": "🇪🇪 Tunn-, oval- och fyrkantiga bastur direkt från tillverkaren • Transport i Estland och Europa",
    "nav_home": "Startsida",
    "nav_products": "Modeller",
    "nav_gallery": "Galleri",
    "nav_production": "Tillverkning",
    "nav_about": "Om oss",
    "nav_contact": "Begär offert",
    "hero_pill": "🔥 Direkt från tillverkaren i Tartumaa",
    "hero_title": "Tunn-, oval- och fyrkantiga bastur",
    "hero_text": "Vi tillverkar högkvalitativa utomhusbastur av thermoträ och gran. Basturna levereras färdigmonterade och vid behov hjälper vi med transport i Estland och Europa.",
    "hero_btn1": "Se modeller",
    "hero_btn2": "Begär offert",
    "quick_1_title": "Material",
    "quick_1_text": "Vi använder högkvalitativ gran och thermoträ som ger hållbarhet, god värmehållning och ett elegant utseende i alla väder.",
    "quick_2_title": "Olika modeller",
    "quick_2_text": "Vi erbjuder tunn-, oval- och fyrkantiga bastur i olika storlekar och lösningar. En helt specialbyggd bastu är också möjlig.",
    "quick_3_title": "Färgval",
    "quick_3_text": "Välj ton och ytbehandling för din bastu – olika kombinationer för trä, tak och detaljer finns så att bastun passar perfekt till hemmet eller sommarstugan.",
    "quick_4_title": "Transport",
    "quick_4_text": "Vi erbjuder säker och bekväm transport i Estland och enligt överenskommelse även i Europa. Vid behov hjälper vi också med installation.",
    "home_eyebrow": "Varför våra bastur?",
    "home_title": "Bastuånga som håller i många år — en kvalitetsbastu direkt från tillverkaren.",
    "home_text": "Varje bastu byggs av kvalitetsmaterial och levereras färdigmonterad och klar att använda. Passar perfekt på gården, vid sommarstugan, vid vattnet eller för boendeverksamhet.",
    "home_li1": "Komplett lösning – kamin, skorsten och bastustenar kan fås som paket",
    "home_li2": "Hållbara bastur av gran och thermoträ",
    "home_li3": "Kan beställas i olika storlekar, färger och utföranden",
    "home_li4": "Transport och vid behov installationshjälp i Estland och Europa",
    "products_eyebrow": "Modeller",
    "products_title": "Välj en lämplig bastu eller be om en speciallösning",
    "products_text": "Modellerna nedan ger en översikt över våra viktigaste lösningar. Alla bastur kan anpassas efter dina önskemål.",
    "product1_badge": "Populär",
    "product1_title": "2-rums tunnbastu",
    "product1_text": "En rymlig tunnbastu med ett praktiskt förrum och basturum. Passar bra för familjen eller en grupp vänner.",
    "product2_badge": "Mycket rymlig",
    "product2_title": "2-rums oval bastu",
    "product2_text": "En välplanerad oval bastu med praktiskt förrum och bekvämt basturum.",
    "product3_badge": "Kompakt",
    "product3_title": "Tunnbastu med terrass",
    "product3_text": "En kompakt tunnbastu i thermoträ för en mindre trädgård, vid vattnet eller för montering på släp.",
    "product4_badge": "Minimalistisk",
    "product4_title": "1-rums tunnbastu",
    "product4_text": "En kompakt 1-rums tunnbastu för dig som vill ha en enkel och praktisk lösning till gården, sommarstugan eller vid vattnet.",
    "ask_offer": "Begär offert",
    "vat": "+ moms",
    "spec1_1": "📏 3,8 m × 2,1 m",
    "spec1_2": "🔥 Harvia M3-kamin",
    "spec_water": "💧 35 l vattentank",
    "spec1_4": "🚪 Låsbar ytterdörr",
    "spec2_1": "📏 4 m × 2,4 m",
    "spec2_2": "🪵 Bastulavar av al",
    "spec2_4": "🌲 Gran eller thermoträ",
    "spec3_1": "🏕 Passar utmärkt på släp",
    "spec3_2": "🪵 Tillverkad av thermoträ",
    "spec3_3": "🔥 Möjlighet att välja inifrån- eller utifråneldad kamin",
    "spec3_4": "📏 2,5 m × 2,1 m",
    "spec4_1": "🚚 Kvalitativ Icopal-takbeläggning",
    "spec4_2": "🎨 Egen storlek kan beställas på begäran",
    "spec4_3": "⚡ Spännband i rostfritt stål",
    "spec4_4": "📐 2,1 m x 2 m",
    "included_title": "Möjliga tillval",
    "inc1": "🔥 Kvalitativ vedeldad Harvia M3-, Harvia M2- eller Stoveman 13M-kamin",
    "inc2": "🏠 Hållbar Icopal- eller bitumenshingel-takbeläggning för året runt-bruk",
    "inc3": "💧 Hållbar vattentank i rostfritt stål för bekväm användning",
    "inc4": "⚡ Möjlighet att välja en modern och bekväm elaggregat",
    "inc5": "🪨 Kvalitativa bastustenar för mjukare och bättre ånga",
    "inc6": "🧱 Värmebeständiga och brandsäkra skyddsskivor runt kaminen",
    "inc7": "🌬 Ventilationsöppningar som förbättrar luftväxlingen och ger behaglig ånga",
    "inc8": "🪟 Härdad bronsfärgad glasdörr",
    "inc9": "🔐 Stark låsbar ytterdörr med tre nycklar",
    "gallery_eyebrow": "Galleri",
    "gallery_title": "Färdiga projekt och interiör",
    "gallery_text": "Se närmare på våra bastudesigner, interiörer och olika finishlösningar.",
    "gal1": "Tunnbastu med ny lösning",
    "gal2": "Harvia vedkamin",
    "gal4": "Bastulave av al",
    "gal5": "Två Harvia vedkaminer",
    "gal6": "Oval bastu i avvikande färg",
    "gal7": "Bastuinredning i thermoträ",
    "gal8": "Elaggregat",
    "gal9": "Bastu hos kund på släp",
    "prod_eyebrow": "Tillverkning och transport",
    "prod_title": "Varje bastu byggs omsorgsfullt från början till slut",
    "prod_text": "Här har vi lagt till bilder från verkstaden, byggprocessen och transporten så att du kan se hur basturna faktiskt blir till.",
    "prod1_title": "Trä och stomme",
    "prod1_text": "Bastuväggarna tillverkas av hållbart 40 mm trä, och gavel- och mellanväggar byggs enligt vald modell.",
    "prod2_title": "Interiör och lavar",
    "prod2_text": "Lavar, sittbänkar och golvgaller tillverkas av al, vilket passar mycket bra i bastumiljö.",
    "prod3_title": "Riktig tillverkning. Riktig kvalitet.",
    "prod3_text": "Alla bastur byggs för hand i vår egen verkstad med stor noggrannhet i varje detalj.",
    "prod4_title": "Material",
    "prod4_text": "Vi använder noggrant utvalt och torkat trä för att säkerställa hållbarhet, stabilitet och ett vackert slutresultat.",
    "prod5_title": "Grundkonstruktion",
    "prod5_text": "Bastuns basram byggs mycket stark, vilket ger säkert stöd och lång livslängd på alla underlag.",
    "prod6_title": "Montering med lyftanordning",
    "prod6_text": "Vid behov hjälper vi till att lyfta bastun exakt på rätt plats, så att du kan börja njuta av den utan extra bekymmer.",
    "prod7_title": "Hämta själv",
    "prod7_text": "Om du vill kan du hämta bastun själv. Vid fabriken hjälper vi till att lasta den säkert på släp eller transportfordon.",
    "about_eyebrow": "Om oss",
    "about_title": "OutDoorSauna — kvalitativa utomhusbastur direkt från tillverkaren",
    "about_intro": "OutDoorSauna tillverkar tunnbastur, ovala bastur och fyrkantiga utomhusbastur i Tartu län för kunder som uppskattar hantverk, hållbara material och bra bastubad.",
    "about_subtitle": "Bastur byggda för verklig användning",
    "about_p1": "Vårt mål är att erbjuda utomhusbastur som ser bra ut, klarar det estniska klimatet och är redo att användas efter leverans. Vi bygger bastur av kvalitetsgran och termoträ och fokuserar på detaljer från grundram till lavar, kamin, skorsten och ytbehandling.",
    "about_p2": "I vårt sortiment finns populära tunnbastur, praktiska ovala bastur och fyrkantiga bastur i olika storlekar. Bastun kan anpassas efter kundens önskemål med mått, träslag, färg, kaminlösning, tak och extra utrustning.",
    "about_p3": "Vi finns nära Tartu i Reola och hjälper vid behov med transport i hela Estland och enligt överenskommelse även i Europa. Om kunden hämtar själv kan vi hjälpa till att lasta bastun säkert på släp eller transportfordon.",
    "about_h1": "Tunn-, ovala och fyrkantiga bastur",
    "about_h1_text": "Olika modeller och mått enligt önskemål.",
    "about_h2": "Gran och termoträ",
    "about_h2_text": "Hållbara material för estniskt väder.",
    "about_h3": "Transport i hela Estland",
    "about_h3_text": "Bastun levereras monterad och klar att använda.",
    "about_caption": "Bild från vår produktion eller en färdig bastu",
    "contact_eyebrow": "Offert",
    "contact_title": "Begär en personlig offert",
    "contact_text": "Skriv vilken typ av bastu du önskar. Ange gärna modell, mått, träslag, färg, plats och om du behöver transport.",
    "contact_loc": "Vi finns nära Tartu, i Reola",
    "contact_transport": "Transport i Estland och Europa",
    "form_title": "Offertformulär",
    "form_name": "Namn",
    "form_phone": "Telefon",
    "form_email": "E-post",
    "form_model": "Önskad bastu",
    "form_transport_question": "Behöver du transport?",
    "form_location": "Plats",
    "form_message": "Beskriv din önskan",
    "form_submit": "Skicka förfrågan",
    "opt_barrel": "1-rums tunnbastu",
    "opt_oval": "2-rums tunnbastu",
    "opt_square": "2-rums oval bastu",
    "opt_custom": "Specialbeställning",
    "opt_other": "Annat",
    "opt_choose": "Välj...",
    "opt_yes": "Ja",
    "opt_no": "Nej",
    "opt_unsure": "Inte säker",
    "location_placeholder": "Till exempel Tallinn, Tartu, Pärnu",
    "message_placeholder": "Till exempel: jag vill ha en 2-rums tunnbastu i thermoträ med transport till Harjumaa.",
    "footer_text": "© 2026 OutDoorSauna. Alla rättigheter förbehållna.",
    "status_mail": "E-postprogrammet öppnas. Tryck på Skicka där för att skicka förfrågan.",
    "status_wait": "Vänligen vänta...",
    "status_sent_btn": "Skickat ✓",
    "status_success": "Tack! Vi kontaktar dig så snart som möjligt.",
    "status_error": "Automatisk formulärsändning misslyckades. Öppna e-postmeddelandet och tryck på Skicka.",
    "toast_success": "✓ Förfrågan skickad",
    "mail_subject": "Offertförfrågan för bastu",
    "mail_name": "Namn",
    "mail_phone": "Telefon",
    "mail_email": "E-post",
    "mail_model": "Önskad bastu",
    "mail_transport": "Transport",
    "mail_location": "Plats",
    "mail_description": "Beskrivning",
    "gal10": "Specialtillverkad tunnbastu med belysning",
    "gal11": "Tunnbastu med belysning tillverkad enligt kundens önskemål",
    "prod8_title": "Säker lastning",
    "prod8_text": "Den färdiga bastun lyfts försiktigt med kran på transportfordonet. Vi använder säkra lyftredskap så att bastun når kunden i samma skick som när den lämnar vår verkstad.",
    "prod9_title": "Färdig bastu till kunden",
    "prod9_text": "Vi levererar bastur säkert till kunder i hela Estland och enligt överenskommelse även till Europa."
  },
  "fi": {
    "meta_title": "OutDoorSauna | Tynnyri-, ovaali- ja suorakulmaiset saunat",
    "meta_description": "OutDoorSauna valmistaa tynnyri-, ovaali- ja suorakulmaisia ulkosaunoja suoraan valmistajalta. Pyydä tarjous lämpöpuu- tai kuusisaunasta koko Viroon.",
    "meta_og_title": "OutDoorSauna | Ulkosaunat suoraan valmistajalta",
    "meta_og_description": "Laadukkaat tynnyri-, ovaali- ja suorakulmaiset saunat. Kuljetus Viroon ja Eurooppaan.",
    "brand_aria": "OutDoorSauna etusivu",
    "prev_image": "Edellinen kuva",
    "next_image": "Seuraava kuva",
    "close_image": "Sulje suurennettu kuva",
    "lang_button": "Kieli: Suomi",
    "topbar": "🇪🇪 Tynnyri-, ovaali- ja suorakulmaiset saunat suoraan valmistajalta • Kuljetus Viroon ja Eurooppaan",
    "nav_home": "Etusivu",
    "nav_products": "Mallit",
    "nav_gallery": "Galleria",
    "nav_production": "Valmistus",
    "nav_about": "Meistä",
    "nav_contact": "Pyydä tarjous",
    "hero_pill": "🔥 Suoraan valmistajalta Tartumaalta",
    "hero_title": "Tynnyri-, ovaali- ja suorakulmaiset saunat",
    "hero_text": "Valmistamme laadukkaita ulkosaunoja lämpöpuusta ja kuusesta. Saunat toimitetaan valmiiksi koottuina, ja tarvittaessa autamme kuljetuksessa Viroon ja Eurooppaan.",
    "hero_btn1": "Katso mallit",
    "hero_btn2": "Pyydä tarjous",
    "quick_1_title": "Materiaali",
    "quick_1_text": "Käytämme laadukasta kuusta ja lämpöpuuta, jotka takaavat kestävyyden, hyvän lämmönpidon ja tyylikkään ulkonäön kaikissa sääolosuhteissa.",
    "quick_2_title": "Eri mallit",
    "quick_2_text": "Valikoimassa on tynnyri-, ovaali- ja suorakulmaisia saunoja eri mitoissa ja ratkaisuissa. Myös täysin mittatilaustyönä valmistettu sauna on mahdollinen.",
    "quick_3_title": "Värivaihtoehdot",
    "quick_3_text": "Valitse saunaasi sopiva sävy ja viimeistely – saatavilla on erilaisia puu-, katto- ja yksityiskohtien väriyhdistelmiä, jotta sauna sopii täydellisesti kotiisi tai mökillesi.",
    "quick_4_title": "Kuljetus",
    "quick_4_text": "Tarjoamme turvallisen ja vaivattoman kuljetuksen Virossa ja sopimuksen mukaan myös Eurooppaan. Tarvittaessa autamme myös asennuksessa.",
    "home_eyebrow": "Miksi meidän saunamme?",
    "home_title": "Löylyt, jotka kestävät vuosia — laadukas ulkosauna suoraan valmistajalta.",
    "home_text": "Jokainen sauna valmistetaan laadukkaista materiaaleista ja toimitetaan täysin koottuna ja käyttövalmiina. Sopii erinomaisesti pihalle, mökille, veden äärelle tai majoitusyritykselle.",
    "home_li1": "Täydellinen ratkaisu – kiuas, savupiippu ja kiuaskivet saatavilla pakettina",
    "home_li2": "Kestävät kuusi- ja lämpöpuusaunat",
    "home_li3": "Mahdollisuus tilata eri mittoja, värejä ja ratkaisuja",
    "home_li4": "Kuljetus ja tarvittaessa asennusapu Viroon ja Eurooppaan",
    "products_eyebrow": "Mallit",
    "products_title": "Valitse sopiva sauna tai pyydä mittatilausratkaisu",
    "products_text": "Alla olevat mallit antavat yleiskuvan tärkeimmistä ratkaisuistamme. Kaikkia saunoja voidaan muokata toiveiden mukaan.",
    "product1_badge": "Suosittu",
    "product1_title": "2-huoneinen tynnyrisauna",
    "product1_text": "Tilava tynnyrisauna käytännöllisellä pukuhuoneella ja löylyhuoneella. Sopii hyvin perheelle tai ystäväporukalle.",
    "product2_badge": "Erittäin tilava",
    "product2_title": "2-huoneinen ovaalisauna",
    "product2_text": "Hyvin suunniteltu ovaalisauna, jossa on käytännöllinen pukuhuone ja mukava löylyhuone.",
    "product3_badge": "Kompakti",
    "product3_title": "Tynnyrisauna terassilla",
    "product3_text": "Kompakti lämpöpuinen tynnyrisauna pienempään pihaan, veden äärelle tai peräkärryyn asennettavaksi.",
    "product4_badge": "Minimalistinen",
    "product4_title": "1-huoneinen tynnyrisauna",
    "product4_text": "Kompakti 1-huoneinen tynnyrisauna sinulle, joka haluat yksinkertaisen ja käytännöllisen ratkaisun pihalle, mökille tai veden äärelle.",
    "ask_offer": "Pyydä tarjous",
    "vat": "+ ALV",
    "spec1_1": "📏 3,8 m × 2,1 m",
    "spec1_2": "🔥 Harvia M3 -kiuas",
    "spec_water": "💧 35 l vesisäiliö",
    "spec1_4": "🚪 Lukittava ulko-ovi",
    "spec2_1": "📏 4 m × 2,4 m",
    "spec2_2": "🪵 Lepälauteet",
    "spec2_4": "🌲 Kuusi tai lämpöpuu",
    "spec3_1": "🏕 Sopii erinomaisesti peräkärryyn",
    "spec3_2": "🪵 Valmistettu lämpöpuusta",
    "spec3_3": "🔥 Valittavissa sisältä tai ulkoa lämmitettävä kiuas",
    "spec3_4": "📏 2,5 m × 2,1 m",
    "spec4_1": "🚚 Laadukas Icopal-kate",
    "spec4_2": "🎨 Halutessasi voit tilata myös omilla mitoilla",
    "spec4_3": "⚡ Ruostumattomasta teräksestä valmistetut kiristysvanteet",
    "spec4_4": "📐 2,1 m x 2 m",
    "included_title": "Mahdolliset lisävarusteet",
    "inc1": "🔥 Laadukas puulämmitteinen Harvia M3-, Harvia M2- tai Stoveman 13M -kiuas",
    "inc2": "🏠 Kestävä Icopal- tai bitumikate ympärivuotiseen käyttöön",
    "inc3": "💧 Kestävä ruostumattomasta teräksestä valmistettu vesisäiliö",
    "inc4": "⚡ Mahdollisuus valita moderni ja mukava sähkökiuas",
    "inc5": "🪨 Laadukkaat kiuaskivet pehmeämpiin ja parempiin löylyihin",
    "inc6": "🧱 Kuumuutta kestävät ja paloturvalliset suojalevyt kiukaan ympärille",
    "inc7": "🌬 Ilmanvaihtoa parantavat venttiilit miellyttäviä löylyjä varten",
    "inc8": "🪟 Karkaistu pronssinsävyinen lasiovi",
    "inc9": "🔐 Vahva lukittava ulko-ovi kolmella avaimella",
    "gallery_eyebrow": "Galleria",
    "gallery_title": "Valmiit projektit ja sisätilat",
    "gallery_text": "Katso tarkemmin saunojemme muotoilua, sisätiloja ja viimeistelyvaihtoehtoja.",
    "gal1": "Uuden ratkaisun tynnyrisauna",
    "gal2": "Harvian puukiuas",
    "gal4": "Lepästä valmistettu laude",
    "gal5": "Kaksi Harvian puukiuasta",
    "gal6": "Erivärinen ovaalisauna",
    "gal7": "Lämpöpuinen saunan sisustus",
    "gal8": "Sähkökiuas",
    "gal9": "Sauna asiakkaalla peräkärryn päällä",
    "prod_eyebrow": "Valmistus ja kuljetus",
    "prod_title": "Jokainen sauna valmistuu huolellisesti alusta loppuun",
    "prod_text": "Tähän olemme lisänneet kuvia työpajasta, rakennusprosessista ja kuljetuksesta, jotta näet, miten saunat oikeasti valmistuvat.",
    "prod1_title": "Puu ja runko",
    "prod1_text": "Saunan seinät valmistetaan kestävästä 40 mm puusta, ja pääty- sekä väliseinät rakennetaan valitun mallin mukaan.",
    "prod2_title": "Sisustus ja lauteet",
    "prod2_text": "Lauteet, istuinpenkit ja lattiaritilät valmistetaan lepästä, joka sopii hyvin saunan sisätiloihin.",
    "prod3_title": "Aitoa valmistusta. Aitoa laatua.",
    "prod3_text": "Kaikki saunat valmistetaan käsityönä omassa työpajassamme suurella huomiolla jokaiseen yksityiskohtaan.",
    "prod4_title": "Materiaali",
    "prod4_text": "Käytämme huolellisesti valittua ja kuivattua puuta, jotta sauna on kestävä, vakaa ja lopputulos kaunis.",
    "prod5_title": "Alusrakenne",
    "prod5_text": "Saunan alarunko valmistetaan erittäin vahvaksi, mikä takaa tukevan perustan ja pitkän käyttöiän kaikilla alustoilla.",
    "prod6_title": "Asennus nosturilla",
    "prod6_text": "Tarvittaessa autamme nostamaan saunan tarkasti oikeaan paikkaan, jotta voit nauttia uudesta saunasta ilman lisähuolia.",
    "prod7_title": "Nouda itse",
    "prod7_text": "Halutessasi voit noutaa saunan itse. Tehtaalla autamme lastaamaan sen turvallisesti peräkärryyn tai kuljetusajoneuvoon.",
    "about_eyebrow": "Meistä",
    "about_title": "OutDoorSauna — laadukkaat ulkosaunat suoraan valmistajalta",
    "about_intro": "OutDoorSauna valmistaa Tartumaalla tynnyrisaunoja, ovaalisaunoja ja kulmikkaita ulkosaunoja ihmisille, jotka arvostavat hyvää käsityötä, kestäviä materiaaleja ja miellyttäviä löylyjä.",
    "about_subtitle": "Saunat oikeaan käyttöön",
    "about_p1": "Tavoitteemme on tarjota ulkosaunoja, jotka näyttävät hyvältä, kestävät Viron ilmastoa ja ovat käyttövalmiita toimituksen jälkeen. Valmistamme saunat laadukkaasta kuusesta ja lämpöpuusta sekä kiinnitämme huomiota jokaiseen yksityiskohtaan rungosta lauteisiin, kiukaaseen, savupiippuun ja viimeistelyyn.",
    "about_p2": "Valikoimassa on suosittuja tynnyrisaunoja, käytännöllisiä ovaalisaunoja ja kulmikkaita saunoja eri mitoissa. Sauna voidaan mukauttaa asiakkaan tarpeisiin: mitat, puulaji, väri, kiuasratkaisu, katemateriaali ja lisävarusteet voidaan valita toiveen mukaan.",
    "about_p3": "Sijaitsemme Tarton lähellä Reolassa ja autamme tarvittaessa kuljetuksessa kaikkialle Viroon sekä sopimuksen mukaan myös muualle Eurooppaan. Jos asiakas noutaa saunan itse, voimme auttaa lastaamaan sen turvallisesti peräkärryyn tai kuljetusajoneuvoon.",
    "about_h1": "Tynnyri-, ovaali- ja kulmikkaat saunat",
    "about_h1_text": "Eri mallit ja mitat toiveen mukaan.",
    "about_h2": "Kuusi ja lämpöpuu",
    "about_h2_text": "Kestävät materiaalit Viron sääolosuhteisiin.",
    "about_h3": "Kuljetus koko Viroon",
    "about_h3_text": "Sauna toimitetaan koottuna ja käyttövalmiina.",
    "about_caption": "Kuva tuotannostamme tai valmiista saunasta",
    "contact_eyebrow": "Tarjous",
    "contact_title": "Pyydä henkilökohtainen tarjous",
    "contact_text": "Kirjoita, millaisen saunan haluat. Mainitse mahdollisuuksien mukaan malli, mitat, puulaji, väri, sijainti ja tarvitsetko kuljetusta.",
    "contact_loc": "Sijaitsemme Tarton lähellä, Reolassa",
    "contact_transport": "Kuljetus Viroon ja Eurooppaan",
    "form_title": "Tarjouslomake",
    "form_name": "Nimi",
    "form_phone": "Puhelin",
    "form_email": "Sähköposti",
    "form_model": "Toivottu sauna",
    "form_transport_question": "Tarvitsetko kuljetusta?",
    "form_location": "Sijainti",
    "form_message": "Kuvaile toiveesi",
    "form_submit": "Lähetä pyyntö",
    "opt_barrel": "1-huoneinen tynnyrisauna",
    "opt_oval": "2-huoneinen tynnyrisauna",
    "opt_square": "2-huoneinen ovaalisauna",
    "opt_custom": "Mittatilaus",
    "opt_other": "Muu",
    "opt_choose": "Valitse...",
    "opt_yes": "Kyllä",
    "opt_no": "Ei",
    "opt_unsure": "En ole varma",
    "location_placeholder": "Esimerkiksi Tallinna, Tartto, Pärnu",
    "message_placeholder": "Esimerkiksi: haluan 2-huoneisen lämpöpuusta valmistetun tynnyrisaunan kuljetuksella Harjumaalle.",
    "footer_text": "© 2026 OutDoorSauna. Kaikki oikeudet pidätetään.",
    "status_mail": "Sähköpostiohjelma avautuu. Lähetä pyyntö painamalla siellä Lähetä.",
    "status_wait": "Odota hetki...",
    "status_sent_btn": "Lähetetty ✓",
    "status_success": "Kiitos! Otamme sinuun yhteyttä mahdollisimman pian.",
    "status_error": "Lomakkeen automaattinen lähetys epäonnistui. Avaa sähköposti ja paina Lähetä.",
    "toast_success": "✓ Pyyntö lähetetty onnistuneesti",
    "mail_subject": "Saunatarjouspyyntö",
    "mail_name": "Nimi",
    "mail_phone": "Puhelin",
    "mail_email": "Sähköposti",
    "mail_model": "Toivottu sauna",
    "mail_transport": "Kuljetus",
    "mail_location": "Sijainti",
    "mail_description": "Kuvaus",
    "gal10": "Mittatilaustyönä valmistettu valaistu tynnyrisauna",
    "gal11": "Asiakkaan toiveiden mukaan valmistettu valaistu tynnyrisauna",
    "prod8_title": "Turvallinen lastaus",
    "prod8_text": "Valmis sauna nostetaan nosturilla varovasti kuljetusajoneuvon päälle. Käytämme turvallisia nostovälineitä, jotta sauna saapuu asiakkaalle samassa kunnossa kuin se lähti työpajaltamme.",
    "prod9_title": "Valmis sauna asiakkaalle",
    "prod9_text": "Toimitamme saunat turvallisesti asiakkaille koko Viroon ja sopimuksen mukaan myös Eurooppaan."
  }
};

let currentLanguage = localStorage.getItem('siteLanguage') || 'et';

function t(key){
  return (translations[currentLanguage] && translations[currentLanguage][key]) || (translations.et && translations.et[key]) || key;
}

function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('active', b.dataset.page===id));
  document.getElementById('mainNav').classList.remove('open');
  const langMenu = document.getElementById('langMenu');
  if(langMenu) langMenu.classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
}

function toggleMenu(){document.getElementById('mainNav').classList.toggle('open')}

function toggleLanguageMenu(){
  const menu = document.getElementById('langMenu');
  if(menu) menu.classList.toggle('open');
}


function ensureTranslationKeys(){
  const textKeyMap = {
    "Valgustusega torusaun, mis on valmistatud eritellimusel": "gal10",
    "Tellija soovide järgi valmistatud valgustusega torusaun": "gal11",
    "Turvaline peale laadimine": "prod8_title",
    "Valmis saun tõstetakse kraanaga ettevaatlikult transpordivahendile. Kasutame turvalisi tõstevahendeid, et saun jõuaks kliendini täpselt samas seisukorras nagu meie töökojast lahkudes.": "prod8_text",
    "Valmis saun kliendile": "prod9_title",
    "Toimetame saunad turvaliselt klientideni üle Eesti ning kokkuleppel ka Euroopasse.": "prod9_text"
  };

  document.querySelectorAll('figcaption, .timeline-card h2, .timeline-card p').forEach(el => {
    if(el.dataset.i18n && el.dataset.i18n !== 'gal9') return;
    const key = textKeyMap[el.textContent.trim()];
    if(key) el.setAttribute('data-i18n', key);
  });

  document.querySelectorAll('.lightbox-prev').forEach(el => {
    if(!el.hasAttribute('data-i18n-aria-label')) el.setAttribute('data-i18n-aria-label', 'prev_image');
  });

  document.querySelectorAll('.lightbox-next').forEach(el => {
    if(!el.hasAttribute('data-i18n-aria-label')) el.setAttribute('data-i18n-aria-label', 'next_image');
  });
}

function setLanguage(lang){
  ensureTranslationKeys();
  if(!translations[lang]) lang='et';
  currentLanguage = lang;
  localStorage.setItem('siteLanguage', lang);

  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.getAttribute('data-i18n');
    if(translations[lang][key] || translations.et[key]) el.textContent=t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const key=el.getAttribute('data-i18n-placeholder');
    if(translations[lang][key] || translations.et[key]) el.setAttribute('placeholder', t(key));
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach(el=>{
    const key=el.getAttribute('data-i18n-aria-label');
    if(translations[lang][key] || translations.et[key]) el.setAttribute('aria-label', t(key));
  });

  document.querySelectorAll('[data-i18n-content]').forEach(el=>{
    const key=el.getAttribute('data-i18n-content');
    if(translations[lang][key] || translations.et[key]) el.setAttribute('content', t(key));
  });

  document.querySelectorAll('.lang').forEach(btn=>btn.classList.remove('active'));
  const activeBtn = document.getElementById('lang' + lang.charAt(0).toUpperCase() + lang.slice(1));
  if(activeBtn) activeBtn.classList.add('active');

  const select = document.getElementById('languageSelect');
  if(select) select.value = lang;

  document.documentElement.lang=lang;
  document.title = t('meta_title');
  const menu = document.getElementById('langMenu');
  if(menu) menu.classList.remove('open');
}

document.addEventListener('click', function(event){
  const switcher = document.querySelector('.language-switcher');
  const menu = document.getElementById('langMenu');
  if(switcher && menu && !switcher.contains(event.target)) menu.classList.remove('open');
});

document.addEventListener('DOMContentLoaded', function(){
  setLanguage(currentLanguage);
});

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby5G-CFGKjiXDlYjNjxfvD67pkx0SMmEkFWZfkjSfK8SxG0SaNwOQHdfXQAu5ppXZOk/exec";

// Varuvariant, kui Google Scripti URL on veel lisamata.
const FALLBACK_EMAIL = "kethontaevere1@gmail.com";

function setFormStatus(message, type){
  const status = document.getElementById('formStatus');
  if(!status) return;
  status.textContent = message || '';
  status.className = 'form-status' + (type ? ' ' + type : '');
}

function setSubmitState(button, text, disabled){
  if(!button) return;
  button.disabled = !!disabled;
  if(text) button.textContent = text;
}

function formDataToObject(form){
  const data = new FormData(form);
  return {
    createdAt: new Date().toISOString(),
    name: (data.get('name') || '').trim(),
    phone: (data.get('phone') || '').trim(),
    email: (data.get('email') || '').trim(),
    model: (data.get('model') || '').trim(),
    transport: (data.get('transport') || '').trim(),
    location: (data.get('location') || '').trim(),
    message: (data.get('message') || '').trim(),
    source: window.location.href
  };
}

function buildMailto(payload){
  const body = [
    t('mail_name') + ': ' + payload.name,
    t('mail_phone') + ': ' + payload.phone,
    t('mail_email') + ': ' + payload.email,
    t('mail_model') + ': ' + payload.model,
    t('mail_transport') + ': ' + payload.transport,
    t('mail_location') + ': ' + payload.location,
    '',
    t('mail_description') + ':',
    payload.message
  ].join('\n');

  return 'mailto:' + FALLBACK_EMAIL + '?subject=' + encodeURIComponent(t('mail_subject')) + '&body=' + encodeURIComponent(body);
}

// Taotluse vorm.
// Kui GOOGLE_SCRIPT_URL on lisatud, saadab andmed Google Sheetsi ja Gmailile.
// Kui URL on tühi, avab varuvariandina e-kirja.
async function handleForm(e){
  e.preventDefault();
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = t('form_submit');
  const payload = formDataToObject(form);

  if(!GOOGLE_SCRIPT_URL){
    setFormStatus(t('status_mail'), 'info');
    window.location.href = buildMailto(payload);
    return;
  }


  try{
    setSubmitState(submitButton, t('status_wait'), true);
    setFormStatus('', '');

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {'Content-Type': 'text/plain;charset=utf-8'},
      body: JSON.stringify(payload)
    });

    showToast(t('toast_success'));

    form.reset();
    setSubmitState(submitButton, t('status_sent_btn'), true);
    setFormStatus(t('status_success'), 'success');
    locationField.style.display = 'none';
    locationInput.required = false;
    locationInput.value = '';

    ['name', 'phone', 'email', 'model', 'transport', 'location', 'message'].forEach(fieldName => {
    localStorage.removeItem('quote_' + fieldName);
    });

    setTimeout(function(){
      setSubmitState(submitButton, originalButtonText, false);
      setFormStatus('', '');
    }, 6000);
    }catch(error){
      console.error(error);
    
      form.reset();
      setSubmitState(submitButton, 'Saadetud ✓', true);
      setFormStatus('Aitäh! Päring on saadetud.', 'success');
    
      setTimeout(function(){
        setSubmitState(submitButton, originalButtonText, false);
        setFormStatus('', '');
      }, 6000);
    }
    }
function initProductCarousels(){
  const lightbox=document.getElementById('imageLightbox');
  const lightboxImg=lightbox ? lightbox.querySelector('img') : null;
  const closeBtn=lightbox ? lightbox.querySelector('.lightbox-close') : null;

const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
const lightboxThumbs = lightbox ? lightbox.querySelector('.lightbox-thumbs') : null;

let lightboxImages = [];
let lightboxIndex = 0;
let lightboxAlt = '';

function updateLightbox(){
  if(!lightboxImg || !lightboxImages.length) return;

  lightboxImg.src = lightboxImages[lightboxIndex];
  lightboxImg.alt = lightboxAlt || '';

  if(lightboxThumbs){
    lightboxThumbs.innerHTML = '';

    lightboxImages.forEach((src, i)=>{
      const thumb = document.createElement('img');
      thumb.src = src;
      thumb.alt = lightboxAlt || '';
      thumb.classList.toggle('active', i === lightboxIndex);

      thumb.addEventListener('click', ()=>{
        lightboxIndex = i;
        updateLightbox();
      });

      lightboxThumbs.appendChild(thumb);
    });
  }
}

function openLightbox(images, startIndex, alt){
  if(!lightbox || !lightboxImg) return;

  lightboxImages = images;
  lightboxIndex = startIndex || 0;
  lightboxAlt = alt || '';

  updateLightbox();

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.classList.add('lightbox-active');
}

function lightboxShow(nextIndex){
  if(!lightboxImages.length) return;
  lightboxIndex = (nextIndex + lightboxImages.length) % lightboxImages.length;
  updateLightbox();
}

  function closeLightbox(){
    if(!lightbox || !lightboxImg) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('lightbox-active');
    lightboxImg.src='';
  }

  document.querySelectorAll('.product-carousel').forEach(carousel=>{
    const images=(carousel.dataset.images || '').split('|').filter(Boolean);
    const img=carousel.querySelector('img');
    const prev=carousel.querySelector('.prev');
    const next=carousel.querySelector('.next');
    let index=0;

    function showImage(nextIndex){
      if(!images.length || !img) return;
      index=(nextIndex + images.length) % images.length;
      img.src=images[index];
    }

    prev.addEventListener('click',event=>{
      event.stopPropagation();
      showImage(index - 1);
    });

    next.addEventListener('click',event=>{
      event.stopPropagation();
      showImage(index + 1);
    });

    if(lightboxPrev){
  lightboxPrev.addEventListener('click', event=>{
    event.stopPropagation();
    lightboxShow(lightboxIndex - 1);
  });
}

if(lightboxNext){
  lightboxNext.addEventListener('click', event=>{
    event.stopPropagation();
    lightboxShow(lightboxIndex + 1);
  });
}

img.addEventListener('click',()=>{
  openLightbox(images, index, carousel.dataset.alt || img.alt);
});

});



  document.querySelectorAll('.gallery-grid figure img').forEach(galleryImg=>{
    galleryImg.style.cursor='zoom-in';
    galleryImg.addEventListener('click',()=>{
      openLightbox([galleryImg.src], 0, galleryImg.alt || '');
    });
  });

  if(lightbox){
    lightbox.addEventListener('click',event=>{
      if(event.target===lightbox) closeLightbox();
    });
  }

  if(closeBtn) closeBtn.addEventListener('click',closeLightbox);

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape') closeLightbox();
  });
}

document.addEventListener('DOMContentLoaded',initProductCarousels);

document.addEventListener('DOMContentLoaded', function(){
  const transportSelect = document.getElementById('transport');
  const locationField = document.getElementById('locationField');
  const locationInput = document.getElementById('location');
  const quoteForm = document.querySelector('.quote-form');

  function updateLocationField(){
    if(!transportSelect || !locationField || !locationInput) return;
    if (transportSelect.value === 'Jah' || transportSelect.value === 'Pole kindel') {
      locationField.style.display = 'block';
      locationInput.required = true;
    } else {
      locationField.style.display = 'none';
      locationInput.required = false;
      locationInput.value = '';
    }
  }

  if(transportSelect){
    transportSelect.addEventListener('change', updateLocationField);
  }

  if (quoteForm) {
    const fieldsToSave = ['name', 'phone', 'email', 'model', 'transport', 'location', 'message'];

    fieldsToSave.forEach(fieldName => {
      const field = quoteForm.querySelector(`[name="${fieldName}"]`);
      if (!field) return;

      const savedValue = localStorage.getItem('quote_' + fieldName);
      if (savedValue) field.value = savedValue;

      field.addEventListener('input', () => {
        localStorage.setItem('quote_' + fieldName, field.value);
      });

      field.addEventListener('change', () => {
        localStorage.setItem('quote_' + fieldName, field.value);
      });
    });
  }

  updateLocationField();
});

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}


// ZONE FIX: tee funktsioonid kindlalt globaalseks, et onclick/onchange HTML-ist töötaks.
window.showPage = showPage;
window.toggleMenu = toggleMenu;
window.setLanguage = setLanguage;
window.handleForm = handleForm;
window.addEventListener('DOMContentLoaded', function(){
  const select = document.getElementById('languageSelect');
  if(select){
    select.value = currentLanguage;
    select.addEventListener('change', function(){ setLanguage(this.value); });
  }
});
