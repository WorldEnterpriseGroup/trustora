# Trustora

Trustora is an Astro 7 editorial website for Employer of Record services and Employee Intelligence: the employment, people-operations, and specialist-talent layer around teams working in AI, machine learning, quantum, physics, sciences, and shipped software.

The site is a static, multipage build published through GitLab Pages at [trustora.net](https://trustora.net). It includes the main EoR narrative, capability detail pages, industry and location briefs, insights, comparison pages, workplace guidance, squeeze pages, and a detailed client-intake form.

## Stack

- Astro 7.2.0 with static output and trailing-slash routes
- TypeScript for data and content helpers
- Astro content collections for editorial articles
- Sharp-backed AVIF image processing
- Native HTML, CSS, and small progressive-enhancement scripts for navigation, form validation, and D365 intake submission
- GitLab Pages deployment defined in `.gitlab-ci.yml`; the pipeline publishes the generated `dist/` artifact and preserves the custom-domain marker

## Local development

```bash
pnpm install
pnpm run dev
```

Useful checks:

```bash
pnpm run check   # Astro and TypeScript diagnostics
pnpm run build   # production output in dist/
pnpm test        # route smoke test plus deep accessibility/SEO/media audit
pnpm run preview # serve the latest dist/ build locally
```

## Repository and deployment source of truth

The canonical repository is [WorldEnterpriseGroup/trustora on GitLab](https://git.developerdojo.org/WorldEnterpriseGroup/trustora). GitLab CI validates the project and publishes the default branch through GitLab Pages. The GitHub remote is a mirror/reference only; do not make website changes there or treat GitHub Pages as an active deployment target.

The production build emits the generated route set, including the recovery route, plus `robots.txt` and `sitemap.xml`. Route counts are intentionally verified from `dist/` rather than maintained as a second hard-coded list; the route families and conversion pages are documented in [docs/route-ledger.md](docs/route-ledger.md).

## Project map

```text
src/
├── assets/editorial/avif/  # source creative library; AVIF only
├── components/             # chrome, editorial, and shared UI components
├── content/articles/       # insight content collection
├── data/                   # site, service, media, and navigation data
├── layouts/                # document shell and metadata
├── pages/                  # static routes and dynamic route families
└── styles/                 # tokens and global editorial system
docs/                       # route and media ledgers
scripts/                    # route, media, deep, and technical audit scripts
```

## Media rules

Every editorial photograph is a distinct AVIF source with intrinsic dimensions, descriptive alternative text, and a caption/credit path. Legacy raster copies are not part of the active source library or production output. The rationale for the direct-master AVIF delivery strategy is recorded in [docs/media-manifest.md](docs/media-manifest.md).

## Forms and deployment boundary

The site is intentionally static, but no form uses an email-client fallback. Contact, briefing, and squeeze-page forms post URL-encoded data to `PUBLIC_TRUSTORA_INTAKE_API_URL`; career forms post to `PUBLIC_CAREERS_API_URL`. Both HTTPS endpoints terminate at the Trustora Azure Function boundary and route accepted submissions into D365. Builds fail closed when either protected endpoint variable is absent or not HTTPS.

The careers integration contract, public-intake contract, schema, and Function source live in [docs/careers-intake-crm.md](docs/careers-intake-crm.md), [docs/careers-intake-contract.schema.json](docs/careers-intake-contract.schema.json), and [infra/careers-intake/](infra/careers-intake/). The Function uses managed identity, Dataverse upsert for careers, and D365 Lead creation with submission-id replay protection for public inquiries. No CRM credentials belong in the Astro build.

## Content and brand

Trustora’s positioning is “EoR with Employee Intelligence”: country-aware employment operations paired with capability-first support for specialist technical and scientific work. Keep legal, tax, immigration, and employment claims qualified and route fact-specific conclusions to the appropriate local professionals.

## License

This project is licensed under the MIT License; see [LICENSE](LICENSE).
