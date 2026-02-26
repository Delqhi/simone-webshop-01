# Vercel Project Record

## Fixed Project (Do Not Replace)
- Scope: `info-zukunftsories-projects`
- Project name: `web`
- Project ID: `prj_lVZswXfsyRAwcfa9AigZ9C9AMFK9`
- Org ID: `team_VTipbYr7L5qhqXdu38e0Z0OL`
- Local link file: `apps/web/.vercel/project.json`
- Current production domain: `https://web-cyan-three-26.vercel.app`

## Hard Rule
- Never create a new Vercel project for this repo.
- Always redeploy the existing project: `info-zukunftsories-projects/web`.

## Standard Redeploy
```bash
cd apps/web
vercel link --project web --scope info-zukunftsories-projects --yes
vercel deploy -y --scope info-zukunftsories-projects
```

## Latest Deployment
- Timestamp (UTC): `2026-02-26T17:48:43Z`
- Preview URL: `https://web-bz2li3l6m-info-zukunftsories-projects.vercel.app`
- Inspect URL: `https://vercel.com/info-zukunftsories-projects/web/CN9EUy2ST5QpveVmqqP6cXSRRmJ7`
- Build status: `READY`

## Notes
- `apps/web` is deployed directly.
- `apps/web/vercel.json` intentionally has no secret references to avoid blocked deploys from missing Vercel secrets.
- `apps/web/src/contracts/*` contains the currently required shared contracts so standalone `apps/web` deploys resolve `@simone/contracts` reliably.
