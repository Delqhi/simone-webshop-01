import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui'
import type { Address } from '@/types'

interface AddressesTabProps {
  addresses: Address[]
  onCreate: () => void
  onEdit: (address: Address) => void
}

export function AddressesTab({ addresses, onCreate, onEdit }: AddressesTabProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Meine Adressen</h2>
        <Button onClick={onCreate} leftIcon={<PlusIcon className="h-4 w-4" />}>
          Neue Adresse
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <article key={address.id} className="panel relative p-5">
            {address.isDefault ? (
              <span className="absolute right-4 top-4 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                Standard
              </span>
            ) : null}

            <h3 className="font-semibold text-brand-text">{address.name}</h3>
            <div className="mt-3 space-y-0.5 text-sm text-brand-text-muted">
              <p>{address.street}</p>
              <p>
                {address.postalCode} {address.city}
              </p>
              <p>{address.country}</p>
              {address.phone ? <p className="text-brand-accent">{address.phone}</p> : null}
            </div>

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => onEdit(address)} leftIcon={<PencilIcon className="h-4 w-4" />}>
                Bearbeiten
              </Button>
              <Button size="sm" variant="ghost" className="text-red-700 hover:bg-red-50" leftIcon={<TrashIcon className="h-4 w-4" />}>
                Löschen
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
