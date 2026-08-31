<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$config = require __DIR__ . '/config.php';

function out(array $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function safe(string $s): string {
    return preg_replace('/[^A-Za-z0-9_\-]/', '', $s) ?? '';
}
function weekStart(string $date): string {
    $dt = new DateTimeImmutable($date ?: 'today');
    return $dt->modify('monday this week')->format('Y-m-d');
}
function cachePath(string $key): string {
    return __DIR__ . '/cache/' . sha1($key) . '.json';
}
function cachedFetch(string $url, int $ttl): ?array {
    $file = cachePath($url);
    if (is_file($file) && (time() - filemtime($file) < $ttl)) {
        $raw = file_get_contents($file);
        $json = json_decode((string)$raw, true);
        if (is_array($json)) return $json;
    }

    $ctx = stream_context_create([
        'http' => [
            'timeout' => 12,
            'header' => "User-Agent: KoosKooli/1.0\r\nAccept: application/json,text/plain,*/*\r\n",
        ],
        'ssl' => ['verify_peer' => true, 'verify_peer_name' => true],
    ]);
    $raw = @file_get_contents($url, false, $ctx);
    if ($raw === false) return null;

    $json = json_decode($raw, true);
    if (!is_array($json)) return null;

    @file_put_contents($file, json_encode($json, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);
    return $json;
}

/**
 * LIVE adapteri oodatav formaat.
 *
 * GROUPS_URL peab tagastama kas:
 * [{"code":"SRT526","name":"..."}, ...]
 * või {"groups":[...]}
 *
 * SCHEDULE_URL peab tagastama kas:
 * {"days":[{"date":"2026-09-02","lessons":[{"start":"08:30","end":"10:00","title":"...","room":"...","teacher":"..."}]}]}
 *
 * Kui VOCO päris JSON erineb, tuleb muuta ainult kahte allolevat normaliseerimisfunktsiooni.
 */
function normalizeGroups(array $raw): array {
    $list = $raw['groups'] ?? $raw;
    $out = [];
    foreach ($list as $g) {
        if (is_string($g)) {
            $out[] = ['code' => $g, 'name' => ''];
        } elseif (is_array($g)) {
            $code = (string)($g['code'] ?? $g['group'] ?? $g['name'] ?? '');
            if ($code !== '') $out[] = ['code' => $code, 'name' => (string)($g['title'] ?? $g['description'] ?? '')];
        }
    }
    return $out;
}
function normalizeSchedule(array $raw): array {
    $days = $raw['days'] ?? [];
    $out = [];
    foreach ($days as $d) {
        $lessons = [];
        foreach (($d['lessons'] ?? $d['events'] ?? []) as $e) {
            $lessons[] = [
                'start' => (string)($e['start'] ?? $e['start_time'] ?? ''),
                'end' => (string)($e['end'] ?? $e['end_time'] ?? ''),
                'title' => (string)($e['title'] ?? $e['subject'] ?? $e['name'] ?? 'Tund'),
                'room' => (string)($e['room'] ?? $e['classroom'] ?? ''),
                'teacher' => (string)($e['teacher'] ?? ''),
            ];
        }
        $out[] = ['date' => (string)($d['date'] ?? ''), 'lessons' => $lessons];
    }
    return $out;
}

function demoGroups(): array {
    return [
        ['code'=>'SRT526','name'=>'Mootorsõidukite remonditehnoloogia'],
        ['code'=>'LOG26','name'=>'Logistika'],
        ['code'=>'TDT25','name'=>'Tekstiiltoodete disain ja -tehnoloogia'],
        ['code'=>'TDT26','name'=>'Tekstiiltoodete disain ja -tehnoloogia'],
        ['code'=>'TEP24','name'=>'Toitlustusteenindus'],
        ['code'=>'TEP25','name'=>'Toitlustusteenindus'],
        ['code'=>'TKEo26','name'=>'Turismikorraldaja'],
        ['code'=>'ME25','name'=>'Mehhatroonik'],
        ['code'=>'ME26','name'=>'Mehhatroonik'],
        ['code'=>'MTT126','name'=>'Masintöötlustehnoloogia'],
        ['code'=>'OM26','name'=>'Õmbleja'],
    ];
}
function demoLessonsFor(string $group, string $date): array {
    $dow = (int)(new DateTimeImmutable($date))->format('N');
    $srt = [
        1 => [['10:15','11:45','Õpitee ja koostöö','A209','']],
        2 => [],
        3 => [['08:30','10:00','Sõidukite tehnoloogia ja töökorraldus','F327','Silver Sõukand'],['10:15','11:45','Sõidukite tehnoloogia ja töökorraldus','F331','Ismail Mirzojev']],
        4 => [['10:15','11:45','Õpitee ja koostöö','F303',''],['11:55','14:00','Õpitee ja koostöö','F303',''],['14:10','15:40','Digipädevused','A145','Eve Siimus']],
        5 => [['10:15','11:45','Füüsiline heaolu','A121',''],['11:55','14:00','Töövahendid ja materjalid','F327','Argo Vahter']],
    ];
    $log = [
        1 => [['08:00','09:30','Logistika alused','B214',''],['12:00','13:30','Veonduse alused','B210','']],
        2 => [['08:30','10:00','Lao töökorraldus','B117','']],
        3 => [['08:30','10:00','Lao töökorraldus','B117',''],['10:15','11:45','Digipädevused','A145','']],
        4 => [['10:15','11:45','Õpitee ja koostöö','A208',''],['12:00','13:30','Erialaõpe','B203','']],
        5 => [['08:30','10:00','Erialaõpe','B205',''],['10:15','11:45','Füüsiline heaolu','A122','']],
    ];
    $rows = $group === 'SRT526' ? ($srt[$dow] ?? []) : ($group === 'LOG26' ? ($log[$dow] ?? []) : []);
    return array_map(fn($r)=>['start'=>$r[0],'end'=>$r[1],'title'=>$r[2],'room'=>$r[3],'teacher'=>$r[4]], $rows);
}
function demoWeek(string $group, string $week): array {
    $start = new DateTimeImmutable($week);
    $days = [];
    for ($i=0;$i<7;$i++) {
        $date = $start->modify("+$i day")->format('Y-m-d');
        $days[] = ['date'=>$date,'lessons'=>demoLessonsFor($group,$date)];
    }
    return $days;
}

function liveGroups(array $config): ?array {
    if (!$config['LIVE_MODE'] || !$config['GROUPS_URL']) return null;
    $raw = cachedFetch($config['GROUPS_URL'], (int)$config['CACHE_SECONDS']);
    return $raw ? normalizeGroups($raw) : null;
}
function liveWeek(array $config, string $group, string $week): ?array {
    if (!$config['LIVE_MODE'] || !$config['SCHEDULE_URL']) return null;
    $url = str_replace(['{group}','{week}'], [rawurlencode($group), rawurlencode($week)], $config['SCHEDULE_URL']);
    $raw = cachedFetch($url, (int)$config['CACHE_SECONDS']);
    return $raw ? normalizeSchedule($raw) : null;
}

$action = $_GET['action'] ?? 'groups';

if ($action === 'groups') {
    $live = liveGroups($config);
    out(['ok'=>true,'source'=>$live ? 'live' : 'demo','groups'=>$live ?: demoGroups()]);
}

if ($action === 'schedule') {
    $group = safe((string)($_GET['group'] ?? 'SRT526'));
    $week = weekStart((string)($_GET['week'] ?? date('Y-m-d')));
    $live = liveWeek($config, $group, $week);
    out([
        'ok'=>true,
        'source'=>$live ? 'live' : 'demo',
        'group'=>$group,
        'week_start'=>$week,
        'days'=>$live ?: demoWeek($group,$week),
    ]);
}

if ($action === 'compare') {
    $date = (string)($_GET['date'] ?? date('Y-m-d'));
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) out(['ok'=>false,'error'=>'Vale kuupäev'],400);
    $a = safe((string)($_GET['a'] ?? $config['COMPARE_GROUP_A']));
    $b = safe((string)($_GET['b'] ?? $config['COMPARE_GROUP_B']));
    $week = weekStart($date);

    $source = 'demo';
    $la = demoLessonsFor($a,$date);
    $lb = demoLessonsFor($b,$date);

    $liveA = liveWeek($config,$a,$week);
    $liveB = liveWeek($config,$b,$week);
    if ($liveA !== null && $liveB !== null) {
        $pick = function(array $days, string $date): array {
            foreach ($days as $d) if (($d['date'] ?? '') === $date) return $d['lessons'] ?? [];
            return [];
        };
        $la = $pick($liveA,$date);
        $lb = $pick($liveB,$date);
        $source = 'live';
    }

    usort($la, fn($x,$y)=>strcmp($x['start'],$y['start']));
    usort($lb, fn($x,$y)=>strcmp($x['start'],$y['start']));
    out(['ok'=>true,'source'=>$source,'date'=>$date,'groups'=>[$a=>$la,$b=>$lb]]);
}

out(['ok'=>false,'error'=>'Tundmatu action'],404);
