import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { extname, join, relative, resolve } from 'node:path';
import { chromium } from 'playwright';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const outputRoot = join(projectRoot, 'dist');
const expectedCounts = { squeeze: 13, briefing: 11, contact: 1, career: 4 };
const expectedTotal = Object.values(expectedCounts).reduce((total, count) => total + count, 0);
const publicEndpoint = requiredUrl('PUBLIC_TRUSTORA_INTAKE_API_URL');
const careerEndpoint = requiredUrl('PUBLIC_CAREERS_API_URL');

function requiredUrl(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required for browser QA`);
  const url = new URL(value);
  assert.equal(url.protocol, 'https:', `${name} must use HTTPS`);
  return url.href;
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

function routeFromFile(file) {
  const path = relative(outputRoot, file).replaceAll('\\', '/');
  if (path === 'index.html') return '/';
  if (!path.endsWith('/index.html')) return null;
  return `/${path.slice(0, -'index.html'.length)}`;
}

function attribute(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return tag.match(new RegExp(`\\b${escaped}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1] ?? null;
}

async function discoverFormRoutes() {
  const files = await walk(outputRoot);
  const entries = [];
  for (const file of files.filter((candidate) => candidate.endsWith('.html'))) {
    const route = routeFromFile(file);
    if (!route) continue;
    const html = await readFile(file, 'utf8');
    const formTags = [...html.matchAll(/<form\b[^>]*>/gi)]
      .map((match) => match[0])
      .filter((tag) => /\bdata-d365-form(?:\s|=|>)/i.test(tag));
    if (formTags.length) entries.push({ route, type: attribute(formTags[0], 'data-intake-type') });
  }
  return entries.sort((left, right) => left.route.localeCompare(right.route));
}

function expectedEndpoint(type) {
  return type === 'career' ? careerEndpoint : publicEndpoint;
}

function expectedSource(route, type) {
  return type === 'career' ? 'trustora.net/careers' : `trustora.net${route}`;
}

function expectedKey(route, type) {
  if (type === 'squeeze') return route.split('/').filter(Boolean).at(-1);
  if (type === 'briefing') return route.split('/').filter(Boolean).at(-1);
  return null;
}

function contentType(file) {
  return {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
  }[extname(file).toLowerCase()] || 'application/octet-stream';
}

async function startLocalServer() {
  const configuredBase = process.env.FORM_QA_BASE_URL?.trim();
  if (configuredBase) {
    const baseUrl = new URL(configuredBase);
    return { baseUrl: baseUrl.href.replace(/\/$/, ''), stop: async () => {} };
  }

  const server = createServer(async (request, result) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
      if (pathname.includes('..')) {
        result.writeHead(400);
        result.end();
        return;
      }
      const relativePath = pathname === '/' ? '' : pathname.replace(/^\/+/, '');
      const candidates = pathname === '/'
        ? [join(outputRoot, 'index.html')]
        : pathname.endsWith('/')
        ? [join(outputRoot, relativePath, 'index.html')]
        : [resolve(outputRoot, relativePath), join(outputRoot, relativePath, 'index.html')];
      let file;
      let contents;
      for (const candidate of candidates) {
        if (!resolve(candidate).startsWith(`${resolve(outputRoot)}${process.platform === 'win32' ? '\\' : '/'}`) && resolve(candidate) !== resolve(outputRoot)) continue;
        try {
          contents = await readFile(candidate);
          file = candidate;
          break;
        } catch {
          // Try the next static-file candidate.
        }
      }
      if (!file) {
        result.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        result.end('Not found');
        return;
      }
      result.writeHead(200, { 'Content-Type': contentType(file), 'Cache-Control': 'no-store' });
      result.end(contents);
    } catch {
      result.writeHead(400);
      result.end();
    }
  });
  await new Promise((resolveServer, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolveServer);
  });
  const address = server.address();
  assert.ok(address && typeof address === 'object', 'local QA server did not expose an address');
  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    stop: async () => new Promise((resolveServer, reject) => server.close((error) => error ? reject(error) : resolveServer())),
  };
}

