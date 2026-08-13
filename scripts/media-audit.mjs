import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const projectRoot = new URL('../', import.meta.url).pathname;
const sourceRoot = join(projectRoot, 'src');
const mediaRoot = join(sourceRoot, 'assets', 'editorial', 'avif');
const distRoot = join(projectRoot, 'dist');

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
  const path = relative(distRoot, file).replaceAll('\\', '/');
  if (path === 'index.html') return '/';
  if (!path.endsWith('/index.html')) return null;
  return `/${path.slice(0, -'index.html'.length)}`;
}

function sourceStem(url) {
  const filename = url.split('/').pop() ?? '';
  return filename.replace(/\.[^.]+\.avif$/, '').replace(/\.avif$/, '');
}

// This is a manual visual-review index. It describes the visible action/context,
// not the service key or the current alt text. It intentionally lives outside
// src/data so a media review cannot silently change published copy.
const visualReview = {
  'accessible-office-review': { action: 'reviewing an accessible workplace plan', category: 'analysis/review', status: 'pass' },
  'accessible-remote-call': { action: 'remote support call', category: 'remote support', status: 'pass' },
  'camera-grip-set': { action: 'adjusting production equipment', category: 'hands-on technical', status: 'pass' },
  'camera-rnd': { action: 'calibrating imaging equipment', category: 'hands-on technical', status: 'pass' },
  'coffee-corridor': { action: 'informal workplace conversation', category: 'conversation/networking', status: 'pass' },
  'conference-networking': { action: 'professional networking', category: 'conversation/networking', status: 'pass' },
  'conference-speaker': { action: 'presenting to an audience', category: 'presentation/facilitation', status: 'pass' },
  'dry-lab-data-review': { action: 'reviewing scientific data', category: 'analysis/review', status: 'pass' },
  'dubai-skyline': { action: 'place/context view', category: 'place/context', status: 'pass' },
  'event-coordinator': { action: 'coordinating event equipment', category: 'coordination/logistics', status: 'pass' },
  'gpu-rnd': { action: 'diagnosing compute hardware', category: 'hands-on technical', status: 'pass' },
  'hardware-prototyping': { action: 'soldering and testing a prototype', category: 'hands-on technical', status: 'pass' },
  'insights-corporate-editorial': { action: 'reviewing strategy data', category: 'analysis/review', status: 'pass' },
  'lab-instrument-research': { action: 'calibrating a laboratory instrument', category: 'hands-on technical', status: 'pass' },
  'legal-drafting': { action: 'drafting legal documents', category: 'writing/documentation', status: 'pass' },
  'operations-room': {
    action: 'fashion-style portrait with no visible work activity',
    category: 'portrait/non-work',
    status: 'review',
    note: 'The image shows a person in sunglasses seated against a blank wall, not colleagues collaborating in an operations room; current alt and caption are materially mismatched.',
  },
  'onboarding-across-borders': { action: 'reviewing onboarding documents with a colleague', category: 'coordination/logistics', status: 'pass' },
  'payroll-benefits-review': { action: 'reviewing payroll and benefits records', category: 'analysis/review', status: 'pass' },
  'people-at-work': {
    action: 'abstract building facade with no people visible',
    category: 'place/abstract',
    status: 'review',
    note: 'The image contains no group at a table; current alt and caption claim a working group and should be reviewed or the asset replaced.',
  },
  'quantum-physics-team': { action: 'reviewing precision hardware with a senior colleague', category: 'hands-on technical', status: 'pass' },
  'remote-work': { action: 'working independently at a laptop beside a window', category: 'remote support', status: 'pass' },
  'remote-call-home': { action: 'working from an accessible home office on a call', category: 'remote support', status: 'pass' },
  'service-ai-evaluation': {
    action: 'handing off a packed equipment case',
    category: 'coordination/logistics',
    status: 'review',
    note: 'The visible scene is an equipment handoff, not an African AI researcher evaluating model outputs across three monitors.',
  },
  'service-benefits-consultation': { action: 'comparing benefits on a tablet', category: 'comparison/decision', status: 'pass' },
  'service-benefits-explainer': { action: 'recording a benefits explainer', category: 'presentation/facilitation', status: 'pass' },
  'service-classification-workflow': { action: 'reviewing a secure workflow', category: 'analysis/review', status: 'pass' },
  'service-compensation-calibration': { action: 'calibrating compensation bands on dashboards', category: 'analysis/review', status: 'pass' },
  'service-compliance-control': { action: 'monitoring compliance data', category: 'analysis/review', status: 'pass' },
  'service-contractor-transition': { action: 'conducting a supportive transition call', category: 'remote support', status: 'pass' },
  'service-embedded-api': { action: 'mapping technical architecture on a screen', category: 'technical build', status: 'pass' },
  'service-embedded-workflow': { action: 'testing an integration beside a server rack', category: 'hands-on technical', status: 'pass' },
  'service-entity-market': { action: 'presenting market-entry data', category: 'analysis/review', status: 'pass' },
  'service-entity-office': { action: 'walking through an office space', category: 'coordination/logistics', status: 'pass' },
  'service-eor-advisor': {
    action: 'reviewing an employment workflow on a large display',
    category: 'analysis/review',
    status: 'review',
    note: 'The visible scene is a workflow review by a Black woman, not an East Asian advisor wearing a headset on a client video call.',
  },
  'service-eor-intake': {
    action: 'conducting a headset intake call',
    category: 'remote support',
    status: 'review',
    note: 'The visible scene is an East Asian woman on a headset call, not a Black HR operations lead configuring onboarding on a monitor; this may be paired with service-eor-advisor in reverse.',
  },
  'service-equipment-handoff': {
    action: 'monitoring technical data across three screens',
    category: 'analysis/review',
    status: 'review',
    note: 'The visible scene is a technical monitoring workstation, not an East Asian employee receiving a laptop and equipment kit; this may be paired with service-ai-evaluation in reverse.',
  },
  'service-equity-scenario': { action: 'presenting a compensation scenario', category: 'presentation/facilitation', status: 'pass' },
  'service-hris-architect': { action: 'tracing a data architecture on a display', category: 'analysis/review', status: 'pass' },
  'service-hris-governance': { action: 'reviewing a people-data console', category: 'analysis/review', status: 'pass' },
  'service-identity-verification': { action: 'reviewing a secure identity workflow', category: 'analysis/review', status: 'pass' },
  'service-interview-room': { action: 'setting up a hybrid interview room', category: 'coordination/logistics', status: 'pass' },
  'service-it-cable-room': { action: 'organizing data-center cabling', category: 'hands-on technical', status: 'pass' },
  'service-it-device-imaging': { action: 'testing a workstation and hardware', category: 'hands-on technical', status: 'pass' },
  'service-ml-deployment': {
    action: 'collaborating on precision laboratory equipment',
    category: 'hands-on technical',
    status: 'review',
    note: 'The visible scene is a three-person laboratory calibration activity, not a Black systems engineer monitoring an ML deployment in an operations center; this may be paired with service-science-calibration in reverse.',
  },
  'service-mobility-airport': { action: 'taking a support call while travelling', category: 'remote support', status: 'pass' },
  'service-mobility-map': { action: 'mapping a cross-border relocation', category: 'coordination/logistics', status: 'pass' },
  'service-model-whiteboard': {
    action: 'conducting a technical video interview',
    category: 'remote support',
    status: 'review',
    note: 'The visible scene is a headset interview with a candidate on a laptop, not a Black candidate writing a model architecture on a glass board; this may be paired with service-technical-interview in reverse.',
  },
  'service-payroll-quality': { action: 'reviewing payroll quality data', category: 'analysis/review', status: 'pass' },
  'service-payroll-reconciliation': { action: 'reconciling payroll figures', category: 'analysis/review', status: 'pass' },
  'service-people-ops-desk': { action: 'answering an employee support call', category: 'remote support', status: 'pass' },
  'service-performance-coaching': { action: 'coaching a specialist through milestones', category: 'coaching/development', status: 'pass' },
  'service-quantum-measurement': { action: 'tinkering with precision lab equipment', category: 'hands-on technical', status: 'pass' },
  'service-science-calibration': {
    action: 'reviewing data in a dark monitoring room',
    category: 'analysis/review',
    status: 'review',
    note: 'The visible scene is a single data-monitoring specialist, not a diverse team calibrating sensors on a clean-room test bench; this may be paired with service-ml-deployment in reverse.',
  },
  'specialist-ai-lab': { action: 'collaborating around advanced laboratory equipment', category: 'hands-on technical', status: 'pass' },
  'service-technical-interview': {
    action: 'writing a model architecture on a glass board',
    category: 'technical build',
    status: 'review',
    note: 'The visible scene is a Black technical specialist whiteboarding a model architecture, not a Latina recruiter conducting a video interview; this may be paired with service-model-whiteboard in reverse.',
  },
  'service-timezone-coordination': { action: 'coordinating schedules across time zones', category: 'coordination/logistics', status: 'pass' },
  'service-verification-risk': { action: 'monitoring a verification risk console', category: 'analysis/review', status: 'pass' },
  'team-table': {
    action: 'casual café-style group collaboration',
    category: 'conversation/networking',
    status: 'review',
    note: 'The image is informal and includes casual clothing and sunglasses; it is not a strong fit for the site’s McKinsey/BCG-style corporate posture.',
  },
  'technical-standup': { action: 'facilitating a technical stand-up', category: 'presentation/facilitation', status: 'pass' },
  'trustora-team': { action: 'formal team portrait at a work table', category: 'portrait/team', status: 'pass' },
  'workplace-grid': { action: 'showing varied workplace settings', category: 'place/context', status: 'pass' },
};

