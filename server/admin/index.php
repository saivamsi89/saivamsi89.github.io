<?php
// Nanofab dashboard: banners, products, enquiries and settings.
declare(strict_types=1);
require __DIR__ . '/../api/lib.php';

$https = ($_SERVER['HTTPS'] ?? '') === 'on' || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
session_set_cookie_params(['httponly' => true, 'samesite' => 'Strict', 'secure' => $https, 'path' => '/admin/']);
session_start();
header('X-Frame-Options: DENY');
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header("Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; script-src 'none'; frame-ancestors 'none'");

function e(?string $s): string { return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function flash(string $msg, bool $ok = true): void { $_SESSION['flash'] = [$msg, $ok]; }
function go(string $tab = 'banners'): void { header('Location: ./?tab=' . urlencode($tab)); exit; }
function token(): string { return $_SESSION['csrf'] ??= bin2hex(random_bytes(32)); }
function csrf(): string { return '<input type="hidden" name="csrf" value="' . token() . '">'; }
function field(string $k, int $max = 200): string { return one_line((string) ($_POST[$k] ?? ''), $max); }

/** Links must stay on this site (/path) or be https. */
function clean_link(string $l): string {
    return preg_match('~^(/(?!/)[^\s"\'<>\\\\]*|https://[^\s"\'<>\\\\]+)$~', $l) ? $l : '';
}

/** Validate an uploaded picture and re-encode it, so only real image data is stored. */
function save_image(string $key): ?string {
    $u = $_FILES[$key] ?? null;
    if (!$u || is_array($u['error']) || $u['error'] === UPLOAD_ERR_NO_FILE) return null;
    if ($u['error'] !== UPLOAD_ERR_OK || $u['size'] > 10 * 1024 * 1024) throw new RuntimeException('Upload failed. Images must be 10 MB or smaller.');
    if (!function_exists('imagecreatefromstring')) throw new RuntimeException('The PHP GD extension is not enabled on this server.');
    $info = @getimagesize($u['tmp_name']);
    if (!$info || !in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) throw new RuntimeException('Please upload a JPG, PNG or WebP image.');
    if ($info[0] * $info[1] > 40_000_000) throw new RuntimeException('Image is too large (over 40 megapixels). Please resize it.');
    ini_set('memory_limit', '512M');
    $img = @imagecreatefromstring((string) file_get_contents($u['tmp_name']));
    if (!$img) throw new RuntimeException('Could not read that image.');
    if (imagesx($img) > 2400) $img = imagescale($img, 2400);
    imagepalettetotruecolor($img);
    imagesavealpha($img, true);
    ensure_dirs();
    $webp = function_exists('imagewebp');
    $name = bin2hex(random_bytes(12)) . ($webp ? '.webp' : '.jpg');
    $ok = $webp ? imagewebp($img, UPLOAD_DIR . "/$name", 84) : imagejpeg($img, UPLOAD_DIR . "/$name", 86);
    if (!$ok) throw new RuntimeException('Could not save the image. Check that the uploads folder is writable.');
    @chmod(UPLOAD_DIR . "/$name", 0644);
    return "/uploads/$name";
}
function drop_image(?string $path): void {
    if ($path && preg_match('~^/uploads/([a-f0-9]{24}\.(webp|jpg))$~', $path, $m)) @unlink(UPLOAD_DIR . '/' . $m[1]);
}

$cfg = config();
$admin = read_json('admin');
$authed = !empty($_SESSION['admin']) && $admin && hash_equals($_SESSION['admin'], hash('sha256', $admin['hash']));
$action = $_POST['action'] ?? '';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    if (!$_POST) { flash('That upload was too large for the server.', false); go(); }
    if (!hash_equals(token(), (string) ($_POST['csrf'] ?? ''))) { flash('Your session expired. Please try again.', false); go(); }

    if ($action === 'setup' && !$admin && $cfg) {
        $key = (string) ($cfg['setup_key'] ?? '');
        $pw = (string) ($_POST['password'] ?? '');
        if (!rate_limit('setup', 8, 900)) flash('Too many attempts. Wait 15 minutes.', false);
        elseif ($key === '' || $key === 'CHANGE-ME') flash('Set your own setup_key in private/config.php first.', false);
        elseif (!hash_equals($key, (string) ($_POST['setup_key'] ?? ''))) flash('Setup key is not correct.', false);
        elseif (strlen($pw) < 10 || $pw !== ($_POST['password2'] ?? '')) flash('Passwords must match and be at least 10 characters.', false);
        else { update_json('admin', fn() => ['hash' => password_hash($pw, PASSWORD_DEFAULT)]); flash('Password created. Please sign in.'); }
        go();
    }
    if ($action === 'login' && $admin) {
        if (!rate_limit('login', 8, 900)) flash('Too many attempts. Wait 15 minutes.', false);
        elseif (password_verify((string) ($_POST['password'] ?? ''), $admin['hash'])) { session_regenerate_id(true); $_SESSION['admin'] = hash('sha256', $admin['hash']); }
        else flash('Wrong password.', false);
        go();
    }
    if (!$authed) go();

    $tab = 'banners';
    try {
        if ($action === 'logout') { $_SESSION = []; session_destroy(); header('Location: ./'); exit; }

        if (in_array($action, ['save', 'delete', 'up', 'down'], true)) {
            $kind = ($_POST['kind'] ?? '') === 'products' ? 'products' : 'slides';
            $tab = $kind === 'products' ? 'products' : 'banners';
            $id = field('id', 32);
            $new = $action === 'save' ? save_image('image') : null;
            $old = null;
            update_json('content', function (array $c) use ($kind, $action, $id, $new, &$old) {
                $list = array_values($c[$kind] ?? []);
                $at = null;
                foreach ($list as $i => $it) if ($it['id'] === $id) $at = $i;
                if ($action === 'save') {
                    $item = $at !== null ? $list[$at] : ['id' => bin2hex(random_bytes(8)), 'image' => ''];
                    if ($new) { $old = $item['image'] ?: null; $item['image'] = $new; }
                    if (!$item['image']) throw new RuntimeException('Please choose an image.');
                    if ($kind === 'slides') {
                        $item['title'] = field('title', 80);
                        $item['accent'] = field('accent', 80);
                        $item['bullets'] = array_values(array_slice(array_filter(array_map(fn($l) => one_line($l, 120), explode("\n", (string) ($_POST['bullets'] ?? '')))), 0, 4));
                        $item['buttonLabel'] = field('buttonLabel', 40);
                        $raw = field('buttonLink', 300);
                        $item['buttonLink'] = clean_link($raw);
                        if ($raw !== '' && $item['buttonLink'] === '') throw new RuntimeException('Button link must start with / or https://');
                        if ($item['title'] === '') throw new RuntimeException('Please enter a headline.');
                    } else {
                        $item['name'] = field('name', 100);
                        $item['category'] = field('category', 60);
                        $item['description'] = mb_substr(trim((string) ($_POST['description'] ?? '')), 0, 600);
                        if ($item['name'] === '') throw new RuntimeException('Please enter the product name.');
                    }
                    if ($at !== null) $list[$at] = $item; else $list[] = $item;
                } elseif ($at !== null && $action === 'delete') {
                    $old = $list[$at]['image'];
                    array_splice($list, $at, 1);
                } elseif ($at !== null) {
                    $to = $action === 'up' ? $at - 1 : $at + 1;
                    if (isset($list[$to])) [$list[$at], $list[$to]] = [$list[$to], $list[$at]];
                }
                $c[$kind] = $list;
                return $c;
            });
            drop_image($old);
            flash($action === 'delete' ? 'Deleted.' : 'Saved. The website shows it now.');
        } elseif ($action === 'builtin') {
            update_json('content', function (array $c) { $c['showBuiltinSlides'] = !empty($_POST['show']); return $c; });
            flash('Saved.');
        } elseif ($action === 'settings') {
            $tab = 'settings';
            $mail = field('notify_email', 254);
            if ($mail !== '' && !filter_var($mail, FILTER_VALIDATE_EMAIL)) throw new RuntimeException('That email address is not valid.');
            update_json('settings', function (array $s) use ($mail) { $s['notify_email'] = $mail; return $s; });
            flash('Saved.');
        } elseif ($action === 'password') {
            $tab = 'settings';
            $pw = (string) ($_POST['password'] ?? '');
            if (!password_verify((string) ($_POST['current'] ?? ''), $admin['hash'])) throw new RuntimeException('Current password is wrong.');
            if (strlen($pw) < 10 || $pw !== ($_POST['password2'] ?? '')) throw new RuntimeException('New passwords must match and be at least 10 characters.');
            $a = update_json('admin', fn() => ['hash' => password_hash($pw, PASSWORD_DEFAULT)]);
            $_SESSION['admin'] = hash('sha256', $a['hash']);
            flash('Password changed.');
        } elseif ($action === 'delete_enquiry') {
            $tab = 'enquiries';
            $id = field('id', 32);
            update_json('submissions', function (array $all) use ($id) {
                return array_values(array_filter($all, function ($s) use ($id) {
                    if ($s['id'] !== $id) return true;
                    if (!empty($s['file'])) @unlink(FILES_DIR . '/' . basename($s['file']['stored']));
                    return false;
                }));
            });
            flash('Deleted.');
        }
    } catch (RuntimeException $x) {
        flash($x->getMessage(), false);
    }
    go($tab);
}

