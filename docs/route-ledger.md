# Trustora route ledger

The site is a static Astro 7.2.0 build with trailing-slash URLs. Route counts are verified against the production output; the current regression gate expects 88 HTML routes including the 404 route and 87 indexable routes, plus `robots.txt` and `sitemap.xml`. Update the gate and this ledger together when a route is intentionally added or removed.

## Route families

| Family | Routes | Reader job | Signature / primary action |
| --- | ---: | --- | --- |
| Home | 1 | Establish Trustora’s point of view and introduce EoR with Employee Intelligence | Orientation hero → capability definition → service index → trust principles → insights → contact CTA |
| Capabilities | 18 | Explain the core EoR service and its adjacent operating options | Capability map or detail → path → boundaries → support image → conversation |
| Industries | 7 | Connect technical work to sector context | Industry thesis → questions to surface → relevant capabilities → next conversation |
| Locations | 4 | Make the EU, Australia, and USA operating context discussable | Location brief → local questions → employment path → contact |
| Insights | 16 | Explain EoR, integrity, employee experience, workplace, and specialist teams | Article index or article reading experience → sources → related questions |
| Briefings | 12 | Give early-stage and executive readers a decision instrument | Brief preview → access gate → use-in-the-room outcomes → working questions |
| Comparisons | 3 | Clarify EoR versus entity, contractor, and PEO models | Thesis → comparison table → caveats → next step |
| Workplace / employee experience | 3 | Make the conditions around work visible | Workplace matrix or employee journey → library → brief |
| Conversion / squeeze | 15 | Capture context for a brief or readiness conversation | Reduced header → working material → `mailto:` fallback |
| Company / utility / legal | 8 | Explain Trustora, invite careers, provide contact, legal, and recovery paths | Page-specific document composition |

## Conversion routes

The squeeze pages use a reduced header and a dominant form. They intentionally use `mailto:info@trustora.net` because the site is static; the form still works without client-side JavaScript by opening an email draft. The full contact intake additionally asks for work timezone, staff count, role families, SaaS-team scope, budget (default `$250,000`), timeline, workplace model, employee support priorities, and decision context.

## Verification gates

- `scripts/route-smoke.mjs` checks the generated output, landmarks, one `h1`, metadata, internal links, intrinsic image dimensions, sitemap inclusion, and route-level emitted-image uniqueness. Its expected route count is a deliberate regression gate and must be updated when a route is intentionally added.
- `scripts/deep-audit.mjs` checks unique metadata, heading structure inside `<main>`, duplicate IDs, form labels, ARIA targets, AVIF-only creative output, and source-media reuse warnings.
- `scripts/technical-audit.mjs` checks canonical-to-route alignment, fragments, sitemap set equality, JSON-LD validity, mobile viewport metadata, form transport risks, static-hosting assumptions, and production-output exposure.
- `pnpm run audit:technical` runs the technical audit independently; warnings identify deployment or intake work that cannot be solved by static page markup alone.
- Firefox review has been run at 390×844 and 1440×900 on the home, services, contact, article, and squeeze-page families. Mobile menu open/close, Escape focus return, and desktop megamenu open states were exercised.

## Editorial media rule

Every editorial creative source and emitted creative URL is unique across the entire website. Brand logos, icons, and technical diagrams are structural assets and are excluded from the creative-photo uniqueness gate. The deep audit also hashes the AVIF source library so the same image cannot return under two filenames.
