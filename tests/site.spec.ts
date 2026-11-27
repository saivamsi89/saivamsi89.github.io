import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
// Every page listed in the sitemap.
const routes = [...readFileSync(join(dist, 'sitemap-0.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

test.describe('every page', () => {
  for (const route of routes) {
    test(`${route} loads cleanly`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page).toHaveTitle(/Nanofab Innovations/);
      expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, 'no horizontal scroll').toBeLessThanOrEqual(0);
      // Images must have alt text (empty alt allowed for decorative images).
      expect(await page.locator('img:not([alt])').count()).toBe(0);
      expect(errors).toEqual([]);
    });
  }
});

test('unknown URL shows the 404 page', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.getByText('doesn’t lead anywhere')).toBeVisible();
});

test('content is never left hidden if the reveal script fails', async ({ page }) => {
  // Simulate a browser where the reveal animation script breaks.
  await page.addInitScript(() => { (window as any).IntersectionObserver = undefined; });
  await page.goto('/');
  await page.waitForTimeout(3300); // safety net fires at 3s
  expect(await page.locator('[data-reveal]').count()).toBeGreaterThan(0);
  expect(await page.locator('[data-reveal]:not(.is-visible)').count()).toBe(0);
});

test('all internal links in the build resolve', () => {
  const files: string[] = [];
  const walk = (d: string) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); });
  walk(dist);
  const broken = new Set<string>();
  for (const f of files) {
    for (const [, href] of readFileSync(f, 'utf8').matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      const p = join(dist, href);
      if (![p, join(p, 'index.html'), p + '.html'].some((c) => existsSync(c) && statSync(c).isFile())) broken.add(`${href} (in ${f.replace(dist, '')})`);
    }
  }
  expect([...broken]).toEqual([]);
});

test.describe('contact form', () => {
  test('blocks empty submission and flags fields', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Submit Enquiry' }).click();
    await expect(page.locator('.form-status')).toContainText('required fields');
    await expect(page.locator('input[name=name]')).toHaveAttribute('aria-invalid', 'true');
  });

  test('pre-fills service and product from the URL', async ({ page }) => {
    await page.goto('/contact?service=Products%20%26%20Quotation&product=Widget');
    await expect(page.locator('select[name=service]')).toHaveValue('Products & Quotation');
    await expect(page.locator('textarea[name=message]')).toHaveValue(/Widget/);
  });

  test('valid submission without an endpoint shows the not-connected notice', async ({ page }) => {
    await page.goto('/contact');
    await page.fill('input[name=name]', 'Test User');
    await page.fill('input[name=email]', 'test@example.com');
    await page.fill('input[name=country]', 'India');
    await page.selectOption('select[name=service]', { index: 1 });
    await page.fill('textarea[name=message]', 'Testing');
    await page.check('input[name=consent]');
    await page.getByRole('button', { name: 'Submit Enquiry' }).click();
    await expect(page.locator('.form-status')).toContainText(/not connected|received/);
  });

  test('rejects files over 10 MB', async ({ page }) => {
    await page.goto('/contact');
    await page.fill('input[name=name]', 'Test User');
    await page.fill('input[name=email]', 'test@example.com');
    await page.fill('input[name=country]', 'India');
    await page.selectOption('select[name=service]', { index: 1 });
    await page.fill('textarea[name=message]', 'Testing');
    await page.check('input[name=consent]');
    await page.setInputFiles('input[type=file]', { name: 'big.zip', mimeType: 'application/zip', buffer: Buffer.alloc(11 * 1024 * 1024) });
    await page.getByRole('button', { name: 'Submit Enquiry' }).click();
    await expect(page.locator('.form-status')).toContainText('larger than 10 MB');
  });
});

test('BOM upload requires a file', async ({ page }) => {
  await page.goto('/resources/bom-upload');
  await page.fill('#bom-name', 'Test User');
  await page.fill('#bom-email', 'test@example.com');
  await page.fill('#bom-country', 'India');
  await page.selectOption('#bom-qty', { index: 1 });
  await page.check('form.enquiry-form input[name=consent]');
  await page.getByRole('button', { name: 'Submit BOM for Quotation' }).click();
  await expect(page.locator('.form-status')).toContainText('required fields');
});

