import { media } from './media';

export const services = [
  {
    number: '01',
    slug: 'employer-of-record',
    title: 'Employer of Record',
    short: 'Employ specialist people in a new country without opening an entity first.',
    description: 'Trustora becomes the local employer of record while your team directs the work. We coordinate the employment layer around the person, the country, and the role.',
  },
  {
    number: '02',
    slug: 'employee-intelligence',
    title: 'Employee intelligence',
    short: 'Access people who understand AI, ML, quantum, science, and shipped software.',
    description: 'Specialist talent and an EoR operating layer for teams working where technical depth and delivery both matter.',
  },
  {
    number: '03',
    slug: 'global-payroll',
    title: 'Global payroll',
    short: 'Make pay, deductions, benefits, and reporting easier to understand.',
    description: 'Payroll support that treats accuracy and employee experience as the same problem—not two separate workstreams.',
  },
  {
    number: '04',
    slug: 'contractor-to-employee',
    title: 'Contractor to employee',
    short: 'Turn a promising contractor relationship into a clearer employment model.',
    description: 'A considered path from independent contractor to employee, with classification questions surfaced early and local details handled deliberately.',
  },
  {
    number: '05',
    slug: 'global-mobility',
    title: 'Global mobility support',
    short: 'Coordinate the people, paperwork, and local partners behind a cross-border move.',
    description: 'A practical operating layer for employee movement, work authorization coordination, and the handoffs that make a transition feel joined up.',
  },
  {
    number: '06',
    slug: 'people-operations',
    title: 'People operations',
    short: 'Keep the employment experience coherent after the first day.',
    description: 'Onboarding, documentation, leave, employee questions, and offboarding support that keeps the human experience visible.',
  },
  {
    number: '07',
    slug: 'global-hris',
    title: 'Global HRIS',
    short: 'Give distributed teams one clearer system of employee records and workflows.',
    description: 'A people-data layer for employee records, approvals, documents, and country-aware workflows across the employment lifecycle.',
  },
  {
    number: '08',
    slug: 'benefits-administration',
    title: 'Benefits administration',
    short: 'Make local benefits easier to understand, compare, and support.',
    description: 'Benefits coordination that respects local context while giving employees and managers a clearer route through the choices.',
  },
  {
    number: '09',
    slug: 'compensation-and-equity',
    title: 'Compensation & equity',
    short: 'Connect pay decisions, market context, and long-term incentives.',
    description: 'A structured conversation around compensation, equity, allowances, and the employee-facing explanation that makes an offer legible.',
  },
  {
    number: '10',
    slug: 'specialist-talent-search',
    title: 'Specialist talent search',
    short: 'Find people who understand the technical problem behind the job title.',
    description: 'Capability-first talent search for AI, ML, quantum, physics, science, software, and applied product roles—with the employment model considered early.',
  },
  {
    number: '11',
    slug: 'talent-operations',
    title: 'Talent operations',
    short: 'Connect sourcing, selection, offers, and onboarding into one operating rhythm.',
    description: 'A practical talent workflow for specialist teams that need better handoffs from role design through first day.',
  },
  {
    number: '12',
    slug: 'background-verifications',
    title: 'Background & employment verification',
    short: 'Build a proportionate, documented path to the checks a role requires.',
    description: 'Verification workflow coordination for employment history, identity, right-to-work, and role-specific checks, subject to local rules and consent.',
  },
  {
    number: '13',
    slug: 'equipment-and-it',
    title: 'Equipment & IT onboarding',
    short: 'Get the tools, access, and device handoffs ready for day one.',
    description: 'Coordinate the employee-facing details around equipment, access, security, and return workflows for distributed teams.',
  },
  {
    number: '14',
    slug: 'workforce-compliance',
    title: 'Workforce compliance',
    short: 'Turn changing employment questions into a reviewable operating rhythm.',
    description: 'A practical compliance coordination layer for classification, documentation, local changes, approvals, and escalation to qualified advisers.',
  },
  {
    number: '15',
    slug: 'entity-and-corporate-services',
    title: 'Entity & corporate services',
    short: 'Know when an EoR bridge should become a local operating commitment.',
    description: 'A staged conversation around entity readiness, local administration, and the operating facts behind a longer-term market presence.',
  },
  {
    number: '16',
    slug: 'embedded-employment',
    title: 'Embedded employment infrastructure',
    short: 'Bring employment workflows closer to the systems your team already uses.',
    description: 'A structured path for teams that need employment, people, and country workflows to connect with internal systems and operating tools.',
  },
  {
    number: '17',
    slug: 'performance-and-development',
    title: 'Performance & development',
    short: 'Help specialist people grow without flattening the work into a template.',
    description: 'Performance, feedback, development, and manager support for teams where the work is specialized and the context matters.',
  },
] as const;

