# Vercel Project Record

## Fixed Project (Do Not Replace)
- Scope: `info-zukunftsories-projects`
- Project name: `web`
- Project ID: `prj_wQy1bo2HlQSRifrnaQTZjQRqr9zg`
- Org ID: `team_VTipbYr7L5qhqXdu38e0Z0OL`
- Local link file: `apps/web/.vercel/project.json`
- Current production domain: `none (new project created on 26.02.2026)`

## Hard Rule
- This repo is now linked to the recreated project `info-zukunftsories-projects/web`.
- Keep using this project for all future deploys.

## Standard Redeploy
```bash
cd apps/web
vercel link --project web --scope info-zukunftsories-projects --yes
vercel deploy -y --scope info-zukunftsories-projects
```

## Latest Deployment
- Timestamp (CET): `2026-02-26 21:43`
- Status: `BLOCKED`
- Reason: `api-deployments-free-per-day` (Vercel free deployment quota reached)
- Retry window from CLI: `~9 hours`

## Notes
- Old project `prj_lVZswXfsyRAwcfa9AigZ9C9AMFK9` was removed and recreated as `prj_wQy1bo2HlQSRifrnaQTZjQRqr9zg`.
- `apps/web` is deployed directly.
- `apps/web/vercel.json` intentionally has no secret references to avoid blocked deploys from missing Vercel secrets.
- `apps/web/src/contracts/*` contains the currently required shared contracts so standalone `apps/web` deploys resolve `@simone/contracts` reliably.
