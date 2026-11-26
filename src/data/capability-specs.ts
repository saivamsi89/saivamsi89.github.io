// Detailed manufacturing capabilities shown on /capabilities.
// Fill in `value` as figures are confirmed. Rows with an empty value show
// "On request", and the whole table stays hidden until at least one value
// in that group is filled in.
export type SpecRow = { label: string; value: string; note?: string };
export const capabilitySpecs: { id: string; title: string; icon: string; rows: SpecRow[] }[] = [
  {
    id: 'pcb-fab',
    title: 'PCB Fabrication',
    icon: 'Layers',
    rows: [
      { label: 'Layer count', value: '' },
      { label: 'Board types', value: '' },
      { label: 'Base materials', value: '' },
      { label: 'Maximum board size', value: '' },
      { label: 'Finished board thickness', value: '' },
      { label: 'Copper weight (outer / inner)', value: '' },
      { label: 'Minimum trace width / spacing', value: '' },
      { label: 'Minimum drilled hole size', value: '' },
      { label: 'Via types', value: '' },
      { label: 'Surface finishes', value: '' },
      { label: 'Solder mask colours', value: '' },
      { label: 'Impedance control', value: '' },
    ],
  },
  {
    id: 'flex',
    title: 'Flexible & Rigid-Flex PCB',
    icon: 'Cable',
    rows: [
      { label: 'Layer count', value: '' },
      { label: 'Materials', value: '' },
      { label: 'Minimum bend radius', value: '' },
      { label: 'Stiffener options', value: '' },
    ],
  },
  {
    id: 'assembly',
    title: 'PCB Assembly',
    icon: 'Cpu',
    rows: [
      { label: 'Assembly types', value: '' },
      { label: 'Smallest passive package', value: '' },
      { label: 'Minimum BGA / fine-pitch', value: '' },
      { label: 'Single / double-sided', value: '' },
      { label: 'Inspection', value: '' },
      { label: 'Testing', value: '' },
      { label: 'Order volumes', value: '' },
    ],
  },
  {
    id: 'stencil',
    title: 'Stencils & Enclosures',
    icon: 'Box',
    rows: [
      { label: 'Stencil types', value: '' },
      { label: 'Stencil thickness', value: '' },
      { label: 'Enclosure processes', value: '' },
    ],
  },
];