export type Service = (typeof services)[number];

type ServiceMediaKey = keyof typeof media;

export const serviceDetails: Record<string, { eyebrow: string; title: string; intro: string; imageKey: ServiceMediaKey; supportImageKey: ServiceMediaKey; pathHeading?: string; pathIntro?: string; nextHeading?: string; nextBody?: string; path: { title: string; body: string }[]; sections: { heading: string; body: string; items?: string[] }[] }> = {
  'employer-of-record': {
    eyebrow: 'The primary service',
    title: 'The employment layer for specialist teams.',
    intro: 'An Employer of Record model lets a company employ someone in a country where it does not yet have its own entity. Trustora handles the local employment administration while your team stays focused on the work, the manager relationship, and the outcome.',
    imageKey: 'service-eor-intake',
    supportImageKey: 'service-eor-advisor',
    pathHeading: 'Make the local employment layer explicit.',
    pathIntro: 'A dependable EoR engagement moves from facts to setup, then stays reviewable as the relationship changes.',
    nextHeading: 'Start with the country and the role.',
    nextBody: 'Tell us where the employee will work, what they will do, and when the relationship needs to begin. We will surface the employment questions before proposing a path.',
    path: [
      { title: 'Scope', body: 'Country, role, manager, start date, compensation, and the questions that change the shape of the engagement.' },
      { title: 'Set up', body: 'Employment documents, onboarding steps, payroll inputs, and a clear ownership map for everyone involved.' },
      { title: 'Operate', body: 'A steady rhythm for pay, leave, documentation, employee questions, and changes over time.' },
      { title: 'Review', body: 'Regular check-ins on what is working, what is changing locally, and whether the model still fits.' },
    ],
    sections: [
      { heading: 'EoR is a bridge, not a black box.', body: 'The useful version of EoR is not “hand everything over.” It is a clear division of responsibility. You keep the work and the relationship with your team; Trustora coordinates the local employment responsibilities and makes the handoffs visible.', items: ['Employment contract coordination', 'Payroll and statutory contribution administration', 'Benefits and leave administration', 'Onboarding and offboarding workflows', 'A named path for employee and client questions'] },
      { heading: 'The important questions come before the paperwork.', body: 'Country rules, worker status, benefits, notice requirements, currency, and timing all shape an employment offer. We start there, because a fast contract is not useful if the underlying model is wrong.' },
    ],
  },
  'employee-intelligence': {
    eyebrow: 'Core capability',
    title: 'Specialist people for high-consequence work.',
    intro: 'Trustora combines EoR with access to people who work across artificial intelligence, machine learning, quantum, physics, the sciences, and shipped software. We help companies employ the right specialist in the right country, with a clear operating model around them.',
    imageKey: 'service-ai-evaluation',
    supportImageKey: 'service-quantum-measurement',
    pathHeading: 'Translate difficult work into a workable hire.',
    pathIntro: 'The capability question comes first; the employment model then gives the specialist a clear place to do the work.',
    nextHeading: 'Bring us the problem behind the role.',
    nextBody: 'Tell us what the person needs to solve, where they will work, and what expertise is difficult to find. We will map the capability and employment questions together.',
    path: [
      { title: 'Define', body: 'Clarify the technical problem, the team context, the country, and the kind of expertise the work requires.' },
      { title: 'Identify', body: 'Connect the role to specialist people whose experience fits the work—not only the job title.' },
      { title: 'Employ', body: 'Use the EoR layer to coordinate the local employment relationship, offer, payroll, and onboarding.' },
      { title: 'Deliver', body: 'Keep the person focused on the work while the employment details stay visible and supported.' },
    ],
    sections: [
      { heading: 'Deep expertise needs a dependable operating layer.', body: 'A strong technical hire should not be slowed by unclear employment responsibilities. Trustora coordinates the local employment relationship so your team can focus on the research, product, model, or application in front of it.', items: ['AI and machine learning specialists', 'Quantum, physics, and applied-science expertise', 'Researchers and engineers who have shipped successful apps', 'EoR, payroll, benefits, and employee support'] },
      { heading: 'The work is specialized. The employment experience should be clear.', body: 'Our relationships across the European Union, Australia, and the United States help us support companies that need expert people across borders. We make the geographic and employment questions visible early, then coordinate the right local next steps.' },
    ],
  },
  'global-payroll': {
    eyebrow: 'Payroll operations',
    title: 'Payroll that people can actually follow.',
    intro: 'Payroll is a recurring trust exercise. Our role is to help coordinate the inputs, local requirements, approvals, and employee-facing answers that sit around each pay cycle.',
    imageKey: 'service-payroll-reconciliation',
    supportImageKey: 'service-payroll-quality',
    pathHeading: 'Build a pay rhythm people can trust.',
    pathIntro: 'The work is recurring, so the controls, owners, and employee-facing answers have to be repeatable too.',
    path: [
      { title: 'Collect', body: 'Bring together compensation, time, leave, expenses, and approved changes.' },
      { title: 'Check', body: 'Review inputs, local deductions, and any changes that need a human decision.' },
      { title: 'Run', body: 'Coordinate the payroll cycle and the documents people expect to receive.' },
      { title: 'Explain', body: 'Make it easier for employees and managers to know where to go with a question.' },
    ],
    sections: [
      { heading: 'Accuracy is only half the job.', body: 'A payroll process can be technically correct and still feel opaque. We put equal weight on the rhythm around the numbers: deadlines, approvals, change logs, and plain-language explanations for employees.' },
      { heading: 'A calmer month-end starts upstream.', body: 'We help teams build a repeatable input calendar, name decision owners, and flag the country-specific questions that do not belong in a generic checklist.', items: ['Payroll calendar and cut-off coordination', 'Compensation and change input review', 'Leave and expense workflow support', 'Employee-facing payroll question routing'] },
    ],
  },
  'contractor-to-employee': {
    eyebrow: 'Employment transition',
    title: 'When the contractor relationship becomes a team.',
    intro: 'A contractor-to-employee move is not a formatting exercise. It is a chance to make the working relationship, responsibilities, protections, and expectations more explicit.',
    imageKey: 'service-contractor-transition',
    supportImageKey: 'service-classification-workflow',
    pathHeading: 'Move from a label to the working reality.',
    pathIntro: 'A considered transition starts with how the work happens, then makes the new relationship legible to everyone involved.',
    path: [
      { title: 'Understand', body: 'Look at how the work actually happens, not only what the current agreement calls it.' },
      { title: 'Compare', body: 'Map the employment implications, compensation, benefits, and local constraints.' },
      { title: 'Choose', body: 'Decide whether an EoR, local entity, or another model fits the facts.' },
      { title: 'Transition', body: 'Move the relationship with clear communication and a deliberate first day.' },
    ],
    sections: [
      { heading: 'Classification is about reality.', body: 'Worker status depends on the facts and the applicable local rules. A label, invoice, or company registration may not answer the question on its own. Trustora helps surface the questions; local legal and tax professionals remain the right authority for advice in a specific jurisdiction.' },
      { heading: 'The employee experience matters too.', body: 'A good transition explains what changes, what stays the same, who handles pay and leave, and how the person can ask questions. Compliance and care should point in the same direction.', items: ['Current working relationship review', 'Country and role context gathering', 'Offer and benefits coordination', 'Employee communication checklist'] },
    ],
  },
  'global-mobility': {
    eyebrow: 'Mobility coordination',
    title: 'Cross-border movement, made legible.',
    intro: 'A move across borders touches employment, work authorization, payroll, benefits, travel, and the employee’s own sense of stability. We help coordinate the operating pieces and the partners who own specialist advice.',
    imageKey: 'service-mobility-map',
    supportImageKey: 'service-mobility-airport',
    pathHeading: 'Join up the pieces of a cross-border move.',
    pathIntro: 'The employee experiences one move. The operating model should connect its employment, timing, document, and specialist handoffs.',
    path: [
      { title: 'Map', body: 'Understand the person, destination, timing, employment model, and work authorization question.' },
      { title: 'Coordinate', body: 'Connect the right local specialists and keep the handoffs visible.' },
      { title: 'Prepare', body: 'Align documents, payroll, benefits, and employee communication before the move.' },
      { title: 'Support', body: 'Keep a steady channel open while the new arrangement settles.' },
    ],
    sections: [
      { heading: 'Mobility is a system of handoffs.', body: 'The employee does not experience immigration, payroll, and HR as separate departments. They experience one move. A good operating layer keeps those handoffs joined up without pretending one provider can replace every specialist.' },
      { heading: 'Know where Trustora’s role ends.', body: 'We coordinate and administer the employment workflow. Immigration, tax, and legal advice may require licensed local professionals, and we make that boundary explicit from the start.', items: ['Move and timing intake', 'Partner and specialist coordination', 'Payroll and benefits transition', 'Employee communication and check-ins'] },
    ],
  },
  'people-operations': {
    eyebrow: 'Employee operations',
    title: 'The quiet infrastructure behind a good employee experience.',
    intro: 'The first day is visible. The small moments after it—an approved leave request, a changed address, a benefits question, a clean offboarding—are where an employment model earns its trust.',
    imageKey: 'service-people-ops-desk',
    supportImageKey: 'service-equipment-handoff',
    pathHeading: 'Keep the relationship useful after day one.',
    pathIntro: 'People operations turns small employment moments into a dependable service rhythm with a clear owner.',
    path: [
      { title: 'Onboard', body: 'Make the first day concrete, prepared, and human.' },
      { title: 'Support', body: 'Route recurring employee questions to people who can answer them.' },
      { title: 'Document', body: 'Keep employment records and changes organized for the right stakeholders.' },
      { title: 'Close well', body: 'Handle offboarding with the same care as onboarding.' },
    ],
    sections: [
      { heading: 'Operations should reduce cognitive load.', body: 'A good people-operations layer gives managers and employees fewer places to look, fewer decisions to guess at, and a more predictable response when something changes.' },
      { heading: 'The work is administrative. The impact is not.', body: 'Leave, onboarding, documentation, and offboarding are not just back-office tasks. They shape whether an employee feels respected, informed, and able to do their work.', items: ['Onboarding and first-day coordination', 'Leave and employee record administration', 'Policy and document routing', 'Offboarding and final-pay coordination'] },
    ],
  },
};

