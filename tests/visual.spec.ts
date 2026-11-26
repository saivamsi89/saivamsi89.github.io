// Visual regression: full-page screenshots of key pages in light and dark themes.
// Animations are disabled and reduced motion is on, so screenshots are deterministic.
// After an intentional design change, refresh the baselines with:
//   npx playwright test tests/visual.spec.ts --update-snapshots
import { test, expect } from '@playwright/test';

const pages = ['/', '/services/', '/about/', '/products/', '/contact/', '/resources/bom-upload/'];

for (const scheme of ['light', 'dark'] as const) {
  for (const path of pages) {
    test(`visual: ${path} (${scheme})`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'baselines are desktop');
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      // hide the moving ticker; render off-screen content at its true size for a stable full-page capture
      await page.addStyleTag({ content: '#announce { display: none !important; } .cv-auto, .slide { content-visibility: visible !important; }' });
      const name = `${path.replace(/\//g, '_') || 'home'}-${scheme}.png`.replace(/^_+/, '') || `home-${scheme}.png`;
      await expect(page).toHaveScreenshot(name === `-${scheme}.png` ? `home-${scheme}.png` : name, {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixelRatio: 0.01,
        timeout: 20_000, // the home page is ~11,000px tall
      });
    });
  }
}
