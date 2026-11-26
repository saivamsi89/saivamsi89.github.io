// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';

// Pages hidden until they have real content are left out of the sitemap too.
const published = (dir) => {
  try {
    return readdirSync(dir).filter((f) => f.endsWith('.md') && !/^draft:\s*true/m.test(readFileSync(`${dir}/${f}`, 'utf8'))).length > 0;
  } catch { return false; }
};
const hiddenPages = [
  !published('./src/content/team') && '/team/',
  !published('./src/content/case-studies') && '/case-studies/',
  '/styleguide/', // internal design-system reference
].filter(Boolean);

// Deployment address. Set SITE_URL (and BASE_PATH if served from a sub-folder) in the
// environment; the GitHub Actions workflow sets these automatically.
export default defineConfig({
  site: process.env.SITE_URL || 'https://www.nanofabinnovations.com',
  base: process.env.BASE_PATH || undefined,
  integrations: [sitemap({ filter: (page) => !hiddenPages.some((p) => new URL(page).pathname.startsWith(p)) })],
  vite: { plugins: [tailwindcss()] },
});
