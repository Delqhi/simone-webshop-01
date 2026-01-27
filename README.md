# 🛍️ SIMONE-WEBSHOP-01

**Vollautomatisierter KI-Dropshipping-Shop für Simone Schulze**

> Besser als Shopify - Vollständig KI-gesteuert mit n8n Workflow-Automatisierung

---

## 📜 LIZENZ & NUTZUNGSBEDINGUNGEN

⚠️ **WICHTIG: Dieses Projekt unterliegt der Delqhi Proprietary License.**

| Was ist erlaubt? | Was ist NICHT erlaubt? |
|------------------|------------------------|
| ✅ Shop nutzen & betreiben | ❌ Quellcode einsehen |
| ✅ Produkte verkaufen | ❌ Quellcode weitergeben |
| ✅ KI-Features nutzen (mit Abo) | ❌ Template kopieren/weiterverkaufen |
| ✅ Support kontaktieren | ❌ Reverse Engineering |

**Quellcode-Lizenz**: €80.000 (einmalig) - Kontakt: legal@delqhi.com

Siehe [LICENSE.md](./LICENSE.md) für vollständige Lizenzbedingungen.

---

## 🎯 FEATURES

### Shop-Frontend
- ✅ Modernes Dark-Mode Design (Fuchsia/Cyan)
- ✅ Produktkatalog mit Kategorien & Filter
- ✅ Warenkorb mit Slide-Drawer
- ✅ Checkout mit Stripe, PayPal, Klarna
- ✅ Kundenkonto & Bestellhistorie
- ✅ KI-Chat-Assistent (24/7)

### Vollautomatisierung
- ✅ **Lieferanten-Recherche**: KI findet automatisch die besten Lieferanten
- ✅ **Trend-Analyse**: Täglich beste Produkte identifizieren
- ✅ **Automatische Bestellungen**: Kunde bestellt → Lieferant erhält Order
- ✅ **Zahlungsabwicklung**: Stripe + PayPal + Klarna
- ✅ **Rechnungen**: Automatische Generierung & Versand
- ✅ **Kundenservice**: KI-Chat beantwortet 80% der Fragen
- ✅ **Social Media**: Automatische Posts auf allen Plattformen

### Admin Dashboard (11 Tabs)
| Tab | Features |
|-----|----------|
| Dashboard | Stats, Recent Orders, Pending Suppliers |
| Bestellungen | Order Management mit Filtern |
| Produkte | Product CRUD, AI Import |
| Kunden | Customer Management |
| Lieferanten | Supplier Approval/Reject |
| Analytik | Revenue, Conversion Stats |
| Workflows | Embedded n8n Editor |
| Seiten | Legal Pages (Impressum, AGB) |
| Blog | Blog Posts mit SEO |
| Aktionen | Rabattcodes, Flash Sales |
| Einstellungen | Shop Config, AI Config |

### Integrationen
| Integration | Status | Beschreibung |
|-------------|--------|--------------|
| n8n | ✅ | 10+ Workflows für Vollautomatisierung |
| Stripe | ✅ | Kreditkarten, Apple Pay, Google Pay |
| PayPal | ✅ | Klassische PayPal-Zahlung |
| Klarna | ✅ | Kauf auf Rechnung, Ratenzahlung |
| ClawdBot | ✅ | Social Media Automation |
| Supabase | ✅ | PostgreSQL Database |
| Vercel | ✅ | Serverless Deployment |

---

## 🚀 DEPLOYMENT

### Option 1: Vercel (Empfohlen)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Delqhi/simone-webshop-01)

**Automatisches Vercel Deployment:**

```bash
# 1. Vercel CLI installieren
npm i -g vercel

# 2. Einloggen
vercel login

# 3. Deployen
vercel --prod

# 4. Environment Variables setzen (im Vercel Dashboard)
# - OPENCODE_API_KEY
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - STRIPE_SECRET_KEY
# - NEXT_PUBLIC_STRIPE_PUBLIC_KEY
```

**Vercel Environment Variables:**
| Variable | Beschreibung | Erforderlich |
|----------|--------------|--------------|
| `OPENCODE_API_KEY` | OpenCode Zen API Key | ✅ |
| `SUPABASE_URL` | Supabase Project URL | ✅ |
| `SUPABASE_ANON_KEY` | Supabase Anonymous Key | ✅ |
| `STRIPE_SECRET_KEY` | Stripe Secret Key | Optional |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe Public Key | Optional |
| `PAYPAL_CLIENT_ID` | PayPal Client ID | Optional |
| `CLAWDBOT_WEBHOOK_URL` | ClawdBot Webhook | Optional |

### Option 2: Docker (Self-Hosted)

```bash
# 1. Docker Compose starten
docker-compose up -d

# 2. Zugriff
# Shop: http://localhost:3000
# Admin: http://localhost:3000/admin
# n8n: http://localhost:5678
```

### Option 3: Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Development Server
npm run dev

