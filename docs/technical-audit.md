# Trustora technical audit

This audit is intentionally separate from `scripts/deep-audit.mjs`. The deep audit owns route-level metadata presence, heading structure, form labels, image dimensions, AVIF output, and creative uniqueness. `scripts/technical-audit.mjs` covers the adjacent operational checks that are easy to miss in a static Astro build:

- canonical-to-route alignment and indexable sitemap membership;
- internal route links and fragment targets;
- JSON-LD parsing and Article canonical alignment;
- mobile viewport metadata and external-link safety;
- form control names, grouped choices, file-upload encoding, and the static `mailto:` boundary;
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

2. **Most form delivery is still an email-client fallback:** the brief, squeeze, EoR, and contact routes submit a `POST` to `mailto:info@trustora.net`. That has no server-side validation, abuse protection, delivery guarantee, retention control, CRM routing, or structured error state. The careers form is wired for the protected `PUBLIC_CAREERS_API_URL` pipeline variable; the current working tree still needs its normal site publish before that endpoint appears in the public static artifact.

3. **Careers intake is provisioned:** the careers route has a structured, consent-aware application form, JSON Schema, Node 24 Azure Function boundary, Trustora Dataverse Business Unit/table/key/security boundary, and shared Front Door route. The protected `PUBLIC_CAREERS_API_URL` pipeline variable is enabled after a synthetic submission/replay test.

4. **Sitemap freshness is content-backed where available:** article routes use their `updatedAt` or `publishedAt` values, while routes without a meaningful editorial date omit `<lastmod>`. The audit still warns if a future build regresses to one identical date for every URL.

5. **Custom-domain behavior is outside the Astro artifact:** the repository contains `CNAME`, but Astro does not emit `dist/CNAME`; `.gitlab-ci.yml` publishes `dist/` as GitLab Pages artifacts. Confirm `trustora.net` is configured in GitLab Pages project settings, or make the deployment explicitly copy the domain file. The root `.nojekyll` is similarly not emitted by the Astro build and is only relevant if GitHub Pages remains a supported target.

6. **Static security headers are a hosting concern:** the generated files do not prove that the deployed host sends HSTS, `Content-Security-Policy`, `Referrer-Policy`, `Permissions-Policy`, or `X-Content-Type-Options`. Configure and verify those at GitLab Pages, Azure Front Door, or the selected edge. Do not add a broad CSP exception merely to accommodate future scripts.

## Intake/CRM boundary

The static site must not contain Dynamics, Azure Function, Logic App, or Front Door credentials. A future intake endpoint should accept only the fields needed for the conversation, validate them server-side, rate-limit abuse, reject sensitive documents unless the upload flow is designed for them, and create the Dynamics record through a secret-backed integration. Career applications need a separate data-retention and access policy from public contact leads.

The preferred low-overhead shape is:

```text
Astro form → Azure Function or Logic App endpoint → validation/rate limit
          → Dynamics 365 Trustora business unit → confirmation/operational alert
```

Front Door can provide the public edge, WAF/routing, and TLS boundary, but it is not a substitute for server-side validation or CRM authorization. Keep the endpoint contract documented beside the eventual function/workflow rather than embedding it in page markup.

## Accepted exceptions and owners

| Exception | Current status | Owner before production hardening |
| --- | --- | --- |
| `mailto:` forms | Temporary no-JavaScript fallback | Web/CRM implementation |
| `CNAME` absent from `dist/` | Deployment warning | GitLab Pages/edge owner |
| Static security headers | Not verifiable from source | Hosting/edge owner |
| Trustora CRM / Function / Front Door resources | Provisioned 2026-08-12; custom-host POP propagation is pending Azure edge convergence | CRM/platform owner |
