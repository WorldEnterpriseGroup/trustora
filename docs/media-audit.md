# Trustora media and editorial audit

Audit date: 2026-08-12

This report covers the rendered production output and the editorial AVIF library. It is intentionally separate from the media manifest: this workstream records findings without changing route assignments, shared UI, or published alt text.

Run the bounded audit with:

```bash
node scripts/media-audit.mjs
```

The command exits non-zero if duplicate assignments appear. That is deliberate: the site requirement is one unique creative image across the entire website.

## Current inventory

- 66 AVIF source masters in `src/assets/editorial/avif/`.
- 66/66 source pixel hashes are unique.
- 59 distinct source masters are active in the rendered site.
- 59 figure references resolve to 59 unique emitted AVIF URLs.
- No emitted creative URL is currently reused across routes.
- 7 source masters are currently unused.
- No PNG, JPG, JPEG, or WebP raster source remains in `src`.

## Action and context diversity

The active set was reviewed visually and classified by what the image actually shows, not by the filename or current alt text.

| Visible action or context | Active masters |
| --- | ---: |
| Analysis / review | 17 |
| Hands-on technical | 11 |
| Coordination / logistics | 7 |
| Remote support | 7 |
| Presentation / facilitation | 4 |
| Conversation / networking | 3 |
| Place / context | 2 |
| Technical build | 2 |
| Coaching / development | 1 |
| Comparison / decision | 1 |
| Place / abstract | 1 |
| Portrait / non-work | 1 |
| Portrait / team | 1 |
| Writing / documentation | 1 |

This is a substantially varied library: calls, presentations, networking, data review, laboratory work, hardware diagnostics, prototyping, legal drafting, device readiness, mobility, benefits, payroll, coaching, and workplace context are all represented. The main weakness is not action variety; it is incorrect pairing between several assets and their manifest descriptions.

## Global uniqueness status

The current rendered snapshot has no duplicate creative URL across routes. The audit is deliberately fail-closed: if a later route or article reuses an emitted creative URL, `scripts/media-audit.mjs` will report the route pair and exit non-zero. Route/data edits remain outside this workstream.

## Corporate-fit and copy findings

The following are concrete review flags from the visual pass. Current alt text and captions are intentionally not changed here.

### Replace or reconsider for corporate positioning

- `operations-room`: a fashion-style portrait with sunglasses against a blank wall; it does not read as an operations room and is not a good fit for the site’s corporate EoR posture.
- `people-at-work`: an abstract building facade with no people visible; the current copy describes a group working around a table.
- `team-table`: a café-style collaboration scene with casual clothing and sunglasses; it is materially more informal than the rest of the Trustora visual system.

### Likely manifest/image pair mismatches

These appear to be reversals or stale descriptions, not merely subjective caption choices:

- `service-ai-evaluation` shows an equipment-case handoff; its current copy describes an African AI researcher evaluating model outputs across three monitors.
- `service-equipment-handoff` shows a technical monitoring workstation; its current copy describes an employee receiving a laptop and equipment kit.
- `service-eor-advisor` shows a Black woman reviewing an employment workflow; its current copy describes an East Asian advisor on a headset call.
- `service-eor-intake` shows an East Asian woman conducting a headset call; its current copy describes a Black HR operations lead configuring onboarding.
- `service-ml-deployment` shows three scientists working on precision laboratory equipment; its current copy describes an ML deployment operations center.
- `service-science-calibration` shows one specialist reviewing a dark data-monitoring wall; its current copy describes a diverse clean-room calibration team.
- `service-technical-interview` shows a Black technical specialist whiteboarding a model architecture; its current copy describes a Latina recruiter conducting a video interview.
- `service-model-whiteboard` shows a headset video interview; its current copy describes a Black candidate writing a model architecture on glass.

The four pairs above should be checked as possible reversed assignments before new imagery is generated.

### Accessibility-copy review

45 of 59 active alt strings include an inferred identity descriptor such as race, nationality, religion, or ethnicity. The diversity intention is positive, but alt text should generally prioritize the visible work action and context. Identity descriptors should be retained only when they are relevant, verified, and useful to the page’s meaning; avoid asking screen readers to infer a person’s identity from appearance.

## Unused source masters

These AVIF masters are present but not emitted by the current route build:

- `accessible-technical-workspace`
- `employee-support-and-planning`
- `eor-decision-room`
- `hardware-prototyping`
- `office-space-walkthrough`
- `remote-professional-setup`
- `remote-work`

They are candidates for future careers, internship, workplace, quantum, and employee-experience pages, but assigning them belongs to the route/editorial workstream. The audit script keeps them visible so unused media does not become invisible repository weight.

## Validation

The bounded audit verifies source hash uniqueness, emitted URL reuse, same-route source reuse, AVIF-only raster hygiene, active review coverage, action/context taxonomy coverage, and identity-descriptor visibility in rendered alt text. It currently passes the AVIF, uniqueness, and source-integrity checks while reporting the editorial review flags above.
