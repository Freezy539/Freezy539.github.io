<?php
/**
 * KOOS KOOLI - VOCO ühenduse seaded
 *
 * Hetkel on LIVE_MODE false, sest VOCO avalik tunniplaan laadib andmed
 * JavaScriptiga eraldi päringust ning selle täpset endpointi ei ole siia
 * turvaliselt välja mõeldud.
 *
 * Kui endpoint on teada, pane LIVE_MODE true ja täida URL-id.
 */
return [
    'LIVE_MODE' => false,

    // Näide:
    // 'GROUPS_URL' => 'https://.../groups',
    // 'SCHEDULE_URL' => 'https://.../schedule?group={group}&week={week}',
    'GROUPS_URL' => '',
    'SCHEDULE_URL' => '',

    // Serveripoolne cache. Nii ei küsita VOCO serverit iga leheavaja kohta uuesti.
    'CACHE_SECONDS' => 600,

    // Need kaks gruppi on koos-sõidu põhivaates.
    'COMPARE_GROUP_A' => 'SRT526',
    'COMPARE_GROUP_B' => 'LOG26',
];
