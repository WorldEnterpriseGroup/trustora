import crypto from 'node:crypto';
import { app } from '@azure/functions';
import { DefaultAzureCredential } from '@azure/identity';

const MAX_BODY_BYTES = boundedInteger(process.env.MAX_BODY_BYTES, 1_024, 32 * 1_024, 16 * 1_024);
const RATE_LIMIT_PER_HOUR = boundedInteger(process.env.RATE_LIMIT_PER_HOUR, 1, 100, 5);
const DATAVERSE_URL = normalizeDataverseUrl(process.env.DATAVERSE_URL);
const ENTITY_SET = clean(process.env.TRUSTORA_APPLICATION_ENTITY_SET, 80).replace(/[^a-zA-Z0-9_]/g, '');
const LEAD_ENTITY_SET = clean(process.env.TRUSTORA_LEAD_ENTITY_SET || 'leads', 80).replace(/[^a-zA-Z0-9_]/g, '');
const FIELD_PREFIX = clean(process.env.TRUSTORA_APPLICATION_FIELD_PREFIX, 20).replace(/[^a-zA-Z0-9_]/g, '');
const TRUSTORA_TEAM_ID = guid(process.env.TRUSTORA_TEAM_ID);
const D365_SMOKE_TOKEN = clean(process.env.D365_SMOKE_TOKEN, 256);
const PUBLIC_SCHEMA_VERSION = 'trustora-public-intake-v1';
const PUBLIC_INTAKE_TYPES = new Set(['contact', 'briefing', 'squeeze']);
const ALLOWED_ORIGINS = new Set((process.env.ALLOWED_ORIGINS || 'https://trustora.net,https://www.trustora.net')
  .split(',').map((value) => normalizeOrigin(value)).filter(Boolean));
const credential = new DefaultAzureCredential();
const requestCounts = new Map();
let smokeInProgress = false;

function clean(value, max = 500) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
}

function multiline(value, max = 4000) {
  return String(value ?? '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, max);
}

function boundedInteger(value, minimum, maximum, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : fallback;
}

function guid(value) {
  const normalized = clean(value, 64).toLowerCase();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(normalized) ? normalized : '';
}

function normalizeOrigin(value) {
  try {
    const url = new URL(String(value).trim());
    if (!/^https?:$/.test(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) return '';
    return url.origin;
  } catch {
    return '';
  }
}

function normalizeDataverseUrl(value) {
  try {
    const url = new URL(String(value || ''));
    if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) return '';
    return url.origin;
  } catch {
    return '';
  }
}

function response(status, body, headers = {}) {
  return {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'none'",
      'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'content-type': 'application/json; charset=utf-8',
      ...headers,
    },
    body: status === 204 ? undefined : JSON.stringify(body),
  };
}

function cors(request) {
  const origin = request.headers.get('origin');
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return {};
  return { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'content-type', Vary: 'Origin' };
}

function clientKey(request) {
  const forwarded = request.headers.get('x-forwarded-for') || request.headers.get('x-azure-clientip') || 'unknown';
  return clean(forwarded.split(',')[0], 80);
}

function rateLimited(request) {
  const now = Date.now();
  const key = clientKey(request);
  const current = requestCounts.get(key) || { count: 0, expiresAt: now + 60 * 60 * 1000 };
  if (current.expiresAt <= now) {
    current.count = 0;
    current.expiresAt = now + 60 * 60 * 1000;
  }
  current.count += 1;
  requestCounts.set(key, current);
  if (requestCounts.size > 5000) {
    for (const [entryKey, entry] of requestCounts) if (entry.expiresAt <= now) requestCounts.delete(entryKey);
  }
  return current.count > RATE_LIMIT_PER_HOUR;
}

