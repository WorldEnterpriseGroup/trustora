export const recordReviewed = '11 September 2026';
export const policyEffective = '1 September 2026';
export const policyPdf = {
  href: '/images/record/trustora-eor-operations-policy.pdf',
  filename: 'trustora-eor-operations-policy.pdf',
  pages: 44,
  bytes: 411767,
  sha256: '4655adae7d974edab9d4cb8f6de7a540b9e6f9012c49b1b6af9a41ee964c5fc2',
  sourceDoc: 'TRUSTORA POLICY DOCUMENT.docx (SharePoint BizCorp Training library, v17.0, modified 7 September 2026)',
};

export const recordNav = [
  {
    group: 'Company',
    links: [
      { href: '/record/', label: 'Company facts' },
      { href: '/record/leadership/', label: 'Leadership' },
      { href: '/record/marketing/', label: 'Market profile' },
      { href: '/record/journeys/', label: 'Decision briefs' },
    ],
  },
  {
    group: 'Evidence',
    links: [
      { href: '/record/federal/', label: 'Registration records' },
      { href: '/record/verify/', label: 'Source register' },
      { href: '/record/files/', label: 'Documents' },
    ],
  },
  {
    group: 'Website archive',
    links: [
      { href: '/record/nav/', label: 'Site map' },
      { href: '/record/metrics/', label: 'Content inventory' },
      { href: '/record/screens/', label: 'Visual archive' },
    ],
  },
  {
    group: 'Reference',
    links: [
      { href: '/record/ops/', label: 'Business status' },
      { href: '/record/style/', label: 'Brand guide' },
    ],
  },
] as const;

export const recordScopeNote =
  'Values marked as published-entity or government-registry describe the current verifiable company record. Capability and operating-experience statements are company-reported and describe what Trustora is organized to provide; they are not claims of an audited contract outcome. Information Trustora does not publish is listed as not published rather than filled with an estimate.';

export const verificationBoundaryNote =
  'Registry facts remain useful without leaving this page. Outbound links to SECP, FBR, EOBI, SESSI, PSEB, and trustora.net legal pages are supplemental checks; agency and registry records control at transaction time and can change after the review date.';
