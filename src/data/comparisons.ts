export const comparisons = [
  {
    slug: 'eor-vs-entity',
    eyebrow: 'Employment model',
    title: 'EoR or local entity? Choose the right bridge.',
    description: 'A practical comparison for companies deciding how much local infrastructure the next market needs.',
    thesis: 'An EoR can create useful optionality while a company learns a market. An entity can make sense when the work, commitment, and local operating requirements are durable enough to justify building one.',
    rows: [
      ['Best fit', 'A defined role or small team where the client wants to move with a local employment layer.', 'A durable market presence with enough activity to justify local ownership and administration.'],
      ['Speed to employ', 'Typically faster to operationalize, subject to country facts and required checks.', 'Usually slower because the company is creating and maintaining its own local structure.'],
      ['Control', 'The client directs the work and owns the day-to-day relationship; the EoR carries defined employment administration.', 'The company owns the local employment structure directly and still needs strong local operating capability.'],
      ['Review question', 'What evidence would tell us this market deserves a more permanent structure?', 'What local capability, cost, and responsibility should we own ourselves?'],
    ],
    prompt: 'If the answer depends on facts about a country, role, tax, immigration, or permanent establishment, bring qualified local advice into the decision.',
  },
  {
    slug: 'eor-vs-contractor',
    eyebrow: 'Worker model',
    title: 'EoR or contractor? Match the model to the relationship.',
    description: 'A clear-eyed comparison for teams weighing flexibility against an employment relationship with defined responsibilities.',
    thesis: 'The label is not the whole relationship. The work, direction, dependence, duration, and local rules should shape whether an employee or an independent contractor is appropriate.',
    rows: [
      ['Best fit', 'A person working as part of the client team with an employment relationship and local employee protections.', 'A genuinely independent business providing defined services with the independence and risk that the model assumes.'],
      ['Direction of work', 'The client manages priorities, collaboration, and outcomes inside its operating rhythm.', 'The contractor retains meaningful independence over how the service is delivered.'],
      ['Risk to surface', 'Employment responsibilities still need clear ownership across the client, EoR, employee, and country.', 'Misclassification risk increases when the practical relationship looks like employment despite the contract label.'],
      ['Review question', 'What does this person need from an employer to do the work well?', 'What evidence shows the person is operating an independent business in practice?'],
    ],
    prompt: 'Worker classification is fact-specific and jurisdiction-specific. Trustora can help organize the operating questions; qualified local professionals should advise on the legal conclusion.',
  },
  {
    slug: 'eor-vs-peo',
    eyebrow: 'Operating model',
    title: 'EoR or PEO? Understand who employs the person.',
    description: 'A compact guide to the difference between a true Employer of Record relationship and a co-employment model.',
    thesis: 'The central question is not which acronym sounds familiar. It is who the legal employer is, what the local structure permits, and which responsibilities the client is prepared to carry.',
    rows: [
      ['Legal employment relationship', 'The EoR is the local employer for the defined employment relationship while the client manages the work.', 'A PEO arrangement generally assumes a co-employment structure that may require the client to have its own local entity.'],
      ['Best fit', 'An international company that wants to employ someone in a country where it does not yet have the relevant structure.', 'A company with a local entity that wants shared payroll, HR, or employment administration.'],
      ['Client responsibility', 'Direction, supervision, role design, performance, and the quality of the employee experience remain with the client.', 'The client shares more of the local employment infrastructure and must understand the co-employment responsibilities.'],
      ['Review question', 'Do we need a local employer now, or are we already prepared to employ locally?', 'Which responsibilities and liabilities are we ready to manage with a local entity?'],
    ],
    prompt: 'The terms and structures vary by country. Confirm the model with qualified local employment and tax advisers before relying on a comparison as a decision.',
  },
] as const;

export type Comparison = (typeof comparisons)[number];
