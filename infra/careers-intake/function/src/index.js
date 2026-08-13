import crypto from 'node:crypto';
import { app } from '@azure/functions';
import { DefaultAzureCredential } from '@azure/identity';

const MAX_BODY_BYTES = boundedInteger(process.env.MAX_BODY_BYTES, 1_024, 32 * 1_024, 16 * 1_024);
const RATE_LIMIT_PER_HOUR = boundedInteger(process.env.RATE_LIMIT_PER_HOUR, 1, 100, 5);
const DATAVERSE_URL = normalizeDataverseUrl(process.env.DATAVERSE_URL);
const ENTITY_SET = clean(process.env.TRUSTORA_APPLICATION_ENTITY_SET, 80).replace(/[^a-zA-Z0-9_]/g, '');
const FIELD_PREFIX = clean(process.env.TRUSTORA_APPLICATION_FIELD_PREFIX, 20).replace(/[^a-zA-Z0-9_]/g, '');
const TRUSTORA_TEAM_ID = guid(process.env.TRUSTORA_TEAM_ID);
const ALLOWED_ORIGINS = new Set((process.env.ALLOWED_ORIGINS || 'https://trustora.net,https://www.trustora.net')
  .split(',').map((value) => normalizeOrigin(value)).filter(Boolean));
const credential = new DefaultAzureCredential();
const requestCounts = new Map();

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
  data['role-interests'] = params.getAll('role-interests');
  data['professional-languages'] = params.getAll('professional-languages');
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

function normalizeInput(input) {
  const value = input || {};
  const applicationId = guid(value['application-id']);
  const email = clean(value.email, 254).toLowerCase();
  const roleInterests = Array.isArray(value['role-interests']) ? value['role-interests'].map((item) => clean(item, 160)).filter(Boolean).slice(0, 12) : clean(value['role-interests'], 160) ? [clean(value['role-interests'], 160)] : [];
  const professionalLanguages = Array.isArray(value['professional-languages']) ? value['professional-languages'].map((item) => clean(item, 80)).filter(Boolean).slice(0, 16) : clean(value['professional-languages'], 80) ? [clean(value['professional-languages'], 80)] : [];
  const links = [value['resume-link'], value.linkedin, value.github, value['portfolio-or-publications']].map((item) => clean(item, 500));
  const required = [applicationId, clean(value['full-name'], 160), email, clean(value['current-country'], 80), clean(value['time-zone'], 120), clean(value['role-title-or-problem'], 180), clean(value['work-authorization'], 160), clean(value['work-model'], 80), clean(value.availability, 100)];
  if (required.some((item) => !item) || !validEmail(email) || links.some((item) => !validHttpsUrl(item)) || value['applicant-consent'] !== 'yes' || clean(value.website, 20)) return { error: 'invalid_application' };
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

async function dataverseRequest(path, options = {}) {
  if (!DATAVERSE_URL) throw new Error('dataverse_not_configured');
  const token = await credential.getToken(`${DATAVERSE_URL}/.default`);
  if (!token?.token) throw new Error('dataverse_token_unavailable');
  const result = await fetch(`${DATAVERSE_URL}/api/data/v9.2/${path}`, {
    ...options,
    headers: { accept: 'application/json', 'content-type': 'application/json', Authorization: `Bearer ${token.token}`, ...(options.headers || {}) },
    signal: AbortSignal.timeout(10_000),
  });
  if (!result.ok) throw new Error(`dataverse_${result.status}`);
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

app.http('careerApplication', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'careers-application',
  handler: async (request) => {
    const headers = cors(request);
    if (request.method === 'OPTIONS') return response(204, {}, headers);
    if (request.headers.get('origin') && !ALLOWED_ORIGINS.has(request.headers.get('origin'))) return response(403, { error: 'origin_not_allowed' }, headers);
    if (rateLimited(request)) return response(429, { error: 'rate_limited' }, headers);
    if (!dataverseReady()) return response(503, { error: 'intake_not_configured' }, headers);
    try {
      const parsed = await parseBody(request);
      if (parsed.error) return response(400, { error: parsed.error }, headers);
      const application = normalizeInput(parsed.data);
      if (application.error) return response(400, { error: application.error }, headers);
      await upsertApplication(application);
      return response(201, { ok: true, applicationId: application.applicationId }, headers);
    } catch (error) {
      request?.logger?.error?.('Trustora careers intake failed', { code: clean(error?.message, 80) });
      return response(502, { error: 'intake_unavailable' }, headers);
    }
  },
});

app.http('careerHealth', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'careers-health',
  handler: async () => response(200, { ok: true, service: 'trustora-careers-intake', configured: dataverseReady() }),
});

export { normalizeInput, applicationFields };
