import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeInput, normalizePublicIntake, publicLeadFields, publicLeadSubject, smokeAuthorized } from '../src/index.js';

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

const basePublicIntake = {
  'application-id': '8f7e6d5c-4b3a-4910-8f7e-6d5c4b3a2910',
  'intake-type': 'contact',
  name: 'Example Contact',
  email: 'contact@example.com',
  company: 'Example Company',
  title: 'People lead',
  source: 'trustora.net/contact/',
  'business-unit': 'Trustora',
  'schema-version': 'trustora-public-intake-v1',
  'safe-to-contact': 'yes',
  website: '',
  decision: 'Plan the next specialist hire',
  roles: ['AI / ML specialists', 'People / operations'],
};

test('normalizes public contact intake for a D365 Lead', () => {
  const intake = normalizePublicIntake(basePublicIntake);

  assert.equal(intake.error, undefined);
  assert.equal(intake.intakeType, 'contact');
  assert.equal(intake.firstName, 'Example');
  assert.equal(intake.lastName, 'Contact');
  assert.match(intake.description, /Decision being made: Plan the next specialist hire/);
  assert.match(intake.description, /Roles needed: AI \/ ML specialists, People \/ operations/);

  const fields = publicLeadFields(intake);
  assert.equal(fields.emailaddress1, 'contact@example.com');
  assert.equal(fields.companyname, 'Example Company');
  assert.equal(fields.lastname, 'Contact');
  assert.match(fields['ownerid@odata.bind'], /^\/teams\([0-9a-f-]*\)$/);
  assert.equal(fields.subject, publicLeadSubject(intake));
});

test('generates a UUID for public intake without a browser idempotency key', () => {
  const intake = normalizePublicIntake({ ...basePublicIntake, 'application-id': '' });

  assert.equal(intake.error, undefined);
  assert.match(intake.submissionId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

test('rejects public intake without explicit consent or with a foreign source', () => {
  assert.equal(normalizePublicIntake({ ...basePublicIntake, 'safe-to-contact': 'no' }).error, 'invalid_public_intake');
  assert.equal(normalizePublicIntake({ ...basePublicIntake, source: 'example.org/contact/' }).error, 'invalid_public_intake');
});

test('fails closed when the protected smoke header is missing', () => {
  assert.equal(smokeAuthorized({ headers: new Headers() }), false);
});
