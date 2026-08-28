# Trustora technical audit

This audit is intentionally separate from `scripts/deep-audit.mjs`. The deep audit owns route-level metadata presence, heading structure, form labels, image dimensions, AVIF output, and creative uniqueness. `scripts/technical-audit.mjs` covers the adjacent operational checks that are easy to miss in a static Astro build:

- canonical-to-route alignment and indexable sitemap membership;
- internal route links and fragment targets;
- JSON-LD parsing and Article canonical alignment;
- mobile viewport metadata and external-link safety;
- form control names, grouped choices, file-upload encoding, and the D365 HTTPS intake boundary;
- robots policy, custom-domain deployment assumptions, and static-hosting recovery output;
- source-map/debug-file exposure, credential-like strings, local development URLs, and unsanitized `set:html` usage.

## Run it

Run the build first, then run the audits sequentially. Do not run `astro build` and `pnpm test` in parallel: the build and test processes can otherwise inspect a changing `dist/` directory and produce misleading route counts or media results.

```bash
pnpm run build
pnpm test
pnpm run audit:technical
```

The technical audit is deliberately warning-oriented for deployment decisions that cannot be solved inside a static page. It fails on broken route/fragment/sitemap relationships, malformed structured data, missing form semantics, unsafe output exposure, and invalid static-hosting essentials. Warnings require an owner before production changes are considered complete.

## Current findings

The latest sequential production-build run found these follow-ups:

1. **Creative uniqueness:** the current production artifact passes the strict global media check: 59 active assignments produce 59 unique emitted creative URLs. The source library contains 66 unique AVIF masters, with unused masters retained for future editorial assignments.

2. **All form delivery uses the D365 intake boundary:** contact, briefing, squeeze, and career forms use HTTPS `POST` transport to the Trustora Azure Function, with server-side validation, origin checks, rate limiting, and visible client feedback. Public inquiries create D365 Lead records; career applications remain in the restricted Trustora career-application table.

3. **D365 intake is provisioned:** the careers route has a structured, consent-aware application form and restricted custom table; public inquiries use the standard Lead table through the same Trustora managed identity and owner-team boundary. The `PUBLIC_CAREERS_API_URL` and `PUBLIC_TRUSTORA_INTAKE_API_URL` build variables are required for every GitLab and GitHub Pages build.

4. **Sitemap freshness is content-backed where available:** article routes use their `updatedAt` or `publishedAt` values, while routes without a meaningful editorial date omit `<lastmod>`. The audit still warns if a future build regresses to one identical date for every URL.

5. **Custom-domain behavior is preserved in both build and packaging:** the tracked `public/CNAME` is emitted as `dist/CNAME`, `.gitlab-ci.yml` explicitly copies the tracked root `CNAME` into the GitLab Pages artifact, and `.github/workflows/pages.yml` copies it into the GitHub Pages artifact. `trustora.net` is configured on the GitHub Pages deployment; GitLab Pages remains the canonical CI artifact publication. The root `.nojekyll` is not part of the supported GitLab Pages deployment.

6. **Static security headers are a hosting concern:** the generated files do not prove that the deployed host sends HSTS, `Content-Security-Policy`, `Referrer-Policy`, `Permissions-Policy`, or `X-Content-Type-Options`. Configure and verify those at GitHub Pages, GitLab Pages, Azure Front Door, or the selected edge. Do not add a broad CSP exception merely to accommodate future scripts.

## Intake/CRM boundary

The static site must not contain Dynamics, Azure Function, Logic App, or Front Door credentials. The intake endpoint accepts only the fields needed for the conversation, validates them server-side, rate-limits abuse, rejects sensitive documents, and creates the D365 record through the managed-identity integration. Career applications retain a separate data-retention and access policy from public contact leads.

The preferred low-overhead shape is:

```text
Astro form → Azure Function or Logic App endpoint → validation/rate limit
          → Dynamics 365 Trustora business unit → confirmation/operational alert
```

Front Door can provide the public edge, WAF/routing, and TLS boundary, but it is not a substitute for server-side validation or CRM authorization. Keep the endpoint contract documented beside the eventual function/workflow rather than embedding it in page markup.

## Accepted exceptions and owners

| Exception | Current status | Owner before production hardening |
| --- | --- | --- |
| D365 intake forms | HTTPS Function boundary with D365 routing; runtime and CRM authorization require the health/replay checks | Web/CRM implementation |
| Static security headers | Not verifiable from source | Hosting/edge owner |
| Trustora CRM / Function / Front Door resources | Provisioned 2026-08-12; custom-host POP propagation is pending Azure edge convergence | CRM/platform owner |
