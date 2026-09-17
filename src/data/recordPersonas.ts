export interface PersonaJourney {
  id: string;
  title: string;
  steps: string[];
  rationale: string[];
  terminal: boolean;
  terminalNote: string;
}

export interface Persona {
  id: string;
  label: string;
  goal: string;
  journeys: PersonaJourney[];
}

export const recordPersonas: Persona[] = [
  {
    id: 'hiring-manager',
    label: 'Hiring manager',
    goal: 'Scope the role and country, then open an intake request.',
    journeys: [
      {
        id: 'hiring-manager-1',
        title: 'New-country specialist path',
        steps: ['/', '/country-parameters/', '/services/employer-of-record/', '/contact/'],
        rationale: [
          'Home introduces the EoR point of view that frames the visit.',
          'Country parameters separate entity identity from corridor questions.',
          'The Employer of Record page states scope for a fit check.',
          'The contact intake converts the evaluation into a request.',
        ],
        terminal: true,
        terminalNote: 'The D365-routed contact intake conversion.',
      },
      {
        id: 'hiring-manager-2',
        title: 'Specialist capability path',
        steps: ['/', '/services/employee-intelligence/', '/services/specialist-talent-search/', '/contact/'],
        rationale: [
          'Home introduces the mission scope that frames the visit.',
          'Employee intelligence translates the technical problem into capability.',
          'Specialist talent search connects the capability to a workable hire.',
          'The contact intake converts the evaluation into a request.',
        ],
        terminal: true,
        terminalNote: 'The D365-routed contact intake conversion.',
      },
    ],
  },
  {
    id: 'reviewer',
    label: 'HR and finance reviewer',
    goal: 'Check standing, payroll, and boundaries before approval.',
    journeys: [
      {
        id: 'reviewer-1',
        title: 'Standing and payroll path',
        steps: ['/record/federal/', '/legal/policy/', '/contact/'],
        rationale: [
          'Registration records state the entity and statutory posture.',
          'The operations policy states the payroll rhythm and controls.',
          'The contact intake opens the reviewer conversation.',
        ],
        terminal: true,
        terminalNote: 'The D365-routed contact intake conversion.',
      },
    ],
  },
  {
    id: 'executive',
    label: 'Executive',
    goal: 'Weigh the operating model and evidence limits.',
    journeys: [
      {
        id: 'executive-1',
        title: 'Operating model path',
        steps: ['/record/', '/record/ops/', '/record/verify/', '/contact/'],
        rationale: [
          'Company facts state identity, standing, and boundaries.',
          'Business status separates registry facts from company-reported experience.',
          'The source register puts each finding beside its source.',
          'The contact intake converts the evaluation into a conversation.',
        ],
        terminal: true,
        terminalNote: 'The D365-routed contact intake conversion.',
      },
    ],
  },
  {
    id: 'employee',
    label: 'Prospective employee',
    goal: 'See the employment promise, then apply.',
    journeys: [
      {
        id: 'employee-1',
        title: 'Employment promise path',
        steps: ['/employee-experience/', '/legal/policy/', '/careers/'],
        rationale: [
          'Employee experience maps the offer-to-offboarding journey.',
          'The operations policy states the standards behind the promise.',
          'Careers converts interest into an application.',
        ],
        terminal: true,
        terminalNote: 'The careers application conversion.',
      },
    ],
  },
];