test('theme follows the device; header has no theme switch or project button', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('#theme-toggle')).toHaveCount(0);
  await expect(page.locator('#site-header a', { hasText: 'Start Your Project' })).toHaveCount(0);
});

test('mobile menu opens and closes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/');
  await page.locator('#menu-toggle').click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-menu')).toBeHidden();
});

test('legal pages show company-detail placeholders until filled', async ({ page }) => {
  await page.goto('/privacy-policy');
  await expect(page.getByRole('heading', { name: /Grievance Officer/ })).toBeVisible();
});

test.describe('home scroll story', () => {
  test('advances through all six stages while scrolling', async ({ page }) => {
    await page.goto('/');
    const story = page.locator('#story');
    await expect(story).toHaveClass(/is-live/);
    for (const stage of [0, 3, 5]) {
      await page.evaluate((s) => {
        const el = document.getElementById('story')!;
        const top = el.getBoundingClientRect().top + scrollY;
        scrollTo(0, top + ((s + 0.5) / 6) * (el.offsetHeight - innerHeight));
      }, stage);
      await expect(story).toHaveAttribute('data-stage', String(stage));
      await expect(page.locator(`.story-step[data-step="${stage}"]`)).toHaveClass(/on/);
    }
  });

  test('reduced motion shows a static list and the finished board', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('#story')).not.toHaveClass(/is-live/);
    await expect(page.locator('.story-step')).toHaveCount(6);
    for (const t of await page.locator('.story-step-text').all()) await expect(t).toBeVisible();
  });
});

test('Blogs is in the main menu, highlighted on blog pages, and linked from home', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page.locator('a[href="/resources/blog"]', { hasText: 'All blogs' })).toBeVisible();
  await expect(page.locator('footer a[href="/resources/blog"]', { hasText: 'Blogs' })).toHaveCount(1);
  await page.goto('/resources/blog/');
  if (isMobile) {
    await page.locator('#menu-toggle').click();
    await expect(page.locator('#mobile-menu a[href="/resources/blog"]', { hasText: 'Blogs' })).toBeVisible();
  } else {
    const current = page.locator('header nav[aria-label=Primary] a[aria-current=page]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveText('Blogs');
  }
});

