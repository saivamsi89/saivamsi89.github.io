// Builds the Bluehost upload package: static site + PHP dashboard/API → nanofab-bluehost.zip
//   npm run package                                    hidden preview (noindex)
//   SITE_URL=https://yourdomain.com npm run package -- --production
import { execFileSync } from 'node:child_process';
import { cpSync, rmSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const out = 'dist-bluehost';
const zip = 'nanofab-bluehost.zip';
const production = process.argv.includes('--production');
const env = {
  ...process.env,
  PUBLIC_DYNAMIC: '1',
  PUBLIC_VISITOR_EMAIL: '1',
  PUBLIC_FORM_ENDPOINT: '/api/submit.php',
  PUBLIC_SITE_MODE: production ? 'production' : 'preview',
  BASE_PATH: '',
};
const run = (cmd, args, cwd = root) => execFileSync(cmd, args, { cwd, env, stdio: 'inherit' });

rmSync(root + out, { recursive: true, force: true });
rmSync(root + zip, { force: true });
run('npx', ['astro', 'build', '--outDir', out]);
// never ship a real config or local data
cpSync(root + 'server', root + out, { recursive: true, filter: (src) => !/private\/(config\.php|data)|uploads\/(?!\.htaccess)./.test(src) });
run('zip', ['-qr', '../' + zip, '.'], root + out);
console.log(`\nReady: ${zip} (${production ? 'PRODUCTION, indexable' : 'preview, hidden from search engines'})`);
console.log(`Domain used for links: ${env.SITE_URL || 'https://www.nanofabinnovations.com (set SITE_URL to change)'}`);
