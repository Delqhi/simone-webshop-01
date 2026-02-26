'use client'

type ExperimentItem = {
  experimentId: string
  variant: string
  exposures: number
  checkoutStarts: number
  purchases: number
  checkoutConversionPct: number
  purchaseConversionPct: number
}

interface ExperimentPanelProps {
  items: ExperimentItem[]
  loading: boolean
}

export function ExperimentPanel({ items, loading }: ExperimentPanelProps) {
  return (
    <article className="panel p-5">
      <h2 className="text-xl">A/B Experiments (24h)</h2>
      {loading ? <p className="mt-2 text-sm text-brand-text-muted">Lade Experimente…</p> : null}
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={`${item.experimentId}:${item.variant}`} className="rounded-xl border border-brand-border bg-brand-surface px-3 py-2 text-sm">
            <p className="font-semibold text-brand-text">
              {item.experimentId} · {item.variant}
            </p>
            <p className="text-brand-text-muted">
              Exposures: {item.exposures} · Checkout: {item.checkoutStarts} ({item.checkoutConversionPct.toFixed(1)}%) · Purchases: {item.purchases} ({item.purchaseConversionPct.toFixed(1)}%)
            </p>
          </div>
        ))}
        {!loading && items.length === 0 ? <p className="text-sm text-brand-text-muted">Keine Experiment-Daten im gewählten Fenster.</p> : null}
      </div>
    </article>
  )
}