const sourceFiles = await walk(mediaRoot);
const sourceAssets = sourceFiles.filter((file) => file.endsWith('.avif')).sort();
const allSourceFiles = await walk(sourceRoot);
const nonAvifRaster = allSourceFiles.filter((file) => /\.(png|jpe?g|webp)$/i.test(file));
const distFiles = await walk(distRoot);
const htmlFiles = distFiles.filter((file) => file.endsWith('.html'));

const sourceHashes = new Map();
for (const file of sourceAssets) {
  const hash = createHash('sha256').update(await readFile(file)).digest('hex');
  if (sourceHashes.has(hash)) failures.push(`duplicate source pixels: ${relative(projectRoot, file)} matches ${sourceHashes.get(hash)}`);
  else sourceHashes.set(hash, relative(projectRoot, file));
}

const assignments = new Map();
const emittedUrls = new Map();
const routeSourceSets = new Map();
const altByStem = new Map();
let figureReferences = 0;
for (const file of htmlFiles) {
  const route = routeFromFile(file);
  if (!route || route === '/404/') continue;
  const html = await readFile(file, 'utf8');
  for (const figure of html.matchAll(/<figure[^>]+data-media-source="([^"]+)"[\s\S]*?<\/figure>/g)) {
    figureReferences += 1;
    const url = figure[1];
    const stem = sourceStem(url);
    const routes = assignments.get(stem) ?? new Set();
    routes.add(route);
    assignments.set(stem, routes);

    if (emittedUrls.has(url)) failures.push(`emitted creative URL repeats: ${url} on ${route} and ${emittedUrls.get(url)}`);
    else emittedUrls.set(url, route);

    const routeSources = routeSourceSets.get(route) ?? new Set();
    if (routeSources.has(stem)) failures.push(`${route}: source creative repeats within route: ${stem}`);
    routeSources.add(stem);
    routeSourceSets.set(route, routeSources);

    const alt = figure[0].match(/<img\b[^>]*\balt="([^"]*)"/)?.[1] ?? '';
    const caption = figure[0].match(/<p class="media-caption"[^>]*>([\s\S]*?)<\/p>/)?.[1]?.replace(/<[^>]+>/g, '').trim() ?? '';
    altByStem.set(stem, { alt, caption });
  }
}

