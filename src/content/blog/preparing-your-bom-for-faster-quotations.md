---
title: Preparing Your BOM for Faster, More Accurate Quotations
description: A clean Bill of Materials is the fastest route to an accurate component quote. Here is what to include, and the common mistakes that slow sourcing down.
date: 2026-11-20
tags: [Component Sourcing, PCB Assembly]
---

A Bill of Materials (BOM) is the single document that connects your design to the real world of
component availability, pricing and assembly. The clearer it is, the faster a sourcing team can
check availability and come back with a quotation, with fewer rounds of clarification.

## What every BOM line should include

At minimum, each line item should carry:

- **Reference designators**: e.g. `R1, R4, R7`. These tie each part to its position on the board.
- **Quantity per board**: this should match the number of reference designators.
- **Manufacturer name and Manufacturer Part Number (MPN)**: the most important column. A full MPN removes ambiguity.
- **Description**: value, tolerance, voltage/power rating and package, e.g. *10 kΩ, 1%, 0.1 W, 0402*.
- **Footprint / package**: so the part can be checked against your PCB layout.

Helpful extras:

- **Approved alternates**: second-source MPNs you have already validated.
- **DNP (Do Not Populate) flags**: for footprints that should stay empty.
- **Notes**: special handling, orientation, or "customer-supplied" parts.

## Common mistakes that slow quotations down

1. **Missing or partial MPNs.** "10k resistor" can match thousands of parts. Provide the exact MPN or a clear specification.
2. **Quantity mismatches.** If the quantity says 4 but there are 5 reference designators, someone has to stop and ask.
3. **Obsolete or end-of-life parts.** Check lifecycle status early. Designing around an EOL part creates problems later.
4. **Mixed units and formats.** Keep values consistent (e.g. always `kΩ`, always `µF`).
5. **Multiple BOM versions in circulation.** Put the revision number in the file name and in the file itself.

## Recommended file formats

Spreadsheet formats (`.xlsx`, `.xls`, `.csv`) are the easiest to process. Most EDA tools, including
KiCad, Altium and Eagle, can export a BOM directly. Keep one row per unique part with grouped reference
designators.

## Tell us your build quantity

Pricing and availability depend heavily on volume. Mention whether you need a prototype run, a pilot
batch or production quantities, along with your target timeline.

---

**Ready to source?** [Upload your BOM](/resources/bom-upload) and our team will review the component
list and get back to you with a quotation.
