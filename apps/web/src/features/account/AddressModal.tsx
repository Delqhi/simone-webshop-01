import { Button, Input, Modal } from '@/components/ui'
import type { Address } from '@/types'

interface AddressModalProps {
  open: boolean
  editingAddress: Address | null
  onClose: () => void
}

export function AddressModal({ open, editingAddress, onClose }: AddressModalProps) {
  return (
    <Modal isOpen={open} onClose={onClose} title={editingAddress ? 'Adresse bearbeiten' : 'Neue Adresse hinzufügen'}>
      <form className="space-y-4">
        <Input label="Bezeichnung" placeholder="z. B. Zuhause, Büro" defaultValue={editingAddress?.name} />
        <Input label="Straße und Hausnummer" placeholder="Musterstraße 123" defaultValue={editingAddress?.street} />

        <div className="grid grid-cols-2 gap-3">
          <Input label="PLZ" placeholder="10115" defaultValue={editingAddress?.postalCode} />
          <Input label="Stadt" placeholder="Berlin" defaultValue={editingAddress?.city} />
        </div>

        <Input label="Land" placeholder="Deutschland" defaultValue={editingAddress?.country} />
        <Input label="Telefon (optional)" type="tel" placeholder="+49 30 12345678" defaultValue={editingAddress?.phone} />

        <label className="flex items-center gap-2 text-sm text-brand-text">
          <input type="checkbox" defaultChecked={editingAddress?.isDefault} className="h-4 w-4 rounded border-brand-border text-brand-accent" />
          Als Standardadresse festlegen
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Abbrechen
          </Button>
          <Button type="submit">{editingAddress ? 'Speichern' : 'Hinzufügen'}</Button>
        </div>
      </form>
    </Modal>
  )
}