async function parseBody(request) {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return { error: 'body_too_large' };
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json') && !contentType.includes('application/x-www-form-urlencoded')) return { error: 'unsupported_content_type' };
  const raw = await request.text();
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) return { error: 'body_too_large' };
  if (contentType.includes('application/json')) {
    try {
      const value = JSON.parse(raw || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? { data: value } : { error: 'invalid_body' };
    } catch {
      return { error: 'invalid_body' };
    }
  }
  const params = new URLSearchParams(raw);
  const data = Object.fromEntries(params.entries());
  for (const key of ['role-interests', 'professional-languages', 'roles', 'capabilities']) data[key] = params.getAll(key);
  return { data };
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function validHttpsUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !url.hash;
  } catch {
    return false;
  }
}

function validPublicSource(value) {
  const source = clean(value, 300);
  return /^trustora\.net\/[a-z0-9][a-z0-9/_-]*\/?$/i.test(source);
}

function normalizeInput(input) {
  const value = input || {};
  const suppliedApplicationId = clean(value['application-id'], 64);
  const applicationId = suppliedApplicationId ? guid(suppliedApplicationId) : crypto.randomUUID();
  const email = clean(value.email, 254).toLowerCase();
  const roleInterests = Array.isArray(value['role-interests']) ? value['role-interests'].map((item) => clean(item, 160)).filter(Boolean).slice(0, 12) : clean(value['role-interests'], 160) ? [clean(value['role-interests'], 160)] : [];
  const professionalLanguages = Array.isArray(value['professional-languages']) ? value['professional-languages'].map((item) => clean(item, 80)).filter(Boolean).slice(0, 16) : clean(value['professional-languages'], 80) ? [clean(value['professional-languages'], 80)] : [];
  const links = [value['resume-link'], value.linkedin, value.github, value['portfolio-or-publications']].map((item) => clean(item, 500));
  const required = [applicationId, clean(value['full-name'], 160), email, clean(value['current-country'], 80), clean(value['time-zone'], 120), clean(value['role-title-or-problem'], 180), clean(value['work-authorization'], 160), clean(value['work-model'], 80), clean(value.availability, 100)];
  if (required.some((item) => !item) || (suppliedApplicationId && !applicationId) || !validEmail(email) || links.some((item) => !validHttpsUrl(item)) || value['applicant-consent'] !== 'yes' || clean(value.website, 20)) return { error: 'invalid_application' };
  if (value['business-unit'] !== 'Trustora' || value['schema-version'] !== 'trustora-careers-v1') return { error: 'invalid_schema' };
  return {
    applicationId,
    name: clean(value['full-name'], 160),
    preferredName: clean(value['preferred-name'], 80),
    email,
    phone: clean(value['phone-or-whatsapp'], 80),
    country: clean(value['current-country'], 80),
    cityRegion: clean(value['city-region'], 120),
    regionalContext: clean(value['regional-context'], 120),
    timeZone: clean(value['time-zone'], 120),
    roleTitle: clean(value['role-title-or-problem'], 180),
    roleInterests,
    professionalLanguages,
    workEvidence: multiline(value['work-evidence'], 5000),
    workAuthorization: clean(value['work-authorization'], 160),
    workModel: clean(value['work-model'], 80),
    availability: clean(value.availability, 100),
    travel: clean(value['travel-or-relocation'], 120),
    authorizationNotes: multiline(value['authorization-notes'], 2000),
    educationLevel: clean(value['education-level'], 120),
    educationField: clean(value['education-field'], 160),
    compensationCurrency: clean(value['compensation-currency'], 60),
    compensationExpectation: clean(value['compensation-expectation'], 120),
    resumeLink: clean(value['resume-link'], 500),
    linkedin: clean(value.linkedin, 500),
    github: clean(value.github, 500),
    portfolio: clean(value['portfolio-or-publications'], 500),
    coverNote: multiline(value['cover-note'], 6000),
    source: clean(value.source, 300),
    receivedAt: new Date().toISOString(),
  };
}

function odataString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function field(name) {
  return `${FIELD_PREFIX}${name}`;
}

function dataverseReady() {
  return Boolean(DATAVERSE_URL && ENTITY_SET && FIELD_PREFIX && TRUSTORA_TEAM_ID);
}

