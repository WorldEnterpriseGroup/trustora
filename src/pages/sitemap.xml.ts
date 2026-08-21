import type { APIRoute } from 'astro';
import { getPublishedArticles } from '../utils/articles';
import { briefings } from '../data/briefings';
import { comparisons } from '../data/comparisons';
import { industries } from '../data/industries';
import { locations } from '../data/locations';
import { services } from '../data/services';
import { getCollection } from 'astro:content';

const pages = ['/', '/services/', '/what-is-eor/', '/insights/', '/about/', '/careers/', '/contact/', '/eor/', '/eor-readiness/', '/resources/', '/briefings/', '/eor-brief/', '/faq/', '/industries/', '/locations/', '/country-parameters/', '/workplace/', '/employee-experience/', '/first-international-hire/', '/eor-country-readiness/', '/eor-for-ai-ml-teams/', '/quantum-science-hiring-brief/', '/remote-employee-setup/', '/office-space-and-eor/', '/cross-border-work-risk-review/', '/employee-experience-brief/', '/specialist-hiring-intake/', '/frontier-talent-operating-plan/', '/internships-and-early-career-program/', '/asia-pacific-workforce-readiness/', '/workforce-risk-governance-review/', '/legal/privacy/', '/legal/terms/', '/legal/entities/', '/legal/policy/'];
interface SitemapEntry {
  path: string;
  lastmod?: string;
}

export const GET: APIRoute = async ({ site }) => {
  const careers = await getCollection('careers', ({ data }) => data.draft !== true && data.status !== 'Closed');
  const articles = await getPublishedArticles();
  const entries: SitemapEntry[] = [
    ...pages.map((path) => ({ path })),
    ...careers.map((career) => ({ path: `/careers/${career.id}/` })),
    ...services.map((service) => ({ path: `/services/${service.slug}/` })),
    ...articles.map((article) => ({
      path: `/insights/${article.id}/`,
      lastmod: (article.data.updatedAt ?? article.data.publishedAt).toISOString().slice(0, 10),
    })),
    ...industries.map((industry) => ({ path: `/industries/${industry.slug}/` })),
    ...locations.map((location) => ({ path: `/locations/${location.slug}/` })),
    ...briefings.map((briefing) => ({ path: `/briefings/${briefing.slug}/` })),
    ...comparisons.map((comparison) => ({ path: `/compare/${comparison.slug}/` })),
  ];
  const base = site ?? new URL('https://trustora.net');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map(({ path, lastmod }) => `<url><loc>${new URL(path, base).toString()}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
