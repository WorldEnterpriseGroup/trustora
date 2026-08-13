import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const projectRoot = new URL('../', import.meta.url).pathname;
const outputRoot = join(projectRoot, 'dist');
const sourceRoot = join(projectRoot, 'src');
const failures = [];
const warnings = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

function routeFromFile(file) {
  const path = relative(outputRoot, file).replaceAll('\\', '/');
  if (path === 'index.html') return '/';
  if (path === '404.html') return '/404/';
  if (!path.endsWith('/index.html')) return null;
  return `/${path.slice(0, -'index.html'.length)}`;
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i'))?.[1] ?? null;
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => match[0]);
}

function normalizeRoute(pathname) {
  if (pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function decodeFragment(fragment) {
  try {
    return decodeURIComponent(fragment);
  } catch {
    return fragment;
  }
}

function isExternalOrSpecial(href) {
  return href.startsWith('mailto:')
    || href.startsWith('tel:')
    || href.startsWith('javascript:')
    || href.startsWith('data:')
    || href.startsWith('http://')
    || href.startsWith('https://')
    || href.startsWith('//');
}

function isAssetPath(pathname) {
  return pathname.startsWith('/_astro/')
    || pathname.startsWith('/images/')
    || pathname === '/favicon.ico'
    || pathname === '/robots.txt'
    || pathname === '/sitemap.xml';
}

function isValidAbsoluteUrl(value) {
  try {
    const url = new URL(value);
    return Boolean(url.protocol && url.host);
  } catch {
    return false;
  }
}

function addWarning(message) {
  warnings.push(`⚠ ${message}`);
}

function printWarnings() {
  if (!warnings.length) return;
  const groups = new Map();
  for (const warning of warnings) {
    const match = warning.match(/^⚠ (\/[^:]+): (.+)$/);
    const message = match?.[2] ?? warning.slice(2);
    const entry = groups.get(message) ?? { count: 0, routes: [] };
    entry.count += 1;
    if (match) entry.routes.push(match[1]);
    groups.set(message, entry);
  }
  const output = [...groups.entries()].map(([message, entry]) => {
    if (!entry.routes.length) return `⚠ ${message}`;
    const routeSummary = entry.routes.length > 8
      ? `${entry.routes.slice(0, 8).join(', ')}, … (+${entry.routes.length - 8} more)`
      : entry.routes.join(', ');
    return `⚠ ${message} (${entry.count} routes: ${routeSummary})`;
  });
  console.log(`Warnings (${warnings.length}, ${output.length} groups):\n${output.join('\n')}`);
}

const config = await readFile(join(projectRoot, 'astro.config.mjs'), 'utf8');
const configuredSite = config.match(/site:\s*['"]([^'"]+)['"]/)?.[1];
if (!configuredSite) failures.push('astro.config.mjs does not declare a site URL');
const siteUrl = new URL(configuredSite ?? 'https://trustora.net');
const expectedHost = siteUrl.hostname;

const outputFiles = await walk(outputRoot);
const sourceFiles = await walk(sourceRoot);
const htmlFiles = outputFiles.filter((file) => file.endsWith('.html'));
const routes = htmlFiles.map(routeFromFile).filter(Boolean).sort();
const routeFiles = new Map(htmlFiles.map((file) => [routeFromFile(file), file]));
const routeHtml = new Map();
const indexableRoutes = new Set();
const noindexRoutes = new Set();

if (!routeFiles.has('/404/')) failures.push('dist/404.html is missing; static-hosting deep links need a recovery document');

for (const file of htmlFiles) {
  const route = routeFromFile(file);
  const html = await readFile(file, 'utf8');
  routeHtml.set(route, html);
  const robots = tags(html, 'meta').find((tag) => attribute(tag, 'name')?.toLowerCase() === 'robots');
  if (robots && /noindex/i.test(attribute(robots, 'content') ?? '')) noindexRoutes.add(route);
  else if (route !== '/404/') indexableRoutes.add(route);
}

for (const [route, html] of routeHtml) {
  if (route === '/404/') continue;
  const canonicalTag = tags(html, 'link').find((tag) => attribute(tag, 'rel')?.toLowerCase() === 'canonical');
  const canonical = canonicalTag ? attribute(canonicalTag, 'href') : null;
  const expectedCanonical = new URL(route, siteUrl).toString();
  if (canonical !== expectedCanonical) failures.push(`${route}: canonical does not match the configured route (${canonical ?? 'missing'})`);

  const viewport = tags(html, 'meta').find((tag) => attribute(tag, 'name')?.toLowerCase() === 'viewport');
  if (!viewport || !/width\s*=\s*device-width/i.test(attribute(viewport, 'content') ?? '')) {
    failures.push(`${route}: mobile viewport metadata is missing or does not declare width=device-width`);
  }

  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const link of tags(html, 'a')) {
    const href = attribute(link, 'href');
    if (!href || isExternalOrSpecial(href)) {
      if (href?.startsWith('javascript:')) failures.push(`${route}: javascript: URL found in an anchor`);
      continue;
    }
    const destination = new URL(href, expectedCanonical);
    if (destination.origin !== siteUrl.origin || isAssetPath(destination.pathname)) continue;
    const destinationRoute = normalizeRoute(destination.pathname);
    if (!routeFiles.has(destinationRoute)) failures.push(`${route}: internal link points to missing route ${href}`);
    if (destination.hash) {
      const fragment = decodeFragment(destination.hash.slice(1));
      const destinationIds = destinationRoute === route
        ? ids
        : new Set([...((routeHtml.get(destinationRoute) ?? '').matchAll(/\bid="([^"]+)"/g))].map((match) => match[1]));
      if (!destinationIds.has(fragment)) failures.push(`${route}: fragment link ${href} has no matching id`);
    }
    if (attribute(link, 'target') === '_blank' && !/(?:^|\s)(?:noopener|noreferrer)(?:\s|$)/i.test(attribute(link, 'rel') ?? '')) {
      failures.push(`${route}: target=_blank link lacks rel=noopener or rel=noreferrer`);
    }
  }

  for (const tag of tags(html, 'script')) {
    if (attribute(tag, 'src')?.startsWith('http')) addWarning(`${route}: third-party script is present; document its owner, consent, and CSP allowance`);
  }

  for (const form of html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)) {
    const formTag = `<form${form[1]}>`;
    const body = form[2];
    const action = attribute(formTag, 'action');
    if (!action) failures.push(`${route}: form has no action`);
    if (!attribute(formTag, 'method')) failures.push(`${route}: form has no method`);
    if (action?.startsWith('mailto:')) {
      addWarning(`${route}: mailto form has no server-side validation, abuse protection, delivery guarantee, or CRM routing`);
      if (attribute(formTag, 'method')?.toLowerCase() === 'post') addWarning(`${route}: mailto form uses POST semantics that depend on the visitor's mail client`);
    }
    if (!/<button\b[^>]*type="submit"[^>]*>\s*[^<]+/i.test(body) && !/<input\b[^>]*type="submit"/i.test(body)) {
      failures.push(`${route}: form has no named submit control`);
    }
    if (/<input\b[^>]*type="(?:checkbox|radio)"/i.test(body) && !/<fieldset\b[\s\S]*?<legend\b/i.test(body)) {
      failures.push(`${route}: checkbox/radio controls are not grouped in a fieldset with a legend`);
    }
    for (const control of body.matchAll(/<(input|select|textarea)\b([^>]*)>/gi)) {
      const controlTag = `<${control[1]}${control[2]}>`;
      const type = (attribute(controlTag, 'type') ?? '').toLowerCase();
      if (type === 'hidden' || ['submit', 'button', 'reset', 'image'].includes(type)) continue;
      if (!attribute(controlTag, 'name')) failures.push(`${route}: form control is missing a name attribute`);
      if (['email', 'tel'].includes(type) && !attribute(controlTag, 'autocomplete')) addWarning(`${route}: ${type} control should declare autocomplete`);
      if (type === 'file' && !/enctype="multipart\/form-data"/i.test(formTag)) failures.push(`${route}: file input requires multipart/form-data encoding`);
    }
  }

  for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (attribute(`<script${script[1]}>`, 'type')?.toLowerCase() !== 'application/ld+json') continue;
    let data;
    try {
      data = JSON.parse(script[2]);
    } catch {
      failures.push(`${route}: JSON-LD is not valid JSON`);
      continue;
    }
    if (data?.['@context'] !== 'https://schema.org') failures.push(`${route}: JSON-LD context is not schema.org`);
    if (!data?.['@type']) failures.push(`${route}: JSON-LD type is missing`);
    for (const [label, value] of [['url', data?.url], ['mainEntityOfPage', data?.mainEntityOfPage], ['author.url', data?.author?.url], ['publisher.url', data?.publisher?.url]]) {
      if (value !== undefined && !isValidAbsoluteUrl(value)) failures.push(`${route}: JSON-LD ${label} is not an absolute URL`);
    }
    if (data?.['@type'] === 'Article') {
      if (data.mainEntityOfPage !== canonical) failures.push(`${route}: Article JSON-LD mainEntityOfPage does not match canonical`);
      if (!data.headline || !data.description || !data.datePublished || !data.author || !data.publisher) failures.push(`${route}: Article JSON-LD is missing headline, description, dates, author, or publisher`);
      for (const dateField of ['datePublished', 'dateModified']) if (data[dateField] && Number.isNaN(Date.parse(data[dateField]))) failures.push(`${route}: Article JSON-LD ${dateField} is not a valid date`);
    }
  }
}

const sitemapPath = join(outputRoot, 'sitemap.xml');
const robotsPath = join(outputRoot, 'robots.txt');
if (!(await walk(outputRoot)).includes(sitemapPath)) failures.push('dist/sitemap.xml is missing');
if (!(await walk(outputRoot)).includes(robotsPath)) failures.push('dist/robots.txt is missing');

if (await readFile(sitemapPath, 'utf8').then(() => true).catch(() => false)) {
  const sitemap = await readFile(sitemapPath, 'utf8');
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const uniqueSitemapUrls = new Set(sitemapUrls);
  if (uniqueSitemapUrls.size !== sitemapUrls.length) failures.push('sitemap contains duplicate loc values');
  const sitemapRoutes = new Set();
  for (const value of sitemapUrls) {
    try {
      const url = new URL(value);
      if (url.origin !== siteUrl.origin) failures.push(`sitemap contains an off-site URL: ${value}`);
      if (url.search || url.hash) failures.push(`sitemap URL has a query or fragment: ${value}`);
      sitemapRoutes.add(normalizeRoute(url.pathname));
    } catch {
      failures.push(`sitemap contains an invalid URL: ${value}`);
    }
  }
  for (const route of indexableRoutes) if (!sitemapRoutes.has(route)) failures.push(`sitemap is missing indexable route ${route}`);
  for (const route of sitemapRoutes) if (!indexableRoutes.has(route)) failures.push(`sitemap includes non-indexable or non-existent route ${route}`);
  const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1]);
  for (const value of lastmods) if (Number.isNaN(Date.parse(value))) failures.push(`sitemap has invalid lastmod value ${value}`);
  if (lastmods.length > 1 && new Set(lastmods).size === 1) addWarning('all sitemap lastmod values are identical; use content publication/update dates when available instead of the build date');
}

