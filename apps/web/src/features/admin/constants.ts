import type { AdminDomainLink } from './types'

export const ADMIN_DOMAINS: AdminDomainLink[] = [
  {
    title: 'Bestellungen',
    href: '/admin/orders',
    description: 'Statuspflege, Fulfillment-Fehler und operative Priorisierung.',
  },
  {
    title: 'Produkte',
    href: '/admin/products',
    description: 'Preis-/Bestandsqualität und Segment-spezifische Angebotslogik.',
  },
  {
    title: 'Kunden',
    href: '/admin/customers',
    description: 'Support-relevante Kundenkontexte und Wiederbestellmuster.',
  },
  {
    title: 'Lieferanten',
    href: '/admin/suppliers',
    description: 'Lead Times, Zuverlässigkeit und Engpass-Management.',
  },
  {
    title: 'Support',
    href: '/admin/support',
    description: 'Kritische Kontaktpfade und Eskalationsbereitschaft.',
  },
  {
    title: 'Analytics War-Room',
    href: '/admin/analytics',
    description: 'Live-Funnel, Alerts und KPI-Regressionen im Blick.',
  },
  {
    title: 'Trends',
    href: '/admin/trends',
    description: 'Trend-Kandidaten, Freigaben und Launch-Status pro Kanal.',
  },
  {
    title: 'Channels',
    href: '/admin/channels',
    description: 'Verbindungen, Sync-Läufe und Kampagnen-Publishing steuern.',
  },
  {
    title: 'Channel Health',
    href: '/admin/channel-health',
    description: 'Provider-Zustand, Token-Status und Sync-Fehler je Kanal prüfen.',
  },
  {
    title: 'KPI Scorecard',
    href: '/admin/kpi',
    description: 'Weltbest-Gates live gegen Zielwerte monitoren.',
  },
  {
    title: 'Growth Budget',
    href: '/admin/growth',
    description: 'Budget-Caps, Ziel-MER/ROAS und harte Stop-Regeln verwalten.',
  },
  {
    title: 'Revenue Forecast',
    href: '/admin/revenue',
    description: 'Szenarien fuer Sessions, Orders, GMV, MER und CAC transparent simulieren.',
  },
  {
    title: 'Revenue Policy',
    href: '/admin/revenue-policy',
    description: 'Annahmen fuer Conservative/Base/Scale zentral im Admin pflegen.',
  },
  {
    title: 'Creatives',
    href: '/admin/creatives',
    description: 'Creative Assets je Kanal verwalten und Performance-ready halten.',
  },
  {
    title: 'Creators',
    href: '/admin/creators',
    description: 'Creator Pipeline mit Region, Status und Score steuern.',
  },
  {
    title: 'Affiliate Offers',
    href: '/admin/affiliate-offers',
    description: 'Codes und Provisionen fuer Creator/Affiliate skalieren.',
  },
  {
    title: 'Attribution',
    href: '/admin/attribution',
    description: 'Umsatz/Kosten pro Kanal inklusive MER-Übersicht.',
  },
  {
    title: 'Automation',
    href: '/admin/automation',
    description: 'Autopilot-Health, Policy-Grenzen und Replay-Sicherheit prüfen.',
  },
  {
    title: 'Kill Switch',
    href: '/admin/kill-switch',
    description: 'Harte Stopps für Checkout/Sync/Publish zentral steuern.',
  },
]
