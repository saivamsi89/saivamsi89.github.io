<?php
// Public, read-only: banners and products managed in the dashboard.
require __DIR__ . '/lib.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$c = read_json('content');
echo json_encode([
    'showBuiltinSlides' => $c['showBuiltinSlides'] ?? true,
    'slides' => array_values($c['slides'] ?? []),
    'products' => array_values($c['products'] ?? []),
], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