# Production Build
npm run build && npm start
```

---

## 💰 PREISMODELL

### Einmalige Zahlung
| Posten | Preis |
|--------|-------|
| Shop-Einrichtung | €350 |
| **Gesamt (einmalig)** | **€350** |

### Monatliches Abo (nach 30-Tage-Test)
| Service | Preis/Monat |
|---------|-------------|
| KI-Services (Chat, Research) | €49 |
| Docker-Container & n8n | €29 |
| ClawdBot Social Media | €20 |
| **Gesamt/Monat** | **€98** |

### Was passiert ohne Abo?
Nach Ablauf der 30-Tage-Testphase:
- ❌ KI-Chat wird deaktiviert
- ❌ Automatische Lieferanten-Recherche stoppt
- ❌ Social Media Automation stoppt
- ❌ n8n Workflows werden pausiert
- ✅ Shop bleibt online (nur Anzeige)
- ✅ Bestandsdaten bleiben erhalten

---

## 📁 PROJEKTSTRUKTUR

```
simone-webshop-01/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/          # 18 Admin API endpoints
│   │   │   ├── ai/chat/        # Customer AI chat
│   │   │   └── webhooks/       # Stripe, ClawdBot
│   │   ├── admin/              # Admin Dashboard (11 tabs)
│   │   ├── products/           # Product pages
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout flow
│   │   └── account/            # Customer account
│   ├── components/
│   │   ├── ui/                 # Button, Card, Input, etc.
│   │   ├── ai/                 # AI Chat Widget
│   │   ├── admin/              # Admin components (Onboarding)
│   │   ├── products/           # Product components
│   │   └── layout/             # Navbar, Footer, CartDrawer
│   ├── lib/                    # Supabase, Store, Utils
│   └── types/                  # TypeScript types
├── n8n-workflows/              # 10 pre-built workflows
├── supabase/                   # Database schema
├── .clawdbot/                  # Social media config
├── docker-compose.yml          # Full stack Docker
├── vercel.json                 # Vercel configuration
├── LICENSE.md                  # Delqhi Proprietary License
└── README.md                   # This file
```

---

## ⚙️ KONFIGURATION

### Benötigte API-Keys (100% KOSTENLOS)

| API | Zweck | Kosten | Link |
|-----|-------|--------|------|
| OpenCode Zen | KI-Chat | ✅ FREE | api.opencode.ai |
| Mistral | Vision/Fallback | ✅ FREE | console.mistral.ai |
| Groq | Fast AI | ✅ FREE | console.groq.com |
| Gemini | Vision/Voice | ✅ FREE | makersuite.google.com |
| Supabase | Database | ✅ FREE | supabase.com |

### Zahlungsanbieter (Pay-per-use)

| Anbieter | Gebühr |
|----------|--------|
| Stripe | 1.4% + €0.25 |
| PayPal | 2.49% + €0.35 |
| Klarna | Nach Vereinbarung |

---

## 🤖 KI-AGENTEN

### 1. Kundenservice-Agent
- 24/7 aktiv im Chat
- Beantwortet 80% der Fragen automatisch
- Eskaliert komplexe Fälle an Support
- Provider: OpenCode Zen (grok-code)

### 2. Lieferanten-Recherche
- Läuft täglich um 6:00 Uhr
- Sucht neue Dropshipping-Lieferanten
- Speichert zur Genehmigung im Dashboard

### 3. Trend-Analyse
- Analysiert TikTok, Google Trends
- Aktualisiert Trending-Score der Produkte
- Empfiehlt neue Produkte

### 4. Social Media Agent
- Erstellt automatische Posts
- Postet auf Instagram, TikTok, Facebook
- Beantwortet Kommentare

---

## 📊 ADMIN DASHBOARD

### 11-Tab Dashboard
1. **Dashboard** - Übersicht, Stats, Schnellaktionen
2. **Bestellungen** - Alle Orders mit Filter/Export
3. **Produkte** - Product Management
4. **Kunden** - Customer Database
5. **Lieferanten** - Supplier Management
6. **Analytik** - Revenue, Conversion, Charts
7. **Workflows** - Embedded n8n Editor
8. **Seiten** - Impressum, AGB, Datenschutz
9. **Blog** - SEO-optimierte Blog Posts
10. **Aktionen** - Rabattcodes, Flash Sales
11. **Einstellungen** - Shop, Payment, AI Config

### Onboarding Wizard
Beim ersten Login startet automatisch ein geführtes Onboarding:
- Shop-Grundlagen einrichten
- Zahlungsanbieter verbinden
- KI-Konfiguration (One-Click)
- Vercel Deployment
- ClawdBot Social Media
- Docker Services prüfen

---

## 🔧 WARTUNG

### Logs anzeigen
```bash
# Docker Logs
docker-compose logs -f

# Vercel Logs
vercel logs --follow
```

### Dienste neustarten
```bash
# Docker
docker-compose down && docker-compose up -d

# Vercel (Redeploy)
vercel --prod --force
```

### Datenbank-Backup
```bash
# Supabase Dashboard → Database → Backups
# Oder via pg_dump
```

---

## 📞 SUPPORT

Bei Fragen oder Problemen:
- 📧 E-Mail: support@delqhi.com
- 💬 Chat: Im Admin-Dashboard
- 📚 Docs: https://docs.delqhi.com

---

## 🔗 LINKS

- 🌐 **Live Shop**: https://simone-shop.vercel.app
- 📊 **Admin**: https://simone-shop.vercel.app/admin
- 📦 **Template Info**: https://template.delqhi.com/webshop
- 📜 **License**: [LICENSE.md](./LICENSE.md)

---

**Version:** 2.0.0  
**Erstellt für:** Simone Schulze  
**Datum:** Januar 2026  
**Powered by:** Delqhi GmbH

*"Vollautomatisierter E-Commerce - Sie müssen nur noch genehmigen."*

---

© 2026 Delqhi GmbH. All Rights Reserved.