test.describe('home portal features', () => {
  test('hero carousel: tabs switch slides, pause button stops auto-advance', async ({ page }) => {
    await page.goto('/');
    const tab2 = page.locator('.hero-tab[data-go="1"]');
    await tab2.click();
    await expect(tab2).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.slide[data-slide="1"]')).toHaveClass(/is-active/);
    await page.locator('.hero-pause').click();
    await expect(page.locator('.hero-pause')).toHaveAttribute('aria-pressed', 'true');
    await page.waitForTimeout(7200); // longer than one slide duration
    await expect(page.locator('.slide[data-slide="1"]')).toHaveClass(/is-active/);
  });

  test('hero rolls sideways and loops seamlessly from the last slide to the first', async ({ page, isMobile }) => {
    test.skip(isMobile, 'arrows are desktop-only');
    await page.goto('/');
    await page.locator('.hero-pause').click();
    const n = await page.locator('.slide:not([data-clone])').count();
    await page.locator(`.hero-tab[data-go="${n - 1}"]`).click();
    await expect(page.locator('.track')).toHaveAttribute('style', new RegExp(`translateX\\(-${(n - 1) * 100}%\\)`));
    await page.locator('.hero-next').click();
    await expect(page.locator('.slide[data-slide="0"]:not([data-clone])')).toHaveClass(/is-active/);
    await expect(page.locator('.track')).toHaveAttribute('style', /translateX\((0px|0|-0%)\)/, { timeout: 3000 });
    await page.locator('.hero-prev').click();
    await expect(page.locator(`.slide[data-slide="${n - 1}"]`)).toHaveClass(/is-active/);
    await expect(page.locator('h1')).toHaveCount(1); // the loop copy must not duplicate the h1
  });

  for (const scheme of ['light', 'dark'] as const) {
    test(`every banner slide uses the same dark style (site in ${scheme} mode)`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/');
      await page.locator('.hero-pause').click();
      const n = await page.locator('.slide:not([data-clone])').count();
      const headerColor = await page.locator('#site-header .nav-link').first().evaluate((el) => getComputedStyle(el).color);
      for (let i = 0; i < n; i++) {
        await page.evaluate((k) => (document.querySelector(`.hero-tab[data-go="${k}"]`) as HTMLButtonElement).click(), i);
        const slide = page.locator(`.slide[data-slide="${i}"]:not([data-clone])`);
        await expect(slide).toHaveClass(/is-active/);
        // background must be dark: read the darkest colour stop of the slide's gradient
        const bg = await slide.evaluate((el) => getComputedStyle(el).backgroundImage);
        const lums = [...bg.matchAll(/rgb\((\d+), (\d+), (\d+)\)/g)].map(([, r, g, b]) => 0.2126 * +r + 0.7152 * +g + 0.0722 * +b);
        expect(Math.max(...lums), `slide ${i} background`).toBeLessThan(90);
        const heading = await slide.locator('h1, h2').first().evaluate((el) => getComputedStyle(el).color);
        expect(heading, `slide ${i} heading`).toBe('rgb(255, 255, 255)');
        // header text stays the same on every slide
        expect(await page.locator('#site-header .nav-link').first().evaluate((el) => getComputedStyle(el).color)).toBe(headerColor);
      }
      await expect(page.locator('html')).not.toHaveAttribute('data-hero-tone', /.*/);
    });
  }

  test('home banner has no quote form', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#hero form, #hero select, #hero input')).toHaveCount(0);
  });

  test('hero videos and posters exist', async ({ request }) => {
    for (const n of ['pcb-build', 'smart-lighting', 'showreel']) {
      for (const f of [`/videos/${n}.mp4`, `/videos/${n}-poster.jpg`]) expect((await request.get(f)).status(), f).toBe(200);
    }
  });

  test('instant quote: PCB specs pre-fill the contact form', async ({ page }) => {
    await page.goto('/');
    await page.locator('#qp-pcb select[name="Layers"]').selectOption('4');
    await page.locator('#qp-pcb input[name="Width (mm)"]').fill('80');
    await page.locator('#qp-pcb input[name="Height (mm)"]').fill('50');
    await page.locator('#qp-pcb button').click();
    await expect(page).toHaveURL(/\/contact\/?\?/);
    await expect(page.locator('select[name=service]')).toHaveValue('PCB Design & Manufacturing');
    await expect(page.locator('textarea[name=message]')).toHaveValue(/PCB fabrication quote request[\s\S]*Layers: 4[\s\S]*Width \(mm\): 80/);
  });

  test('instant quote: assembly tab goes to BOM upload with specs', async ({ page }) => {
    await page.goto('/');
    await page.locator('#qt-assembly').click();
    await expect(page.locator('#qp-assembly')).toBeVisible();
    await page.locator('#qp-assembly button').click();
    await expect(page).toHaveURL(/\/resources\/bom-upload\/?\?/);
    await expect(page.locator('textarea[name=message]')).toHaveValue(/PCB assembly quote request/);
  });

  test('announcement bar can be dismissed and stays dismissed', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#announce')).toBeVisible();
    await page.locator('.announce-close').click();
    await expect(page.locator('#announce')).toBeHidden();
    await page.reload();
    await expect(page.locator('#announce')).toBeHidden();
  });

  test('showreel opens in a modal player', async ({ page }) => {
    await page.goto('/');
    await page.locator('button.reel-open').first().click();
    await expect(page.locator('#reel-modal')).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(page.locator('#reel-modal')).not.toHaveAttribute('open', '');
  });
});

