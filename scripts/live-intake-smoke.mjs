import assert from 'node:assert/strict';

const smokeUrl = process.env.LIVE_INTAKE_SMOKE_URL?.trim()
  || 'https://careers-api.trustora.net/api/careers-health?smoke=d365';
const smokeToken = process.env.D365_SMOKE_TOKEN?.trim();
if (!smokeToken) throw new Error('D365_SMOKE_TOKEN is required for the protected live smoke');

const response = await fetch(smokeUrl, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'X-Trustora-Smoke-Token': smokeToken,
  },
  signal: AbortSignal.timeout(90_000),
});
const body = await response.json().catch(() => ({}));
const diagnostics = [body.stage, ...(Array.isArray(body.cleanup) ? body.cleanup : [])].filter(Boolean).join(':');
assert.equal(response.status, 200, `live D365 smoke returned HTTP ${response.status}${diagnostics ? ` at ${diagnostics}` : ''}`);
assert.equal(body.ok, true, 'live D365 smoke did not report ok=true');
assert.equal(body.smoke, true, 'live D365 smoke did not report smoke=true');
assert.equal(body.cleaned, true, 'live D365 smoke did not confirm cleanup');
assert.deepEqual(body.checked, ['contact', 'briefing', 'squeeze', 'career'], 'live D365 smoke did not check every intake path');
assert.equal(Object.hasOwn(body, 'leadIds'), false, 'live D365 smoke exposed record identifiers');
assert.equal(Object.hasOwn(body, 'applicationIds'), false, 'live D365 smoke exposed record identifiers');
console.log('Live D365 intake smoke passed: contact, briefing, squeeze, and career create/replay/read/cleanup verified.');
