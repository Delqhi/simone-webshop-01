'use client'

import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SelectProps } from './Select.types'

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Auswählen...',
  label,
  error,
  disabled,
  className,
}: SelectProps) {
  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={cn('w-full', className)}>
      {label ? <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label> : null}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button
            className={cn(
              'relative w-full rounded-xl border bg-white py-3 pl-4 pr-10 text-left transition-all duration-200 dark:bg-gray-800',
              'focus:outline-none focus:ring-2 focus:ring-fuchsia-500',
              error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <span className={cn('block truncate', selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500')}>
              {selectedOption ? (
                <span className="flex items-center gap-2">
                  {selectedOption.icon}
                  {selectedOption.label}
                </span>
              ) : (
                placeholder
              )}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options
              className={cn(
                'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800',
                'focus:outline-none',
              )}
            >
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={({ active, selected }) =>
                    cn(
                      'relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors',
                      active && 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
                      selected && 'text-fuchsia-600 dark:text-fuchsia-400',
                      !selected && 'text-gray-900 dark:text-white',
                      option.disabled && 'cursor-not-allowed opacity-50',
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={cn('block truncate', selected ? 'font-semibold' : 'font-normal')}>
                        <span className="flex items-center gap-2">
                          {option.icon}
                          {option.label}
                        </span>
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-fuchsia-600 dark:text-fuchsia-400">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error ? <p className="mt-1.5 text-sm text-red-500">{error}</p> : null}
    </div>
  )
}
