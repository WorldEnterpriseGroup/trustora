export const countryParameters = [
  {
    number: '01',
    code: 'PK',
    title: 'Pakistan',
    status: 'Published identity',
    posture: 'Entity on record',
    summary:
      'Trustora’s published legal identity is TRUSTORA (SMC-PRIVATE) LIMITED, a company established in Pakistan.',
    parameters: [
      'Employment administration and coordination are the public service boundary.',
      'Registration numbers, office details, tax identifiers, licenses, and insurance are not published until approved.',
      'Engagement-specific legal, tax, immigration, and employment questions require qualified local professionals where needed.',
    ],
  },
  {
    number: '02',
    code: 'EU',
    title: 'European Union',
    status: 'Client context',
    posture: 'Country-by-country review',
    summary:
      'The EU is a strategic client corridor for specialist work. It is not a claim that one Trustora entity covers every member state.',
    parameters: [
      'Name the actual employing country before the model is selected.',
      'Surface worker status, payroll, benefits, workplace, and manager-location facts early.',
      'Country-specific advice and partner validation remain part of readiness.',
    ],
  },
  {
    number: '03',
    code: 'AU',
    title: 'Australia',
    status: 'Client context',
    posture: 'Local facts shape the answer',
    summary:
      'Australia is a strategic client corridor where time zone, workplace, role, and employment facts should be made visible before an offer.',
    parameters: [
      'Confirm the state or territory and the person’s working location.',
      'Separate employment coordination from legal, tax, immigration, and workplace advice.',
      'Use the live role and intended start date to determine the next review.',
    ],
  },
  {
    number: '04',
    code: 'US',
    title: 'United States',
    status: 'Client context',
    posture: 'State and role matter',
    summary:
      'The United States is a strategic client corridor. The specific state, worker, manager, and business facts still determine the operating questions.',
    parameters: [
      'Identify the state or states where the employee will work.',
      'Make manager ownership, work authorization, payroll, benefits, and workplace expectations explicit.',
      'Escalate questions requiring qualified US legal, tax, immigration, or employment advice.',
    ],
  },
] as const;