const adjacentDetails: Record<string, { eyebrow: string; title: string; intro: string; firstHeading: string; firstBody: string; secondHeading: string; secondBody: string; items: string[]; imageKey: 'dubai-skyline' | 'workplace-grid' | 'operations-room' | 'people-at-work' | 'remote-work'; supportImageKey: 'dubai-skyline' | 'workplace-grid' | 'operations-room' | 'people-at-work' | 'remote-work' }> = {
  'global-hris': { eyebrow: 'People systems', title: 'One clearer employee record across borders.', intro: 'A distributed workforce needs more than a list of names. Trustora helps teams create a people-data and workflow layer that keeps employment records, approvals, and documents usable across countries.', firstHeading: 'A system should reduce the number of places people have to look.', firstBody: 'A global HRIS is useful when it makes the employment relationship easier to operate, not when it adds another dashboard. We help map the records, permissions, owners, and country-aware steps around the employee lifecycle.', secondHeading: 'Data is part of the employee experience.', secondBody: 'People notice when an address change, leave request, document, or manager approval disappears into a system. Good people data has a human consequence: a clearer answer and a shorter route to it.', items: ['Employee record and document structure', 'Country-aware approval workflows', 'Role and access ownership', 'Change history and operating review'], imageKey: 'operations-room', supportImageKey: 'remote-work' },
  'benefits-administration': { eyebrow: 'Employee support', title: 'Benefits people can understand before they choose.', intro: 'Benefits vary by country, role, and employer. Trustora helps coordinate the local options, decision points, employee communications, and support path around the program.', firstHeading: 'Local variation should not become employee confusion.', firstBody: 'Benefits administration sits where country context and employee trust meet. We make the choices, deadlines, ownership, and escalation path visible while keeping qualified local advice in the right place.', secondHeading: 'A benefit is only useful when the person can use it.', secondBody: 'The employee should understand what is offered, what is required, when a change takes effect, and who can help with a question. That is operational design, not brochure copy.', items: ['Benefits intake and country mapping', 'Enrollment and change coordination', 'Employee-facing explanation', 'Provider and issue routing'], imageKey: 'workplace-grid', supportImageKey: 'people-at-work' },
  'compensation-and-equity': { eyebrow: 'Rewards & offers', title: 'A more legible conversation about pay and value.', intro: 'Compensation decisions carry market, role, country, tax, and communication questions. Trustora helps teams structure the operating conversation around pay, incentives, and equity.', firstHeading: 'The number is not the whole offer.', firstBody: 'A specialist candidate evaluates the seriousness of a company through the entire offer: pay, benefits, equity, timing, local employment, and the confidence of the answers. We help keep those pieces joined up.', secondHeading: 'Context makes the decision defensible.', secondBody: 'Compensation and equity should be reviewed against the work, the country, the level, and the company’s own principles. We surface the questions and coordinate the relevant local and specialist advice.', items: ['Offer and compensation input map', 'Country and currency questions', 'Equity and incentive handoff coordination', 'Employee-facing offer narrative'], imageKey: 'people-at-work', supportImageKey: 'operations-room' },
  'specialist-talent-search': { eyebrow: 'Core capability', title: 'Find the expertise behind the difficult problem.', intro: 'Trustora’s employee-intelligence position starts with the work: AI, ML, quantum, physics, sciences, software, and applied product delivery. We help teams frame specialist roles and connect the employment model early.', firstHeading: 'Expertise is not a commodity keyword.', firstBody: 'A role may require a researcher, systems builder, model evaluator, product engineer, or technical leader. We help make the capability legible before the search is reduced to a title and a filter.', secondHeading: 'The search should end in a workable relationship.', secondBody: 'A promising candidate still needs a country, an offer, a manager, a payroll rhythm, and a clear first day. Talent search and EoR should not be separate conversations when the role crosses a border.', items: ['Capability-first role framing', 'Specialist search across technical domains', 'Country and employment-model review', 'Offer and first-day handoff'], imageKey: 'operations-room', supportImageKey: 'people-at-work' },
  'talent-operations': { eyebrow: 'Hiring operations', title: 'A connected path from role design to first day.', intro: 'Specialist hiring often slows down between teams. Trustora helps connect the role brief, search, selection, offer, employment setup, and onboarding handoffs.', firstHeading: 'Most hiring friction lives between functions.', firstBody: 'The talent workflow is not only recruiting. It is a chain between the manager, people team, finance, local employment partner, candidate, and employee. We help name the handoffs and the decisions that should not be lost.', secondHeading: 'A good first day starts weeks earlier.', secondBody: 'When the offer, equipment, documents, payroll, and manager plan are coordinated, specialist people can enter the work with less avoidable uncertainty.', items: ['Role intake and decision ownership', 'Interview and selection workflow', 'Offer-to-employment handoff', 'Onboarding readiness review'], imageKey: 'workplace-grid', supportImageKey: 'remote-work' },
  'background-verifications': { eyebrow: 'Trust & integrity', title: 'Checks with purpose, consent, and a clear owner.', intro: 'Verification should be proportionate to the role, documented, and explained. Trustora helps coordinate the workflow around identity, employment history, right-to-work, and role-specific checks.', firstHeading: 'A check is a responsibility, not a ritual.', firstBody: 'The right check depends on the role, country, consent, retention, and decision it is meant to inform. We help teams avoid generic overreach and surface where local rules or specialist advice matter.', secondHeading: 'The candidate should know what is happening.', secondBody: 'A credible verification process tells the person what is being checked, why, by whom, and how questions or discrepancies are handled.', items: ['Check scope and role intake', 'Consent and document workflow', 'Result routing and exception handling', 'Country-specific escalation'], imageKey: 'operations-room', supportImageKey: 'workplace-grid' },
  'equipment-and-it': { eyebrow: 'Workplace readiness', title: 'Day-one tools for people who need to ship.', intro: 'A specialist employee should not spend the first week chasing a device, access, or security answer. Trustora helps coordinate the equipment and IT handoffs around distributed employment.', firstHeading: 'Operational readiness is part of the offer.', firstBody: 'The equipment, access, security, and return workflow should match the role, location, data sensitivity, and employee experience. We help connect the people and systems that own each step.', secondHeading: 'Good onboarding is visible before the laptop arrives.', secondBody: 'The employee should know what is coming, when it is expected, how access is granted, and where to go if the plan changes.', items: ['Device and access intake', 'Security and role requirements', 'Shipping and receipt coordination', 'Return and offboarding workflow'], imageKey: 'people-at-work', supportImageKey: 'remote-work' },
  'workforce-compliance': { eyebrow: 'Trust & integrity', title: 'A reviewable rhythm for changing workforce questions.', intro: 'Global employment changes. Trustora helps teams create a practical review rhythm for classification, documentation, local changes, approvals, and escalation.', firstHeading: 'Compliance should increase speed by reducing surprises.', firstBody: 'A useful control system makes assumptions visible, gives them an owner, and creates a path for qualified advice when the facts require it. It should help the team move with better context.', secondHeading: 'The boundary is part of the design.', secondBody: 'Trustora coordinates the operating workflow. Legal, tax, immigration, and employment conclusions remain with the appropriate qualified professionals for the country and facts.', items: ['Classification question intake', 'Country change and policy watch', 'Documentation and approval map', 'Local adviser escalation'], imageKey: 'operations-room', supportImageKey: 'dubai-skyline' },
  'entity-and-corporate-services': { eyebrow: 'Expansion option', title: 'Know when the bridge should become a local commitment.', intro: 'An EoR can create useful optionality. Trustora helps companies review the evidence, operating need, and local capability behind a longer-term entity decision.', firstHeading: 'Optionality is valuable when it leads to learning.', firstBody: 'The entity question should follow the shape of the work, the durability of the market, the size of the team, and the company’s ability to operate locally. We help make those variables explicit.', secondHeading: 'The first model should have a review date.', secondBody: 'A staged employment model is stronger when the company knows what would trigger expansion, continuation, or change—and who owns that decision.', items: ['Entity readiness questions', 'Market and workforce evidence map', 'Local adviser coordination', 'EoR-to-entity transition planning'], imageKey: 'dubai-skyline', supportImageKey: 'operations-room' },
  'embedded-employment': { eyebrow: 'Systems capability', title: 'Employment workflows closer to the work.', intro: 'Some teams need employment, people, and country workflows to connect with the systems they already use. Trustora helps define the data, ownership, and operating boundaries for an embedded path.', firstHeading: 'Integration should clarify the work, not hide responsibility.', firstBody: 'A connected workflow still needs a clear owner for employment decisions, approvals, employee support, data access, and local escalation. We start with the operating model before the interface.', secondHeading: 'The employee experience remains the test.', secondBody: 'A system is useful when the employee and manager can get to a dependable answer. Integrations should make that route shorter and more accountable.', items: ['Workflow and data mapping', 'System ownership and permissions', 'Employment-event coordination', 'Employee-support handoffs'], imageKey: 'workplace-grid', supportImageKey: 'operations-room' },
  'performance-and-development': { eyebrow: 'People capability', title: 'Development that respects specialist work.', intro: 'Performance and development systems often flatten difficult work into generic language. Trustora helps teams create clearer feedback, growth, and manager rhythms for specialist employees.', firstHeading: 'Good performance practice starts with context.', firstBody: 'A research milestone, shipped app, model improvement, or systems decision may not fit a generic scorecard. We help teams connect performance conversations to the actual contribution and team environment.', secondHeading: 'Development is part of retention.', secondBody: 'Specialist people want to know how their work is understood, how they can grow, and how the organization will invest in their next level of contribution.', items: ['Role and contribution framing', 'Manager feedback rhythm', 'Development and growth planning', 'Employee experience review'], imageKey: 'people-at-work', supportImageKey: 'workplace-grid' },
};

