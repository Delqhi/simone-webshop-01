'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Menu, Search, ShoppingBag, Sparkles, User, X } from 'lucide-react'
import { PromotionBannerStrip } from '@/features/promotions'
import { SegmentSwitch } from '@/features/segment'
import { useCustomerSegmentStore } from '@/features/segment/store'
import { useCartStore, useUIStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Start', href: '/' },
  { label: 'Produkte', href: '/products' },
  { label: 'B2B', href: '/products', segment: 'b2b' as const },
  { label: 'Service', href: '/kontakt' },
]

const MOBILE_CTA_ITEMS = [
  { label: 'Produkte', href: '/products' },
  { label: 'Warenkorb', href: '/cart' },
  { label: 'Support', href: '/kontakt' },
  { label: 'Konto', href: '/account' },
]

export function Navbar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { itemCount } = useCartStore()
  const { segment } = useCustomerSegmentStore()
  const { toggleCart, toggleMobileMenu, closeMobileMenu, isMobileMenuOpen } = useUIStore()

  const activeSegment = searchParams.get('segment')
  const isNavItemActive = (href: string, requiredSegment?: 'b2b' | 'b2c') => {
    if (pathname !== href) {
      return false
    }
    if (!requiredSegment) {
      return !activeSegment
    }
    return activeSegment === requiredSegment
  }

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-surface/90 backdrop-blur-xl">
      <div className="border-b border-brand-border/60 bg-brand-bg-muted/55">
        <div className="shell-container flex min-h-[2.25rem] items-center justify-between gap-3 text-xs text-brand-text-muted">
          <p>Lieferung in DACH in 2-4 Werktagen</p>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full border border-brand-border bg-white/85 px-2 py-0.5">30 Tage Rückgabe</span>
            <span className="rounded-full border border-brand-border bg-white/85 px-2 py-0.5">Support innerhalb 24h</span>
          </div>
        </div>
      </div>
      <PromotionBannerStrip placement="header" segment={segment} variant="header" className="border-b border-brand-border/60" />

      <div className="shell-container">
        <div className="flex min-h-[4.8rem] items-center gap-3">
          <Link href="/" className="mr-2 inline-flex items-center gap-2" onClick={closeMobileMenu}>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border-strong bg-white text-sm font-semibold text-brand-accent">
              SS
            </span>
            <span className="leading-none">
              <span className="block text-base font-semibold text-brand-text">Simone Shop</span>
              <span className="block text-[0.68rem] uppercase tracking-[0.18em] text-brand-text-muted">Premium Commerce</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = isNavItemActive(item.href, item.segment)
              return (
                <Link
                  key={`${item.href}:${item.segment || 'all'}`}
                  href={item.segment ? `${item.href}?segment=${item.segment}` : item.href}
                  className={cn(
                    'rounded-full px-3 py-2 text-sm font-semibold transition-all',
                    active
                      ? 'border border-brand-border-strong bg-white text-brand-text shadow-sm'
                      : 'text-brand-text-muted hover:bg-white/70 hover:text-brand-text',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Link
              href="/products"
              className="inline-flex items-center gap-1 rounded-full border border-brand-border px-3 py-1.5 text-xs font-semibold text-brand-text hover:border-brand-accent hover:text-brand-accent"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Neuheiten
            </Link>
            <SegmentSwitch />
          </div>

          <div className="ml-auto flex items-center gap-1 md:ml-4">
            <Link
              href="/products"
              aria-label="Produkte durchsuchen"
              className="rounded-lg p-2 text-brand-text-muted transition-colors hover:bg-brand-bg-muted hover:text-brand-text"
            >
              <Search className="h-5 w-5" />
            </Link>
            <button
              type="button"
              aria-label="Warenkorb öffnen"
              onClick={toggleCart}
              className="relative rounded-lg p-2 text-brand-text-muted transition-colors hover:bg-brand-bg-muted hover:text-brand-text"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-accent px-1 text-xs font-semibold text-white">
                  {itemCount}
                </span>
              ) : null}
            </button>
            <Link
              href="/account"
              aria-label="Konto"
              className="rounded-lg p-2 text-brand-text-muted transition-colors hover:bg-brand-bg-muted hover:text-brand-text"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="rounded-lg p-2 text-brand-text-muted transition-colors hover:bg-brand-bg-muted hover:text-brand-text md:hidden"
              aria-label="Menü öffnen"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen ? (
          <div className="animate-slide-down space-y-3 border-t border-brand-border py-4 md:hidden">
            <SegmentSwitch className="w-full justify-center" />
            <nav className="grid gap-1 rounded-2xl border border-brand-border bg-white/75 p-2">
              {MOBILE_CTA_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-brand-text-muted hover:bg-brand-bg-muted hover:text-brand-text"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  )
}
