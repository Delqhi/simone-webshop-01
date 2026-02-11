# OmniAgent — DESIGN.md

> **Letzte Aktualisierung:** Februar 2026  
> **Version:** 0.4.0 — Dark/Light Theme System  
> **Status:** Production Ready

---

## 📋 Inhaltsverzeichnis

1. [Design-Philosophie](#1-design-philosophie)
2. [Theme-System (Dark/Light)](#2-theme-system-darklight)
3. [Farb-System & Tokens](#3-farb-system--tokens)
4. [Typografie](#4-typografie)
5. [Spacing & Sizing](#5-spacing--sizing)
6. [Borders & Radii](#6-borders--radii)
7. [Surfaces & Elevation](#7-surfaces--elevation)
8. [Status-Indikatoren](#8-status-indikatoren)
9. [Interaktive Zustände](#9-interaktive-zustände)
10. [Animationen](#10-animationen)
11. [Icon-System](#11-icon-system)
12. [Komponenten-Patterns](#12-komponenten-patterns)
13. [Layout-Patterns](#13-layout-patterns)
14. [Formular-Elemente](#14-formular-elemente)
15. [Terminal-Design](#15-terminal-design)
16. [Command Palette](#16-command-palette)
17. [Responsive Design](#17-responsive-design)
18. [Anti-Patterns](#18-anti-patterns)
19. [Checkliste](#19-checkliste)

---

## 1. Design-Philosophie

### Kernprinzipien

| # | Prinzip | Umsetzung |
|---|---------|-----------|
| 1 | **Monochrom-First** | Gesamte UI in Zinc-Grautönen. Farbe nur für Status-Dots (5px). |
| 2 | **Dichte ohne Chaos** | 10–13px Font, 3–8px Gaps, maximale Info-Dichte bei voller Lesbarkeit. |
| 3 | **Invisible Borders** | Borders bei 3–8% Opacity — sichtbar, aber nie dominant. |
| 4 | **Functional, not decorative** | Kein Element ohne Funktion. Keine Gradients, keine Schatten, keine Dekor-Icons. |
| 5 | **Keyboard-First** | Cmd+K Command Palette, Arrow-Navigation, ESC-Close. |
| 6 | **Theme-Adaptive** | Alle Farben über CSS Custom Properties — nahtloser Dark/Light Wechsel. |

### Referenz-Interfaces

| Interface | Inspiration |
|-----------|-------------|
| **Linear** | App-Shell, Navigation, Density |
| **Vercel Dashboard** | Breadcrumbs, Minimal Color |
| **Bloomberg Terminal** | Monospace Data, Information Density |
| **Raycast** | Command Palette, Keyboard UX |

### Die Goldene Regel

> **Wenn du dich fragst, ob ein Element mehr Farbe braucht — braucht es nicht.**

---

## 2. Theme-System (Dark/Light)

### Architektur

```
ThemeProvider (React Context)
  └── useTheme() Hook
       ├── theme: 'dark' | 'light'
       └── toggle: () => void

Persistenz: localStorage('omniagent-theme')
HTML-Attribut: data-theme="dark|light"
Flash Prevention: Inline <script> in index.html
```

### Implementation

**ThemeProvider** (`src/hooks/useTheme.tsx`):

```tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = localStorage.getItem('omniagent-theme') as Theme;
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('omniagent-theme', theme);
  }, [theme]);

  const toggle = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

**CSS Custom Properties** (`src/index.css`):

```css
@import "tailwindcss";

@theme {
  /* Colors - Dark (Default) */
  --color-app: #09090b;
  --color-side: #0c0c0e;
  --color-sf: #111113;
  --color-sf2: #18181b;
  --color-drop: #141416;
  
  /* Overlays */
  --color-ov1: rgba(255,255,255,0.015);
  --color-ov2: rgba(255,255,255,0.02);
  --color-ov3: rgba(255,255,255,0.03);
  --color-ov4: rgba(255,255,255,0.04);
  --color-ov5: rgba(255,255,255,0.05);
  --color-ov6: rgba(255,255,255,0.06);
  
  /* Borders */
  --color-bd1: rgba(255,255,255,0.03);
  --color-bd2: rgba(255,255,255,0.04);
  --color-bd3: rgba(255,255,255,0.05);
  --color-bd4: rgba(255,255,255,0.06);
  --color-bd5: rgba(255,255,255,0.08);
  
  /* Text */
  --color-tx1: #fafafa;
  --color-tx2: #e4e4e7;
  --color-tx3: #d4d4d8;
  --color-tx4: #a1a1aa;
  --color-tx5: #71717a;
  --color-tx6: #52525b;
  --color-tx7: #3f3f46;
  --color-tx8: #27272a;
  
  /* Accent */
  --color-accent: #6366f1;
  --color-accent-muted: rgba(99,102,241,0.08);
}

/* Light Theme Override */
[data-theme="light"] {
  --color-app: #fafafa;
  --color-side: #f4f4f5;
  --color-sf: #ffffff;
  --color-sf2: #f4f4f5;
  --color-drop: #ffffff;
  
  --color-ov1: rgba(0,0,0,0.015);
  --color-ov2: rgba(0,0,0,0.025);
  --color-ov3: rgba(0,0,0,0.04);
  --color-ov4: rgba(0,0,0,0.05);
  --color-ov5: rgba(0,0,0,0.06);
  --color-ov6: rgba(0,0,0,0.08);
  
  --color-bd1: rgba(0,0,0,0.05);
  --color-bd2: rgba(0,0,0,0.06);
  --color-bd3: rgba(0,0,0,0.08);
  --color-bd4: rgba(0,0,0,0.1);
  --color-bd5: rgba(0,0,0,0.12);
  
  --color-tx1: #18181b;
  --color-tx2: #27272a;
  --color-tx3: #3f3f46;
  --color-tx4: #52525b;
  --color-tx5: #71717a;
  --color-tx6: #a1a1aa;
  --color-tx7: #d4d4d8;
  --color-tx8: #e4e4e7;
  
  --color-accent-muted: rgba(99,102,241,0.08);
}

/* Base Styles */
:root {
  color-scheme: dark;
}

html[data-theme="light"] {
  color-scheme: light;
}

html, body {
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Flash Prevention** (`index.html`):

```html
<!DOCTYPE html>
<html lang="de" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OmniAgent</title>
  <script>
    (function() {
      try {
        var saved = localStorage.getItem('omniagent-theme');
        if (saved === 'dark' || saved === 'light') {
          document.documentElement.setAttribute('data-theme', saved);
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          document.documentElement.setAttribute('data-theme', 'light');
        }
      } catch(e) {}
    })();
  </script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

### Theme Toggle Orte

| # | Ort | UI Pattern |
|---|-----|------------|
| 1 | Top Bar | Sun/Moon Icon Button (immer sichtbar) |
| 2 | Settings View | Segmented Control (Dark \| Light) |
| 3 | Command Palette | "Zum Light/Dark Mode wechseln" Befehl |

---

## 3. Farb-System & Tokens

### CSS Custom Properties → Tailwind Utilities

| Token | CSS Variable | Tailwind Class | Dark Value | Light Value |
|-------|-------------|----------------|------------|-------------|
| **Surfaces** | | | | |
| App Background | `--color-app` | `bg-app` | `#09090b` | `#fafafa` |
| Sidebar | `--color-side` | `bg-side` | `#0c0c0e` | `#f4f4f5` |
| Surface | `--color-sf` | `bg-sf` | `#111113` | `#ffffff` |
| Surface Elevated | `--color-sf2` | `bg-sf2` | `#18181b` | `#f4f4f5` |
| Dropdown | `--color-drop` | `bg-drop` | `#141416` | `#ffffff` |
| **Overlays** | | | | |
| Overlay 1 | `--color-ov1` | `bg-ov1` | `rgba(255,255,255,0.015)` | `rgba(0,0,0,0.015)` |
| Overlay 2 | `--color-ov2` | `bg-ov2` | `rgba(255,255,255,0.02)` | `rgba(0,0,0,0.025)` |
| Overlay 3 | `--color-ov3` | `bg-ov3` | `rgba(255,255,255,0.03)` | `rgba(0,0,0,0.04)` |
| Overlay 4 | `--color-ov4` | `bg-ov4` | `rgba(255,255,255,0.04)` | `rgba(0,0,0,0.05)` |
| Overlay 5 | `--color-ov5` | `bg-ov5` | `rgba(255,255,255,0.05)` | `rgba(0,0,0,0.06)` |
| Overlay 6 | `--color-ov6` | `bg-ov6` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.08)` |
| **Borders** | | | | |
| Border 1 | `--color-bd1` | `border-bd1` | `rgba(255,255,255,0.03)` | `rgba(0,0,0,0.05)` |
| Border 2 | `--color-bd2` | `border-bd2` | `rgba(255,255,255,0.04)` | `rgba(0,0,0,0.06)` |
| Border 3 | `--color-bd3` | `border-bd3` | `rgba(255,255,255,0.05)` | `rgba(0,0,0,0.08)` |
| Border 4 | `--color-bd4` | `border-bd4` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.1)` |
| Border 5 | `--color-bd5` | `border-bd5` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.12)` |
| **Text** | | | | |
| Text Primary | `--color-tx1` | `text-tx1` | `#fafafa` | `#18181b` |
| Text Secondary | `--color-tx2` | `text-tx2` | `#e4e4e7` | `#27272a` |
| Text Tertiary | `--color-tx3` | `text-tx3` | `#d4d4d8` | `#3f3f46` |
| Text Muted | `--color-tx4` | `text-tx4` | `#a1a1aa` | `#52525b` |
| Text Faint | `--color-tx5` | `text-tx5` | `#71717a` | `#71717a` |
| Text Subtle | `--color-tx6` | `text-tx6` | `#52525b` | `#a1a1aa` |
| Text Ghost | `--color-tx7` | `text-tx7` | `#3f3f46` | `#d4d4d8` |
| Text Invisible | `--color-tx8` | `text-tx8` | `#27272a` | `#e4e4e7` |
| **Accent** | | | | |
| Indigo | `--color-accent` | `text-accent` | `#6366f1` | `#6366f1` |
| Indigo Muted | `--color-accent-muted` | `bg-accent-muted` | `rgba(99,102,241,0.08)` | `rgba(99,102,241,0.08)` |

### Farben die NICHT wechseln

| Verwendung | Klasse | Begründung |
|------------|--------|------------|
| Status: Online | `bg-emerald-500` | Universell grün |
| Status: Error | `bg-red-500` | Universell rot |
| Status: Warning | `bg-amber-500` | Universell gelb |
| Status: Processing | `bg-indigo-400` | Accent-adjacent |
| Status: Offline | `bg-zinc-600` | Neutral grau |
| Terminal UI | Hardcoded Hex | Terminal ist immer dunkel |

---

## 4. Typografie

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif;
```

### Font Rendering

```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### Größen-Hierarchie

| Element | Size | Weight | Color Token | Tailwind |
|---------|------|--------|-------------|----------|
| Page Title | 16px | 600 | tx1 | `text-[16px] font-semibold text-tx1` |
| Page Subtitle | 12px | 400 | tx5 | `text-[12px] text-tx5` |
| Section Title | 12px | 500 | tx4 | `text-[12px] font-medium text-tx4` |
| Section Label | 10px | 500 | tx6 | `text-[10px] font-medium uppercase tracking-widest text-tx6` |
| Body Text | 13px | 400 | tx3 | `text-[13px] text-tx3` |
| Body Secondary | 12px | 400 | tx5 | `text-[12px] text-tx5` |
| Small Text | 11px | 400 | tx6 | `text-[11px] text-tx6` |
| Micro | 10px | 400 | tx6 | `text-[10px] text-tx6` |
| Stat Number | 20px | 600 | tx1 | `text-[20px] font-semibold text-tx1 tabular-nums` |
| Mono Data | 12px | 400 | tx4 | `text-[12px] text-tx4 font-mono` |
| Kbd Shortcut | 10px | 400 | tx6 | `text-[10px] text-tx6 font-mono` |

### UPPERCASE Label Pattern

```tsx
<span className="text-[10px] font-medium uppercase tracking-widest text-tx6">
  LABEL TEXT
</span>
```

### Monospace-Regeln

Nutze `font-mono` für:

| Context | Beispiele |
|---------|-----------|
| Identifier | E-Mail, Telefon, Bot-IDs |
| Technische Werte | Ports, Versions, API Keys |
| Metriken | Response Time, Counts |
| Terminal-Output | Console Logs, System Messages |
| Code/Prompts | Source Code, AI Prompts |

---

## 5. Spacing & Sizing

### Spacing-Tokens

| Token | Wert | Verwendung |
|-------|------|------------|
| `gap-px` | 1px | Grid-Divider (Gap-px Pattern) |
| `gap-1` | 4px | Inline-Element Spacing |
| `gap-1.5` | 6px | Icon + Text Pairs |
| `gap-2` | 8px | Standard Component Gap |
| `gap-2.5` | 10px | Navigation Items |
| `gap-3` | 12px | Card Content Sections |
| `gap-4` | 16px | Section Spacing |
| `space-y-2` | 8px | Vertikale Listen |
| `space-y-4` | 16px | View Sections |
| `space-y-6` | 24px | Major Sections |

### Element-Höhen

| Element | Height | Tailwind |
|---------|--------|----------|
| Top Bar | 40px | `h-10` |
| Sidebar Header | 44px | `h-11` |
| Nav Item | ~28px | `py-[6px]` |
| Table Row | ~36px | `py-2.5` |
| Input | ~28px | `py-[5px]` |
| Command Palette Search | 48px | `h-12` |

### Sidebar

| State | Width | Tailwind |
|-------|-------|----------|
| Expanded | 220px | `w-[220px]` |
| Collapsed | 52px | `w-[52px]` |

### Avatare

| Context | Size | Font |
|---------|------|------|
| Sidebar Agent | 22×22px | `text-[10px]` |
| Dashboard Agent | 28×28px | `text-[11px]` |
| Agent Card | 32×32px | `text-[12px]` |
| Top Bar User | 24×24px | `text-[10px]` |

---

## 6. Borders & Radii

### Border Opacity Stufen

Alle Borders nutzen CSS Variable Tokens (bd1–bd5). Siehe Farb-System Tabelle.

### Border-Klassen

```
border border-bd1  → Subtilste Trennung (Divider)
border border-bd2  → Tag Borders, Inner Elements
border border-bd3  → Standard Container Borders
border border-bd4  → Interactive Element Borders
border border-bd5  → Hover State, Command Palette
```

### Radius-Hierarchie

| Element | Radius | Tailwind |
|---------|--------|----------|
| Buttons, Tags, Badges | 4px | `rounded` |
| Inputs, Selects | 6px | `rounded-md` |
| Cards, Tables | 8px | `rounded-lg` |
| Modals, Terminal | 12px | `rounded-xl` |
| Avatare, Dots | voll | `rounded-full` |

### Divider Pattern

```tsx
<div className="divide-y divide-bd1">  {/* oder divide-bd2 */}
  <div>Row 1</div>
  <div>Row 2</div>
</div>
```

---

## 7. Surfaces & Elevation

### Das Gap-px Grid Pattern (Signature Element)

Statt Borders zwischen Zellen nutzen wir einen Container mit `gap-px` und einer Overlay-Hintergrundfarbe, die durch den 1px Gap durchscheint.

```tsx
<div className="grid grid-cols-4 gap-px bg-ov5 rounded-lg overflow-hidden border border-bd3">
  <div className="bg-app p-4">Cell 1</div>
  <div className="bg-app p-4">Cell 2</div>
  <div className="bg-app p-4">Cell 3</div>
  <div className="bg-app p-4">Cell 4</div>
</div>
```

**Wie es funktioniert:**

1. Container hat `bg-ov5` → Overlay-Farbe
2. Zellen haben `bg-app` → App-Hintergrund
3. `gap-px` erzeugt 1px Lücken → Overlay scheint durch
4. Ergebnis: Haarfeine Divider-Linien ohne explizite Borders

### Surface-Hierarchie

| Level | Token | Verwendung |
|-------|-------|------------|
| 0 | `bg-app` | Page Background |
| 1 | `bg-side` | Sidebar |
| 2 | `bg-sf` | Cards, Modals, Command Palette |
| 3 | `bg-sf2` | Elevated Elements |
| 4 | `bg-ov2–ov3` | Tags, Code Blocks |
| 5 | `bg-ov4–ov6` | Buttons, Active States |

---

## 8. Status-Indikatoren

### Status-Dots

```tsx
{/* Standard Dot (5px) */}
<div className="w-[5px] h-[5px] rounded-full bg-emerald-500" />

{/* Avatar-inset Dot (6px mit Border) */}
<div className="absolute -bottom-px -right-px w-[6px] h-[6px] rounded-full 
     border-[1.5px] border-app bg-emerald-500" />
```

### Status-Farben

| Status | Dot-Klasse | Text-Klasse |
|--------|-----------|-------------|
| Online / Connected | `bg-emerald-500` | `text-emerald-400` |
| Processing / Active | `bg-indigo-400` | `text-indigo-400` |
| Idle / Pending | `bg-amber-500` | `text-amber-400` |
| Offline / Disconnected | `bg-zinc-600` | `text-zinc-500` |
| Error | `bg-red-500` | `text-red-400` |

### Unread-Indikator (Messages)

```tsx
<div className="border-l-2 border-l-indigo-500/50">
  {/* Message Content */}
</div>
```

---

## 9. Interaktive Zustände

### Hover

| Element | Hover-Klasse |
|---------|-------------|
| Table Row | `hover:bg-ov1` |
| Nav Item (inactive) | `hover:bg-ov3 hover:text-tx3` |
| Button | `hover:bg-ov4` oder `hover:bg-ov6` |
| Delete Button | `hover:bg-red-500/10 hover:text-red-400` |
| Border Enhance | `hover:border-bd5` |

### Show-on-Hover Pattern

```tsx
<div className="group">
  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
    <Trash2 size={12} />
  </button>
</div>
```

### Focus State

```css
focus:outline-none focus:border-indigo-500/30
```

### Transitions

| Transition | Verwendung |
|------------|------------|
| `transition-colors` | Standard für Farb-Änderungen |
| `transition-all` | Toggle-Switches, Position-Changes |
| `transition-opacity` | Show/Hide |
| `transition` | Generisch |

**Dauer:** Tailwind Default (150ms)

---

## 10. Animationen

### Keyframes

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(3px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Utility Classes

```css
.animate-fade-in {
  animation: fade-in 150ms ease-out forwards;
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s ease-in-out infinite;
}

.animate-slide-up {
  animation: slide-up 200ms ease-out forwards;
}

.animate-slide-down {
  animation: slide-down 200ms ease-out forwards;
}
```

### Verwendung

| Animation | Klasse | Verwendung |
|-----------|--------|------------|
| fade-in | `animate-fade-in` | View-Eintritt (150ms) |
| pulse-subtle | `animate-pulse-subtle` | Aktive Cursor, Status-Dots |
| slide-up | `animate-slide-up` | Modals, Command Palette (200ms) |
| slide-down | `animate-slide-down` | Dropdowns (200ms) |

### Timing-Philosophie

- **Nie** `bounce`, `elastic`, oder `spring`
- Immer `ease-out`
- Max Dauer: 200ms
- Modals: `slide-up` (200ms)
- Views: `fade-in` (150ms)

---

## 11. Icon-System

### Library: Lucide React

### Größen

| Context | Size | Beispiel |
|---------|------|---------|
| Workflow Chain | 10px | `<ArrowRight size={10} />` |
| Inline / Tags | 11–12px | `<Cpu size={11} />` |
| Nav Item | 13–15px | `<LayoutDashboard size={15} />` |
| Top Bar Action | 14px | `<Sun size={14} />` |
| Sidebar Toggle | 14px | `<PanelLeftClose size={14} />` |

### Farb-Regeln

| Context | Klasse |
|---------|--------|
| Standard | `text-tx5` |
| Aktiv/Hover | `text-tx3` oder `text-tx4` |
| Destructive | `text-tx7 hover:text-red-400` |
| Status | Nutze Status-Farben (emerald, red, etc.) |

### Platform-Icon Registry

**PlatformIcon Komponente:** `src/components/PlatformIcon.tsx`

```tsx
import { LucideIcon } from 'lucide-react';

interface PlatformIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
}

export function PlatformIcon({ icon: Icon, size = 14, className = '' }: PlatformIconProps) {
  return (
    <Icon 
      size={size} 
      className={`text-tx5 shrink-0 ${className}`} 
    />
  );
}
```

**Regeln:**
- Rendert nur das Icon — **keine Box, kein Background**
- Standard: `text-tx5 shrink-0`

---

## 12. Komponenten-Patterns

### Page Header

```tsx
<div>
  <h1 className="text-[16px] font-semibold text-tx1">Titel</h1>
  <p className="text-[12px] text-tx5 mt-0.5">Beschreibung</p>
</div>
```

### Section with "See All" Link

```tsx
<div className="flex items-center justify-between mb-2">
  <span className="text-[12px] font-medium text-tx4">Section</span>
  <button className="text-[11px] text-tx6 hover:text-tx4 transition flex items-center gap-1">
    Alle <ArrowRight size={10} />
  </button>
</div>
```

### Stat Card (Gap-px Grid)

```tsx
<div className="grid grid-cols-4 gap-px bg-ov5 rounded-lg overflow-hidden border border-bd3">
  <div className="bg-app p-4">
    <div className="text-[10px] font-medium uppercase tracking-wider text-tx6 mb-2">Label</div>
    <div className="text-[20px] font-semibold text-tx1 tabular-nums leading-none">42</div>
    <div className="text-[11px] text-tx6 mt-1.5">Subtitle</div>
  </div>
</div>
```

### Avatar

```tsx
<div className="w-7 h-7 rounded bg-ov4 flex items-center justify-center text-[11px] font-medium text-tx5">
  A
</div>
```

### Tag / Badge

```tsx
<span className="text-[10px] bg-ov2 border border-bd2 text-tx5 px-1.5 py-0.5 rounded">
  Tag Text
</span>
```

### Toggle Switch (CSS-Only)

```tsx
<button onClick={onToggle}>
  <div className={cn(
    'w-7 h-4 rounded-full transition-colors relative',
    isActive ? 'bg-indigo-500/30' : 'bg-ov4'
  )}>
    <div className={cn(
      'absolute top-0.5 w-3 h-3 rounded-full transition-all',
      isActive ? 'left-3.5 bg-indigo-400' : 'left-0.5 bg-tx6'
    )} />
  </div>
</button>
```

### Segmented Control

```tsx
<div className="inline-flex bg-ov2 rounded p-px border border-bd2">
  {options.map(opt => (
    <button className={cn(
      'px-2 py-px rounded text-[10px] transition-colors',
      selected === opt ? 'bg-ov6 text-tx3' : 'text-tx6 hover:text-tx4'
    )}>
      {opt}
    </button>
  ))}
</div>
```

### Source Badge (Automation)

```tsx
<span className={cn(
  'text-[9px] font-medium uppercase tracking-wider px-1.5 py-px rounded border',
  source === 'edge_function'
    ? 'text-indigo-400/70 bg-indigo-500/8 border-indigo-500/15'
    : 'text-amber-400/70 bg-amber-500/8 border-amber-500/15'
)}>
  {label}
</span>
```

---

## 13. Layout-Patterns

### App Shell

```
┌──────────────────────────────────────────┐
│ ┌────────┬───────────────────────────┐   │
│ │        │ Top Bar (h-10, border-b)  │   │
│ │Sidebar │───────────────────────────│   │
│ │(220px) │                           │   │
│ │        │ Content Area              │   │
│ │        │ (p-4 sm:p-5, overflow-y)  │   │
│ │        │                           │   │
│ │        │ max-w-4xl to max-w-6xl    │   │
│ └────────┴───────────────────────────┘   │
└──────────────────────────────────────────┘
```

### Content Max-Width per View

| View | Max Width |
|------|-----------|
| Dashboard | `max-w-6xl` |
| Channels | `max-w-6xl` |
| Agents | `max-w-6xl` |
| Routing | `max-w-6xl` |
| Messages | `max-w-5xl` |
| Automations | `max-w-5xl` |
| Settings | `max-w-4xl` |

### Top Bar Breadcrumb

```tsx
<div className="flex items-center gap-1.5 text-[11px]">
  <span className="text-tx6">OmniAgent</span>
  <span className="text-tx8">/</span>
  <span className="text-tx4">{currentView}</span>
</div>
```

---

## 14. Formular-Elemente

### Text Input

```tsx
<input 
  className="flex-1 bg-transparent text-[13px] text-tx2 placeholder:text-tx7 outline-none" 
/>
```

### Search Input (with border)

```tsx
<div className="flex items-center gap-2 border border-bd3 rounded-md px-2.5 py-[5px] 
     focus-within:border-indigo-500/30 transition">
  <Search size={13} className="text-tx6" />
  <input 
    className="flex-1 bg-transparent text-[13px] text-tx2 placeholder:text-tx7 outline-none" 
  />
</div>
```

### Select Dropdown

```tsx
<select className="bg-transparent border border-bd3 rounded px-1.5 py-0.5 text-[12px] 
     text-tx4 focus:outline-none focus:border-indigo-500/30 cursor-pointer hover:bg-ov3 transition">
  <option value="">—</option>
</select>
```

### Select Option Styling (CSS)

```css
select option {
  background: var(--color-app);
  color: var(--color-tx2);
}
```

---

## 15. Terminal-Design

> **Das Terminal ist IMMER dunkel** — unabhängig vom aktiven Theme.

### Terminal Farben (hardcoded)

| Element | Wert |
|---------|------|
| Header Background | `#1a1a1e` |
| Body Background | `#0e0e10` |
| Footer Background | `#141416` |
| Borders | `border-white/[0.06]` und `border-white/[0.08]` |
| Text: System | `text-zinc-500` |
| Text: Info | `text-zinc-400` |
| Text: Success | `text-emerald-400` |
| Text: Error | `text-red-400` |
| Text: Warning | `text-amber-400` |
| Text: Input | `text-indigo-400` |
| Timestamp | `text-zinc-700` |
| Cursor | `text-zinc-500 animate-pulse-subtle ▊` |

### macOS Traffic Lights

```tsx
<div className="flex items-center gap-1.5">
  <button className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
  <div className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
  <div className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
</div>
```

### Terminal Title Format

```
openclaw — {platform_label_lowercase}
```

### Docker Isolation Badge

```tsx
<span className="text-[10px] text-zinc-600 font-mono">docker: isolated</span>
```

---

## 16. Command Palette

### Overlay

```css
fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]
```

### Container

```
bg-sf border-bd5 rounded-xl shadow-2xl shadow-black/50
max-w-lg animate-slide-up
```

### Search Input Height: `h-12`

### Result Item

```tsx
<button className={cn(
  'w-full flex items-center gap-3 px-4 py-2 text-left transition-colors',
  isActive ? 'bg-ov4' : ''
)}>
  <Icon size={15} className="text-tx5" />
  <div className="flex-1">
    <div className="text-[13px] text-tx3">{label}</div>
    <div className="text-[11px] text-tx6">{description}</div>
  </div>
  {isActive && <ArrowRight size={12} className="text-tx6" />}
</button>
```

### Group Header

```tsx
<span className="text-[10px] font-medium uppercase tracking-wider text-tx6">
  {groupName}
</span>
```

### Footer Keyboard Hints

```tsx
<kbd className="bg-ov4 px-1 rounded font-mono text-[10px]">↑↓</kbd>
```

---

## 17. Responsive Design

### Breakpoints

| Breakpoint | Wert | Verwendung |
|------------|------|------------|
| `sm` | 640px | Content Padding, Search Bar |
| `lg` | 1024px | Sidebar sichtbar, Grid-Layouts |
| `xl` | 1280px | Agent Cards 2-Spaltig |

### Mobile Sidebar

```
fixed inset-y-0 left-0 z-40
-translate-x-full lg:translate-x-0
```

Mit Backdrop: `bg-black/40`

### Content Padding

```
p-4 sm:p-5
```

---

## 18. Anti-Patterns

### VERBOTEN

| # | Anti-Pattern | Warum | Alternative |
|---|-------------|-------|-------------|
| 1 | Gradients auf Hintergründen | Wirkt verspielt | Flat `bg-app` |
| 2 | `box-shadow` für Elevation | Widerspricht Monochrom | `border-bd*` |
| 3 | Farbige Icon-Hintergründe | Lenkt ab | Nur Icon in `text-tx5` |
| 4 | `text-white` für Überschriften | Zu hart | `text-tx1` oder `text-tx2` |
| 5 | Hardcoded Farben in Components | Bricht Theme | Token-Klassen nutzen |
| 6 | `bg-blue-500` für Buttons | Zu bunt | `bg-ov4 hover:bg-ov6` |
| 7 | Font size > 20px | Überdimensioniert | Max `text-[20px]` für Stats |
| 8 | Padding > 24px | Zu luftig | Max `p-6` |
| 9 | `border-2` oder dicker | Zu dominant | Max `border` (1px) |
| 10 | Animationen > 200ms | Fühlt sich langsam an | Max 200ms, ease-out |
| 11 | `rounded-2xl` oder mehr | Zu weich | Max `rounded-xl` |
| 12 | Inline Styles für Farben | Unwartbar | CSS Variables + Tokens |
| 13 | Opacity > 0.12 auf Borders | Zu sichtbar | Max `bd5` (0.08/0.12) |
| 14 | Emojis in UI | Unprofessionell | Lucide Icons |
| 15 | Alert/Toast mit hellen Farben | Zu aggressiv | Subtile Border-Hinweise |

### PFLICHT

| # | Pattern | Umsetzung |
|---|---------|-----------|
| 1 | Theme Tokens statt hardcoded | `text-tx1` statt `text-white` |
| 2 | Monospace für Daten | `font-mono` für alle technischen Werte |
| 3 | UPPERCASE für Labels | `text-[10px] font-medium uppercase tracking-widest` |
| 4 | Show-on-Hover Actions | `opacity-0 group-hover:opacity-100` |
| 5 | Gap-px für Grid-Divider | Container `bg-ov5 gap-px` + Zellen `bg-app` |
| 6 | Status-Dots statt Badges | `w-[5px] h-[5px] rounded-full bg-emerald-500` |
| 7 | Terminal bleibt dunkel | Hardcoded Hex, nie Theme-Tokens |

---

## 19. Checkliste

### Pre-Commit Check für neue Komponenten

#### Visuell

- [ ] Nur Theme-Token-Klassen verwendet (keine hardcoded Farben außer Status/Terminal)
- [ ] Kein `bg-white`, `text-white`, `bg-black` in regulären Elementen
- [ ] Borders nutzen `bd1`–`bd5` Tokens
- [ ] Text nutzt `tx1`–`tx8` Hierarchie
- [ ] Overlays nutzen `ov1`–`ov6` Tokens
- [ ] Font-Größen im Bereich 10–20px
- [ ] Monospace für technische Daten
- [ ] UPPERCASE für Labels

#### Interaktion

- [ ] Hover-States auf allen klickbaren Elementen
- [ ] Destructive Actions: `hover:bg-red-500/10 hover:text-red-400`
- [ ] Show-on-Hover für sekundäre Actions
- [ ] `transition-colors` auf allen interaktiven Elementen

#### Layout

- [ ] `max-w-*` auf View-Ebene gesetzt
- [ ] `animate-fade-in` auf View-Root
- [ ] Responsive ab `lg:` Breakpoint getestet
- [ ] Spacing konsistent mit Spacing-Tokens

#### Theme-Kompatibilität

- [ ] In Dark Mode getestet
- [ ] In Light Mode getestet
- [ ] Contrast Ratio ausreichend in beiden Modi
- [ ] Terminal-Elemente nutzen hardcoded Hex (kein Theme)

#### Konsistenz

- [ ] Folgt bestehendem Pattern einer ähnlichen Komponente
- [ ] Keine neuen Farb-Tokens ohne Abstimmung
- [ ] Icon-Größen im erlaubten Bereich (10–18px)
- [ ] Status-Dots verwenden korrekte Farben

---

## Änderungshistorie

| Version | Datum | Änderungen |
|---------|-------|------------|
| 0.4.0 | Feb 2026 | Dark/Light Theme System hinzugefügt |
| 0.3.0 | Jan 2026 | Terminal-Design dokumentiert |
| 0.2.0 | Jan 2026 | Command Palette Patterns ergänzt |
| 0.1.0 | Jan 2026 | Initiale Version |

---

<p align="center">
  <strong>OmniAgent Design System</strong><br />
  © 2026 — Built with precision.
</p>
