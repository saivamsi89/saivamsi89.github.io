// Central site content. Edit copy here; pages read from this file.

export const site = {
  name: 'Nanofab Innovations',
  legalName: 'Nanofab Innovations Pvt. Ltd.',
  tagline: 'Engineering Innovation. Enabling Possibilities.',
  description:
    'Nanofab Innovations is a full-stack electronics engineering and manufacturing company delivering PCB design and manufacturing, embedded systems, hardware engineering, IoT and intelligent automation.',
  pillars: ['PCB Engineering', 'Embedded Systems', 'Product Development', 'IoT & Automation'],
  // TODO: replace with real contact details
  contact: {
    email: '',
    phone: '',
    address: '',
  },
  social: {
    linkedin: '',
  },
  // Legal entity details used by the Privacy Policy, Terms and footer.
  // Empty values render as highlighted placeholders on the legal pages.
  legal: {
    cin: '', // Corporate Identification Number, e.g. U26100KA2024PTC000000
    registeredAddress: '',
    jurisdictionCity: '', // courts with jurisdiction, e.g. "Bengaluru, Karnataka"
    grievanceOfficer: { name: '', designation: 'Grievance Officer', email: '', phone: '' },
    privacyEmail: '', // inbox for privacy / data requests
    lastUpdated: '23 November 2026',
    reviewedByCounsel: false, // set true once counsel approves; hides the draft notice
  },
};

export type NavItem = { label: string; href: string; children?: { label: string; href: string; desc?: string }[] };

export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'PCB Design & Manufacturing', href: '/services#pcb', desc: 'Schematic to assembled boards' },
      { label: 'Embedded Systems Engineering', href: '/services#embedded', desc: 'Hardware, firmware, Linux' },
      { label: 'End-to-End Product Development', href: '/services#product', desc: 'Idea to production' },
      { label: 'IoT & Intelligent Automation', href: '/services#iot', desc: 'Connected, smart systems' },
      { label: 'Engineering Talent Solutions', href: '/services#talent', desc: 'Specialist engineers' },
      { label: 'Engineering Capabilities', href: '/capabilities', desc: 'What we can build' },
    ],
  },
  { label: 'Industries', href: '/industries' },
  { label: 'Products', href: '/products' },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'Engineering Blog', href: '/resources/blog', desc: 'Insights & updates' },
      { label: 'FAQ', href: '/resources/faq', desc: 'Common questions' },
      { label: 'Case Studies', href: '/case-studies', desc: 'Projects we have delivered' },
      { label: 'BOM Upload & Quotation', href: '/resources/bom-upload', desc: 'Get component quotes' },
      { label: 'Infrastructure', href: '/infrastructure', desc: 'Smart street lighting' },
      { label: 'Management Team', href: '/team', desc: 'Our leadership' },
    ],
  },
  { label: 'Blogs', href: '/resources/blog' },
  { label: 'Contact', href: '/contact' },
];

