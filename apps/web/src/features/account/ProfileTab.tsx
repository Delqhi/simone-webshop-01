import { useEffect, useState, type FormEvent } from 'react'
import { Button, Input } from '@/components/ui'
import { getAuthHeaders } from '@/lib/api/auth'
import type { AccountProfileSource } from '@/features/account/client'
import type { AccountDisplayUser } from '@/features/account/types'

interface ProfileTabProps {
  user: AccountDisplayUser
  state: {
    source: AccountProfileSource
    error: string | null
  }
}

export function ProfileTab({ user, state }: ProfileTabProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setFirstName(user.name.split(' ')[0] || '')
    setLastName(user.name.split(' ')[1] || '')
    setPhone(user.phone || '')
    setSaved(false)
    setSaveError(null)
  }, [user])

  if (state.source === 'unauthorized' && !user.email) {
    return (
      <section className="panel p-6 md:p-8">
        <h2 className="text-2xl">Profil</h2>
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Für Profilinformationen ist ein Login erforderlich.
        </p>
      </section>
    )
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setSaveError(null)
    setSaved(false)

    try {
      const response = await fetch('/api/account/me', {
        method: 'PATCH',
        headers: await getAuthHeaders({
          'content-type': 'application/json',
        }),
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: 'account_update_failed' }))
        throw new Error(payload.error || 'account_update_failed')
      }

      setSaved(true)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'account_update_failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="panel p-6 md:p-8">
      <h2 className="text-2xl">Profil bearbeiten</h2>
      {state.source === 'api_unavailable' ? (
        <p className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700">
          Profil-API aktuell nicht erreichbar{state.error ? ` (${state.error})` : ''}.
        </p>
      ) : null}

      <form className="mt-5 space-y-5" onSubmit={submit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Vorname" value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Vorname eingeben" />
          <Input label="Nachname" value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Nachname eingeben" />
        </div>
        <Input label="E-Mail-Adresse" type="email" defaultValue={user.email} placeholder="E-Mail eingeben" disabled />
        <Input label="Telefonnummer" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Telefonnummer eingeben" />

        <div className="border-t border-brand-border pt-4">
          <h3 className="text-lg">Passwort ändern</h3>
          <div className="mt-3 space-y-3">
            <Input label="Aktuelles Passwort" type="password" placeholder="••••••••" />
            <Input label="Neues Passwort" type="password" placeholder="••••••••" />
            <Input label="Passwort bestätigen" type="password" placeholder="••••••••" />
          </div>
        </div>

        {saveError ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{saveError}</p> : null}
        {saved ? <p className="rounded-xl bg-green-50 px-3 py-2 text-sm text-green-700">Profil gespeichert.</p> : null}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => {
            setFirstName(user.name.split(' ')[0] || '')
            setLastName(user.name.split(' ')[1] || '')
            setPhone(user.phone || '')
            setSaveError(null)
            setSaved(false)
          }}>
            Zurücksetzen
          </Button>
          <Button type="submit" isLoading={saving}>Speichern</Button>
        </div>
      </form>
    </section>
  )
}
