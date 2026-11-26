// Register of third-party images used on the site. Every stock/licensed image MUST be
// listed here (a test enforces it). Shown on /credits; licences that require attribution
// (e.g. CC BY) are satisfied by that page.
export type Credit = {
  file: string; // file name in src/assets/hero/ (or public path)
  title: string;
  author: string;
  license: 'CC0' | 'Public domain' | 'CC BY 2.0' | 'CC BY 3.0' | 'CC BY 4.0' | 'Unsplash License' | 'Pexels License' | 'Commercial licence (purchased)' | 'Nanofab (own)';
  licenseUrl?: string;
  source: string;
  changes?: string;
};

export const credits: Credit[] = [
  {
    file: 'street-lamp-dusk.jpg',
    title: 'Evening',
    author: 'XoMEoX',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Evening_(23885348798).jpg',
    changes: 'Resized, cropped and colour-graded to blend with the site design.',
  },
];
