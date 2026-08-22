# SEO and regional landing plan

## Purpose

The commercial route metadata now leads with the decision a reader wants to
make: hire, employ, support, or clarify a specialist team across borders. The
shared SEO registry in `src/data/seo.ts` keeps titles at 60 characters or less
and descriptions at 160 characters or less. Article routes are deliberately
not in the registry; their collection front matter remains authoritative.

## Regional routes

The existing location model now includes two focused entries:

- `/locations/us-ai-ml-teams/` — for teams building AI and ML capability in
  the United States. The page frames role scope, access, state and worker
  questions, pay, benefits, and manager rhythm.
- `/locations/eu-specialist-hiring/` — for companies hiring technical and
  scientific specialists across European Union countries. The page keeps
  country-by-country employment, worker, benefits, and local-advice questions
  visible.

These pages are audience-focused service contexts, not claims that Trustora
has a US or EU legal entity. Trustora’s Pakistan entity, the facts of the
worker and role, and the relevant country determine the operating path. Legal,
tax, immigration, and employment conclusions remain with qualified local
professionals where required.

## Publishing guidance

Add a regional page by extending `src/data/locations.ts` with a distinct slug,
reader problem, watch list, and accurate `contextNote`, then add its exact
route metadata to `src/data/seo.ts`. The dynamic location route will generate
the page and the location index will link to it automatically. Keep copy
specific to the audience and country context; do not turn a region into a
single legal or employment rule.

Before publishing, check the title and description lengths, verify the
canonical route in a production build, and confirm that the page’s next step
matches the reader’s question.
