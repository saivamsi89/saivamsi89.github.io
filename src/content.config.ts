import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Images: put image files next to the Markdown file (or anywhere under src/)
// and reference them with a relative path, e.g. `image: ./iot-gateway.jpg`.
// Astro then generates optimised, responsive WebP versions at build time.
// `draft: true` entries show only in `npm run dev`, never in production.

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      category: z.string(),
      summary: z.string(),
      image: image().nullish(),
      gallery: z.array(image()).default([]),
      specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      configurations: z.array(z.string()).default([]),
      datasheet: z.string().nullish(), // PDF path under /public, e.g. /datasheets/nf-iot-gw.pdf
      price: z.string().nullish(), // e.g. "From ₹4,999". Omit to show "Price on request"
      order: z.number().default(100),
      draft: z.boolean().default(false),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      author: z.string().default('Nanofab Engineering Team'),
      tags: z.array(z.string()).default([]),
      cover: image().nullish(),
      draft: z.boolean().default(false),
    }),
});

// Leadership: `role` should match one of leadershipRoles in src/data/site.ts.
const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      photo: image().nullish(),
      linkedin: z.url().nullish(),
      order: z.number().default(100),
      draft: z.boolean().default(false),
    }),
});

// Case studies: problem → solution → result. Only publish real projects,
// and name the client only with their permission.
const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string().default('Confidential client'),
      industry: z.string(), // should match an industry title in src/data/site.ts
      services: z.array(z.string()).default([]),
      summary: z.string(),
      cover: image().nullish(),
      challenge: z.string(),
      solution: z.string(),
      results: z.array(z.string()).default([]),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      date: z.coerce.date(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { products, blog, team, caseStudies };