test.describe('unfinished sections stay out of sight', () => {
  test('Team and Case Studies are hidden from menus while empty, and not indexed', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header a[href="/team"], footer a[href="/team"]')).toHaveCount(0);
    await expect(page.locator('header a[href="/case-studies"], footer a[href="/case-studies"]')).toHaveCount(0);
    for (const path of ['/team/', '/case-studies/']) {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200); // still reachable directly
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    }
  });

  test('Contact hides the world map until locations exist; Products shows real offerings', async ({ page }) => {
    await page.goto('/contact/');
    await expect(page.locator('#world-map')).toHaveCount(0);
    await page.goto('/products/');
    await expect(page.getByRole('heading', { name: 'Smart Street Lighting' })).toBeVisible();
    await expect(page.locator('a[href="/infrastructure"]').first()).toBeVisible();
  });

  test('Services menu highlights the section in view', async ({ page, isMobile }) => {
    test.skip(isMobile, 'side menu is desktop-only');
    await page.goto('/services/');
    await page.locator('#iot').scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 200);
    await expect(page.locator('[data-spy="iot"]')).toHaveAttribute('aria-current', 'true');
  });
});

test.describe('accessibility audit (axe) in both themes', () => {
  for (const scheme of ['light', 'dark'] as const) {
    for (const route of routes) {
      test(`${route} has no serious accessibility issues (${scheme})`, async ({ page, isMobile }) => {
        test.skip(isMobile, 'audited once, on desktop');
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
        await page.goto(route);
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
        const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
        expect(serious.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
      });
    }
  }
});

test('design-system discipline: no hardcoded colours or !important overrides outside artwork', () => {
  const src = new URL('../src/', import.meta.url).pathname;
  // Illustration/brand-mark files may use literal colours; the style guide documents them.
  const allow = /components\/home\/(SlideArt|Illo|ScrollStory)\.astro$|components\/(WorldMap|Logo)\.astro$|pages\/styleguide\.astro$/;
  const rules: [string, RegExp][] = [
    ['hex colour (use a token)', /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/],
    ['raw grey palette class (use text-fg-*, border-line, bg-surface-*)', /\b(text|bg|border|divide|ring)-(slate|gray|zinc|neutral)-\d+/],
    ['retired class (use bg-surface-2 / text-fg)', /\bbg-paper\b|\btext-ink-900\b/],
    ['palette variable used for a themed role (use var(--color-fg|fg-muted|accent|surface…))', /var\(--color-(ink-900|signal-[67]00|copper-600|paper|slate-\d+)\)/],
    ['!important utility override (add a variant instead)', /(?<=[\s"'`])!(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|text|rounded|bg|w|h)-/],
  ];
  const problems: string[] = [];
  const walk = (d: string) => readdirSync(d).forEach((f) => {
    const p = join(d, f);
    if (statSync(p).isDirectory()) return f === 'content' || f === 'assets' || f === 'styles' ? undefined : walk(p);
    if (!/\.(astro|ts)$/.test(p) || allow.test(p)) return;
    readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
      if (line.includes('theme-color')) return; // browser chrome colour must be a literal
      for (const [why, re] of rules) if (re.test(line)) problems.push(`${p.replace(src, '')}:${i + 1} ${why}`);
    });
  });
  walk(src);
  expect(problems).toEqual([]);
});

test('every banner photo is registered in the image credits', () => {
  const dir = new URL('../src/assets/hero/', import.meta.url).pathname;
  const registry = readFileSync(new URL('../src/data/credits.ts', import.meta.url).pathname, 'utf8');
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)) : [];
  expect(files.filter((f) => !registry.includes(`file: '${f}'`))).toEqual([]);
});

test('no image with unconfirmed rights gets deployed', () => {
  test.skip(!process.env.CI, 'local previews may use unconfirmed images');
  const registry = readFileSync(new URL('../src/data/credits.ts', import.meta.url).pathname, 'utf8');
  expect(registry.match(/license: 'Unconfirmed'/g) ?? []).toEqual([]);
});

test('pointing at a banner progress segment shows that slide and holds it', async ({ page, isMobile }) => {
  test.skip(isMobile, 'mouse only');
  await page.goto('/');
  for (const i of [3, 1, 4]) {
    await page.locator(`.hero-tab[data-go="${i}"]`).hover();
    await expect(page.locator(`.slide[data-slide="${i}"]:not([data-clone])`)).toHaveClass(/is-active/);
  }
  await page.waitForTimeout(7200);
  await expect(page.locator('.slide[data-slide="4"]')).toHaveClass(/is-active/);
  await page.mouse.move(5, 400);
  await expect(page.locator('.slide[data-slide="0"]:not([data-clone])')).toHaveClass(/is-active/, { timeout: 9000 });
});
