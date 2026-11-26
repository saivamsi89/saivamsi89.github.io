// Minimal static server for dist/ used by the test suite (mirrors typical static hosting).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
const port = Number(process.env.PORT || 4600);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json', '.pdf': 'application/pdf' };

async function resolve(p) {
  const file = join(root, normalize(decodeURIComponent(p)).replace(/^(\.\.[/\\])+/, ''));
  for (const c of [file, join(file, 'index.html'), file + '.html']) {
    try { if ((await stat(c)).isFile()) return c; } catch {}
  }
  return null;
}
createServer(async (req, res) => {
  const path = new URL(req.url, 'http://x').pathname;
  const file = await resolve(path);
  if (!file) { res.writeHead(404, { 'content-type': types['.html'] }); return res.end(await readFile(join(root, '404.html'))); }
  res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
  res.end(await readFile(file));
}).listen(port, () => console.log(`serving dist on http://localhost:${port}`));
