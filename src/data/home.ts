// Home page content: hero banner slides, announcement ticker, instant-quote options.
// All banner slides deliberately share one dark style so the banner never flips between themes.
// Real media: put a photo/render (landscape, ideally ≥2000 px wide) in src/assets/hero/, register it
// in src/data/credits.ts, and set a slide's `photo`. It is optimised automatically and blended into the slide.

export type HeroSlide = {
  id: string;
  tab: string; // label for the progress indicator (screen readers / tooltip)
  eyebrow?: string;
  title: string;
  accent?: string; // highlighted line of the title (gradient)
  bullets?: string[];
  art?: 'showcase' | 'boards' | 'iot' | 'lighting' | 'assembly';
  photo?: string; // photo in src/assets/hero/ (must be listed in data/credits.ts), shown blended into the slide instead of `art`
  bg: 'showcase' | 'deep' | 'ocean' | 'teal' | 'night'; // named brand gradient (see --grad-* in global.css)
  cta: { label: string; href: string };
};

export const heroSlides: HeroSlide[] = [
  {
    id: 'nanofab',
    tab: 'Nanofab Innovations',
    eyebrow: 'Full-Stack Electronics Engineering & Manufacturing',
    title: 'Engineering Innovation.',
    accent: 'Enabling Possibilities.',
    bullets: ['PCB design, fabrication and assembly', 'Embedded systems, firmware and IoT', 'From concept to production-ready products'],
    art: 'showcase',
    bg: 'showcase',
    cta: { label: 'Start Your Project', href: '/contact' },
  },
  {
    id: 'pcb',
    tab: 'Multilayer PCBs',
    title: 'Multilayer PCBs',
    accent: 'Design to Assembly',
    bullets: ['Schematic and multilayer layout, reviewed for manufacturability', 'Rigid and flexible fabrication, stencils and assembly', 'Component sourcing from your BOM'],
    art: 'boards',
    bg: 'deep',
    cta: { label: 'Explore PCB Services', href: '/services#pcb' },
  },
  {
    id: 'assembly',
    tab: 'BOM to assembly',
    title: 'Upload Your BOM.',
    accent: 'We Source & Assemble.',
    bullets: ['Component availability checks and alternates', 'PCB assembly for prototypes and production runs', 'One quotation for parts, boards and assembly'],
    art: 'assembly',
    bg: 'ocean',
    cta: { label: 'Upload Your BOM', href: '/resources/bom-upload' },
  },
  {
    id: 'iot',
    tab: 'Embedded & IoT',
    title: 'Embedded & IoT',
    accent: 'Built End to End',
    bullets: ['Embedded hardware, firmware and embedded Linux', 'Sensor integration and wireless connectivity', 'Devices, gateways and dashboards that work together'],
    art: 'iot',
    bg: 'teal',
    cta: { label: 'Discuss Your Project', href: '/contact?service=Embedded%20Systems%20Engineering' },
  },
  {
    id: 'infra',
    tab: 'Smart lighting',
    title: 'Smart Street Lighting',
    accent: 'Connected Control',
    bullets: ['Centralized lighting management', 'Remote monitoring and control', 'Real-time operational visibility'],
    art: 'lighting',
    photo: 'street-lamp-dusk.jpg',
    bg: 'night',
    cta: { label: 'Explore Infrastructure', href: '/infrastructure' },
  },
];

// Scrolling announcement bar above the header. Change `announcementVersion`
// to show the bar again to visitors who dismissed an earlier version.
export const announcementVersion = '2026-11';
export const announcements: { text: string; href: string; tag?: string }[] = [
  { tag: 'Quote', text: 'Upload your BOM for component availability checks and a quotation', href: '/resources/bom-upload' },
  { tag: 'PCB', text: 'Rigid and flexible PCB fabrication, stencils and assembly under one roof', href: '/services#pcb' },
  { tag: 'Engineering', text: 'Embedded, firmware and IoT engineers available for your project', href: '/services#talent' },
  { tag: 'Infrastructure', text: 'Smart street lighting with centralized monitoring and control', href: '/infrastructure' },
  { tag: 'Blog', text: 'New guide: preparing your BOM for faster, more accurate quotations', href: '/resources/blog/preparing-your-bom-for-faster-quotations' },
];

// Instant-quote panel options. These are request options, not price commitments.
// Ask the engineering team to confirm they match current capabilities.
export const quoteOptions = {
  pcb: {
    material: ['Rigid (FR-4)', 'Flexible', 'Not sure'],
    layers: ['1', '2', '4', '6', '8', '10+'],
    quantity: ['5', '10', '25', '50', '100', '250', '500', '1,000', '5,000+'],
    thickness: ['0.8 mm', '1.0 mm', '1.2 mm', '1.6 mm', '2.0 mm', 'Other'],
    finish: ['HASL', 'Lead-free HASL', 'ENIG', 'OSP', 'Not sure'],
  },
  assembly: {
    boards: ['1–10', '10–100', '100–1,000', '1,000+'],
    parts: ['Up to 20', '20–50', '50–150', '150+'],
    sides: ['Top only', 'Top and bottom'],
    sourcing: ['Nanofab sources all parts', 'I will supply some parts', 'I will supply all parts'],
  },
  stencil: {
    type: ['Framed', 'Frameless'],
    thickness: ['0.10 mm', '0.12 mm', '0.15 mm', 'Not sure'],
    quantity: ['1', '2', '3–5', '5+'],
  },
  engineering: {
    service: ['PCB Design & Layout', 'Embedded Hardware Design', 'Firmware / Embedded Linux', 'IoT Device Development', 'End-to-End Product Development', 'Engineering Talent'],
    stage: ['Idea / concept', 'Prototype', 'Ready for production', 'Existing product'],
  },
};
