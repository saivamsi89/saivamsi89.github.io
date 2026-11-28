<?php
// Receives the contact form, BOM upload and the optional visitor email.
// Every submission is saved for the dashboard and emailed to the notification address.
require __DIR__ . '/lib.php';
header('Content-Type: application/json; charset=utf-8');

function reply(int $code, array $body): void { http_response_code($code); echo json_encode($body); exit; }

const MAX_FILE = 10 * 1024 * 1024;
const FILE_TYPES = ['pdf','zip','rar','7z','png','jpg','jpeg','xlsx','xls','csv','ods','doc','docx','step','stp','dxf','txt'];
const FIELDS = ['name'=>'Name','company'=>'Company','email'=>'Email','phone'=>'Phone','country'=>'Country','service'=>'Service',
    'product'=>'Product','quantity'=>'Quantity','project'=>'Project','required_by'=>'Required by','also'=>'Also interested in','message'=>'Message','page'=>'Page'];

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') reply(405, ['error' => 'POST only']);
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $o = parse_url($origin, PHP_URL_HOST) . (parse_url($origin, PHP_URL_PORT) ? ':' . parse_url($origin, PHP_URL_PORT) : '');
    if (strcasecmp($o, $_SERVER['HTTP_HOST'] ?? '') !== 0) reply(403, ['error' => 'Wrong origin']);
}
if (!$_POST) reply(413, ['error' => 'Upload too large']);
if (!empty($_POST['_gotcha'])) reply(200, ['ok' => true]); // spam bot

$form = $_POST['form'] ?? '';
if (!in_array($form, ['Contact Enquiry', 'BOM Upload', 'Visitor email'], true)) reply(400, ['error' => 'Unknown form']);
$email = one_line((string) ($_POST['email'] ?? ''), 254);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) reply(422, ['error' => 'A valid email is required']);
if (empty($_POST['consent'])) reply(422, ['error' => 'Consent is required']);
if ($form !== 'Visitor email' && one_line((string) ($_POST['name'] ?? '')) === '') reply(422, ['error' => 'Name is required']);
ensure_dirs();
if (!rate_limit('submit', 10, 3600)) reply(429, ['error' => 'Too many submissions. Try again later.']);

if ($form === 'Visitor email') {
    foreach (read_json('submissions') as $s) {
        if ($s['form'] === $form && strcasecmp($s['fields']['email'], $email) === 0) reply(200, ['ok' => true]);
    }
}

$fields = [];
foreach (FIELDS as $k => $label) {
    $v = $_POST[$k] ?? '';
    if (is_array($v)) $v = implode(', ', array_filter($v, 'is_string'));
    $v = $k === 'message' ? mb_substr(trim((string) $v), 0, 5000) : one_line((string) $v, 300);
    if ($v !== '') $fields[$k] = $v;
}
$fields['email'] = $email;

$file = null;
$u = $_FILES['attachment'] ?? null;
if ($u && !is_array($u['error']) && $u['error'] !== UPLOAD_ERR_NO_FILE) {
    $ext = strtolower(pathinfo($u['name'], PATHINFO_EXTENSION));
    if ($u['error'] !== UPLOAD_ERR_OK || $u['size'] > MAX_FILE) reply(413, ['error' => 'File too large or upload failed']);
    if (!in_array($ext, FILE_TYPES, true)) reply(422, ['error' => 'File type not allowed']);
    $stored = bin2hex(random_bytes(16)) . ".$ext";
    if (!move_uploaded_file($u['tmp_name'], FILES_DIR . "/$stored")) reply(500, ['error' => 'Could not save the file']);
    $file = ['stored' => $stored, 'name' => one_line(basename($u['name']), 150)];
}

$record = ['id' => bin2hex(random_bytes(8)), 'time' => gmdate('c'), 'form' => $form, 'fields' => $fields, 'file' => $file, 'emailed' => false];

// Email notification
$to = read_json('settings')['notify_email'] ?? '';
if ($to !== '') {
    $cfg = config() ?? [];
    $host = preg_replace('/^www\.|:\d+$/', '', preg_replace('/[^a-z0-9.:-]/i', '', $_SERVER['HTTP_HOST'] ?? 'localhost'));
    $from = filter_var($cfg['from_email'] ?? '', FILTER_VALIDATE_EMAIL) ?: "no-reply@$host";
    $body = "New submission from the website: $form\n\n";
    foreach ($fields as $k => $v) $body .= (FIELDS[$k] ?? $k) . ": $v\n";
    $headers = ["From: Nanofab Website <$from>", "Reply-To: $email", 'MIME-Version: 1.0'];
    if ($file) {
        $b = 'nf_' . bin2hex(random_bytes(12));
        $safe = preg_replace('/[^A-Za-z0-9._ -]/', '_', $file['name']);
        $headers[] = "Content-Type: multipart/mixed; boundary=\"$b\"";
        $body = "--$b\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($body))
            . "--$b\r\nContent-Type: application/octet-stream\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=\"$safe\"\r\n\r\n"
            . chunk_split(base64_encode((string) file_get_contents(FILES_DIR . '/' . $file['stored']))) . "--$b--\r\n";
    } else {
        $headers[] = 'Content-Type: text/plain; charset=utf-8';
        $headers[] = 'Content-Transfer-Encoding: base64';
        $body = chunk_split(base64_encode($body));
    }
    $subject = mb_encode_mimeheader("[Website] $form: " . ($fields['name'] ?? $email), 'UTF-8');
    $record['emailed'] = @mail($to, $subject, $body, implode("\r\n", $headers), "-f$from");
}

update_json('submissions', function (array $all) use ($record) { array_unshift($all, $record); return array_slice($all, 0, 3000); });
reply(200, ['ok' => true]);
