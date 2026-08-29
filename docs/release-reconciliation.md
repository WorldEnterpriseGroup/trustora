# Trustora release reconciliation

GitLab’s protected default branch is the release source of truth. GitLab Pages remains the canonical CI artifact publication; GitHub `gh-pages` is synchronized only after the Pages job and the protected live D365 smoke have passed.

## Browser release gate

`pnpm run qa:browser` runs from the built `dist/` output. It keeps full success-path coverage for every rendered D365 form and squeeze fallback, and adds an explicit representative route matrix:

| Route family | Representative route | Desktop | Mobile |
| --- | --- | --- | --- |
| Public landing | `/` | 1440×900 | 390×844 |
| Contact intake | `/contact/` | 1440×900 | 390×844 |
| Squeeze intake | `/eor-for-ai-ml-teams/` | 1440×900 | 390×844 |
| Briefing intake | `/briefings/employer-of-record-operating-brief/` | 1440×900 | 390×844 |
| Career intake | `/careers/contract-strategic-initiatives-manager/` | 1440×900 | 390×844 |

Each matrix cell checks that the primary CTA is visible, the document has no horizontal overflow, and any representative form action is HTTPS. Mocked endpoint responses also verify visible success and error status feedback without sending a real submission. See `scripts/form-browser-qa.mjs` for the executable contract.

## GitLab-to-GitHub synchronization

The `sync-github` job is intentionally protected:

- it runs only when `CI_COMMIT_BRANCH == CI_DEFAULT_BRANCH` and `CI_COMMIT_REF_PROTECTED == "true"`;
- it requires the protected `GITHUB_SYNC_KEY_B64` variable and pins GitHub’s SSH host keys;
- it uses `git push --no-force` with `HEAD:refs/heads/gh-pages`, so a non-fast-forward remote cannot be overwritten;
- after the push, `git ls-remote --exit-code` must return a `gh-pages` SHA matching both the checked-out `HEAD` and `CI_COMMIT_SHA`.

Any failed comparison stops the release. Do not make GitHub the source of truth, add a force-push fallback, or weaken the site CSP to accommodate this synchronization path.
