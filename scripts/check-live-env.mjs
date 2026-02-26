#!/usr/bin/env node

const withSmoke = process.argv.includes('--with-smoke')
const failures = []
const warnings = []

const PLACEHOLDER_SNIPPETS = [
  'CHANGE_ME',
  'YOUR_PROJECT',
  'YOUR_DOMAIN',
  'your-project',
  'your-domain',
  '<admin_jwt>',
  'sk_live_xxx',
  'pk_live_xxx',
  'whsec_xxx',
  'oc_live_xxx',
  'BASE64_ENCODED_SERVICE_ACCOUNT_JSON',
  'n8n.example.com',
  'example.com',
]

function valueOf(name) {
  return String(process.env[name] || '').trim()
}

function pushFailure(message) {
  failures.push(message)
}

function requireValue(name) {
  const value = valueOf(name)
  if (!value) {
    pushFailure(`${name} is required`)
  }
  return value
}

function validateNoPlaceholder(name, value) {
  if (!value) {
    return
  }
  const hit = PLACEHOLDER_SNIPPETS.find((snippet) => value.includes(snippet))
  if (hit) {
    pushFailure(`${name} looks like a placeholder value (${hit})`)
  }
}

function validateURL(name, value, options = {}) {
  if (!value) {
    return null
  }

  let parsed
  try {
    parsed = new URL(value)
  } catch (error) {
    pushFailure(`${name} must be a valid URL (${error instanceof Error ? error.message : String(error)})`)
    return null
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    pushFailure(`${name} must use http:// or https://`)
    return null
  }

  if (options.disallowLocalhost) {
    const host = parsed.hostname.toLowerCase()
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
      pushFailure(`${name} must not point to localhost for go-live`)
    }
  }

  return parsed
}

function validateDatabaseURL(value) {
  if (!value) {
    return
  }
  let parsed
  try {
    parsed = new URL(value)
  } catch (error) {
    pushFailure(`DATABASE_URL must be a valid URL (${error instanceof Error ? error.message : String(error)})`)
    return
  }
  if (parsed.protocol !== 'postgres:' && parsed.protocol !== 'postgresql:') {
    pushFailure('DATABASE_URL must use postgres:// or postgresql://')
  }
}

function validateCSVOrigins(name, value) {
  if (!value) {
    return
  }
  const origins = value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

  if (origins.length === 0) {
    pushFailure(`${name} must contain at least one origin`)
    return
  }

  for (const origin of origins) {
    validateURL(`${name} origin "${origin}"`, origin, { disallowLocalhost: true })
  }
}

function validateEmailish(name, value) {
  if (!value) {
    return
  }
  if (!value.includes('@')) {
    pushFailure(`${name} must contain an email address`)
  }
}

const databaseURL = requireValue('DATABASE_URL')
validateNoPlaceholder('DATABASE_URL', databaseURL)
validateDatabaseURL(databaseURL)

const corsAllowlist = requireValue('CORS_ALLOWLIST')
validateNoPlaceholder('CORS_ALLOWLIST', corsAllowlist)
validateCSVOrigins('CORS_ALLOWLIST', corsAllowlist)

const siteURL = requireValue('SITE_URL')
validateNoPlaceholder('SITE_URL', siteURL)
validateURL('SITE_URL', siteURL, { disallowLocalhost: true })

const supplierWebhookSecret = requireValue('SUPPLIER_WEBHOOK_SECRET')
validateNoPlaceholder('SUPPLIER_WEBHOOK_SECRET', supplierWebhookSecret)

const stripeSecret = requireValue('STRIPE_SECRET_KEY')
validateNoPlaceholder('STRIPE_SECRET_KEY', stripeSecret)

const stripeWebhookSecret = requireValue('STRIPE_WEBHOOK_SECRET')
validateNoPlaceholder('STRIPE_WEBHOOK_SECRET', stripeWebhookSecret)

