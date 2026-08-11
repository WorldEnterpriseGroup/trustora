export const locations = [
  {
    slug: 'european-union',
    number: '01',
    title: 'European Union',
    short: 'A connected market with distinct local employment realities.',
    thesis: '“Europe” is a strategic region and a collection of employment contexts. The right EoR conversation starts with the country, not the label.',
    body: 'Trustora helps companies plan specialist employment across EU markets with an explicit operating map for local contracts, payroll, benefits, employee support, and specialist advice.',
    watch: ['Country-specific employment requirements', 'Worker classification and local documentation', 'Benefits, currency, leave, and employee expectations', 'When an EoR should become an entity conversation'],
  },
  {
    slug: 'australia',
    number: '02',
    title: 'Australia',
    short: 'A strong destination for technical, scientific, and product capability.',
    thesis: 'Distance changes the employment workflow, not the standard of the employee experience.',
    body: 'Trustora helps teams coordinate an Australian employment layer for specialist people while keeping the day-to-day work and management relationship with the client company.',
    watch: ['Local employment and payroll administration', 'Benefits and leave expectations', 'Time-zone and manager handoffs', 'Mobility and longer-term workforce planning'],
  },
  {
    slug: 'united-states',
    number: '03',
    title: 'United States',
    short: 'A deep market for AI, software, science, and applied innovation.',
    thesis: 'A strong talent market does not remove the need for a clear employing model. It increases the cost of getting the relationship wrong.',
    body: 'Trustora supports international companies employing specialist people in the United States and U.S.-based teams building a distributed capability footprint.',
    watch: ['State and role context', 'Payroll, benefits, and employment documentation', 'Contractor-to-employee transitions', 'When specialist legal or tax advice is needed'],
  },
] as const;

export type Location = (typeof locations)[number];