export const footerLinks = {
  quick: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Industries', href: '/industries' },
    { label: 'Products', href: '/products' },
    { label: 'Resources', href: '/resources' },
    { label: 'Blogs', href: '/resources/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  company: [
    { label: 'Engineering Capabilities', href: '/capabilities' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Infrastructure', href: '/infrastructure' },
    { label: 'Management Team', href: '/team' },
    { label: 'BOM Upload', href: '/resources/bom-upload' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Disclaimer', href: '/disclaimer' },
    { label: 'Image Credits', href: '/credits' },
  ],
};

// ---------- Home ----------
export const whatWeDo = [
  { icon: 'CircuitBoard', title: 'PCB Design & Manufacturing', href: '/services#pcb', text: 'Schematic and layout through fabrication, stencils and assembly.' },
  { icon: 'Cpu', title: 'Electronic Hardware Development', href: '/services#product', text: 'Robust hardware architecture and circuit design for real-world products.' },
  { icon: 'Code', title: 'Embedded Systems & Firmware Engineering', href: '/services#embedded', text: 'Firmware, embedded Linux and hardware-software integration.' },
  { icon: 'Boxes', title: 'PCB Assembly & Component Sourcing', href: '/resources/bom-upload', text: 'Reliable assembly backed by component sourcing support.' },
  { icon: 'Wifi', title: 'IoT & Intelligent Automation', href: '/services#iot', text: 'Connected devices, sensing, remote monitoring and smart control.' },
  { icon: 'Rocket', title: 'End-to-End Product Development', href: '/services#product', text: 'One partner from concept to production-ready product.' },
];

export const journey = [
  { title: 'Concept & Requirement Analysis', icon: 'Lightbulb' },
  { title: 'System Architecture & Design', icon: 'Network' },
  { title: 'Hardware & PCB Development', icon: 'CircuitBoard' },
  { title: 'Component Sourcing & Manufacturing', icon: 'Factory' },
  { title: 'Firmware Development & Integration', icon: 'Code' },
  { title: 'Testing, Validation & Deployment', icon: 'ShieldCheck' },
];

export const whyNanofab = [
  { icon: 'Layers', title: 'End-to-end engineering capabilities' },
  { icon: 'Puzzle', title: 'Integrated hardware and software expertise' },
  { icon: 'Truck', title: 'Manufacturing and component sourcing support' },
  { icon: 'Building2', title: 'Solutions for startups and established businesses' },
  { icon: 'Wrench', title: 'Engineering-focused approach' },
  { icon: 'TrendingUp', title: 'Scalable product development support' },
];

// ---------- Services ----------
export const services = [
  {
    id: 'pcb',
    icon: 'CircuitBoard',
    title: 'PCB Design & Manufacturing',
    intro: 'Complete PCB solutions, from initial circuit design to fabrication and assembly.',
    items: [
      'PCB Schematic Design',
      'PCB Layout Design',
      'Rigid PCB Fabrication',
      'Flexible PCB Fabrication',
      'PCB Stencil Manufacturing',
      'PCB Assembly',
      'Electronic Component Sourcing',
      'Enclosure Design & Manufacturing',
    ],
  },
  {
    id: 'embedded',
    icon: 'Cpu',
    title: 'Embedded Systems Engineering',
    intro:
      'We develop customized embedded solutions combining hardware, firmware and software to meet specific application requirements.',
    items: [
      'Embedded Hardware Design',
      'Microcontroller & Processor Integration',
      'Firmware Development',
      'Embedded Linux Development',
      'Hardware-Software Integration',
      'Communication Protocol Integration',
      'Testing & Debugging',
    ],
  },
  {
    id: 'product',
    icon: 'Rocket',
    title: 'End-to-End Product Development',
    intro:
      'Transform your idea into a functional and production-ready electronic product with our complete engineering workflow.',
    items: [],
  },
  {
    id: 'iot',
    icon: 'Wifi',
    title: 'IoT & Intelligent Automation',
    intro:
      'Develop connected products and intelligent systems that improve operational efficiency and enable real-time monitoring.',
    items: [
      'IoT Device Development',
      'Sensor Integration',
      'Wireless Communication',
      'Remote Monitoring Systems',
      'Smart Control Systems',
      'Industrial Automation',
      'Dashboard & Device Integration',
    ],
  },
  {
    id: 'talent',
    icon: 'Users',
    title: 'Embedded Engineering Talent Solutions',
    intro:
      'Flexible engineering talent support for businesses requiring specialized electronics and embedded engineering expertise.',
    items: [
      'Embedded Engineers',
      'Firmware Developers',
      'Hardware Design Engineers',
      'PCB Design Engineers',
      'IoT Engineers',
      'Hardware Testing Engineers',
    ],
  },
];

export const developmentProcess = [
  'Requirement Analysis',
  'System Architecture',
  'Hardware & Circuit Design',
  'PCB Design & Prototyping',
  'Firmware & Software Development',
  'Testing & Validation',
  'Product Integration',
  'Production & Deployment',
];

export const serviceOptions = [
  'PCB Design & Manufacturing',
  'PCB Assembly & Component Sourcing',
  'Embedded Systems Engineering',
  'End-to-End Product Development',
  'IoT & Intelligent Automation',
  'Embedded Engineering Talent Solutions',
  'Products & Quotation',
  'Infrastructure Solutions',
  'Other',
];

// ---------- Industries ----------
export const industries = [
  { icon: 'Factory', title: 'Industrial Automation', text: 'Industrial controllers, monitoring systems and automation electronics.' },
  { icon: 'Car', title: 'Automotive Electronics', text: 'Electronic control modules, embedded systems and automotive hardware.' },
  { icon: 'Sprout', title: 'Agriculture & Smart Farming', text: 'Sensor-based monitoring, connected agriculture and intelligent control systems.' },
  { icon: 'HeartPulse', title: 'Medical Electronics', text: 'Electronic hardware and embedded solutions for healthcare applications.' },
  { icon: 'RadioTower', title: 'Telecommunications', text: 'Communication hardware, connectivity and electronic systems.' },
  { icon: 'Bot', title: 'Robotics', text: 'Embedded controllers, robotic electronics and hardware integration.' },
  { icon: 'Smartphone', title: 'Consumer Electronics', text: 'Customized electronic products, PCB development and embedded solutions.' },
  { icon: 'Zap', title: 'Energy & Infrastructure', text: 'Intelligent monitoring, control systems and smart infrastructure solutions.' },
];

// ---------- Capabilities ----------
export const capabilities = [
  {
    icon: 'CircuitBoard',
    title: 'PCB Manufacturing Capabilities',
    items: ['Rigid and Flexible PCBs', 'Multilayer PCB Design', 'PCB Prototyping', 'PCB Fabrication', 'PCB Assembly', 'Component Sourcing'],
  },
  {
    icon: 'Cpu',
    title: 'Embedded Engineering Capabilities',
    items: ['Hardware Architecture', 'Schematic Design', 'PCB Development', 'Firmware Engineering', 'Embedded Linux', 'Hardware-Software Integration'],
  },
  {
    icon: 'Rocket',
    title: 'Product Development Capabilities',
    items: ['Concept Development', 'Product Architecture', 'Prototyping', 'Functional Testing', 'Product Validation', 'Production Readiness'],
  },
];

// ---------- Infrastructure ----------
export const streetLightingFeatures = [
  { icon: 'LayoutDashboard', title: 'Centralized lighting management' },
  { icon: 'Signal', title: 'Remote monitoring and control' },
  { icon: 'Activity', title: 'Real-time operational visibility' },
  { icon: 'Lightbulb', title: 'Intelligent lighting management' },
  { icon: 'Network', title: 'Connected infrastructure' },
];

// ---------- Contact ----------
export const audiences = [
  { icon: 'Building2', title: 'For Businesses', text: 'Discuss manufacturing partnerships, OEM requirements and engineering projects.' },
  { icon: 'Rocket', title: 'For Startups & Innovators', text: 'Get support with prototypes, PCB design and product development.' },
  { icon: 'Wrench', title: 'For Engineers', text: 'Explore our products, technical resources and engineering services.' },
];

// Global presence map pins. Coordinates are lon/lat.
// TODO: replace with real offices, partners and representatives.
export const locations: { name: string; type: 'Office' | 'Partner' | 'Representative'; city: string; lon: number; lat: number }[] = [];

export const leadershipRoles = [
  'Founder & CEO',
  'Co-Founder & CTO',
  'Co-Founder & Managing Director',
  'Chief Strategy Officer',
  'Chief Financial Officer',
  'Head of Legal Panel',
];

// ---------- Trust signals ----------
// Every block below is hidden until it has real entries. Use only verifiable facts.
export const trust = {
  // e.g. { value: '250+', label: 'Projects delivered' }, { value: '2019', label: 'Founded' }
  stats: [] as { value: string; label: string }[],
  // Logo files go in src/assets/clients/ (SVG or PNG). Only list clients who have agreed.
  // e.g. { name: 'Acme Robotics', logo: 'acme.svg' }
  clients: [] as { name: string; logo: string }[],
  // Badge files (optional) go in src/assets/certifications/.
  // e.g. { name: 'ISO 9001:2015', description: 'Quality management', logo: 'iso9001.png' }
  certifications: [] as { name: string; description?: string; logo?: string }[],
  // e.g. { quote: '…', name: 'Jane Doe', role: 'CTO, Acme Robotics' }, with permission
  testimonials: [] as { quote: string; name: string; role: string }[],
};
