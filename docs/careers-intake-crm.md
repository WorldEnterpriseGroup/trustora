# Trustora careers intake → Dream Dataverse

Status: provisioned 2026-08-12. This document remains the operating contract for the live Trustora careers intake.

## Recommended shape

```text
Astro public or careers form
  → Azure Function HTTP endpoint (managed identity, validation, rate limit)
  → private Blob intake ledger (short retention, optional)
  → Dream Dataverse Lead or custom application row
  → internal alert / triage queue

Trustora endpoint → taodoor Front Door route (WAF + TLS + no-cache)
```

Use an Azure Function as the primary boundary. A Logic App can be added after the Function for notifications or a reviewed workflow, but it should not receive unvalidated public form data or hold Dynamics credentials in the browser. The existing Global Enterprise brief-delivery implementation is the reference pattern for `DefaultAzureCredential`, Key Vault, private Blob storage, origin checks, rate limiting, and Dataverse upsert.

The endpoint should be same-brand and isolated from another company’s workflow, for example `careers-api.trustora.net` or a Trustora-specific `/api/careers-application` route on the shared edge. Do not point the site at the existing Tao Mgt or Global Enterprise function.

## CRM boundary

The live hierarchy is:

1. Child Business Unit `Trustora` under `tli` (`149ad333-9e96-f111-8075-000d3a59e29a`).
2. Trustora owner team (`539bd333-9e96-f111-8075-000d3a59e29a`) owns application rows; the public form never chooses the owner.
3. Custom table `tr_TrustoraCareerApplication`, entity set `tr_trustoracareerapplications`, publisher prefix `tr_`.
4. Alternate key `tr_ApplicationIdKey` on `tr_submissionid`; the Function upserts by this key and never search-then-creates.
5. The Function’s user-assigned managed identity is the non-interactive Dataverse application user and receives the Trustora Careers Intake role.
6. Public contact, briefing, and squeeze submissions create standard Lead rows with a deterministic subject derived from the submission UUID; the Function assigns them to the Trustora owner team and treats replay as an idempotent success.

Do not silently create the Business Unit, team, table, role, app user, or Front Door route. Those are external tenant changes and need a named CRM/platform owner plus an approved migration window.

## Application row

The custom row is an application record, not a sales Lead. Candidate data should not be promoted into a Contact, Account, marketing list, or hiring campaign automatically. Human triage can decide whether a later relationship record is justified.

Recommended fields:

| Contract field | CRM role | Notes |
| --- | --- | --- |
| `application-id` | alternate key / idempotency | Browser-generated UUID is re-used on retry when available; the Function generates one when the no-JavaScript path sends it empty |
| `full-name`, `preferred-name` | candidate identity | Keep within the approved table’s access scope |
| `email` | protected identity / contact route | Normalize and protect; do not log raw value |
| `phone-or-whatsapp` | optional contact route | Do not require a phone number |
| `current-country`, `city-region`, `time-zone` | operating context | Country is not a proxy for eligibility or capability |
| `role-title-or-problem`, `role-interests` | capability routing | Use a controlled choice plus supplied detail |
| `work-authorization`, `work-model`, `availability` | recruiting context | Do not infer immigration eligibility |
| education and compensation fields | candidate-supplied context | Do not treat compensation as a final offer or benchmark |
| links and cover note | evidence | Validate HTTPS URLs; do not fetch links server-side |
| consent + source + received time | provenance | Preserve exact consent scope and timestamp |
| status, owner, review note | CRM-owned triage | Never take these from the browser |

Do not collect passport numbers, national IDs, bank details, health information, passwords, confidential client material, or raw identity documents in this form. A later documentation step must use a separate secure workflow with its own retention and access policy. Resume URLs are accepted as links in v1; a file upload path should not be added until malware scanning, private storage, retention, and access controls are implemented.

## Validation and idempotency

The Function must re-validate the request regardless of browser HTML validation:

- accept JSON or `application/x-www-form-urlencoded` only, with a small bounded body limit;
- reject a non-empty honeypot, unsupported origin, invalid email, unknown choice values, overlong fields, and unknown security fields;
- normalize email only inside the protected integration path and compute an email hash for deduplication diagnostics;
- require exact `business-unit = Trustora` and `schema-version = trustora-careers-v1` but treat them as routing assertions, not authorization;
- set a fresh server `receivedAt` and ignore client-supplied CRM status, owner, BU IDs, or permissions;
- generate a UUID when `application-id` is absent or empty, then upsert by that ID; replaying the same browser-supplied ID must return success without creating a duplicate row;
- never emit the application body into normal logs, error messages, Front Door diagnostics, or Teams messages;
- keep candidate notification separate from internal triage notification and never email a raw application to an unapproved distribution list.

Suggested event envelope:

```json
{
  "schemaVersion": "trustora-careers-v1",
  "eventType": "career.application.received",
  "eventId": "server-generated-event-id",
  "receivedAt": "2026-08-12T15:04:05.000Z",
  "applicationId": "form-uuid",
  "businessUnit": "Trustora",
  "candidate": {
    "name": "supplied name",
    "emailHash": "sha256 of normalized email",
    "country": "Pakistan",
    "timeZone": "UTC+05:00 / Pakistan Standard Time"
  },
  "routing": {
    "roleTitle": "ML evaluation engineer",
    "roleInterests": ["AI / ML engineering and evaluation"],
    "workModel": "Remote-first",
    "availability": "Within 2–4 weeks"
  },
  "source": "trustora.net/careers",
  "consent": {
    "granted": true,
    "scope": "career-application-review",
    "capturedAt": "server-or-form-captured-time"
  }
}
```

The envelope is a projection, not a complete CRM schema. Store the minimum application fields in the approved table and keep free-text access narrow. A future file-upload event should be separate and reference only a private object ID.

## Provisioned infrastructure

- Azure resource group: `rg-trustora-careers` in `eastus`.
- Function: `fn-trustora-careers-sy4lxie35bmuy` on the Flex Consumption plan, Node 24.
- Managed identity: `uai-trustora-careers-sy4lxie35bmuy`; Dataverse app user is assigned only to the Trustora boundary.
- Function endpoint: `https://careers-api.trustora.net/api/careers-application` through the Terraform-owned shared `taodoor-standard` Front Door profile.
- Front Door route: `trustora-careers-route`, limited to `/api/careers-application` and `/api/careers-health`, with WAF rate limiting and no-cache Function responses.
- `PUBLIC_CAREERS_API_URL` and `PUBLIC_TRUSTORA_INTAKE_API_URL` are protected in the Trustora GitLab project and are consumed at the next static-site build.
- The Trustora Careers Intake role carries Local-depth Lead Create/Read/Write/Append/Append To/Assign plus Local-depth `prvReadAsyncOperation` (System Job), which Dataverse checks during owner validation.
- Synthetic submission/replay passed twice with one CRM row; the controlled test row was deleted after verification.
- The careers form does not accept document uploads. Resume/CV fields remain HTTPS links until malware scanning, private storage, retention, and access controls are separately approved.

## Cost-conscious recommendation

For the current small team, use one Trustora Function app and one private storage account in one resource group, with a single endpoint and a single custom table. Keep Front Door as the shared edge. Add a Logic App only for a genuinely needed notification or approval workflow. This avoids an unnecessary foreign subsidiary, duplicate CRM records, or a second automation surface while preserving a clean path to a larger Trustora US operating model later.