function publicIntakeReady() {
  return Boolean(DATAVERSE_URL && LEAD_ENTITY_SET && TRUSTORA_TEAM_ID);
}

async function dataverseRequest(path, options = {}) {
  if (!DATAVERSE_URL) throw new Error('dataverse_not_configured');
  const token = await credential.getToken(`${DATAVERSE_URL}/.default`);
  if (!token?.token) throw new Error('dataverse_token_unavailable');
  const result = await fetch(`${DATAVERSE_URL}/api/data/v9.2/${path}`, {
    ...options,
    headers: { accept: 'application/json', 'content-type': 'application/json', Authorization: `Bearer ${token.token}`, ...(options.headers || {}) },
    signal: AbortSignal.timeout(10_000),
  });
  if (!result.ok) {
    const details = await result.json().catch(() => null);
    const code = clean(details?.error?.code, 80).replace(/[^a-zA-Z0-9._-]/g, '_');
    throw new Error(`dataverse_${result.status}${code ? `_${code}` : ''}`);
  }
  return result;
}

function applicationFields(application) {
  return {
    [field('name')]: application.name,
    [field('submissionid')]: application.applicationId,
    [field('fullname')]: application.name,
    [field('preferredname')]: application.preferredName || null,
    [field('email')]: application.email,
    [field('phoneorwhatsapp')]: application.phone || null,
    [field('country')]: application.country,
    [field('cityregion')]: application.cityRegion || null,
    [field('regionalcontext')]: application.regionalContext || null,
    [field('timezone')]: application.timeZone,
    [field('roletitle')]: application.roleTitle,
    [field('roleinterests')]: application.roleInterests.join('; '),
    [field('professionallanguages')]: application.professionalLanguages.join('; '),
    [field('workevidence')]: application.workEvidence || null,
    [field('workauthorization')]: application.workAuthorization,
    [field('workmodel')]: application.workModel,
    [field('availability')]: application.availability,
    [field('travel')]: application.travel || null,
    [field('authorizationnotes')]: application.authorizationNotes || null,
    [field('educationlevel')]: application.educationLevel || null,
    [field('educationfield')]: application.educationField || null,
    [field('compensationcurrency')]: application.compensationCurrency || null,
    [field('compensationexpectation')]: application.compensationExpectation || null,
    [field('resumelink')]: application.resumeLink || null,
    [field('linkedin')]: application.linkedin || null,
    [field('github')]: application.github || null,
    [field('portfolio')]: application.portfolio || null,
    [field('covernote')]: application.coverNote || null,
    [field('source')]: application.source || 'trustora.net/careers',
    [field('consent')]: true,
    [field('consentscope')]: 'career-application-review',
    [field('consentcapturedat')]: application.receivedAt,
    [field('receivedat')]: application.receivedAt,
    [field('status')]: 'New',
    'ownerid@odata.bind': `/teams(${TRUSTORA_TEAM_ID})`,
  };
}

async function upsertApplication(application) {
  const key = `${field('submissionid')}=${odataString(application.applicationId)}`;
  const result = await dataverseRequest(`${ENTITY_SET}(${key})`, {
    method: 'PATCH',
    body: JSON.stringify(applicationFields(application)),
  });
  return result.headers.get('odata-entityid') || null;
}

function splitName(value) {
  const parts = clean(value, 160).split(/\s+/).filter(Boolean);
  const lastName = parts.pop() || 'Trustora inquiry';
  return { firstName: parts.join(' '), lastName };
}

