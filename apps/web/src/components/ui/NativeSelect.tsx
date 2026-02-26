'use client'

import { cn } from '@/lib/utils'
import type { NativeSelectProps } from './Select.types'

export function NativeSelect({ options, label, error, className, ...props }: NativeSelectProps) {
  return (
    <div className="w-full">
      {label ? <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label> : null}
      <select
        className={cn(
          'w-full rounded-xl border bg-white px-4 py-3 text-gray-900 transition-all duration-200 dark:bg-gray-800 dark:text-white',
          'focus:outline-none focus:ring-2 focus:ring-fuchsia-500',
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1.5 text-sm text-red-500">{error}</p> : null}
    </div>
  )
}
