# Cloudflare Deployment Record

Stand: **26.02.2026**

## Canonical Production Target

- Platform: `Cloudflare Workers`
- Worker name: `simone-worldbest-shop`
- Account subdomain: `aquawild-station.workers.dev` (technical endpoint, currently not primary)
- Production route: `delqhi.com/*` -> `simone-worldbest-shop`
- Live URL: `https://delqhi.com`

## Deploy Command

```bash
cd /Users/jeremy/dev/projects/family-projects/simone-webshop-01
pnpm deploy:cloudflare
```

## Runtime Endpoints

- `/` -> storefront landing
- `/health` -> runtime status JSON
- `/api/products` -> product payload JSON

## Auth Strategy

- Primary: `CLOUDFLARE_API_TOKEN` environment variable
- Fallback: Wrangler OAuth token from `~/Library/Preferences/.wrangler/config/default.toml`

## Notes

- `workers.dev` can return account-level `1042` on this setup; deploy script falls back to zone route deployment and validates `https://delqhi.com/health`.
