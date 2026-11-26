import { getCollection } from 'astro:content';

// Drafts are visible in `astro dev` only.
const visible = ({ data }: { data: { draft: boolean } }) => import.meta.env.DEV || !data.draft;

export const getProducts = async () =>
  (await getCollection('products', visible)).sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));

export const getPosts = async () =>
  (await getCollection('blog', visible)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

export const getTeam = async () => (await getCollection('team', visible)).sort((a, b) => a.data.order - b.data.order);

export const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export const getCaseStudies = async () =>
  (await getCollection('caseStudies', visible)).sort(
    (a, b) => Number(b.data.featured) - Number(a.data.featured) || b.data.date.valueOf() - a.data.date.valueOf(),
  );
