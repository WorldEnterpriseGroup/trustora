# Trustora

Trustora is an Astro 7 editorial website for Employer of Record services and Employee Intelligence: the employment, people-operations, and specialist-talent layer around teams working in AI, machine learning, quantum, physics, sciences, and shipped software.

The site is a static, multipage build published through GitHub Pages at [trustora.net](https://trustora.net). It includes the main EoR narrative, capability detail pages, industry and location briefs, insights, comparison pages, workplace guidance, squeeze pages, and a detailed client-intake form.

## Stack

- Astro 7.2.0 with static output and trailing-slash routes
- TypeScript for data and content helpers
- Astro content collections for editorial articles
- Sharp-backed AVIF image processing
- Native HTML, CSS, and a small progressive-enhancement script for navigation
- GitHub Pages deployment defined in `.github/workflows/pages.yml`; the workflow publishes only the generated `dist/` artifact

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

The site is intentionally static. Squeeze-page forms and the full contact intake use a `mailto:` fallback so a visitor can prepare an inquiry without a JavaScript dependency. The careers form uses the same fallback until `PUBLIC_CAREERS_API_URL` is configured; when set, it posts URL-encoded data to the Trustora-specific Azure Function boundary.

The careers integration contract, schema, and Function source live in [docs/careers-intake-crm.md](docs/careers-intake-crm.md), [docs/careers-intake-contract.schema.json](docs/careers-intake-contract.schema.json), and [infra/careers-intake/](infra/careers-intake/). The Function uses managed identity and Dataverse upsert, and is deliberately fail-closed until the Trustora Business Unit, owner team, custom application table, alternate key, security role, and Front Door route exist in Dream. No CRM credentials belong in the Astro build.

## Content and brand

Trustora’s positioning is “EoR with Employee Intelligence”: country-aware employment operations paired with capability-first support for specialist technical and scientific work. Keep legal, tax, immigration, and employment claims qualified and route fact-specific conclusions to the appropriate local professionals.

## License

This project is licensed under the MIT License; see [LICENSE](LICENSE).
