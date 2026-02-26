import { existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const APP_DIR = join(ROOT, 'apps', 'web', 'src', 'app')

const NAV_FOOTER_LINKS = [
  '/',
  '/products',
  '/products?segment=b2b',
  '/products?segment=b2c',
  '/kontakt',
  '/cart',
  '/faq',
  '/versand',
  '/rueckgabe',
  '/impressum',
  '/datenschutz',
  '/agb',
  '/widerrufsrecht',
  '/account',
]

function routeExists(route) {
  const pathname = route.split('?')[0]
  if (pathname === '/') {
    return existsSync(join(APP_DIR, 'page.tsx'))
  }
  const targetDir = join(APP_DIR, pathname.slice(1))
  return (
    existsSync(join(targetDir, 'page.tsx')) ||
    existsSync(join(targetDir, 'route.ts')) ||
    existsSync(join(targetDir, 'layout.tsx'))
  )
}

const missing = NAV_FOOTER_LINKS.filter((route) => !routeExists(route))

if (missing.length > 0) {
  console.error('Broken route gate failed. Missing route files:')
  for (const route of missing) {
    console.error(`- ${route}`)
  }
  process.exit(1)
}

console.log(`Route gate passed for ${NAV_FOOTER_LINKS.length} navigation/footer targets.`)
