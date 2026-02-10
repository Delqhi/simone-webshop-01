# OpenDocs Project Overview

## Project Purpose
OpenDocs is an open-source documentation and workflow management platform that combines the best features of Notion, Linear, and Plane. It's built with Best Practices February 2026 for enterprise-grade quality.

## Tech Stack
- **Frontend**: React 19.2.3 + TypeScript 5.9.3 + Vite 7.2.4
- **State Management**: Zustand 5.0.11
- **Styling**: Tailwind CSS 4.1.17
- **Backend**: Express 5.2.1 API Gateway
- **Database**: Supabase PostgreSQL (Postgres client via pg 8.18.0)
- **ID Generation**: nanoid 5.1.6 (no UUIDv4 for environment safety)
- **Visual Components**: 
  - @xyflow/react 12.10.0 (flow diagrams)
  - @excalidraw/excalidraw 0.18.0 (whiteboard)
  - Mermaid 11.12.2 (diagrams)
- **Drag & Drop**: @dnd-kit libraries
- **Icons**: lucide-react 0.563.0

## Key Features Implemented (per README)
1. **AI-Native Documentation**: AI Prompt Block, Per-Block AI Agent
2. **Real Relational Databases**: 6 dynamic views (Table, Kanban, Flow/Graph, Calendar, Timeline, Gallery)
3. **Visual Workflow Orchestration**: n8n integration with visual node connections
4. **Enterprise Security**: Hard Locks, SSRF-Hardening, API Gating
5. **Best Practices UI/UX**: Modular blocks, Dark Mode, Slash Menu, Icon System

## Code Structure
- `src/` - React frontend source
  - `components/` - UI components
  - `store/` - Zustand state management
  - `services/` - Infrastructure clients
  - `types/` - Domain types
- `server.js` - Express API server (31KB)
- `n8n/` - n8n workflow directory
- `dist/` - Built output

## Development Commands
```bash
# Development
npm run dev           # Start Vite dev server (localhost:5173)

# Production
npm run build        # Create production build
npm run preview      # Preview production build

# Server
node server.js       # Start Express API server (localhost:3000)
```

## Environment Variables
Required in `.env`:
- `NVIDIA_API_KEY` - For AI features
- `API_AUTH_TOKEN` - For API gating (optional but recommended)
- `SUPABASE_DB_URL` - For database features (optional)
- `N8N_BASE_URL`, `N8N_API_KEY` - For n8n integration (optional)
- `OPENCLAW_BASE_URL`, `OPENCLAW_TOKEN` - For OpenClaw integration (optional)

## Code Style & Conventions
- **TypeScript Strict Mode**: No `any` types, no `@ts-ignore`
- **Modular Architecture**: Small, focused files
- **Environment Safety**: nanoid for all IDs (no UUIDv4)
- **Security First**: SSRF-Hardening, API Gating, No Client Secrets
- **Performance Budget**: Hydration < 100ms, FCP < 1.2s
- **Error Resilience**: Root-Level ErrorBoundary with Recovery

## Documentation Status
- ✅ README.md - Complete with Best Practices Feb 2026
- ✅ ARCHITECTURE.md - Technical architecture
- ✅ AGENTS-PLAN.md - Task tracking
- ✅ REQUIREMENTS.md - Dependency manifest
- ✅ API-ENDPOINTS.md - REST API reference
- 📖 SUPABASE.md - Needs completion
- 📖 OPENCLAW.md - Needs completion
- 📖 ONBOARDING.md - Needs completion

## Project Status
**Production Ready** according to README, but user reports missing/broken features:
- AI Block creation missing
- Per-block AI chat missing
- n8n block integration incomplete
- Flow view missing
- Icon system needs enhancement
- Documentation needs completion