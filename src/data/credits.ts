// Register of third-party images used on the site. Every stock/licensed image MUST be
// listed here (a test enforces it). Shown on /credits; licences that require attribution
// (e.g. CC BY) are satisfied by that page.
export type Credit = {
  file: string; // file name in src/assets/hero/ (or public path)
  title: string;
  author: string;
  license: 'CC0' | 'Public domain' | 'CC BY 2.0' | 'CC BY 3.0' | 'CC BY 4.0' | 'Unsplash License' | 'Pexels License' | 'Commercial licence (purchased)' | 'Nanofab (own)' | 'Unconfirmed' | 'Rights confirmed by site owner';
  licenseUrl?: string;
  source: string;
  changes?: string;
};

export const credits: Credit[] = [
  { file: 'iot-dashboard-engineer.jpg', title: 'Engineer at a digital dashboard', author: 'Supplied by Nanofab', license: 'Rights confirmed by site owner', source: '', changes: 'Blended with the site design.' },
  // The four photos supplied by the owner were confirmed by them on 27 Nov 2026; add source/author when known.
  // 'Unconfirmed' = rights not yet verified. Deployment is blocked while any entry has it:
  // confirm the licence, fill in author/source, then change the value (or remove the image).
  { file: 'engineers-inspecting.jpg', title: 'Engineers inspecting machinery (AI-generated)', author: 'Vecteezy', license: 'Rights confirmed by site owner', source: 'https://www.vecteezy.com/', changes: 'Resized and blended with the site design.' },
  { file: 'pcb-assembly.jpg', title: 'PCB assembly', author: 'Supplied by Nanofab', license: 'Rights confirmed by site owner', source: '', changes: 'Blended with the site design.' },
  { file: 'team-meeting.webp', title: 'Team meeting', author: 'Supplied by Nanofab', license: 'Rights confirmed by site owner', source: '', changes: 'Blended with the site design.' },
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
