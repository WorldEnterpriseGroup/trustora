import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
const failures = [];

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
  const path = relative(root, file).replaceAll('\\', '/');
  if (path === 'index.html') return '/';
  if (path === '404.html') return '/404/';
  if (!path.endsWith('/index.html')) return null;
  return `/${path.slice(0, -'index.html'.length)}`;
}

function countMatches(html, expression) {
  return [...html.matchAll(expression)].length;
}

const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const routes = htmlFiles.map(routeFromFile).filter(Boolean).sort();
const indexableRoutes = [];

const expectedRouteCount = 96;
if (routes.length !== expectedRouteCount) failures.push(`Expected ${expectedRouteCount} HTML routes, found ${routes.length}`);
if (!files.some((file) => file.endsWith('/robots.txt'))) failures.push('robots.txt is missing');
if (!files.some((file) => file.endsWith('/sitemap.xml'))) failures.push('sitemap.xml is missing');

const availableRoutes = new Set(routes);
const globalCreativeImages = new Map();
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const route = routeFromFile(file);
  if (route === '/404/') continue;
  if (!/<meta name="robots" content="noindex, nofollow"/.test(html)) indexableRoutes.push(route);
  if (!/<html[^>]+lang="en"/.test(html)) failures.push(`${route}: html lang is missing`);
  if (countMatches(html, /<h1\b/g) !== 1) failures.push(`${route}: expected exactly one h1`);
  if (!/<title>[^<]+<\/title>/.test(html)) failures.push(`${route}: title is missing`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) failures.push(`${route}: description is missing`);
  if (!/<link rel="canonical" href="https:\/\/trustora\.net/.test(html)) failures.push(`${route}: canonical is missing`);
  if (!/href="#main-content"/.test(html) || !/<main id="main-content">/.test(html)) failures.push(`${route}: skip link or main landmark is missing`);
  if (/href="#"/.test(html)) failures.push(`${route}: placeholder hash link found`);
  for (const match of html.matchAll(/<img\b([^>]+)>/g)) {
    if (!/\balt="[^"]*"/.test(match[1])) failures.push(`${route}: image missing alt`);
    if (!/\bwidth="\d+"/.test(match[1]) || !/\bheight="\d+"/.test(match[1])) failures.push(`${route}: image missing intrinsic dimensions`);
  }
  const creativeImages = [...html.matchAll(/<img[^>]+src="(\/_astro\/[^"?]+)/g)].map((match) => match[1]);
  if (new Set(creativeImages).size !== creativeImages.length) failures.push(`${route}: repeated creative image detected`);
  for (const image of creativeImages) {
    const previousRoute = globalCreativeImages.get(image);
    if (previousRoute) failures.push(`${route}: creative image ${image} is also rendered on ${previousRoute}`);
    else globalCreativeImages.set(image, route);
  }
  for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = match[1] || '/';
    if (href.startsWith('/_astro/') || href.startsWith('/images/') || href === '/favicon.ico') continue;
    const normalized = href.endsWith('/') ? href : `${href}/`;
    if (!availableRoutes.has(normalized) && normalized !== '/404/') failures.push(`${route}: broken internal link ${href}`);
  }
}

const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
if (!/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(sitemap)) failures.push('sitemap is missing lastmod dates');
for (const route of indexableRoutes) {
  if (!sitemap.includes(`https://trustora.net${route}`)) failures.push(`sitemap is missing ${route}`);
}

const careersIndex = await readFile(join(root, 'careers', 'index.html'), 'utf8');
for (const marker of [
  'Early-career / no experience',
  'Mid-level / senior',
  'https://usfellows.org/fellowships.html',
  'https://usfellows.org/international-rd-scholars.html',
  'https://usfellows.org/apply.html?program=International+R%26D+Scholar',
  'data-role-option',
]) {
  if (!careersIndex.includes(marker)) failures.push(`careers index is missing architecture marker: ${marker}`);
}

const careerDetailSource = await readFile(new URL('../src/pages/careers/[slug].astro', import.meta.url), 'utf8');
for (const marker of [
  "career.data.status === 'Closed'",
  "career.data.status === 'Talent pool'",
  'noindex={isClosed}',
]) {
  if (!careerDetailSource.includes(marker)) failures.push(`career status lifecycle branch is missing: ${marker}`);
}

for (const [route, roleTitle] of [
  ['/careers/contract-strategic-initiatives-manager/', 'Contract & Strategic Initiatives Manager'],
  ['/careers/employee-intelligence-workforce-strategy-lead/', 'Senior Employee Intelligence & Workforce Strategy Lead'],
]) {
  const detail = await readFile(join(root, route.slice(1), 'index.html'), 'utf8');
  if (detail.includes('Closed role')) {
    if (!detail.includes('<meta name="robots" content="noindex, nofollow"')) failures.push(`${route}: closed role is not noindex`);
    if (detail.includes('data-schema-version="trustora-careers-v1"')) failures.push(`${route}: closed role still renders an application form`);
  } else {
    if (!detail.includes('Paid Trustora opportunity')) failures.push(`${route}: paid opportunity marker is missing`);
    if (!detail.includes('id="apply"')) failures.push(`${route}: direct application form is missing`);
    const escapedRoleTitle = roleTitle.replaceAll('&', '&amp;');
    if (!detail.includes(`name="role-title-or-problem"`) || !detail.includes(`value="${escapedRoleTitle}"`)) failures.push(`${route}: no-JavaScript role prefill is missing`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`✓ ${routes.length} rendered routes passed metadata, link, image, landmark, and global media-uniqueness smoke checks.`);
