import { Button } from '@/components/ui'

function ToggleRow({ title, description, defaultChecked = false }: { title: string; description: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <div>
        <p className="font-medium text-brand-text">{title}</p>
        <p className="text-sm text-brand-text-muted">{description}</p>
      </div>
      <input type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 rounded border-brand-border text-brand-accent" />
    </label>
  )
}

export function SettingsTab() {
  return (
    <section className="panel p-6 md:p-8">
      <h2 className="text-2xl">Einstellungen</h2>
      <div className="mt-5 space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg">Benachrichtigungen</h3>
          <ToggleRow title="E-Mail-Benachrichtigungen" description="Updates zu Bestellungen per E-Mail erhalten" defaultChecked />
          <ToggleRow title="Newsletter" description="Angebote und Neuigkeiten erhalten" defaultChecked />
          <ToggleRow title="SMS-Benachrichtigungen" description="Versandstatus per SMS erhalten" />
        </div>

        <div className="border-t border-brand-border pt-6">
          <h3 className="text-lg">Datenschutz</h3>
          <div className="mt-4 space-y-4">
            <ToggleRow title="Personalisierte Werbung" description="Relevantere Empfehlungen erhalten" defaultChecked />
            <ToggleRow title="Analysen teilen" description="Hilft bei der Verbesserung des Shops" defaultChecked />
          </div>
        </div>

        <div className="border-t border-brand-border pt-6">
          <h3 className="text-lg text-red-700">Gefahrenzone</h3>
          <p className="mt-2 text-sm text-brand-text-muted">
            Bei Kontolöschung werden alle Daten dauerhaft entfernt.
          </p>
          <Button variant="outline" className="mt-4 border-red-200 text-red-700 hover:bg-red-50">
            Konto löschen
          </Button>
        </div>
      </div>
    </section>
  )
}