function publicDetails(value) {
  const fields = [
    ['title', 'Role or title'],
    ['primary-region', 'Primary employment region'],
    ['countries', 'Countries where staff will work'],
    ['work-timezone', 'Primary work time zone'],
    ['collaboration-window', 'Collaboration window'],
    ['staff-count', 'Staff needed'],
    ['team-stage', 'Team stage'],
    ['roles', 'Roles needed'],
    ['saas-team', 'SaaS team scope'],
    ['budget', 'Indicative budget'],
    ['budget-basis', 'Budget basis'],
    ['timeline', 'Timeline'],
    ['target-date', 'Target start or decision date'],
    ['employment-model', 'Employment model'],
    ['entity-status', 'Local entity status'],
    ['workplace-model', 'Workplace model'],
    ['employee-support', 'Employee support priorities'],
    ['capabilities', 'Additional capabilities'],
    ['briefing-slug', 'Briefing'],
    ['squeeze-key', 'Squeeze page'],
    ['region', 'Brief region'],
    ['context', 'Decision context'],
    ['decision', 'Decision being made'],
    ['constraints', 'Known constraints or risks'],
    ['questions', 'Questions for Trustora'],
  ];
  const lines = [];
  for (const [key, label] of fields) {
    const raw = Array.isArray(value[key]) ? value[key].join(', ') : value[key];
    const normalized = multiline(raw, 2000);
    if (normalized) lines.push(`${label}: ${normalized}`);
  }
  return lines.join('\n');
}

function normalizePublicIntake(input) {
  const value = input || {};
  const suppliedSubmissionId = clean(value['application-id'] || value['submission-id'], 64);
  const submissionId = suppliedSubmissionId ? guid(suppliedSubmissionId) : crypto.randomUUID();
  const intakeType = clean(value['intake-type'], 32).toLowerCase();
  const name = clean(value.name || value['full-name'], 160);
  const email = clean(value.email, 254).toLowerCase();
  const source = clean(value.source, 300);
  const company = clean(value.company, 200);
  const title = clean(value.title, 180);
  const required = [submissionId, intakeType, name, email, source];
  if (
    required.some((item) => !item)
    || (suppliedSubmissionId && !submissionId)
    || !PUBLIC_INTAKE_TYPES.has(intakeType)
    || !validEmail(email)
    || !validPublicSource(source)
    || value['safe-to-contact'] !== 'yes'
    || clean(value.website, 20)
  ) return { error: 'invalid_public_intake' };
  if (value['business-unit'] !== 'Trustora' || value['schema-version'] !== PUBLIC_SCHEMA_VERSION) return { error: 'invalid_schema' };

  const { firstName, lastName } = splitName(name);
  const receivedAt = new Date().toISOString();
  const description = [
    `Submission ID: ${submissionId}`,
    `Intake type: ${intakeType}`,
    `Source: ${source}`,
    `Consent: safe-to-contact=yes`,
    `Received at: ${receivedAt}`,
    publicDetails(value),
  ].filter(Boolean).join('\n');

  return {
    submissionId,
    intakeType,
    name,
    firstName,
    lastName,
    email,
    company,
    title,
    source,
    description: multiline(description, 12_000),
    receivedAt,
  };
}

function publicLeadSubject(intake) {
  return `Trustora ${intake.intakeType} intake — ${intake.submissionId}`;
}

function publicLeadFields(intake) {
  return {
    subject: publicLeadSubject(intake),
    firstname: intake.firstName || null,
    lastname: intake.lastName,
    emailaddress1: intake.email,
    companyname: intake.company || null,
    jobtitle: intake.title || null,
    description: intake.description,
    'ownerid@odata.bind': `/teams(${TRUSTORA_TEAM_ID})`,
  };
}

async function findPublicIntake(intake) {
  const subject = encodeURIComponent(odataString(publicLeadSubject(intake)));
  const query = `${LEAD_ENTITY_SET}?$select=leadid&$filter=subject%20eq%20${subject}&$top=1`;
  const result = await dataverseRequest(query, { method: 'GET' });
  const body = await result.json();
  return body?.value?.[0]?.leadid || null;
}

async function createPublicIntake(intake) {
  const existing = await findPublicIntake(intake);
  if (existing) return { leadId: existing, created: false };
  const result = await dataverseRequest(LEAD_ENTITY_SET, {
    method: 'POST',
    body: JSON.stringify(publicLeadFields(intake)),
  });
  return { leadId: result.headers.get('odata-entityid') || null, created: true };
}

