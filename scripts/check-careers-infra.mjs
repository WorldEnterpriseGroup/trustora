import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Gate: the Dataverse entity set configured for the careers Function must be
// the one Dataverse derives from the provisioned table. A typo here passes every
// MR check and only surfaces in the default-branch live smoke as
// dataverse_404_0x80060888 (2026-10-14 .. 2026-11-02 outage).
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const table = JSON.parse(read('infra/careers-intake/provision/table-definition.json'));
const expected = `${table.SchemaName.toLowerCase()}s`;

const bicep = /param applicationEntitySet string = '([^']+)'/.exec(read('infra/careers-intake/main.bicep'));
assert.ok(bicep, 'main.bicep must declare applicationEntitySet');
assert.equal(bicep[1], expected, `main.bicep applicationEntitySet must be ${expected}`);

const readme = /TRUSTORA_APPLICATION_ENTITY_SET=(\S+)/.exec(read('infra/careers-intake/README.md'));
assert.ok(readme, 'README must document TRUSTORA_APPLICATION_ENTITY_SET');
assert.equal(readme[1], expected, `README TRUSTORA_APPLICATION_ENTITY_SET must be ${expected}`);
console.log(`Careers infra entity set verified: ${expected}`);

// Gate: the CI deploy adopts the launch-sequence certificate template and never carries a credential
// (WorldEnterpriseGroup/trustora#3). Only the switch AZURE_FUNCTION_DEPLOY_ENABLED and non-secret ids appear.
const ci = read('.gitlab-ci.yml');
const deploy = /^deploy-function:\n((?:[ \t].*\n|\n)+)/m.exec(ci);
assert.ok(deploy, '.gitlab-ci.yml must define deploy-function');
assert.match(deploy[1], /extends: \.deploy:azure-function/, 'deploy-function must extend .deploy:azure-function');
assert.match(ci, /file: \/jobs\/deploy-azure-function\.yml/, 'CI must include the launch-sequence deploy-azure-function template');
for (const forbidden of ['AZURE_CLIENT_SECRET', 'AZURE_PASSWORD', 'AZURE_CLIENT_CERTIFICATE_PASSWORD', 'federated-token', 'id_tokens']) {
  assert.ok(!ci.includes(forbidden), `.gitlab-ci.yml must not mention ${forbidden}: credentials come only from the runner-mounted secret`);
}
assert.match(deploy[1], /\$CI_COMMIT_REF_PROTECTED == "true"/, 'deploy-function must be limited to protected refs');
const app = /AZURE_FUNCTION_APP: (\S+)/.exec(deploy[1]);
assert.ok(app, 'deploy-function must set AZURE_FUNCTION_APP');
assert.ok(read('infra/careers-intake/README.md').includes(app[1]), `README must name the Function App ${app[1]}`);
console.log(`Careers deploy config verified: ${app[1]}`);
