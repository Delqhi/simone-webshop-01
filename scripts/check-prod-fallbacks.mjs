const FALLBACK_FLAGS = [
  'NEXT_PUBLIC_WEB_CATALOG_FALLBACK_ENABLED',
  'NEXT_PUBLIC_WEB_ACCOUNT_FALLBACK_ENABLED',
]

const invalid = FALLBACK_FLAGS.filter((name) => String(process.env[name] || '').toLowerCase() === 'true')

if (invalid.length > 0) {
  console.error('Production fallback validation failed. The following flags must not be true during build/deploy:')
  for (const name of invalid) {
    console.error(`- ${name}=true`)
  }
  process.exit(1)
}

console.log('Fallback env validation passed.')