function isPublicIntake(data) {
  return data?.['schema-version'] === PUBLIC_SCHEMA_VERSION || Boolean(data?.['intake-type']);
}

async function publicLeadHealth() {
  if (!publicIntakeReady()) return { ok: false, error: 'not_configured' };
  try {
    await dataverseRequest(`${LEAD_ENTITY_SET}?$select=leadid&$top=1`, { method: 'GET' });
    return { ok: true };
  } catch (error) {
    const code = clean(error?.message, 80);
    return { ok: false, error: code.startsWith('dataverse_') ? code : 'unavailable' };
  }
}

function smokeAuthorized(request) {
  if (!D365_SMOKE_TOKEN) return false;
  const supplied = request.headers.get('x-trustora-smoke-token') || '';
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(D365_SMOKE_TOKEN);
  return suppliedBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(suppliedBuffer, expectedBuffer);
}

function smokeCheck(condition) {
  if (!condition) throw new Error('d365_smoke_assertion_failed');
}

async function eventually(label, read, timeout = 15_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeout) {
    try {
      const value = await read();
      if (value) return value;
    } catch {
      // Dataverse can briefly lag after a write; retry until the bounded deadline.
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`d365_smoke_timeout_${label}`);
}

async function eventuallyGone(label, read, timeout = 15_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeout) {
    try {
      if (await read()) return true;
    } catch {
      // Dataverse can briefly lag while a delete is committed; retry until the bounded deadline.
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`d365_smoke_timeout_${label}`);
}

async function careerApplicationRows(application) {
  const filter = `${field('submissionid')} eq ${odataString(application.applicationId)}`;
  const result = await dataverseRequest(`${ENTITY_SET}?$filter=${encodeURIComponent(filter)}&$top=5`, { method: 'GET' });
  return (await result.json())?.value || [];
}

function careerApplicationId(row) {
  const expectedKey = `${ENTITY_SET.replace(/s$/, '')}id`;
  const expectedValue = guid(row?.[expectedKey]);
  if (expectedValue) return expectedValue;
  for (const [key, value] of Object.entries(row || {})) {
    if (key.toLowerCase() === field('submissionid').toLowerCase() || key.toLowerCase().endsWith('_value')) continue;
    const candidate = guid(value);
    if (candidate && key.toLowerCase().endsWith('id')) return candidate;
  }
  return '';
}

function publicSmokeInput(intakeType, route, marker) {
  const applicationId = crypto.randomUUID();
  const input = {
    'application-id': applicationId,
    'intake-type': intakeType,
    name: 'Trustora CI Smoke',
    email: `trustora-ci-smoke+${applicationId}@trustora.net`,
    company: 'Trustora CI Smoke',
    title: 'D365 release smoke',
    source: `trustora.net${route}`,
    'business-unit': 'Trustora',
    'schema-version': PUBLIC_SCHEMA_VERSION,
    'safe-to-contact': 'yes',
    website: '',
    context: marker,
  };
  if (intakeType === 'briefing') input['briefing-slug'] = route.split('/').filter(Boolean).at(-1);
  if (intakeType === 'squeeze') input['squeeze-key'] = route.split('/').filter(Boolean).at(-1);
  return input;
}

function careerSmokeInput(marker) {
  const applicationId = crypto.randomUUID();
  return {
    'application-id': applicationId,
    'full-name': 'Trustora CI Smoke',
    email: `trustora-career-smoke+${applicationId}@trustora.net`,
    'current-country': 'United States',
    'time-zone': 'America/New_York',
    'role-title-or-problem': 'D365 release smoke',
    'work-authorization': 'I will need guidance',
    'work-model': 'Remote',
    availability: 'Within one month',
    'work-evidence': marker,
    'applicant-consent': 'yes',
    'business-unit': 'Trustora',
    'schema-version': 'trustora-careers-v1',
    website: '',
    source: 'trustora.net/careers',
  };
}

