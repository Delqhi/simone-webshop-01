import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const baselinePath = join(process.cwd(), 'scripts', 'guard-lines-baseline.json')

let baseline
try {
  baseline = JSON.parse(readFileSync(baselinePath, 'utf8'))
} catch (error) {
  console.error(`Failed to read baseline file at ${baselinePath}:`, error)
  process.exit(1)
}

const keys = Object.keys(baseline || {})
if (keys.length > 0) {
  console.error('guard-lines baseline must be empty. Remove entries before merging.')
  console.error(keys.map((key) => `- ${key}: ${baseline[key]}`).join('\n'))
  process.exit(1)
}

console.log('Baseline guard passed (no exceptions).')
