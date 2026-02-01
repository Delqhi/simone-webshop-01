# SIN-Solver Enterprise Dashboard

A modern, enterprise-grade monitoring dashboard for the SIN-Solver CAPTCHA solving platform. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## Features

### 📊 Real-time Monitoring
- Live solve rate charts with WebSocket updates
- System health indicators with latency tracking
- Recent solves log with real-time updates
- Connection status indicator

### 🎨 Modern UI
- Dark theme with blue accents (professional enterprise look)
- Fully responsive design
- **Collapsible sidebar navigation with categories**
- **Minimizable/maximizable AI chat widget (MoltBot)**
- Smooth animations and transitions

### 📈 Analytics
- KPI cards with trend indicators
- Time-series charts (Recharts)
- CAPTCHA type distribution (pie chart)
- AI model performance table

### 🏗️ Category-Based Navigation (NEW)
- **Agents**: n8n, Agent Zero, Steel Browser, Skyvern
- **Workers**: CAPTCHA Solver (5 accounts), Survey Worker, Website Builder
- **Infrastructure**: PostgreSQL, Redis, Vault, Cloudflare, Scira AI Search
- **Storage & Monitoring**: Prometheus, Grafana, Jaeger, Loki, Alertmanager

### 💼 Job Management (NEW)
- Job queue with status filtering
- Progress tracking for running jobs
- Pause, resume, restart, cancel actions

### 🔧 Components
- **KPICards**: Key performance indicators with trends
- **SolveRateChart**: Real-time line/area charts
- **CaptchaTypeDistribution**: Pie chart breakdown
- **ModelPerformance**: AI model statistics table
- **RecentSolves**: Live activity feed
- **SystemHealth**: Component status monitoring

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Navigate to dashboard directory
cd dashboard-enterprise

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_DASHBOARD_TITLE=SIN-Solver Enterprise
NEXT_PUBLIC_ENABLE_REALTIME=true
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
dashboard-enterprise/
├── app/                          # Next.js app directory
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main dashboard
│   ├── agents/                  # AI Agents overview
│   │   └── page.tsx
│   ├── workers/                 # Task Workers overview
│   │   └── page.tsx
│   ├── infrastructure/          # Infrastructure services
│   │   └── page.tsx
│   ├── storage/                 # Storage & Monitoring
│   │   └── page.tsx
│   ├── jobs/                    # Job queue management
│   │   └── page.tsx
│   └── moltbot/                 # AI Chat interface
│       └── page.tsx
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── KPICards.tsx
│   ├── SolveRateChart.tsx
│   ├── CaptchaTypeDistribution.tsx
│   ├── ModelPerformance.tsx
│   ├── RecentSolves.tsx
│   ├── SystemHealth.tsx
│   ├── Sidebar.tsx             # Updated with categories
│   └── TopBar.tsx
├── lib/                         # Utilities and hooks
│   ├── utils.ts                # Helper functions
│   ├── api.ts                  # SWR hooks for API
│   ├── websocket.ts            # WebSocket client
│   └── store.ts                # Zustand state
├── types/                       # TypeScript types
│   └── index.ts
├── public/                     # Static assets
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## API Integration

The dashboard expects the following API endpoints:

### REST Endpoints
- `GET /api/v2/dashboard/stats` - Dashboard statistics
- `GET /api/v2/dashboard/timeseries?range=24h` - Time series data
- `GET /api/v2/dashboard/captcha-types` - CAPTCHA type distribution
- `GET /api/v2/models/performance` - AI model performance
- `GET /api/v2/solves/recent?limit=50` - Recent solves
- `GET /api/v2/system/health` - System health status
- `GET /api/v2/alerts` - Active alerts

### WebSocket Events
- `stats` - Real-time statistics updates
- `solve` - New solve events
- `alert` - System alerts
- `health` - Health status changes

## Technology Stack

- **Framework**: Next.js 15.1 with App Router
- **UI Library**: React 19
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **Components**: shadcn/ui + Radix UI
- **Charts**: Recharts
- **State**: Zustand
- **Data Fetching**: SWR
- **WebSocket**: Socket.io Client
- **Icons**: Lucide React

## Customization

### Themes
Edit `tailwind.config.ts` to customize colors:
- Primary: Blue accent color
- Status colors: Online (emerald), Warning (amber), Error (red)

### Layout
Modify `app/page.tsx` to rearrange dashboard sections.

### API Base URL
Update `NEXT_PUBLIC_API_URL` in `.env.local`.

## Recent Changes (Session 2026-02-01) - Dashboard Restructuring v2.2

### ✨ New Features
- **Category-Based Navigation**: Sidebar restructured with 4 collapsible categories
  - Agents: n8n, Agent Zero, Steel Browser, Skyvern
  - Workers: CAPTCHA Solver (5 accounts), Survey Worker, Website Builder
  - Infrastructure: PostgreSQL, Redis, Vault, Cloudflare, Scira
  - Storage & Monitoring: Prometheus, Grafana, Jaeger, Loki, Alertmanager
- **Jobs Page**: Job queue management with status filtering and progress tracking
- **MoltBot Chat**: Minimizable AI chat interface (replaced ClawdBot)

### 🔧 Improvements
- **Navigation**: Collapsible categories for better organization
- **UI**: Consistent card-based layout across all category pages
- **UX**: Minimizable chat widget for uninterrupted workflow

### 📁 New Components
- `app/agents/page.tsx` - AI Agents overview
- `app/workers/page.tsx` - Task Workers overview
- `app/infrastructure/page.tsx` - Infrastructure services
- `app/storage/page.tsx` - Storage & monitoring
- `app/jobs/page.tsx` - Job queue management
- `app/moltbot/page.tsx` - AI chat interface
- `components/ui/input.tsx` - shadcn input component

### 🚀 Deployment
- Successfully deployed to Vercel
- Production URL: https://dashboard-enterprise-dbpztu7hc-info-zukunftsories-projects.vercel.app

## License

Apache 2.0 - See LICENSE file for details.
