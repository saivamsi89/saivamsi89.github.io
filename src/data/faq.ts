// FAQ content. Answers are deliberately general; add specific figures
// (lead times, layer counts, minimums) once capabilities are published.
export const faq: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: 'PCB Manufacturing & Fabrication',
    items: [
      { q: 'What types of PCBs can you manufacture?', a: 'We support rigid and flexible PCBs, including multilayer designs, from prototype quantities through to production. Detailed manufacturing limits will be published separately. Contact us with your requirements for specifics.' },
      { q: 'What files do I need to provide for PCB fabrication?', a: 'Gerber files (RS-274X) with drill files are standard. Include a fabrication drawing or notes specifying board thickness, layer stack-up, copper weight, surface finish and solder mask colour where relevant.' },
      { q: 'Do you offer PCB prototyping?', a: 'Yes. We support prototyping so you can validate your design before moving to larger production runs.' },
      { q: 'Do you manufacture PCB stencils?', a: 'Yes, PCB stencil manufacturing is part of our PCB services and can be supplied alongside your boards or assembly order.' },
    ],
  },
  {
    group: 'PCB Assembly & Component Sourcing',
    items: [
      { q: 'What do I need to provide for PCB assembly?', a: 'Typically your Gerber files, a Bill of Materials (BOM) with manufacturer part numbers, and a pick-and-place (centroid) file. Assembly drawings and any special instructions also help.' },
      { q: 'Can you source the components for my board?', a: 'Yes. Upload your BOM through our BOM Upload & Quotation tool and our team will check component availability and prepare a quotation.' },
      { q: 'What BOM file formats do you accept?', a: 'Spreadsheet formats such as .xlsx, .xls and .csv are preferred. Most EDA tools can export a BOM directly in these formats.' },
      { q: 'What if a component in my BOM is unavailable?', a: 'Our team will flag availability issues during review and can discuss suitable alternatives with you before proceeding.' },
    ],
  },
  {
    group: 'Embedded & Product Development',
    items: [
      { q: 'Can you take a product from idea to production?', a: 'Yes. Our end-to-end process covers requirement analysis, system architecture, hardware and PCB design, firmware and software, testing and validation, product integration, and production and deployment.' },
      { q: 'Do you develop firmware and embedded Linux?', a: 'Yes. We provide firmware development, embedded Linux development, microcontroller and processor integration, communication protocol integration, and hardware-software integration.' },
      { q: 'Do you work with startups?', a: 'Absolutely. We support startups and innovators with prototypes, PCB design and product development, as well as established businesses with manufacturing and engineering projects.' },
      { q: 'Can you provide engineers to work with our team?', a: 'Yes. Our Embedded Engineering Talent Solutions provide embedded, firmware, hardware design, PCB design, IoT and hardware testing engineers.' },
    ],
  },
  {
    group: 'Working With Us',
    items: [
      { q: 'How do I get a quotation?', a: 'For component sourcing, use the BOM Upload tool. For PCB, engineering or product development projects, submit an enquiry through the Contact page with as much detail as possible. You can attach files.' },
      { q: 'Is my design information kept confidential?', a: 'We treat customer designs and project information as confidential. If you require an NDA before sharing details, mention it in your enquiry and we will arrange one before you send files. See our Privacy Policy for how we handle uploaded files.' },
    ],
  },
];
