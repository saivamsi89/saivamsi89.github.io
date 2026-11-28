<?php
// Shared helpers for the public API and the admin dashboard.
declare(strict_types=1);

define('SITE_ROOT', dirname(__DIR__));
define('DATA_DIR', SITE_ROOT . '/private/data');
define('FILES_DIR', DATA_DIR . '/files');
define('UPLOAD_DIR', SITE_ROOT . '/uploads');

function config(): ?array {
    // A config file one level above the web root is also accepted.
    foreach ([dirname(SITE_ROOT) . '/nanofab-config.php', SITE_ROOT . '/private/config.php'] as $f) {
        if (is_file($f)) return require $f;
    }
    return null;
}

function ensure_dirs(): void {
    foreach ([DATA_DIR, FILES_DIR, UPLOAD_DIR] as $d) {
        if (!is_dir($d)) mkdir($d, 0750, true);
    }
    @chmod(UPLOAD_DIR, 0755);
}

function read_json(string $name, array $default = []): array {
    $f = DATA_DIR . "/$name.json";
    if (!is_file($f)) return $default;
    $d = json_decode((string) file_get_contents($f), true);
    return is_array($d) ? $d : $default;
}

/** Read-modify-write under an exclusive lock, replacing the file atomically. */
function update_json(string $name, callable $fn, array $default = []): array {
    ensure_dirs();
    $lock = fopen(DATA_DIR . "/$name.lock", 'c');
    flock($lock, LOCK_EX);
    $data = $fn(read_json($name, $default));
    $tmp = DATA_DIR . "/$name." . bin2hex(random_bytes(4)) . '.tmp';
    file_put_contents($tmp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE));
    rename($tmp, DATA_DIR . "/$name.json");
    flock($lock, LOCK_UN);
    fclose($lock);
    return $data;
}

/** True while the visitor is within $max actions per $window seconds. */
function rate_limit(string $action, int $max, int $window): bool {
    $key = $action . ':' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? '');
    $ok = true;
    update_json('rate', function (array $all) use ($key, $max, $window, &$ok) {
        $now = time();
        foreach ($all as $k => $times) {
            $all[$k] = array_values(array_filter($times, fn($t) => $t > $now - 86400));
            if (!$all[$k]) unset($all[$k]);
        }
        $recent = array_filter($all[$key] ?? [], fn($t) => $t > $now - $window);
        if (count($recent) >= $max) $ok = false;
        else $all[$key][] = $now;
        return $all;
    });
    return $ok;
}

function one_line(string $s, int $max = 200): string {
    return mb_substr(trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $s) ?? ''), 0, $max);
}