const adjacentServiceMedia = {
  'global-hris': ['service-hris-architect', 'service-hris-governance'],
  'benefits-administration': ['service-benefits-explainer', 'service-benefits-consultation'],
  'compensation-and-equity': ['service-compensation-calibration', 'service-equity-scenario'],
  'specialist-talent-search': ['service-technical-interview', 'service-model-whiteboard'],
  'talent-operations': ['service-interview-room', 'service-timezone-coordination'],
  'background-verifications': ['service-identity-verification', 'service-verification-risk'],
  'equipment-and-it': ['service-it-cable-room', 'service-it-device-imaging'],
  'workforce-compliance': ['service-compliance-control', 'service-ml-deployment'],
  'entity-and-corporate-services': ['service-entity-market', 'service-entity-office'],
  'embedded-employment': ['service-embedded-api', 'service-embedded-workflow'],
  'performance-and-development': ['service-performance-coaching', 'service-science-calibration'],
} as const;

for (const service of services.slice(6)) {
  const adjacent = adjacentDetails[service.slug];
  const [imageKey, supportImageKey] = adjacentServiceMedia[service.slug as keyof typeof adjacentServiceMedia];
  serviceDetails[service.slug] = {
    ...adjacent,
    imageKey,
    supportImageKey,
    path: [
      { title: 'Frame', body: 'Clarify the role, country, decision owner, and the employee experience the capability needs to support.' },
      { title: 'Coordinate', body: 'Connect the people, documents, systems, and local questions that sit around the work.' },
      { title: 'Operate', body: 'Create a repeatable rhythm with visible handoffs, practical support, and clear escalation.' },
      { title: 'Review', body: 'Use evidence from the team and the employee to decide what should change next.' },
    ],
    sections: [
      { heading: adjacent.firstHeading, body: adjacent.firstBody, items: adjacent.items },
      { heading: adjacent.secondHeading, body: adjacent.secondBody },
    ],
  };
}

