'use client'

import { AdminAccessGate, AdminControlPlane } from '@/features/admin'

export default function AdminPage() {
  return (
    <AdminAccessGate>
      <AdminControlPlane />
    </AdminAccessGate>
  )
}
