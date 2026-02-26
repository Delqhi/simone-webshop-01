# Contracts and Events (War-Room Final)

## Public Web Interfaces

- `GET /api/categories` -> proxy to Go API `GET /api/v1/catalog/categories`
- `GET /api/products/:id` -> proxy to Go API `GET /api/v1/catalog/products/:id`
- `POST /api/checkout/session` -> proxy to Go API `POST /api/v1/checkout/session`
- `GET /api/account/me` -> proxy to Go API `GET /api/v1/account/me`
- `PATCH /api/account/me` -> proxy to Go API `PATCH /api/v1/account/me`
- `POST /api/analytics` -> event ingestion for frontend funnel analytics
- `GET /api/analytics/funnel` -> aggregated funnel metrics (windowed)
- `GET /api/analytics/alerts` -> regression and error-rate alerts
- `GET /api/analytics/experiments` -> A/B exposure and conversion proxy metrics

## Checkout Payload

`POST /api/checkout/session` accepts:

- `email` (required)
- `currency` (required, `EUR`)
- `shipping_method` (required)
- `items[]` with `sku`, `title`, `quantity`, `unit_price_amount` (required)
- `customer_type` (optional, `b2c|b2b`)
- `company_name` (optional)
- `vat_id` (optional)
- `purchase_order_ref` (optional)

## Analytics Event Taxonomy

- `view_product`
- `add_to_cart`
- `begin_checkout`
- `checkout_step_completed`
- `purchase`
- `checkout_error`
- `contact_support_clicked`
- `trust_panel_opened`
- `onboarding_opened`
- `onboarding_completed`
- `onboarding_skipped`

Payload convention:

- `occurredAt` ISO timestamp
- `segment` (`b2c|b2b`) when available
- `route`
- `payload` object with event-specific metadata

## A/B Experiments (initial set)

- `home_hero_copy_v1` -> variants: `control`, `trust`
- `pdp_cta_copy_v1` -> variants: `control`, `benefit`
- `pdp_trust_position_v1` -> variants: `after_cta`, `before_cta`

## Go API Analytics Endpoints

- `POST /api/v1/analytics/events`
- `GET /api/v1/analytics/funnel?hours=24`
- `GET /api/v1/analytics/alerts?hours=2`
- `GET /api/v1/analytics/experiments?hours=24`
- `GET /api/v1/account/me`
- `PATCH /api/v1/account/me`

Alert rules implemented:

- add-to-cart drop > 20% vs previous window
- checkout-step-completed drop > 15% vs previous window
- checkout_error_rate > 3% of begin_checkout
- telemetry_silence when no funnel events in window

## Production Security Contract

- Web fallback flags in production must remain disabled:
  - `NEXT_PUBLIC_WEB_CATALOG_FALLBACK_ENABLED=false`
  - `NEXT_PUBLIC_WEB_ACCOUNT_FALLBACK_ENABLED=false`
- API startup validates:
  - `DATABASE_URL` set
  - `CORS_ALLOWLIST` non-empty and no `*`
  - `SUPABASE_JWKS_URL`, `SUPABASE_ISSUER`, `SUPABASE_AUDIENCE` when JWT required
- JWT-required mode is enforced in production, with role normalization for customer/admin/ops/support access rules.
- `POST /api/v1/checkout/session` supports guest and authenticated checkout; account/admin/order-history endpoints remain JWT protected.
- Admin mutation routes emit structured `audit_mutation` logs including `request_id`, actor id, actor role, method/path/status.