if (await readFile(robotsPath, 'utf8').then(() => true).catch(() => false)) {
  const robots = await readFile(robotsPath, 'utf8');
  if (!/^User-agent:\s*\*/im.test(robots)) failures.push('robots.txt has no wildcard User-agent rule');
  if (/^Disallow:\s*\/\s*$/im.test(robots)) failures.push('robots.txt disallows the entire site');
  if (!new RegExp(`^Sitemap:\\s*${siteUrl.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}sitemap\\.xml\\s*$`, 'im').test(robots)) {
    failures.push('robots.txt does not point to the configured site sitemap');
  }
}

const cnamePath = join(projectRoot, 'CNAME');
const cname = await readFile(cnamePath, 'utf8').then((value) => value.trim()).catch(() => '');
if (cname !== expectedHost) failures.push(`CNAME does not match the configured site host (${cname || 'missing'} vs ${expectedHost})`);
if (!outputFiles.some((file) => relative(outputRoot, file) === 'CNAME')) {
  addWarning('dist/CNAME is absent; the GitLab Pages custom domain must be configured in project settings or the deployment must explicitly copy CNAME');
}
if (!(await readFile(join(projectRoot, '.nojekyll'), 'utf8').then(() => true).catch(() => false))) addWarning('.nojekyll is absent; retain it if GitHub Pages remains a supported deployment target');