async function verifyPublicSmoke(intake) {
  const created = await createPublicIntake(intake);
  smokeCheck(created.created === true);
  const leadId = await eventually('public_create', () => findPublicIntake(intake));
  const result = await dataverseRequest(`${LEAD_ENTITY_SET}(${leadId})?$select=leadid,subject,emailaddress1,companyname,jobtitle,description,_ownerid_value`, { method: 'GET' });
  const row = await result.json();
  smokeCheck(guid(row.leadid) === leadId.toLowerCase());
  smokeCheck(row.subject === publicLeadSubject(intake));
  smokeCheck(row.emailaddress1 === intake.email);
  smokeCheck(row.companyname === intake.company);
  smokeCheck(row.jobtitle === intake.title);
  smokeCheck(row._ownerid_value?.toLowerCase() === TRUSTORA_TEAM_ID);
  smokeCheck(row.description?.includes(`Submission ID: ${intake.submissionId}`));
  smokeCheck(row.description?.includes(`Source: ${intake.source}`));
  smokeCheck(row.description?.includes('Consent: safe-to-contact=yes'));
  const replay = await createPublicIntake(intake);
  smokeCheck(replay.created === false);
  smokeCheck((await findPublicIntake(intake))?.toLowerCase() === leadId.toLowerCase());
  return leadId;
}

async function verifyCareerSmoke(application) {
  await upsertApplication(application);
  const firstRows = await eventually('career_create', async () => {
    const rows = await careerApplicationRows(application);
    return rows.length === 1 ? rows : null;
  });
  const firstId = careerApplicationId(firstRows[0]);
  smokeCheck(Boolean(firstId));
  const firstRow = firstRows[0];
  smokeCheck(firstRow[field('submissionid')] === application.applicationId);
  smokeCheck(firstRow[field('name')] === application.name);
  smokeCheck(firstRow[field('email')] === application.email);
  smokeCheck(firstRow[field('source')] === application.source);
  smokeCheck(firstRow[field('consent')] === true);
  smokeCheck(firstRow[field('consentscope')] === 'career-application-review');
  smokeCheck(firstRow[field('status')] === 'New');
  smokeCheck(firstRow._ownerid_value?.toLowerCase() === TRUSTORA_TEAM_ID);
  await upsertApplication(application);
  const replayRows = await eventually('career_replay', async () => {
    const rows = await careerApplicationRows(application);
    return rows.length === 1 ? rows : null;
  });
  smokeCheck(careerApplicationId(replayRows[0]) === firstId);
  return firstId;
}

async function runD365Smoke() {
  if (!publicIntakeReady() || !dataverseReady()) throw new Error('d365_smoke_not_configured');
  const marker = `Trustora D365 CI smoke ${crypto.randomUUID()}`;
  const publicInputs = [
    publicSmokeInput('contact', '/contact/', marker),
    publicSmokeInput('briefing', '/briefings/employer-of-record-operating-brief/', marker),
    publicSmokeInput('squeeze', '/specialist-hiring-intake/', marker),
  ].map(normalizePublicIntake);
  const careerInput = normalizeInput(careerSmokeInput(marker));
  publicInputs.forEach((input) => smokeCheck(!input.error));
  smokeCheck(!careerInput.error);

  const leadIds = [];
  let stage = 'setup';
  try {
    for (const intake of publicInputs) {
      stage = `public_${intake.intakeType}`;
      leadIds.push(await verifyPublicSmoke(intake));
    }
    stage = 'career';
    await verifyCareerSmoke(careerInput);
    return { ok: true, service: 'trustora-careers-intake', smoke: true, checked: ['contact', 'briefing', 'squeeze', 'career'], cleaned: true };
  } catch (error) {
    error.smokeStage = stage;
    throw error;
  } finally {
    const cleanupErrors = [];
    for (const intake of publicInputs) {
      try {
        const leadId = await findPublicIntake(intake);
        if (leadId) await dataverseRequest(`${LEAD_ENTITY_SET}(${leadId})`, { method: 'DELETE' });
      } catch {
        cleanupErrors.push('public_delete');
      }
    }
    if (!careerInput.error) {
      try {
        const rows = await careerApplicationRows(careerInput);
        for (const row of rows) {
          const applicationId = careerApplicationId(row);
          if (!applicationId) cleanupErrors.push('career_id');
          else await dataverseRequest(`${ENTITY_SET}(${applicationId})`, { method: 'DELETE' });
        }
      } catch {
        cleanupErrors.push('career_delete');
      }
    }
    for (const intake of publicInputs) {
      try {
        await eventuallyGone('public_cleanup_verify', async () => (await findPublicIntake(intake)) === null);
      } catch {
        cleanupErrors.push('public_verify');
      }
    }
    if (!careerInput.error) {
      try {
        await eventuallyGone('career_cleanup_verify', async () => (await careerApplicationRows(careerInput)).length === 0);
      } catch {
        cleanupErrors.push('career_verify');
      }
    }
    if (cleanupErrors.length) {
      const error = new Error('d365_smoke_cleanup_failed');
      error.smokeStage = 'cleanup';
      error.smokeCleanup = [...new Set(cleanupErrors)];
      throw error;
    }
  }
}

