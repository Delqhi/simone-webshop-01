# ADR-0004: Security Model

## Status
Accepted

## Decision
- JWT-Validierung über JWKS (Supabase issuer/audience).
- RBAC Rollen: `admin`, `ops`, `support`, `customer`.
- CORS via Allowlist (kein `*`).
- Service-Role-Keys niemals in clientseitigen Flows.
- Idempotency-Key für kritische write operations (Checkout/Webhook).
