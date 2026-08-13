# Trustora media manifest

All editorial raster masters live in `src/assets/editorial/avif/` and are imported through `src/data/media.ts`. The library currently contains 66 distinct AVIF masters, with source assignments emitted across the generated route set. `MediaFrame.astro` serves those already-optimized AVIF masters directly with intrinsic dimensions, deliberate loading priority, meaningful alt text, captions, credits, and a `data-media-source` identity used by the production audit.

## Asset families

The active library covers 55 assigned creative sources across:

- corporate collaboration, leadership, networking, and event coordination;
- remote work, accessible home work, employee support, and workplace setup;
- AI evaluation, ML deployment, GPU R&D, camera R&D, hardware prototyping, and technical interviews;
- physics, quantum measurement, scientific calibration, dry-lab data review, and laboratory research;
- EoR intake, payroll, benefits, compensation, mobility, verification, HRIS, compliance, IT, and people operations.

Every active creative assignment is represented by a typed key in `src/data/media.ts` and a corresponding editorial description in `src/data/site.ts`. The `credit` field distinguishes Trustora-generated illustrative imagery from brand-archive material. Generated imagery is illustrative and should not be presented as a photograph of a real employee, client, office, or customer outcome.

## Delivery rules

- Source masters are AVIF; no PNG/JPG/JPEG/WebP creative files remain in `src` or `public`.
- `MediaFrame` serves the pre-optimized AVIF master directly. Astro’s Sharp transform pipeline was benchmarked during the audit; generating 115–223 additional AVIF variants pushed a production build to 8–10 minutes for this image library without improving the already-AVIF payload. The direct-master choice is intentional and keeps publishing reproducible and fast.
- The likely LCP image is eager and high priority; other editorial images are lazy by default.
- Every meaningful image has alt text; every editorial figure has a caption and credit.
- The route smoke test detects repeated emitted creative URLs within or across routes.
- The deep audit additionally checks source identities, rejects cross-route reuse, and hashes source masters to catch duplicate files with different names.

Run `pnpm run build && pnpm run test` after adding or changing an image. Do not add a new image reference directly in a page; add the asset import, manifest entry, alt/caption/credit, and route assignment together.