async function assertFallback(page, baseUrl, route) {
  if (route.type !== 'squeeze') return;
  const links = await page.locator('.squeeze-fallback a[href]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')));
  assert.equal(links.length, 1, `${route.route}: expected exactly one squeeze fallback link`);
  const href = links[0];
  assert.ok(href && !href.toLowerCase().startsWith('mailto:'), `${route.route}: squeeze fallback must not use mailto`);
  const fallbackUrl = new URL(href, `${baseUrl}${route.route}`).href;
  const result = await fetch(fallbackUrl, { signal: AbortSignal.timeout(10_000) });
  assert.equal(result.status, 200, `${route.route}: fallback ${href} returned HTTP ${result.status}`);
  if (new URL(fallbackUrl).pathname.startsWith('/briefings/')) {
    const html = await result.text();
    assert.match(html, /<form\b[^>]*data-d365-form/i, `${route.route}: briefing fallback has no D365 form`);
    assert.match(html, /data-intake-type=["']briefing["']/i, `${route.route}: briefing fallback is not a briefing intake`);
  }
}

async function fillControl(control, seenChoiceNames) {
  const metadata = await control.evaluate((element) => ({
    name: element.getAttribute('name') || '',
    type: (element.getAttribute('type') || element.tagName).toLowerCase(),
    value: 'value' in element ? element.value : '',
    disabled: element.disabled,
    hidden: element.type === 'hidden',
  }));
  if (!metadata.name || metadata.disabled || metadata.hidden || metadata.name === 'website' || ['submit', 'button', 'reset', 'image', 'file'].includes(metadata.type)) return;

  if (metadata.type === 'checkbox' || metadata.type === 'radio') {
    if (!seenChoiceNames.has(metadata.name)) {
      await control.check();
      seenChoiceNames.add(metadata.name);
    }
    return;
  }
  if (metadata.type === 'select') {
    const optionIndex = await control.locator('option').evaluateAll((options) => options.findIndex((option) => option.value));
    if (optionIndex >= 0) await control.selectOption({ index: optionIndex });
    return;
  }
  if (metadata.type === 'email') return control.fill('qa.browser@trustora.net');
  if (metadata.type === 'url') return control.fill('https://trustora.net/qa');
  if (metadata.type === 'date') return control.fill('2026-10-15');
  if (metadata.type === 'tel') return control.fill('+1 202 555 0147');
  if (metadata.type === 'number') return control.fill('1');
  await control.fill(metadata.value || 'Trustora Browser QA');
}

function parseBody(body, route) {
  assert.ok(body, `${route}: no POST body was captured`);
  return new URLSearchParams(body);
}

function assertSubmissionBody(body, route) {
  const type = route.type;
  const expectedSchema = type === 'career' ? 'trustora-careers-v1' : 'trustora-public-intake-v1';
  assert.match(body.get('application-id') || '', /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, `${route.route}: missing browser idempotency UUID`);
  assert.equal(body.get('business-unit'), 'Trustora', `${route.route}: wrong business unit`);
  assert.equal(body.get('schema-version'), expectedSchema, `${route.route}: wrong schema version`);
  assert.equal(body.get('website'), '', `${route.route}: honeypot must remain empty`);
  assert.equal(body.get('source'), expectedSource(route.route, type), `${route.route}: wrong D365 source`);
  if (type === 'career') {
    assert.equal(body.get('applicant-consent'), 'yes', `${route.route}: career consent was not submitted`);
    assert.equal(body.get('full-name'), 'Trustora Browser QA', `${route.route}: career name was not submitted`);
  } else {
    assert.equal(body.get('intake-type'), type, `${route.route}: wrong public intake type`);
    assert.equal(body.get('safe-to-contact'), 'yes', `${route.route}: public consent was not submitted`);
    assert.equal(body.get('name'), 'Trustora Browser QA', `${route.route}: public name was not submitted`);
    const keyName = type === 'squeeze' ? 'squeeze-key' : type === 'briefing' ? 'briefing-slug' : null;
    if (keyName) assert.equal(body.get(keyName), expectedKey(route.route, type), `${route.route}: wrong ${keyName}`);
  }
}

async function testRoute(browser, baseUrl, route) {
  const page = await browser.newPage();
  try {
    const pageResponse = await page.goto(`${baseUrl}${route.route}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    assert.equal(pageResponse?.status(), 200, `${route.route}: page returned HTTP ${pageResponse?.status() ?? 'no response'}`);
    assert.equal(await page.locator('a[href^="mailto:"]').count(), 0, `${route.route}: mailto link is present`);

    const forms = page.locator('form[data-d365-form]');
    assert.equal(await forms.count(), 1, `${route.route}: expected exactly one D365 form`);
    const form = forms.first();
    const metadata = await form.evaluate((element) => ({
      action: element.action,
      method: element.method,
      enctype: element.enctype,
      intakeType: element.dataset.intakeType || '',
      schema: element.querySelector('[name="schema-version"]')?.value || '',
      source: element.querySelector('[name="source"]')?.value || '',
    }));
    assert.equal(metadata.action, expectedEndpoint(route.type), `${route.route}: form action does not use the configured D365 endpoint`);
    assert.equal(metadata.method.toLowerCase(), 'post', `${route.route}: form must use POST`);
    assert.equal(metadata.enctype, 'application/x-www-form-urlencoded', `${route.route}: form must use URL-encoded transport`);
    assert.equal(metadata.intakeType, route.type, `${route.route}: wrong form intake type`);

    await assertFallback(page, baseUrl, route);

    let captured;
    await page.route(expectedEndpoint(route.type), async (interceptedRoute) => {
      const request = interceptedRoute.request();
      captured = { method: request.method(), body: request.postData() || '' };
      await interceptedRoute.fulfill({ status: 201, contentType: 'application/json', body: '{"ok":true}' });
    });
    const seenChoiceNames = new Set();
    const controls = form.locator('input,select,textarea');
    for (let index = 0; index < await controls.count(); index += 1) await fillControl(controls.nth(index), seenChoiceNames);
    const validity = await form.evaluate((element) => ({
      valid: element.checkValidity(),
      invalid: [...element.elements].filter((control) => !control.checkValidity()).map((control) => control.name || control.id),
    }));
    assert.equal(validity.valid, true, `${route.route}: required controls are invalid (${validity.invalid.join(', ')})`);
    await form.locator('button[type="submit"],input[type="submit"]').first().click();
    await form.locator('[data-d365-status][data-state="success"]').waitFor({ state: 'visible', timeout: 10_000 });
    assert.equal(captured?.method, 'POST', `${route.route}: browser did not POST to the D365 endpoint`);
    assertSubmissionBody(parseBody(captured?.body, route), route);
  } finally {
    await page.close();
  }
}

async function main() {
  const routes = await discoverFormRoutes();
  assert.equal(routes.length, expectedTotal, `expected ${expectedTotal} D365 form routes, found ${routes.length}`);
  for (const [type, count] of Object.entries(expectedCounts)) {
    assert.equal(routes.filter((route) => route.type === type).length, count, `expected ${count} ${type} form routes`);
  }

  const preview = await startLocalServer();
  const browser = await chromium.launch({ headless: true });
  try {
    for (const route of routes) await testRoute(browser, preview.baseUrl, route);
  } finally {
    await browser.close();
    await preview.stop();
  }
  console.log(`Form browser QA passed: ${routes.length} forms (${expectedCounts.squeeze} squeezes, ${expectedCounts.briefing} briefings, ${expectedCounts.contact} contact, ${expectedCounts.career} careers) and ${expectedCounts.squeeze} squeeze fallbacks.`);
}

main().catch((error) => {
  console.error(`Form browser QA failed: ${error.message}`);
  process.exitCode = 1;
});
