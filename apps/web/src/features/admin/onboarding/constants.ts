import {
  CheckCircleIcon,
  CloudIcon,
  CpuChipIcon,
  CreditCardIcon,
  RocketLaunchIcon,
  ServerStackIcon,
  ShoppingBagIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import type { WizardStepMeta } from '@/features/admin/onboarding/types'

export const ONBOARDING_STEPS: WizardStepMeta[] = [
  { name: 'Willkommen', icon: RocketLaunchIcon },
  { name: 'Shop-Basics', icon: ShoppingBagIcon },
  { name: 'Zahlung', icon: CreditCardIcon },
  { name: 'KI-Setup', icon: CpuChipIcon },
  { name: 'Vercel', icon: CloudIcon },
  { name: 'Social', icon: UserGroupIcon },
  { name: 'Docker', icon: ServerStackIcon },
  { name: 'Fertig', icon: CheckCircleIcon },
]

export const DOCKER_SERVICES = [
  { name: 'Next.js App', status: 'running', port: 3000 },
  { name: 'n8n Workflows', status: 'running', port: 5678 },
  { name: 'PostgreSQL', status: 'running', port: 5432 },
  { name: 'Redis Cache', status: 'running', port: 6379 },
] as const

export const CONFETTI_COLORS = ['#d946ef', '#06b6d4', '#8b5cf6', '#f43f5e', '#22c55e']