export interface ServiceProblem {
  heading: string;
  body: string;
  painPoints: readonly string[];
}

export const serviceProblems: Record<Service['slug'], ServiceProblem> = {
  'employer-of-record': {
    heading: 'A new-country hire should not wait for a new-country entity.',
    body: 'Teams lose momentum when the employment model is treated as paperwork at the end of the hiring process. The country, worker, role, and timing need a clear operating path before the offer is drafted.',
    painPoints: ['No local entity, but a real need to employ someone', 'Unclear ownership across contracts, payroll, benefits, and support', 'A promising hire waiting while country questions remain open'],
  },
  'employee-intelligence': {
    heading: 'A difficult technical role cannot be solved by a job title alone.',
    body: 'Specialist teams need a way to translate the problem into capability, team context, country, and working conditions. Without that translation, the search gets wider while the decision gets less precise.',
    painPoints: ['A role brief that names tools instead of the outcome', 'Technical depth that gets lost between hiring and delivery', 'Specialists entering a team without a clear employment or support model'],
  },
  'global-payroll': {
    heading: 'Payroll becomes a trust problem when nobody can explain the number.',
    body: 'A pay cycle can be technically correct and still create avoidable anxiety. Distributed teams need visible inputs, owners, local context, and a dependable route for employee questions.',
    painPoints: ['Last-minute changes with no clear decision owner', 'Country-specific deductions or benefits that employees cannot follow', 'Recurring payroll questions spread across too many teams'],
  },
  'contractor-to-employee': {
    heading: 'A contractor label can outlive the working reality.',
    body: 'When a contractor becomes part of the team, the relationship may need a more explicit model. Trustora helps surface the facts and options; classification conclusions remain subject to the applicable local rules and qualified advice.',
    painPoints: ['A contractor working like an employee without a reviewed model', 'Unclear changes to pay, benefits, protections, or responsibilities', 'A transition that could damage trust if it is treated as an administrative swap'],
  },
  'global-mobility': {
    heading: 'A cross-border move feels fragmented when every handoff has a different owner.',
    body: 'Employment, payroll, benefits, travel, work authorization, and employee support are experienced as one move. The operating plan should connect those pieces while leaving immigration, tax, and legal conclusions with qualified professionals.',
    painPoints: ['A move date that is disconnected from employment readiness', 'Documents and local partners managed in separate channels', 'An employee unsure who owns the next question'],
  },
  'people-operations': {
    heading: 'The employee experience gets heavy when small questions have no home.',
    body: 'After the first day, trust is built through ordinary moments: leave, records, changes, questions, and offboarding. A clear people-operations rhythm keeps those moments from becoming a manager or employee scavenger hunt.',
    painPoints: ['Onboarding that ends before the employee feels ready', 'Leave, document, and support requests with no visible route', 'Offboarding treated as an exception instead of part of the lifecycle'],
  },
  'global-hris': {
    heading: 'Distributed teams cannot operate well from scattered employee records.',
    body: 'A people system should shorten the route to a dependable answer. The challenge is not collecting more data; it is giving records, permissions, approvals, and country-aware workflows a clear owner.',
    painPoints: ['The same employee fact maintained in multiple places', 'Approvals and documents disappearing between teams', 'Managers and employees unsure which system is authoritative'],
  },
  'benefits-administration': {
    heading: 'Local benefits should not become a maze for the employee.',
    body: 'Benefits vary by country and employer, but the employee still needs a clear explanation of what is offered, what is required, and where to go for help. Coordination makes local variation easier to use.',
    painPoints: ['Benefits choices that are hard to compare or explain', 'Enrollment deadlines and changes without a clear owner', 'Country context missing from an otherwise global program'],
  },
  'compensation-and-equity': {
    heading: 'A compelling offer is more than a number on a page.',
    body: 'Specialist candidates read the whole operating promise: role, country, pay, equity, benefits, timing, and the confidence of the answers. A structured conversation keeps those pieces aligned without pretending one formula fits every market.',
    painPoints: ['Pay decisions separated from role and country context', 'Equity or allowance questions arriving too late in the offer', 'Employees unable to understand how the offer is meant to work'],
  },
  'specialist-talent-search': {
    heading: 'The hardest talent searches fail when expertise is reduced to keywords.',
    body: 'A researcher, model evaluator, systems builder, product engineer, and technical leader may all solve different parts of the same problem. Capability-first framing gives the search a better starting point and the eventual hire a workable path.',
    painPoints: ['A title that attracts the wrong experience', 'Interview signals disconnected from the work the person will do', 'A candidate found without a country, offer, or first-day plan'],
  },
  'talent-operations': {
    heading: 'Specialist hiring slows down in the gaps between functions.',
    body: 'The manager, recruiter, finance team, employment partner, candidate, and new employee each hold part of the path. Naming the handoffs and decision owners helps the process move from a good brief to a credible first day.',
    painPoints: ['Role design and sourcing operating on different assumptions', 'Offers delayed by employment, payroll, or equipment questions', 'Candidate momentum lost between selection and onboarding'],
  },
  'background-verifications': {
    heading: 'A check without purpose can create more risk than confidence.',
    body: 'Verification should match the role, country, consent, retention need, and decision it is meant to inform. A proportionate workflow gives the candidate context and gives the team a clear route for exceptions.',
    painPoints: ['Generic checks that do not match the role or country', 'Consent, records, and retention responsibilities left unclear', 'Discrepancies routed without a human review path'],
  },
  'equipment-and-it': {
    heading: 'A specialist cannot do the work if day-one access is still a surprise.',
    body: 'Devices, accounts, security, shipping, and returns are part of the employment experience. A visible readiness plan helps the employee start contributing instead of spending the first week finding the right owner.',
    painPoints: ['A device or access request raised after the start date', 'Security requirements disconnected from role and location', 'No dependable return or offboarding workflow'],
  },
  'workforce-compliance': {
    heading: 'Workforce risk grows when changing facts are reviewed only after a problem.',
    body: 'A useful compliance rhythm makes assumptions visible, gives them an owner, and creates a path to qualified legal, tax, immigration, or employment advice when the facts require it.',
    painPoints: ['Classification and documentation assumptions that are not revisited', 'Country or role changes without a corresponding review', 'Approvals and escalations that depend on personal memory'],
  },
  'entity-and-corporate-services': {
    heading: 'An EoR bridge needs a review point before it becomes permanent by default.',
    body: 'A local entity can be the right commitment, but the decision should follow evidence about the work, team, market, and operating capability. A staged review keeps optionality useful and the next decision explicit.',
    painPoints: ['A temporary model continuing without a defined review date', 'Entity decisions made before the operating need is clear', 'Local administration questions arriving without the right adviser involved'],
  },
  'embedded-employment': {
    heading: 'Connecting systems does not solve an unclear employment responsibility.',
    body: 'Embedded workflows are useful when they make ownership, permissions, approvals, and employee support easier to follow. The interface should shorten the path to a human answer rather than hide who is accountable.',
    painPoints: ['Employment events moving between systems without a named owner', 'Data access and permissions designed after the workflow', 'Employees sent through an integration that has no support route'],
  },
  'performance-and-development': {
    heading: 'Specialist contribution gets flattened when every role uses the same scorecard.',
    body: 'Research milestones, model improvements, shipped software, and systems decisions need context to be discussed fairly. A better rhythm connects feedback and development to the actual work and the conditions around it.',
    painPoints: ['Generic goals that do not describe the contribution', 'Managers without a steady, useful feedback rhythm', 'Specialists unable to see how growth connects to their next level of work'],
  },
};
