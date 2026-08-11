# Trustora media manifest

All editorial images are bundled from `src/assets/editorial/avif/` and emitted as AVIF. They are used through the typed manifest in `src/data/site.ts` and the typed asset map in `src/data/media.ts`. The `MediaFrame` component supplies meaningful alt text, intrinsic dimensions, responsive sizing hints, captions, and credit lines.

| Asset | Role | Route use | Reuse rationale |
| --- | --- | --- | --- |
| `team-table.avif` | Orientation | Home hero | Establishes the human, collaborative starting point |
| `trustora-team.avif` | Observation | Home / about / employee-intelligence article | Shows the company’s operating posture and team context; the article uses it as a people-and-practice visual |
| `workplace-grid.avif` | Context | What-is-EoR explainer, contractor service, article | A collage communicates multiple local working contexts |
| `dubai-skyline.avif` | Place | Services index, EoR service, mobility support | Reused only when geographic market context is the subject |
| `operations-room.avif` | Observation | Payroll service, people operations support, article | Signals the recurring operational layer |
| `people-at-work.avif` | Observation | Services support, contractor support, careers | Signals employee experience and collaboration |
| `remote-work.avif` | Context | Global mobility, payroll support, article | Signals distributed work and cross-border coordination |

No substantial route repeats the same creative image in its hero and supporting media slot. Repeated images across routes are role-based: place, context, observation, or orientation. The repository’s original image library remains available as source material, while the active build consumes the seven selected, pre-optimized editorial assets above.
