# Trustora careers intake

This folder contains the deployable Azure Function boundary for the Trustora careers form. It is intentionally separate from the static Astro site and contains no Dataverse credentials. It targets the newest Azure Functions-supported GA Node.js runtime (Node 24); Node 26 is not currently in the Azure Functions support matrix.

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
ALLOWED_ORIGINS=https://trustora.net,https://www.trustora.net
RATE_LIMIT_PER_HOUR=5
```

The live table is `tr_TrustoraCareerApplication` in the Trustora Business Unit. The Function fails closed with `503 intake_not_configured` when the Dataverse boundary is not ready.

## Production sequence

1. Keep the Trustora Business Unit, owner team, table, key, and role changes under the CRM migration record.
2. Keep the Function managed identity and Dataverse app user non-interactive; do not add a client secret.
3. Deploy the Function and test `GET /api/careers-health`.
4. Keep the `careers-api.trustora.net` route in the Terraform-owned `taodoor` Front Door profile with WAF, TLS, no-cache, and request-rate controls.
5. Build the Astro site with `PUBLIC_CAREERS_API_URL=https://careers-api.trustora.net/api/careers-application` and repeat the synthetic replay test after infrastructure changes.

Do not share the public Function URL in the website until Front Door and the CRM authorization are working. Do not add resume uploads to this Function without private Blob storage, malware scanning, retention, and access controls.
