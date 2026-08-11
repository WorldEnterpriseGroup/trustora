export type BriefingSection = { title: string; body: string; prompts?: string[] };

export const briefings = [
  {
    slug: 'employer-of-record-operating-brief',
    format: 'Executive brief',
    title: 'The Employer of Record Operating Brief',
    dek: 'A practical decision instrument for leaders deciding whether an EoR is the right employment layer for the next specialist hire.',
    audience: 'Founders, people leaders, operators, and technical executives',
    thesis: 'An EoR is most useful when it creates a deliberate bridge between a real hiring need and a future operating model—not when it is sold as a shortcut around responsibility.',
    signal: 'You have the role, the candidate, or the country in mind, but the employment model is still unclear.',
    preview: ['A decision map for EoR, contractor, and entity questions', 'A responsibility map for the client, EoR, employee, and country', 'A pre-offer checklist for specialist roles', 'A set of questions for the first operating review'],
    outcomes: ['Know which facts should shape the first EoR conversation', 'Separate employment administration from legal, tax, and immigration advice', 'Give the employee a clearer answer about who owns what', 'Recognize when the EoR model needs to evolve'],
    accent: 'cobalt',
    sections: [
      { title: 'The decision is not only “can we hire?”', body: 'The useful question is whether the company can create a compliant, understandable, and sustainable employment relationship around the role it actually needs.', prompts: ['What work needs to happen?', 'Where will the person work?', 'Which responsibilities must remain with the client company?'] },
      { title: 'The bridge has boundaries', body: 'An EoR coordinates a local employment relationship. It does not remove the client’s responsibility for direction, management, product decisions, or the quality of the work.', prompts: ['Which advice must come from a qualified local professional?', 'Where will the employee ask for help?', 'What should be documented before the first day?'] },
    ],
  },
  {
    slug: 'specialist-talent-expansion-brief',
    format: 'Talent brief',
    title: 'The Specialist Talent Expansion Brief',
    dek: 'How to connect technical, scientific, and product expertise to the countries where the work needs to happen.',
    audience: 'AI, ML, quantum, science, software, and advanced-product leaders',
    thesis: 'The best global talent strategy connects the problem, the person, the country, and the employment experience before it optimizes the hiring funnel.',
    signal: 'The role is difficult to source, the team is distributed, or the employment model is slowing a high-value decision.',
    preview: ['A capability-first role framing canvas', 'A country and employment-model checklist', 'A specialist employee experience map', 'A set of conjectures for building a durable talent advantage'],
    outcomes: ['Make technical roles legible to both candidates and operators', 'Identify country questions before offer design', 'Connect EoR, employee experience, and specialist retention', 'Create a practical next conversation with Trustora'],
    accent: 'brick',
    sections: [
      { title: 'Expertise is not a commodity line item', body: 'A title can hide the difference between research, engineering, product, delivery, and leadership. Start with the work and the conditions that let the person do it well.', prompts: ['What has this person shipped or made possible?', 'Which team boundary will they cross?', 'What does good support feel like in the first 90 days?'] },
      { title: 'The employee experience is part of the proposition', body: 'A specialist can assess the seriousness of a company through the offer, the local employment setup, the payroll rhythm, and the quality of the answers they receive.', prompts: ['What will the employee understand before accepting?', 'Who can answer a local employment question?', 'Which part of the relationship needs a named owner?'] },
    ],
  },
  {
    slug: 'eor-vs-entity-decision-brief',
    format: 'Decision brief',
    title: 'EoR or Entity? A Decision Brief for the Next Market',
    dek: 'A structured way to decide whether to stage a market entry through an EoR or commit to building a local entity.',
    audience: 'Expansion leaders, finance, legal, people, and founders',
    thesis: 'The right answer depends on the shape of the work, the durability of the market commitment, the country facts, and the organization’s ability to operate locally.',
    signal: 'The company has moved beyond a single hire or is comparing an EoR with a more permanent local presence.',
    preview: ['A staged-commitment decision tree', 'The cost and control questions to surface early', 'An EoR-to-entity transition checklist', 'Questions for finance, people, legal, and the employee'],
    outcomes: ['Make the market-entry choice with fewer hidden assumptions', 'Know which variables change the recommendation', 'Plan the next review instead of treating the first model as permanent', 'Align the employee experience with the company’s level of commitment'],
    accent: 'gold',
    sections: [
      { title: 'Optionality has an operating cost', body: 'An EoR can create a useful bridge, but the bridge still needs ownership, review, and a clear answer to the employee. Optionality is valuable when it helps the company learn—not when it postpones every decision.', prompts: ['What would make the market durable?', 'What would trigger an entity conversation?', 'Which facts are still unknown?'] },
      { title: 'The model should be reviewed in public', body: 'A good employment partner makes the assumptions visible so the company can decide whether to continue, adapt, expand, or change the structure.', prompts: ['Who owns the review?', 'What evidence will matter?', 'How will the employee be included?'] },
    ],
  },
] as const;

export type Briefing = (typeof briefings)[number];
