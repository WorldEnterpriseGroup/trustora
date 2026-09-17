import { getCollection } from 'astro:content';
import { briefings } from '../data/briefings';
import { comparisons } from '../data/comparisons';
import { industries } from '../data/industries';
import { locations } from '../data/locations';
import { services } from '../data/services';

export interface DirectoryEntry {
  number: string;
  file: string;
  href: string;
  title: string;
}

const staticRoutes: Array<[string, string]> = [
  ['/', 'index'],
  ['/services/', 'services'],
  ['/what-is-eor/', 'what-is-eor'],
  ['/insights/', 'insights'],
  ['/about/', 'about'],
  ['/careers/', 'careers'],
  ['/contact/', 'contact'],
  ['/eor/', 'eor'],
  ['/eor-readiness/', 'eor-readiness'],
  ['/resources/', 'resources'],
  ['/briefings/', 'briefings'],
  ['/eor-brief/', 'eor-brief'],
  ['/faq/', 'faq'],
  ['/industries/', 'industries'],
  ['/locations/', 'locations'],
  ['/country-parameters/', 'country-parameters'],
  ['/workplace/', 'workplace'],
  ['/employee-experience/', 'employee-experience'],
  ['/first-international-hire/', 'first-international-hire'],
  ['/eor-country-readiness/', 'eor-country-readiness'],
  ['/eor-for-ai-ml-teams/', 'eor-for-ai-ml-teams'],
  ['/quantum-science-hiring-brief/', 'quantum-science-hiring-brief'],
  ['/remote-employee-setup/', 'remote-employee-setup'],
  ['/office-space-and-eor/', 'office-space-and-eor'],
  ['/cross-border-work-risk-review/', 'cross-border-work-risk-review'],
  ['/employee-experience-brief/', 'employee-experience-brief'],
  ['/specialist-hiring-intake/', 'specialist-hiring-intake'],
  ['/frontier-talent-operating-plan/', 'frontier-talent-operating-plan'],
  ['/internships-and-early-career-program/', 'internships-and-early-career-program'],
  ['/asia-pacific-workforce-readiness/', 'asia-pacific-workforce-readiness'],
  ['/workforce-risk-governance-review/', 'workforce-risk-governance-review'],
  ['/legal/privacy/', 'legal/privacy'],
  ['/legal/terms/', 'legal/terms'],
  ['/legal/entities/', 'legal/entities'],
  ['/legal/policy/', 'legal/policy'],
  ['/record/', 'record'],
  ['/record/leadership/', 'record/leadership'],
  ['/record/marketing/', 'record/marketing'],
  ['/record/journeys/', 'record/journeys'],
  ['/record/federal/', 'record/federal'],
  ['/record/verify/', 'record/verify'],
  ['/record/files/', 'record/files'],
  ['/record/nav/', 'record/nav'],
  ['/record/metrics/', 'record/metrics'],
  ['/record/screens/', 'record/screens'],
  ['/record/ops/', 'record/ops'],
  ['/record/style/', 'record/style'],
];

export async function getDirectoryEntries(): Promise<DirectoryEntry[]> {
  const careers = await getCollection('careers', ({ data }) => data.draft !== true && data.status !== 'Closed');
  const articles = await getCollection('articles', ({ data }) => data.draft !== true);

  const entries: Array<{ href: string; file: string; title: string }> = [
    ...staticRoutes.map(([href, file]) => ({ href, file, title: '' })),
    ...careers
      .map((career) => ({ href: `/careers/${career.id}/`, file: `careers/${career.id}`, title: career.data.title }))
      .sort((a, b) => a.href.localeCompare(b.href)),
    ...services.map((service) => ({ href: `/services/${service.slug}/`, file: `services/${service.slug}`, title: service.title })),
    ...articles
      .map((article) => ({ href: `/insights/${article.id}/`, file: `insights/${article.id}`, title: article.data.title }))
      .sort((a, b) => a.href.localeCompare(b.href)),
    ...industries.map((industry) => ({ href: `/industries/${industry.slug}/`, file: `industries/${industry.slug}`, title: industry.title })),
    ...locations.map((location) => ({ href: `/locations/${location.slug}/`, file: `locations/${location.slug}`, title: location.title })),
    ...briefings.map((briefing) => ({ href: `/briefings/${briefing.slug}/`, file: `briefings/${briefing.slug}`, title: briefing.title })),
    ...comparisons.map((comparison) => ({ href: `/compare/${comparison.slug}/`, file: `compare/${comparison.slug}`, title: comparison.title })),
  ];

  const pad = String(entries.length).length;
  return entries.map((entry, index) => ({
    number: String(index + 1).padStart(pad, '0'),
    ...entry,
  }));
}
