import type { APIRoute } from 'astro';
import { getPublishedArticles } from '../utils/articles';
import { briefings } from '../data/briefings';
import { comparisons } from '../data/comparisons';
import { industries } from '../data/industries';
import { locations } from '../data/locations';
import { services } from '../data/services';
import { getCollection } from 'astro:content';

const pages = ['/', '/services/', '/what-is-eor/', '/insights/', '/about/', '/careers/', '/contact/', '/eor/', '/eor-readiness/', '/resources/', '/briefings/', '/eor-brief/', '/faq/', '/industries/', '/locations/', '/country-parameters/', '/workplace/', '/employee-experience/', '/first-international-hire/', '/eor-country-readiness/', '/eor-for-ai-ml-teams/', '/quantum-science-hiring-brief/', '/remote-employee-setup/', '/office-space-and-eor/', '/cross-border-work-risk-review/', '/employee-experience-brief/', '/specialist-hiring-intake/', '/frontier-talent-operating-plan/', '/internships-and-early-career-program/', '/asia-pacific-workforce-readiness/', '/workforce-risk-governance-review/', '/legal/privacy/', '/legal/terms/', '/legal/entities/', '/legal/policy/'];
export const GET: APIRoute = async ({ site }) => {
  const careers = await getCollection('careers', ({ data }) => data.draft !== true && data.status !== 'Closed');
  const articles = await getPublishedArticles();
  const urls = [
    ...pages,
    ...careers.map((career) => `/careers/${career.id}/`),
    ...services.map((service) => `/services/${service.slug}/`),
    ...articles.map((article) => `/insights/${article.id}/`),
    ...industries.map((industry) => `/industries/${industry.slug}/`),
    ...locations.map((location) => `/locations/${location.slug}/`),
    ...briefings.map((briefing) => `/briefings/${briefing.slug}/`),
    ...comparisons.map((comparison) => `/compare/${comparison.slug}/`),
  ];
  const base = site ?? new URL('https://trustora.net');
  const lastmod = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((path) => `<url><loc>${new URL(path, base).toString()}</loc><lastmod>${lastmod}</lastmod></url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
