// Content managed in the PHP dashboard (Bluehost build only: PUBLIC_DYNAMIC=1).
export type DynSlide = { id: string; image: string; title: string; accent: string; bullets: string[]; buttonLabel: string; buttonLink: string };
export type DynProduct = { id: string; image: string; name: string; category: string; description: string };
export type DynContent = { showBuiltinSlides: boolean; slides: DynSlide[]; products: DynProduct[] };

export const dynamicEnabled = import.meta.env.PUBLIC_DYNAMIC === '1';

export async function loadContent(): Promise<DynContent | null> {
  if (!dynamicEnabled) return null;
  try {
    const res = await fetch('/api/content.php', { cache: 'no-store', signal: AbortSignal.timeout(3000) });
    return res.ok ? ((await res.json()) as DynContent) : null;
  } catch {
    return null; // the built-in content stays
  }
}

export const safeImage = (s: string) => (/^\/uploads\/[a-z0-9]+\.(webp|jpg|png)$/.test(s) ? s : '');
export const safeLink = (s: string) => (/^(\/(?!\/)|https:\/\/)/.test(s) ? s : '/contact');
