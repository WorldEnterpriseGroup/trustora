/**
 * record-graph.mjs — build-time link + inventory data for the Record Room.
 *
 * Reads dist/ (fresh `astro build` required), computes body-copy edges between
 * routes, per-route main-zone word/image counts, and section aggregates, then
 * writes src/data/recordGraph.ts. Run BEFORE the release build so record pages
 * embed the current numbers:
 *
 *   node scripts/record-graph.mjs
 *
 * Counts describe site structure; they are not traffic or audience metrics.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const distRoot = join(projectRoot, 'dist');
const outPath = join(projectRoot, 'src', 'data', 'recordGraph.ts');

const SECTION_ORDER = ['top', 'services', 'insights', 'briefings', 'industries', 'locations', 'legal', 'careers', 'compare', 'record'];

function sectionOf(route) {
  for (const s of SECTION_ORDER) {
    if (s !== 'top' && route.startsWith(`/${s}/`)) return s;
  }
  return 'top';
}

function fileOf(route) {
  return route === '/' ? 'index' : route.replace(/^\/|\/$/g, '');
}

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
  const path = relative(distRoot, file).replaceAll('\\', '/');
  if (path === 'index.html') return '/';
  if (path === '404.html') return null;
  if (!path.endsWith('/index.html')) return null;
  return `/${path.slice(0, -'index.html'.length)}`;
}

const files = await walk(distRoot);
const routes = new Map();
for (const file of files.filter((f) => f.endsWith('.html'))) {
  const route = routeFromFile(file);
  if (route) routes.set(route, await readFile(file, 'utf8'));
}

const inventory = [];
for (const [route, html] of [...routes.entries()].sort()) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
  const text = main.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
  inventory.push({
    href: route,
    file: fileOf(route),
    section: sectionOf(route),
    title,
    titleLen: title.length,
    descLen: desc.length,
    h1: (main.match(/<h1\b/g) ?? []).length,
    h2: (main.match(/<h2\b/g) ?? []).length,
    canonOk: canon === `https://trustora.net${route}`,
    htmlSections: (main.match(/<section\b/g) ?? []).length,
    words: text ? text.split(' ').length : 0,
    images: (main.match(/data-media-source="/g) ?? []).length,
  });
}

const edges = [];
const matrix = Object.fromEntries(SECTION_ORDER.map((a) => [a, Object.fromEntries(SECTION_ORDER.map((b) => [b, 0]))]));
for (const [route, html] of routes.entries()) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
  const dests = new Set();
  for (const m of main.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = m[1] || '/';
    const norm = href.endsWith('/') ? href : `${href}/`;
    if (routes.has(norm) && norm !== route) dests.add(norm);
  }
  for (const d of [...dests].sort()) {
    edges.push([fileOf(route), fileOf(d)]);
    matrix[sectionOf(route)][sectionOf(d)] += 1;
  }
}
edges.sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));

const sections = SECTION_ORDER.map((name) => {
  const rows = inventory.filter((r) => r.section === name);
  return {
    name,
    routes: rows.length,
    words: rows.reduce((n, r) => n + r.words, 0),
    images: rows.reduce((n, r) => n + r.images, 0),
    htmlSections: rows.reduce((n, r) => n + r.htmlSections, 0),
  };
});

const totalWords = inventory.reduce((n, r) => n + r.words, 0);
const totalImages = inventory.reduce((n, r) => n + r.images, 0);

const STOP = new Set('with,from,that,this,will,have,more,your,their,what,when,where,which,whom,than,then,them,they,about,into,over,after,before,between,through,during,under,such,each,other,these,those,been,were,also,across,while,within,trustora,and,the,for,are,but,not,you,all,can,had,her,was,one,our,out,has,have'.split(','));
const termCounts = new Map();
const termPages = new Map();
for (const [route, html] of routes.entries()) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
  const toks = main.replace(/<[^>]+>/g, ' ').toLowerCase().match(/[a-z]{4,}/g) ?? [];
  const seen = new Set();
  for (const t of toks) {
    if (STOP.has(t)) continue;
    termCounts.set(t, (termCounts.get(t) ?? 0) + 1);
    if (!seen.has(t)) {
      seen.add(t);
      termPages.set(t, (termPages.get(t) ?? 0) + 1);
    }
  }
}
const siteTerms = [...termCounts.entries()]
  .map(([term, occurrences]) => ({ term, occurrences, pages: termPages.get(term) ?? 0 }))
  .sort((a, b) => b.occurrences - a.occurrences || a.term.localeCompare(b.term))
  .slice(0, 12);

const ts = `// AUTO-GENERATED by scripts/record-graph.mjs — do not hand-edit.
// Regenerate after a fresh dist/ build: node scripts/record-graph.mjs
export const recordGraphGeneratedAt = ${JSON.stringify(new Date().toISOString().slice(0, 10))};
export const recordGraphTotals = ${JSON.stringify({ routes: inventory.length, words: totalWords, images: totalImages, handoffs: edges.length }, null, 2)};
export const recordGraphSections = ${JSON.stringify(sections)};
export const recordGraphMatrixOrder = ${JSON.stringify(SECTION_ORDER)};
export const recordGraphMatrix = ${JSON.stringify(matrix)};
export interface RecordInventoryRow { href: string; file: string; section: string; title: string; titleLen: number; descLen: number; h1: number; h2: number; canonOk: boolean; htmlSections: number; words: number; images: number; }
export const recordGraphInventory: RecordInventoryRow[] = ${JSON.stringify(inventory.map(({ href, file, section, title, titleLen, descLen, h1, h2, canonOk, htmlSections, words, images }) => ({ href, file, section, title, titleLen, descLen, h1, h2, canonOk, htmlSections, words, images })))};
export const recordGraphEdges: Array<[string, string]> = ${JSON.stringify(edges)};
export interface RecordSiteTerm { term: string; occurrences: number; pages: number; }
export const recordGraphSiteTerms: RecordSiteTerm[] = ${JSON.stringify(siteTerms)};
`;

await writeFile(outPath, ts, 'utf8');
console.log(`Wrote ${outPath}: ${inventory.length} routes, ${totalWords} words, ${totalImages} images, ${edges.length} handoffs, ${siteTerms.length} site terms.`);
