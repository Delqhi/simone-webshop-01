# OpenDocs — REQUIREMENTS.md

> **Best Practices Feb 2026:** Exact dependency versions for reproducible builds.

---

## Production Dependencies

### 🏗 Core UI & State
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.2.3 | Latest React with concurrent rendering |
| `react-dom` | 19.2.3 | DOM renderer |
| `zustand` | 5.0.11 | High-performance state management |
| `nanoid` | 5.1.6 | Robust ID generation (replaces crypto.randomUUID) |
| `lucide-react` | 0.563.0 | Standardized icon system |
| `clsx` | 2.1.1 | Conditional CSS classes |
| `tailwind-merge` | 3.4.0 | Tailwind class merging |

### 📊 Data Visualization & Diagrams
| Package | Version | Purpose |
|---------|---------|---------|
| `@xyflow/react` | 12.10.0 | Workflow Graph / Flow views |
| `@excalidraw/excalidraw` | 0.18.0 | Whiteboard/Draw blocks |
| `mermaid` | 11.12.2 | Markdown-driven diagrams |
| `@dnd-kit/core` | 6.3.1 | Drag & drop functionality |
| `@dnd-kit/sortable` | 10.0.0 | Sortable lists |
| `@dnd-kit/utilities` | 3.2.2 | DnD utilities |

### 🤖 AI & Content
| Package | Version | Purpose |
|---------|---------|---------|
| `react-markdown` | 10.1.0 | Markdown rendering |
| `remark-gfm` | 4.0.1 | GitHub Flavored Markdown |

### ☁️ Backend Integration
| Package | Version | Purpose |
|---------|---------|---------|
| `@supabase/supabase-js` | 2.95.3 | Supabase client |
| `express` | 5.2.1 | API proxy server |
| `pg` | 8.18.0 | PostgreSQL driver |
| `node-html-parser` | 7.0.2 | HTML scraping |

---

## Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | 7.2.4 | Build tool |
| `typescript` | 5.9.3 | Type checking |
| `tailwindcss` | 4.1.17 | CSS framework |
| `@tailwindcss/vite` | 4.1.17 | Tailwind Vite plugin |
| `@vitejs/plugin-react` | 5.1.1 | React Vite plugin |
| `vite-plugin-singlefile` | 2.3.0 | Single file build |
| `@types/react` | 19.2.7 | React types |
| `@types/react-dom` | 19.2.3 | React DOM types |
| `@types/node` | 22.0.0 | Node types |

---

## Installation

```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

---

## Version Lock

All versions are pinned in `package.json` for reproducible builds. Use exact versions in production.

---
© 2026 OpenDocs Project. Best Practices Feb 2026.
