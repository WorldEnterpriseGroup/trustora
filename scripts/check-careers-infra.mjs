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
