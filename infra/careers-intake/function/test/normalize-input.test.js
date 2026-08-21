import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeInput } from '../src/index.js';

const baseApplication = {
  'full-name': 'Example Applicant',
  email: 'applicant@example.com',
  'current-country': 'Pakistan',
  'time-zone': 'Asia/Karachi',
  'role-title-or-problem': 'Strategic initiatives',
  'work-authorization': 'I will need guidance',
  'work-model': 'Remote',
  availability: 'Within one month',
  'applicant-consent': 'yes',
  'business-unit': 'Trustora',
  'schema-version': 'trustora-careers-v1',
  website: '',
};

test('generates a UUID for the no-JavaScript form submission path', () => {
  const application = normalizeInput({ ...baseApplication, 'application-id': '' });

  assert.equal(application.error, undefined);
  assert.match(application.applicationId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

test('preserves a valid browser idempotency key', () => {
  const applicationId = '8f7e6d5c-4b3a-4910-8f7e-6d5c4b3a2910';
  const application = normalizeInput({ ...baseApplication, 'application-id': applicationId });

  assert.equal(application.error, undefined);
  assert.equal(application.applicationId, applicationId);
});

test('rejects a malformed supplied idempotency key', () => {
  const application = normalizeInput({ ...baseApplication, 'application-id': 'not-a-uuid' });

  assert.equal(application.error, 'invalid_application');
});