if ($authed && isset($_GET['download'])) {
    foreach (read_json('submissions') as $s) {
        if ($s['id'] === $_GET['download'] && !empty($s['file'])) {
            $path = FILES_DIR . '/' . basename($s['file']['stored']);
            if (!is_file($path)) break;
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="' . preg_replace('/[^A-Za-z0-9._ -]/', '_', $s['file']['name']) . '"');
            readfile($path);
            exit;
        }
    }
    http_response_code(404);
    exit('Not found');
}
if ($authed && isset($_GET['export'])) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="nanofab-contacts.csv"');
    $out = fopen('php://output', 'w');
    $safe = fn($v) => preg_match('/^[=+\-@\t\r]/', (string) $v) ? "'" . $v : (string) $v; // stop spreadsheet formulas
    fputcsv($out, ['Date', 'Type', 'Email', 'Name', 'Company', 'Phone', 'Country']);
    foreach (read_json('submissions') as $s) {
        $f = $s['fields'];
        fputcsv($out, array_map($safe, [$s['time'], $s['form'], $f['email'] ?? '', $f['name'] ?? '', $f['company'] ?? '', $f['phone'] ?? '', $f['country'] ?? '']));
    }
    exit;
}

$tab = in_array($_GET['tab'] ?? '', ['banners', 'products', 'enquiries', 'settings'], true) ? $_GET['tab'] : 'banners';
$content = read_json('content');
$msg = $_SESSION['flash'] ?? null;
unset($_SESSION['flash']);

