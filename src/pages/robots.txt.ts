// robots.txt: blocks all crawlers while the site is a preview; allows them (and points
// to the sitemap) once PUBLIC_SITE_MODE=production.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const production = import.meta.env.PUBLIC_SITE_MODE === 'production';
  const body = production
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`
    : `# Preview deployment: not for indexing yet.\nUser-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
