import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const IGNORE_DIRS = new Set(['.git', 'node_modules', '.next', 'dist', 'build', 'coverage', '.turbo']);
const MAX_BRANCHES_PER_FILE = 120;

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

const targets = walk(ROOT).filter((f) => /\.(ts|tsx|go)$/.test(f.rel));
const violations = [];

for (const t of targets) {
  const src = readFileSync(t.full, 'utf8');
  const branches = (src.match(/\b(if|switch|case|for|while|catch|\?|&&|\|\|)\b/g) || []).length;
  if (branches > MAX_BRANCHES_PER_FILE) {
    violations.push(`${t.rel}: branch tokens ${branches} (max ${MAX_BRANCHES_PER_FILE})`);
  }
}

if (violations.length) {
  console.error('Complexity guard violations:\n' + violations.join('\n'));
  process.exit(1);
}

console.log('Complexity guard passed.');
