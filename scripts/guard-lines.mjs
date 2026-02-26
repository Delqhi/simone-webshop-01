import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const IGNORE_DIRS = new Set(['.git', 'node_modules', '.next', 'dist', 'build', 'coverage', '.turbo']);
const BASELINE_PATH = join(ROOT, 'scripts', 'guard-lines-baseline.json');
const RULES = [
  { ext: '.tsx', max: 180 },
  { ext: '.ts', max: 220 },
  { ext: '.go', max: 150 }
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = full.replace(`${ROOT}/`, '');
    const st = statSync(full);
    if (st.isDirectory()) {
      if (IGNORE_DIRS.has(entry)) continue;
      walk(full, out);
    } else {
      out.push({ full, rel });
    }
  }
  return out;
}

const files = walk(ROOT);
const violations = [];
let baseline = {};

try {
  baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
} catch (_err) {
  baseline = {};
}

for (const f of files) {
  const rule = RULES.find((r) => f.rel.endsWith(r.ext));
  if (!rule) continue;
  const lines = readFileSync(f.full, 'utf8').split(/\r?\n/).length;
  const baselineLimit = baseline[f.rel];
  if (typeof baselineLimit === 'number' && lines <= baselineLimit) {
    continue;
  }
  if (lines > rule.max) {
    const maxInfo = typeof baselineLimit === 'number'
      ? `baseline ${baselineLimit} / rule ${rule.max}`
      : `rule ${rule.max}`;
    violations.push(`${f.rel}: ${lines} lines (${maxInfo})`);
  }
}

if (violations.length) {
  console.error('Line guard violations:\n' + violations.join('\n'));
  process.exit(1);
}

console.log('Line guard passed.');
