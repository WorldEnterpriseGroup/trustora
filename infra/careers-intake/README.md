# Trustora careers intake

This folder contains the deployable Azure Function boundary for Trustora’s D365-only public intake. It is intentionally separate from the static Astro site and contains no Dataverse credentials. It targets the newest Azure Functions-supported GA Node.js runtime (Node 24); Node 26 is not currently in the Azure Functions support matrix.

## Local function

```bash
cd infra/careers-intake/function
npm install
npm test
func start
```

Required production settings (the live deployment uses these values):

```text
DATAVERSE_URL=https://dream.crm.dynamics.com
TRUSTORA_APPLICATION_ENTITY_SET=tr_trustoracareerapplications
TRUSTORA_APPLICATION_FIELD_PREFIX=tr_
TRUSTORA_TEAM_ID=539bd333-9e96-f111-8075-000d3a59e29a
TRUSTORA_LEAD_ENTITY_SET=leads
ALLOWED_ORIGINS=https://trustora.net,https://www.trustora.net
RATE_LIMIT_PER_HOUR=5
D365_SMOKE_TOKEN=<secure random token shared only with the Function and CI secret stores>
```

Career submissions write to `tr_TrustoraCareerApplication` in the Trustora Business Unit. Contact, briefing, and squeeze submissions write to the standard D365 `Lead` table, owned by the Trustora team. The Function fails closed with `503 ..._not_configured` when the relevant Dataverse boundary is not ready.

## Production sequence

1. Keep the Trustora Business Unit, owner team, table, key, and role changes under the CRM migration record.
2. Keep the Function managed identity and Dataverse app user non-interactive; do not add a client secret.
3. Deploy the Function and test `GET /api/careers-health`; the response must report both career and public intake configuration. The Bicep deployment requires `d365SmokeToken` as a secure parameter and writes it only to the Function app setting; do not place it in a checked-in parameter file.
4. Keep the `careers-api.trustora.net` route in the Terraform-owned `taodoor` Front Door profile with WAF, TLS, no-cache, and request-rate controls.
5. The protected smoke is `POST /api/careers-health?smoke=d365` with `X-Trustora-Smoke-Token`. It creates contact, briefing, squeeze, and career fixtures, verifies D365 ownership, fields, and replay behavior, and deletes its UUID-scoped records in a `finally` cleanup. Invalid or missing tokens return `404`.
6. Build the Astro site with `PUBLIC_CAREERS_API_URL=https://careers-api.trustora.net/api/careers-application` and `PUBLIC_TRUSTORA_INTAKE_API_URL=https://careers-api.trustora.net/api/careers-application`; GitLab and GitHub Pages run the browser matrix and protected smoke before deployment.

## Public intake contract

The same Front Door-approved route accepts `schema-version=trustora-public-intake-v1` and `intake-type=contact|briefing|squeeze`. The Function re-validates the source, corporate email, consent, honeypot, and submission UUID, then creates a Lead with the supplied context in `description`. The browser never supplies the owner or D365 status. Replays with the same submission UUID resolve the existing Lead by its deterministic subject instead of creating another row.

The managed identity’s `Trustora Careers Intake` role must carry Local-depth `Create`, `Read`, `Write`, `Append`, `Append To`, `Assign`, and `Delete` privileges for the standard Lead table and the Trustora career-application table, plus Local-depth `Read` for `prvReadAsyncOperation` (System Job). Delete is limited to the managed identity’s Trustora Business Unit and is required only so the token-protected CI smoke can remove its UUID-scoped fixtures. Dataverse performs an owner-read check during Lead creation. This keeps the existing careers role and Trustora team as the integration boundary without granting the Function a client secret or System Administrator access.

Do not share the public Function URL in the website until Front Door and the CRM authorization are working. Do not add resume uploads to this Function without private Blob storage, malware scanning, retention, and access controls.