app.http('careerApplication', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'careers-application',
  handler: async (request) => {
    const headers = cors(request);
    if (request.method === 'OPTIONS') return response(204, {}, headers);
    if (request.headers.get('origin') && !ALLOWED_ORIGINS.has(request.headers.get('origin'))) return response(403, { error: 'origin_not_allowed' }, headers);
    if (rateLimited(request)) return response(429, { error: 'rate_limited' }, headers);
    try {
      const parsed = await parseBody(request);
      if (parsed.error) return response(400, { error: parsed.error }, headers);
      if (isPublicIntake(parsed.data)) {
        if (!publicIntakeReady()) return response(503, { error: 'public_intake_not_configured' }, headers);
        const intake = normalizePublicIntake(parsed.data);
        if (intake.error) return response(400, { error: intake.error }, headers);
        const result = await createPublicIntake(intake);
        return response(201, { ok: true, submissionId: intake.submissionId, intakeType: intake.intakeType, created: result.created }, headers);
      }
      if (!dataverseReady()) return response(503, { error: 'intake_not_configured' }, headers);
      const application = normalizeInput(parsed.data);
      if (application.error) return response(400, { error: application.error }, headers);
      await upsertApplication(application);
      return response(201, { ok: true, applicationId: application.applicationId }, headers);
    } catch (error) {
      const code = clean(error?.message, 120);
      request?.logger?.error?.('Trustora careers intake failed', { code });
      return response(502, { error: 'intake_unavailable' }, headers);
    }
  },
});

app.http('careerHealth', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  route: 'careers-health',
  handler: async (request) => {
    const smokeRequested = new URL(request.url).searchParams.get('smoke') === 'd365';
    if (smokeRequested) {
      if (request.method !== 'POST' || !smokeAuthorized(request)) return response(404, { error: 'not_found' });
      if (smokeInProgress) return response(409, { ok: false, error: 'smoke_in_progress' });
      smokeInProgress = true;
      try {
        return response(200, await runD365Smoke());
      } catch (error) {
        request?.logger?.error?.('Trustora D365 smoke failed', { code: clean(error?.message, 120) });
        return response(502, { ok: false, error: 'smoke_failed', stage: clean(error?.smokeStage, 40) || 'unknown', cleanup: Array.isArray(error?.smokeCleanup) ? error.smokeCleanup.slice(0, 8) : undefined });
      } finally {
        smokeInProgress = false;
      }
    }
    if (request.method !== 'GET') return response(405, { error: 'method_not_allowed' });
    return response(200, { ok: true, service: 'trustora-careers-intake', configured: dataverseReady(), publicIntakeConfigured: publicIntakeReady(), publicLeadHealth: await publicLeadHealth() });
  },
});

export { normalizeInput, applicationFields, normalizePublicIntake, publicLeadFields, publicLeadSubject, smokeAuthorized };
