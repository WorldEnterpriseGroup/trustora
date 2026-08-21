export interface SeoMetadata {
  title: string;
  description: string;
}

/**
 * Route-specific search metadata for the site's commercial and navigational
 * surfaces. Article routes are intentionally absent so their collection
 * metadata remains the source of truth.
 */
export const seoOverrides: Readonly<Record<string, SeoMetadata>> = {
  '/': {
    title: 'Global hiring, made reliable | Trustora',
    description:
      'Trustora pairs Employer of Record services with specialist talent and employee support for AI, science, software, and cross-border teams.',
  },
  '/services/': {
    title: 'EoR services that keep global hiring moving | Trustora',
    description:
      'Employ, pay, support, and grow specialist teams across borders with Trustora’s country-aware EoR and employee intelligence services.',
  },
  '/about/': {
    title: 'A clearer employment layer for global teams | Trustora',
    description:
      'See how Trustora connects EoR administration, specialist talent, and employee intelligence for teams working across borders.',
  },
  '/contact/': {
    title: 'Plan your next global hire with Trustora',
    description:
      'Share the role, country, and timing; Trustora will help frame a practical EoR and specialist-employment path.',
  },
  '/locations/': {
    title: 'Global hiring with local context | Trustora',
    description:
      'Plan specialist hiring across the EU, Australia, and United States with a clearer employment model and country-aware operating questions.',
  },
  '/industries/': {
    title: 'EoR for technical and scientific teams | Trustora',
    description:
      'Build a dependable employment layer around technical, scientific, financial, manufacturing, and mission-led specialist work.',
  },
  '/insights/': {
    title: 'Global employment insights for better decisions | Trustora',
    description:
      'Read practical perspectives on EoR, specialist hiring, payroll, employee experience, and the questions behind global work.',
  },
  '/resources/': {
    title: 'Practical tools for global hiring | Trustora',
    description:
      'Use Trustora’s briefings, comparisons, guides, and decision frames to make cross-border employment questions easier to act on.',
  },
  '/what-is-eor/': {
    title: 'Understand EoR before your next hire | Trustora',
    description:
      'Learn what an Employer of Record does, what your company keeps, and which country and worker questions deserve attention first.',
  },
  '/employee-experience/': {
    title: 'Make global employee experience work | Trustora',
    description:
      'Design a clearer EoR journey across offers, onboarding, pay, benefits, support, development, mobility, and offboarding.',
  },
  '/workplace/': {
    title: 'Make day one work across borders | Trustora',
    description:
      'Coordinate remote setup, equipment, access, office questions, and workplace readiness around the employee and the role.',
  },
  '/faq/': {
    title: 'EoR answers for global teams | Trustora',
    description:
      'Find plain-language answers about Employer of Record services, specialist employment, employee intelligence, and cross-border hiring.',
  },
  '/careers/': {
    title: 'Build the future of global work at Trustora',
    description:
      'Join a team connecting EoR, specialist talent, technical fluency, and country-aware employee support across global work.',
  },
  '/careers/govcon-fellowship/': {
    title: 'GovCon Policy & Administration Fellowship | Trustora',
    description:
      'Professional development in government contracting, grants, proposal development, strategic partnerships, policy administration, and business development.',
  },
  '/country-parameters/': {
    title: 'Clarify the country questions before you hire | Trustora',
    description:
      'Use a practical country-context map to organize worker, role, workplace, timing, and local-advice questions before an offer.',
  },
  '/briefings/': {
    title: 'Practical briefings for global hiring | Trustora',
    description:
      'Access decision instruments for EoR, specialist talent, market entry, employee experience, and cross-border workforce risk.',
  },

  '/services/employer-of-record/': {
    title: 'Hire globally without opening an entity | Trustora',
    description:
      'Employ specialist people in a new country with a clearer EoR path for contracts, payroll, benefits, and employee support.',
  },
  '/services/employee-intelligence/': {
    title: 'Find specialists for difficult work | Trustora',
    description:
      'Translate a technical problem into the right expertise, country, and employment model for AI, ML, science, quantum, and software teams.',
  },
  '/services/global-payroll/': {
    title: 'Make global payroll easier to trust | Trustora',
    description:
      'Coordinate pay inputs, local requirements, approvals, and employee answers in a repeatable payroll rhythm.',
  },
  '/services/contractor-to-employee/': {
    title: 'Move contractors into clearer employment | Trustora',
    description:
      'Surface classification and country questions early, then make the move from contractor to employee understandable and deliberate.',
  },
  '/services/global-mobility/': {
    title: 'Coordinate cross-border moves with confidence | Trustora',
    description:
      'Join up employment, payroll, benefits, work-authorisation coordination, and employee support around an international move.',
  },
  '/services/people-operations/': {
    title: 'Keep global employee operations coherent | Trustora',
    description:
      'Make onboarding, records, leave, employee questions, and offboarding easier to own across borders.',
  },
  '/services/global-hris/': {
    title: 'Connect global people data and workflows | Trustora',
    description:
      'Create a clearer employee-record and approval layer for country-aware workflows across the employment lifecycle.',
  },
  '/services/benefits-administration/': {
    title: 'Make global benefits easier to understand | Trustora',
    description:
      'Coordinate local benefits, employee choices, deadlines, and support so a global program feels easier to use.',
  },
  '/services/compensation-and-equity/': {
    title: 'Make pay and equity offers easier to explain | Trustora',
    description:
      'Connect role, country, currency, compensation, equity, and employee-facing offer questions into one clearer decision.',
  },
  '/services/specialist-talent-search/': {
    title: 'Find expertise behind the job title | Trustora',
    description:
      'Frame AI, ML, quantum, science, software, and product roles around the capability the work needs—not only a keyword.',
  },
  '/services/talent-operations/': {
    title: 'Move specialist hiring from brief to day one | Trustora',
    description:
      'Connect role design, sourcing, selection, offers, employment setup, and onboarding into one accountable operating rhythm.',
  },
  '/services/background-verifications/': {
    title: 'Run proportionate employment checks | Trustora',
    description:
      'Coordinate identity, employment, right-to-work, and role-specific checks with purpose, consent, local context, and clear ownership.',
  },
  '/services/equipment-and-it/': {
    title: 'Make global employee onboarding ready | Trustora',
    description:
      'Coordinate devices, access, security, shipping, and returns so distributed specialists can start with fewer avoidable delays.',
  },
  '/services/workforce-compliance/': {
    title: 'Keep workforce risk visible across borders | Trustora',
    description:
      'Create a reviewable rhythm for classification, documentation, local changes, approvals, and escalation to qualified advisers.',
  },
  '/services/entity-and-corporate-services/': {
    title: 'Know when to build a local employment base | Trustora',
    description:
      'Use an EoR bridge to learn, then review the evidence and operating need behind a longer-term entity decision.',
  },
  '/services/embedded-employment/': {
    title: 'Connect employment workflows to your systems | Trustora',
    description:
      'Map employment, people, and country workflows to internal systems without losing ownership, permissions, or employee support.',
  },
  '/services/performance-and-development/': {
    title: 'Help specialist people grow and stay | Trustora',
    description:
      'Build context-rich feedback, development, and manager rhythms that respect specialist work and strengthen retention.',
  },

  '/locations/european-union/': {
    title: 'Hire across Europe with local context | Trustora',
    description:
      'Plan specialist employment across EU countries with a clearer EoR path for contracts, payroll, benefits, and local questions.',
  },
  '/locations/australia/': {
    title: 'Hire specialist talent in Australia | Trustora',
    description:
      'Coordinate an Australian employment layer for technical, scientific, and product teams with clearer local questions and employee support.',
  },
  '/locations/united-states/': {
    title: 'Hire specialist talent in the US | Trustora',
    description:
      'Support specialist hiring in the United States with a clear employing model, pay, benefits, and country-aware employee support.',
  },
  '/locations/us-ai-ml-teams/': {
    title: 'Hire AI/ML talent in the US | Trustora',
    description:
      'Build US AI and ML teams with a practical EoR path that keeps role scope, employment, access, and employee support visible.',
  },
  '/locations/eu-specialist-hiring/': {
    title: 'EU specialist hiring, made clearer | Trustora',
    description:
      'Hire technical and scientific specialists across EU countries with country-aware EoR coordination and a clearer employee experience.',
  },
};

function normalizePath(pathname: string) {
  const pathWithoutQuery = pathname.split(/[?#]/, 1)[0] || '/';
  if (pathWithoutQuery === '/') return '/';
  return `/${pathWithoutQuery.replace(/^\/+|\/+$/g, '')}/`;
}

export function getSeoMetadata(pathname: string, fallback: SeoMetadata): SeoMetadata {
  return seoOverrides[normalizePath(pathname)] ?? fallback;
}
