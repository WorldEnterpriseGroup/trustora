import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
const sourceRoot = new URL('../src/', import.meta.url).pathname;
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
  const path = relative(root, file).replaceAll('\\', '/');
  if (path === 'index.html') return '/';
  if (path === '404.html') return '/404/';
  if (!path.endsWith('/index.html')) return null;
  return `/${path.slice(0, -'index.html'.length)}`;
}

const files = await walk(root);
const sourceFiles = await walk(sourceRoot);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const sourceAvifFiles = sourceFiles.filter((file) => file.endsWith('.avif'));
const routes = htmlFiles.map(routeFromFile).filter(Boolean).sort();
const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();
const creativeSources = new Map();
const routeCreativeSources = new Map();
const creativeUrls = new Map();

const sourceHashes = new Map();
for (const file of sourceAvifFiles) {
  const hash = createHash('sha256').update(await readFile(file)).digest('hex');
  if (sourceHashes.has(hash)) failures.push(`duplicate AVIF source content: ${relative(sourceRoot, file)} matches ${sourceHashes.get(hash)}`);
  else sourceHashes.set(hash, relative(sourceRoot, file));
}
for (const file of sourceFiles) {
  if (/\.(png|jpe?g|webp)$/i.test(file)) failures.push(`non-AVIF source asset: ${relative(sourceRoot, file)}`);
}

for (const file of htmlFiles) {
  const route = routeFromFile(file);
  if (!route || route === '/404/') continue;
  const html = await readFile(file, 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? '';
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '';

  for (const [label, value, registry] of [['title', title, titles], ['description', description, descriptions], ['canonical', canonical, canonicals]]) {
    if (!value) failures.push(`${route}: missing ${label}`);
    if (value.length > (label === 'title' ? 60 : 160)) warnings.push(`${route}: ${label} is long (${value.length} chars)`);
    if (registry.has(value)) failures.push(`${route}: duplicate ${label} with ${registry.get(value)}`);
    else registry.set(value, route);
  }

  if (html.match(/<main[^>]*>.*?<h1\b/s)?.length === 0) failures.push(`${route}: main h1 is missing`);
  if ((html.match(/<h1\b/g) ?? []).length !== 1) failures.push(`${route}: expected one h1`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const seenIds = new Set();
  for (const id of ids) {
    if (seenIds.has(id)) failures.push(`${route}: duplicate id ${id}`);
    seenIds.add(id);
  }

  const mainHtml = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
  const headings = [...mainHtml.matchAll(/<h([1-6])\b/g)].map((match) => Number(match[1]));
  if (headings[0] !== 1) failures.push(`${route}: first heading is h${headings[0] ?? 'none'}`);
  for (let index = 1; index < headings.length; index += 1) {
    if (headings[index] > headings[index - 1] + 1) warnings.push(`${route}: heading jump h${headings[index - 1]} to h${headings[index]}`);
  }

  for (const match of html.matchAll(/<img\b([^>]+)>/g)) {
    const attributes = match[1];
    if (!/\balt="[^"\\]*"/.test(attributes)) failures.push(`${route}: image missing alt`);
    if (!/\bwidth="\d+"/.test(attributes) || !/\bheight="\d+"/.test(attributes)) failures.push(`${route}: image missing dimensions`);
    const source = attributes.match(/\bsrc="([^"]+)"/)?.[1];
    if (source?.startsWith('/_astro/')) {
      if (!source.endsWith('.avif')) failures.push(`${route}: non-AVIF creative image ${source}`);
      if (creativeUrls.has(source)) failures.push(`${route}: creative URL repeated with ${creativeUrls.get(source)}`);
      else creativeUrls.set(source, route);
    }
  }

  for (const match of html.matchAll(/<figure[^>]+data-media-source="([^"]+)"/g)) {
    const source = match[1];
    const routeSources = routeCreativeSources.get(route) ?? new Set();
    if (routeSources.has(source)) failures.push(`${route}: source media repeats within the route`);
    routeSources.add(source);
    routeCreativeSources.set(route, routeSources);
    const previous = creativeSources.get(source);
    if (previous && previous !== route) failures.push(`${route}: source media is reused from ${previous}`);
    if (!previous) creativeSources.set(source, route);
  }

  for (const match of html.matchAll(/<(?:input|select|textarea)\b([^>]*)>/g)) {
    const attributes = match[1];
    if (/type="hidden"/.test(attributes)) continue;
    const id = attributes.match(/\bid="([^"]+)"/)?.[1];
    const name = attributes.match(/\bname="([^"]+)"/)?.[1];
    if (!id && name && !/type="checkbox"/.test(attributes)) warnings.push(`${route}: form control ${name} has no id`);
    if (id && !html.includes(`for="${id}"`) && !new RegExp(`<label[^>]*>[\\s\\S]{0,500}id="${id}"`).test(html)) failures.push(`${route}: form control ${id} lacks a label`);
  }

  for (const match of html.matchAll(/aria-controls="([^"]+)"/g)) {
    if (!seenIds.has(match[1])) failures.push(`${route}: aria-controls target ${match[1]} missing`);
  }
}

if (!files.some((file) => file.endsWith('/robots.txt'))) failures.push('robots.txt is missing');
if (!files.some((file) => file.endsWith('/sitemap.xml'))) failures.push('sitemap.xml is missing');
for (const file of files) {
  if (/\.(png|jpe?g|webp)$/i.test(file) && !file.endsWith('.ico')) failures.push(`non-AVIF asset in production output: ${relative(root, file)}`);
}

console.log(`Audited ${routes.length} routes, ${sourceAvifFiles.length} AVIF source masters, ${creativeSources.size} source creative assignments, and ${creativeUrls.size} emitted creative URLs.`);
if (warnings.length) console.log(`Warnings (${warnings.length}):\n${warnings.join('\n')}`);
if (failures.length) {
  console.error(`Failures (${failures.length}):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log('✓ Deep route, metadata, semantics, form-label, and AVIF audit passed.');
