import type { ComponentType, SVGProps } from 'react'

export interface OnboardingWizardProps {
  onComplete: () => void
  onSkip?: () => void
}

export interface StepProps {
  onNext: () => void
  onBack?: () => void
  onComplete?: () => void
}

export interface WizardStepMeta {
  name: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}