const sourceStems = new Set(sourceAssets.map((file) => file.split('/').pop().replace(/\.avif$/, '')));
const activeStems = new Set(assignments.keys());
const unusedStems = [...sourceStems].filter((stem) => !activeStems.has(stem)).sort();
const missingReview = [...activeStems].filter((stem) => !visualReview[stem]).sort();
const staleReview = Object.keys(visualReview).filter((stem) => !activeStems.has(stem)).sort();
if (missingReview.length) failures.push(`active source(s) missing manual visual review: ${missingReview.join(', ')}`);
if (nonAvifRaster.length) failures.push(`non-AVIF raster source(s): ${nonAvifRaster.map((file) => relative(projectRoot, file)).join(', ')}`);

const categoryCounts = new Map();
for (const stem of activeStems) {
  if (!visualReview[stem]) continue;
  const category = visualReview[stem].category;
  categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
}

const identityTerms = /\b(?:Black|white|African|East Asian|South Asian|Southeast Asian|Middle Eastern|Muslim|Latina)\b/i;
const identityAltStems = [...activeStems].filter((stem) => identityTerms.test(altByStem.get(stem)?.alt ?? '')).sort();
for (const stem of activeStems) {
  if (visualReview[stem]?.status === 'review') warnings.push(`${stem}: ${visualReview[stem].note}`);
}

console.log(`Media audit: ${sourceAssets.length} AVIF source masters; ${activeStems.size} active assignments; ${unusedStems.length} unused masters.`);
console.log(`Uniqueness: ${sourceHashes.size}/${sourceAssets.length} source hashes unique; ${figureReferences} figure references; ${emittedUrls.size} unique emitted creative URLs; ${assignments.size} active stems.`);
console.log(`Raster hygiene: ${nonAvifRaster.length ? 'FAIL' : 'PASS'} — no PNG/JPG/JPEG/WebP raster sources expected.`);
console.log('\nAction/context coverage:');
for (const [category, count] of [...categoryCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) console.log(`- ${category}: ${count}`);
console.log(`\nManual visual review: ${activeStems.size - warnings.length} pass; ${warnings.length} review flags.`);
console.log(`Alt text contains inferred identity descriptors on ${identityAltStems.length}/${activeStems.size} active assignments; review for activity-first accessibility copy.`);
if (staleReview.length) console.log(`Manual review index also covers ${staleReview.length} currently unused source master(s).`);
if (unusedStems.length) console.log(`\nUnused masters: ${unusedStems.join(', ')}`);
if (warnings.length) console.log(`\nReview findings:\n${warnings.map((warning) => `- ${warning}`).join('\n')}`);

if (failures.length) {
  console.error(`\nFailures (${failures.length}):\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log('\n✓ Media assignment, AVIF uniqueness, asset hygiene, and manual review coverage passed.');