const apiProxyURL = valueOf('INTERNAL_API_URL') || valueOf('NEXT_PUBLIC_API_URL')
if (!apiProxyURL) {
  pushFailure('INTERNAL_API_URL or NEXT_PUBLIC_API_URL is required for web API proxy routes')
} else {
  validateURL('INTERNAL_API_URL/NEXT_PUBLIC_API_URL', apiProxyURL)
  validateNoPlaceholder('INTERNAL_API_URL/NEXT_PUBLIC_API_URL', apiProxyURL)
}

const supabaseURL = valueOf('SUPABASE_URL')
const supabaseJWKS = valueOf('SUPABASE_JWKS_URL')
const supabaseIssuer = valueOf('SUPABASE_ISSUER')

if (!supabaseURL && (!supabaseJWKS || !supabaseIssuer)) {
  pushFailure('Provide SUPABASE_URL or both SUPABASE_JWKS_URL and SUPABASE_ISSUER')
}
if (supabaseURL) {
  validateURL('SUPABASE_URL', supabaseURL)
  validateNoPlaceholder('SUPABASE_URL', supabaseURL)
}
if (supabaseJWKS) {
  validateURL('SUPABASE_JWKS_URL', supabaseJWKS)
}
if (supabaseIssuer) {
  validateURL('SUPABASE_ISSUER', supabaseIssuer)
}

const gsaJSONB64 = valueOf('GOOGLE_SERVICE_ACCOUNT_JSON_B64')
const gsaFile = valueOf('GOOGLE_SERVICE_ACCOUNT_FILE')
if (!gsaJSONB64 && !gsaFile) {
  pushFailure('GOOGLE_SERVICE_ACCOUNT_JSON_B64 or GOOGLE_SERVICE_ACCOUNT_FILE is required')
}
validateNoPlaceholder('GOOGLE_SERVICE_ACCOUNT_JSON_B64', gsaJSONB64)

const gmailDelegatedUser = requireValue('GMAIL_DELEGATED_USER')
validateNoPlaceholder('GMAIL_DELEGATED_USER', gmailDelegatedUser)
validateEmailish('GMAIL_DELEGATED_USER', gmailDelegatedUser)

const gmailSenderFrom = requireValue('GMAIL_SENDER_FROM')
validateNoPlaceholder('GMAIL_SENDER_FROM', gmailSenderFrom)
validateEmailish('GMAIL_SENDER_FROM', gmailSenderFrom)

const billingCompany = requireValue('BILLING_COMPANY_NAME')
validateNoPlaceholder('BILLING_COMPANY_NAME', billingCompany)

const billingAddress = requireValue('BILLING_ADDRESS')
validateNoPlaceholder('BILLING_ADDRESS', billingAddress)

const billingTaxID = requireValue('BILLING_TAX_ID')
validateNoPlaceholder('BILLING_TAX_ID', billingTaxID)

const billingVATID = requireValue('BILLING_VAT_ID')
validateNoPlaceholder('BILLING_VAT_ID', billingVATID)

const gmailAPIBase = valueOf('GMAIL_API_BASE_URL')
if (gmailAPIBase) {
  validateURL('GMAIL_API_BASE_URL', gmailAPIBase)
}

if (withSmoke) {
  const apiBase = requireValue('API_BASE_URL')
  validateNoPlaceholder('API_BASE_URL', apiBase)
  validateURL('API_BASE_URL', apiBase)

  const adminBearerToken = requireValue('ADMIN_BEARER_TOKEN')
  validateNoPlaceholder('ADMIN_BEARER_TOKEN', adminBearerToken)
  if (adminBearerToken && adminBearerToken.length < 20) {
    warnings.push('ADMIN_BEARER_TOKEN looks unusually short')
  }
}

if (warnings.length > 0) {
  console.warn('Live environment warnings:')
  for (const warning of warnings) {
    console.warn(`- ${warning}`)
  }
}

if (failures.length > 0) {
  console.error(`Live environment check failed (${failures.length} issue${failures.length === 1 ? '' : 's'}):`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

const modeLabel = withSmoke ? 'runtime+smoke' : 'runtime'
console.log(`Live environment check passed (${modeLabel}).`)