for (const file of outputFiles) {
  const relativePath = relative(outputRoot, file);
  if (/\.(?:map|bak|old|orig)$/i.test(relativePath) || /(?:^|\/)\.env(?:\.|$)/i.test(relativePath)) failures.push(`unexpected sensitive/debug file in production output: ${relativePath}`);
  if (/\.(?:html|css|js|json|xml|txt|svg)$/i.test(file)) {
    const text = await readFile(file, 'utf8');
    if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:DefaultEndpointsProtocol|AccountKey=|SharedAccessSignature=)|\b(?:ghp_|glpat-|xox[baprs]-|sk-[A-Za-z0-9])/i.test(text)) failures.push(`possible credential material in production output: ${relativePath}`);
    if (/\b(?:localhost|127\.0\.0\.1):\d+/i.test(text)) failures.push(`local development URL in production output: ${relativePath}`);
    if (/\b(?:onclick|onload|onerror)\s*=/i.test(text)) addWarning(`inline event handler in production output: ${relativePath}`);
  }
}

for (const file of sourceFiles.filter((candidate) => /\.(?:astro|ts|js|mjs)$/i.test(candidate))) {
  const text = await readFile(file, 'utf8');
  if (/set:html\s*=/.test(text) && !/set:html\s*=\s*\{\s*JSON\.stringify\(/.test(text)) {
    failures.push(`raw set:html requires an explicit sanitization review: ${relative(projectRoot, file)}`);
  }
}

console.log(`Technical audit reviewed ${routes.length} rendered routes, ${indexableRoutes.size} sitemap-eligible routes, ${[...routeHtml.values()].filter((html) => /<form\b/i.test(html)).length} form-bearing routes, and ${outputFiles.length} production files.`);
printWarnings();
if (failures.length) {
  console.error(`Failures (${failures.length}):\n${failures.map((failure) => `✗ ${failure}`).join('\n')}`);
  process.exit(1);
}
console.log('✓ Technical route, sitemap, fragment, form, structured-data, static-hosting, and output-exposure audit passed.');
