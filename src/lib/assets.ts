// Build-time discovery of images dropped into src/assets/.
import type { ImageMetadata } from 'astro';

type Mod = { default: ImageMetadata };
const byName = (mods: Record<string, Mod>) =>
  Object.fromEntries(Object.entries(mods).map(([p, m]) => [p.split('/').pop()!, m.default]));
const sorted = (mods: Record<string, Mod>) =>
  Object.entries(mods).sort(([a], [b]) => a.localeCompare(b)).map(([p, m]) => ({ file: p.split('/').pop()!, src: m.default }));

export const clientLogos = byName(import.meta.glob<Mod>('/src/assets/clients/*.{svg,png,jpg,jpeg,webp}', { eager: true }));
export const certLogos = byName(import.meta.glob<Mod>('/src/assets/certifications/*.{svg,png,jpg,jpeg,webp}', { eager: true }));

/** Facility photos: src/assets/photos/facility/*. The file name becomes the caption ("smt-line.jpg" → "Smt line"). */
export const facilityPhotos = sorted(import.meta.glob<Mod>('/src/assets/photos/facility/*.{png,jpg,jpeg,webp,avif}', { eager: true })).map((p) => ({
  ...p,
  caption: p.file.replace(/\.[^.]+$/, '').replace(/^\d+[-_]/, '').replace(/[-_]+/g, ' ').replace(/^./, (c) => c.toUpperCase()),
}));

/** Service photos: src/assets/photos/services/<service-id>.jpg (pcb, embedded, product, iot, talent). */
export const servicePhotos = byName(import.meta.glob<Mod>('/src/assets/photos/services/*.{png,jpg,jpeg,webp,avif}', { eager: true }));
export const servicePhoto = (id: string) => Object.entries(servicePhotos).find(([f]) => f.replace(/\.[^.]+$/, '') === id)?.[1];

/** Banner photos: src/assets/hero/<file>. Referenced by file name from slide data and page banners. */
export const heroPhotos = byName(import.meta.glob<Mod>('/src/assets/hero/*.{png,jpg,jpeg,webp,avif}', { eager: true }));
export const heroPhoto = (file?: string) => {
  if (!file) return undefined;
  const img = heroPhotos[file];
  if (!img) throw new Error(`Banner photo not found: src/assets/hero/${file}`);
  return img;
};