function item_form(string $kind, ?array $it = null): void {
    $slide = $kind === 'slides';
    ?>
    <form method="post" enctype="multipart/form-data" class="grid">
      <?= csrf() ?><input type="hidden" name="action" value="save"><input type="hidden" name="kind" value="<?= $kind ?>"><input type="hidden" name="id" value="<?= e($it['id'] ?? '') ?>">
      <label class="wide">Image <?= $it ? '(choose a file only to replace it)' : '' ?><input type="file" name="image" accept="image/jpeg,image/png,image/webp" <?= $it ? '' : 'required' ?>>
        <small><?= $slide ? 'Landscape, at least 2000 px wide, with the main subject on the right.' : 'Clear photo of the product, about 1200 px wide.' ?> Max 10 MB.</small></label>
      <?php if ($slide): ?>
        <label>Headline<input name="title" maxlength="80" required value="<?= e($it['title'] ?? '') ?>"></label>
        <label>Second line (highlighted)<input name="accent" maxlength="80" value="<?= e($it['accent'] ?? '') ?>"></label>
        <label class="wide">Bullet points (one per line, up to 4)<textarea name="bullets" rows="4"><?= e(implode("\n", $it['bullets'] ?? [])) ?></textarea></label>
        <label>Button text<input name="buttonLabel" maxlength="40" value="<?= e($it['buttonLabel'] ?? 'Learn More') ?>"></label>
        <label>Button link<input name="buttonLink" maxlength="300" value="<?= e($it['buttonLink'] ?? '/contact') ?>"><small>For example /services or https://…</small></label>
      <?php else: ?>
        <label>Product name<input name="name" maxlength="100" required value="<?= e($it['name'] ?? '') ?>"></label>
        <label>Category<input name="category" maxlength="60" value="<?= e($it['category'] ?? '') ?>"></label>
        <label class="wide">Short description<textarea name="description" rows="3" maxlength="600"><?= e($it['description'] ?? '') ?></textarea></label>
      <?php endif ?>
      <div class="wide"><button class="primary"><?= $it ? 'Save changes' : ($slide ? 'Add banner' : 'Add product') ?></button></div>
    </form>
    <?php
}
function item_list(string $kind, array $items): void {
    foreach ($items as $i => $it): ?>
    <article class="card item">
      <img src="<?= e($it['image']) ?>" alt="">
      <div class="grow">
        <h3><?= e($kind === 'slides' ? trim($it['title'] . ' ' . $it['accent']) : $it['name']) ?></h3>
        <details><summary>Edit</summary><?php item_form($kind, $it) ?></details>
      </div>
      <div class="tools">
        <?php foreach (['up' => '↑', 'down' => '↓', 'delete' => 'Delete'] as $a => $label):
          if (($a === 'up' && $i === 0) || ($a === 'down' && $i === count($items) - 1)) continue; ?>
          <?php if ($a === 'delete'): ?><details><summary class="danger">Delete</summary><?php endif ?>
          <form method="post"><?= csrf() ?><input type="hidden" name="action" value="<?= $a ?>"><input type="hidden" name="kind" value="<?= $kind ?>"><input type="hidden" name="id" value="<?= e($it['id']) ?>">
            <button class="<?= $a === 'delete' ? 'danger' : '' ?>" title="<?= $a === 'up' ? 'Move up' : ($a === 'down' ? 'Move down' : 'Delete') ?>"><?= $a === 'delete' ? 'Yes, delete' : $label ?></button></form>
          <?php if ($a === 'delete'): ?></details><?php endif ?>
        <?php endforeach ?>
      </div>
    </article>
    <?php endforeach;
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>Nanofab Dashboard</title>
<style>
  :root { --red:#087a0a; --dark:#11052b; --cream:#f4f5f9; --line:#e1e3ec; }
  * { box-sizing: border-box; } body { margin:0; font:15px/1.5 system-ui,sans-serif; background:var(--cream); color:#11052b; }
  header { background:var(--dark); color:#fff; padding:14px 16px; } header .wrap { display:flex; justify-content:space-between; align-items:center; }
  .wrap { max-width:960px; margin:0 auto; } main { padding:20px 16px 60px; }
  nav a { display:inline-block; padding:9px 14px; text-decoration:none; color:#11052b; background:#fff; border:1px solid var(--line); margin:0 4px 6px 0; }
  nav a.on { background:var(--red); border-color:var(--red); color:#fff; }
  .card { background:#fff; border:1px solid var(--line); padding:18px; margin:14px 0; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px; } .wide { grid-column:1/-1; }
  label { display:block; font-weight:600; font-size:13px; } input,textarea { display:block; width:100%; margin-top:4px; padding:9px; border:1px solid #bbb; font:inherit; }
  small { display:block; font-weight:400; color:#666; margin-top:3px; }
  button { padding:9px 16px; border:1px solid #999; background:#fff; cursor:pointer; font:600 13px system-ui; } button.primary { background:var(--red); border-color:var(--red); color:#fff; }
  .danger { color:var(--red); } summary { cursor:pointer; font-weight:600; font-size:13px; }
  .item { display:flex; gap:14px; align-items:flex-start; } .item img { width:150px; height:96px; object-fit:cover; background:#eee; } .grow { flex:1; min-width:0; } .item h3 { margin:0 0 6px; font-size:16px; }
  .tools { display:flex; gap:6px; align-items:flex-start; flex-wrap:wrap; }
  .msg { padding:12px 14px; margin-bottom:12px; background:#e7f7ec; border:1px solid #9fd5b0; } .msg.bad { background:#fdeaec; border-color:#f0aab2; }
  .scroll { overflow-x:auto; } dl { display:grid; grid-template-columns:max-content 1fr; gap:2px 14px; margin:8px 0; } dt { color:#666; } dd { margin:0; white-space:pre-wrap; overflow-wrap:anywhere; }
  @media (max-width:640px) { .grid { grid-template-columns:1fr; } .item { flex-wrap:wrap; } }
</style>
</head>
<body>
<header><div class="wrap"><strong>Nanofab Dashboard</strong>
  <?php if ($authed): ?><span><a href="/" target="_blank" style="color:#fff;margin-right:14px">View website</a>
  <form method="post" style="display:inline"><?= csrf() ?><input type="hidden" name="action" value="logout"><button>Sign out</button></form></span><?php endif ?>
</div></header>
<main><div class="wrap">
<?php if ($msg): ?><div class="msg <?= $msg[1] ? '' : 'bad' ?>" role="status"><?= e($msg[0]) ?></div><?php endif ?>

<?php if (!$cfg): ?>
  <div class="card"><h2>One step before you start</h2><p>In the Bluehost File Manager, open the <code>private</code> folder, copy <code>config.sample.php</code> to <code>config.php</code>, set your own <code>setup_key</code>, then reload this page.</p></div>
<?php elseif (!$admin): ?>
  <div class="card"><h2>Create the dashboard password</h2>
    <form method="post" class="grid"><?= csrf() ?><input type="hidden" name="action" value="setup">
      <label class="wide">Setup key (from private/config.php)<input type="password" name="setup_key" required></label>
      <label>New password (10+ characters)<input type="password" name="password" minlength="10" required autocomplete="new-password"></label>
      <label>Repeat password<input type="password" name="password2" minlength="10" required autocomplete="new-password"></label>
      <div class="wide"><button class="primary">Create password</button></div></form></div>
<?php elseif (!$authed): ?>
  <div class="card" style="max-width:420px;margin:30px auto"><h2>Sign in</h2>
    <form method="post"><?= csrf() ?><input type="hidden" name="action" value="login">
      <label>Password<input type="password" name="password" required autofocus autocomplete="current-password"></label>
      <p><button class="primary">Sign in</button></p></form></div>
<?php else: ?>
  <nav><?php foreach (['banners' => 'Scrolling banners', 'products' => 'Products', 'enquiries' => 'Enquiries & emails', 'settings' => 'Settings'] as $k => $label): ?><a class="<?= $tab === $k ? 'on' : '' ?>" href="?tab=<?= $k ?>"><?= $label ?></a><?php endforeach ?></nav>

  <?php if ($tab === 'banners'): ?>
    <div class="card"><h2>Add a scrolling banner</h2><?php item_form('slides') ?></div>
    <div class="card"><form method="post"><?= csrf() ?><input type="hidden" name="action" value="builtin">
      <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="show" value="1" style="width:auto;margin:0" <?= ($content['showBuiltinSlides'] ?? true) ? 'checked' : '' ?>>Also show the original five banners</label>
      <small>If unticked, only your banners appear (the originals return if you have none).</small><p><button>Save</button></p></form></div>
    <h2>Your banners (<?= count($content['slides'] ?? []) ?>)</h2>
    <?php item_list('slides', array_values($content['slides'] ?? [])) ?>
  <?php elseif ($tab === 'products'): ?>
    <div class="card"><h2>Add a product</h2><?php item_form('products') ?></div>
    <h2>Your products (<?= count($content['products'] ?? []) ?>)</h2>
    <?php item_list('products', array_values($content['products'] ?? [])) ?>
  <?php elseif ($tab === 'enquiries'): $all = read_json('submissions'); ?>
    <h2>Enquiries and visitor emails (<?= count($all) ?>)</h2>
    <?php if ($all): ?><p><a href="?export=1">Download all as a spreadsheet (CSV)</a></p><?php else: ?><p>Nothing yet.</p><?php endif ?>
    <?php foreach (array_slice($all, 0, 200) as $s): ?>
      <div class="card"><strong><?= e($s['form']) ?></strong> · <?= e(date('d M Y, H:i', strtotime($s['time']))) ?> UTC <?= $s['emailed'] ? '· notified by email' : '' ?>
        <dl><?php foreach ($s['fields'] as $k => $v): ?><dt><?= e(ucfirst(str_replace('_', ' ', $k))) ?></dt><dd><?= e($v) ?></dd><?php endforeach ?></dl>
        <?php if (!empty($s['file'])): ?><p><a href="?download=<?= e($s['id']) ?>">Download <?= e($s['file']['name']) ?></a> <small>Treat attachments from strangers with care.</small></p><?php endif ?>
        <details><summary class="danger">Delete</summary><form method="post"><?= csrf() ?><input type="hidden" name="action" value="delete_enquiry"><input type="hidden" name="id" value="<?= e($s['id']) ?>"><button class="danger">Yes, delete</button></form></details></div>
    <?php endforeach ?>
  <?php else: $set = read_json('settings'); ?>
    <div class="card"><h2>Email notifications</h2><form method="post"><?= csrf() ?><input type="hidden" name="action" value="settings">
      <label>Send enquiries and visitor emails to<input type="email" name="notify_email" value="<?= e($set['notify_email'] ?? '') ?>" placeholder="you@yourdomain.com"></label>
      <small>Leave empty to only store them here.</small><p><button class="primary">Save</button></p></form></div>
    <div class="card"><h2>Change password</h2><form method="post" class="grid"><?= csrf() ?><input type="hidden" name="action" value="password">
      <label class="wide">Current password<input type="password" name="current" required autocomplete="current-password"></label>
      <label>New password<input type="password" name="password" minlength="10" required autocomplete="new-password"></label>
      <label>Repeat new password<input type="password" name="password2" minlength="10" required autocomplete="new-password"></label>
      <div class="wide"><button class="primary">Change password</button></div></form></div>
  <?php endif ?>
<?php endif ?>
</div></main>
</body>
</html>
