# Module Boundaries and File Size Policy

## Size limits
- `.tsx` Komponenten: max 180 Zeilen
- `.ts` Hooks/Services: max 220 Zeilen
- `.go` Handler: max 150 Zeilen

## Code ownership
- Jeder Bounded Context besitzt seine Handler und Services.
- Shared Code nur in `packages/*` oder `apps/api/internal/shared`.

## CI guard
- `pnpm guard:lines`
- `pnpm guard:complexity`
