'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { CheckCircleIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ONBOARDING_STEPS } from '@/features/admin/onboarding/constants'
import {
  AISetupStep,
  ClawdBotStep,
  CompleteStep,
  DockerStep,
  PaymentStep,
  ShopBasicsStep,
  VercelStep,
  WelcomeStep,
} from '@/features/admin/onboarding/steps'
import type { OnboardingWizardProps, StepProps } from '@/features/admin/onboarding/types'

export default function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = ONBOARDING_STEPS.length

  const handleComplete = () => {
    onComplete()
  }

  const stepProps: StepProps = {
    onNext: () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1)),
    onBack: () => setCurrentStep((prev) => Math.max(prev - 1, 0)),
    onComplete: handleComplete,
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep {...stepProps} />
      case 1:
        return <ShopBasicsStep {...stepProps} />
      case 2:
        return <PaymentStep {...stepProps} />
      case 3:
        return <AISetupStep {...stepProps} />
      case 4:
        return <VercelStep {...stepProps} />
      case 5:
        return <ClawdBotStep {...stepProps} />
      case 6:
        return <DockerStep {...stepProps} />
      case 7:
        return <CompleteStep {...stepProps} onComplete={handleComplete} />
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(246,244,239,0.94)] backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8">
        <header className="mx-auto mb-8 flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-brand-accent" />
            <span className="font-semibold text-brand-text">Setup-Assistent</span>
          </div>
          {onSkip && currentStep < totalSteps - 1 ? (
            <button
              type="button"
              onClick={() => {
                if (confirm('Onboarding wirklich überspringen? Du kannst es später in Einstellungen wiederholen.')) {
                  onSkip()
                }
              }}
              className="flex items-center gap-1 text-brand-text-muted transition-colors hover:text-brand-text"
            >
              <XMarkIcon className="h-5 w-5" /> Überspringen
            </button>
          ) : null}
        </header>

        <section className="mx-auto mb-12 max-w-4xl">
          <div className="flex items-center justify-between">
            {ONBOARDING_STEPS.map((step, index) => (
              <div key={step.name} className="flex flex-col items-center">
                <div
                  className={[
                    'flex h-10 w-10 items-center justify-center rounded-full border transition-all',
                    index < currentStep
                      ? 'border-green-600 bg-green-600 text-white'
                      : index === currentStep
                        ? 'border-brand-accent bg-brand-accent text-white'
                        : 'border-brand-border bg-brand-surface text-brand-text-muted',
                  ].join(' ')}
                >
                  {index < currentStep ? <CheckCircleIcon className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </div>
                <span
                  className={[
                    'mt-2 hidden text-xs md:block',
                    index <= currentStep ? 'text-brand-text' : 'text-brand-text-muted',
                  ].join(' ')}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-brand-border">
            <div
              className="h-full bg-brand-accent transition-all duration-500"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </section>

        <section className="mx-auto max-w-4xl">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </section>
      </div>
    </div>
  )
}
