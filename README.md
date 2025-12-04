# VaxaV 🚀

**VaxaV** es un juego web asíncrono de ciencia ficción espacial donde asumes el papel de un piloto en un universo persistente. Inspirado en títulos como **EVE Online**, **OGame** y la saga **X de Egosoft**.

## 🚀 Quick Start

```bash
npm install
npm run dev
# → http://localhost:5173/game
```

## 📁 Estructura del Proyecto

```
src/
├── app.css                    # Entry point: imports Tailwind + theme + CRT effects
├── lib/
│   ├── icons/                 # SVG icon registry
│   │   └── index.ts           # Icon definitions (close, maximize, map, pilot, ship, etc.)
│   │
│   ├── layout/                # Golden Layout configuration
│   │   ├── layoutConfig.ts    # Default panel arrangement
│   │   └── panelRegistry.ts   # Panel component registry with icons & config
│   │
│   ├── panels/                # Game panels (folder per panel)
│   │   ├── MapPanel/
│   │   │   ├── MapPanel.svelte
│   │   │   └── index.ts       # Re-export
│   │   ├── PilotPanel/
│   │   │   ├── PilotPanel.svelte
│   │   │   └── index.ts
│   │   └── ShipPanel/
│   │       ├── ShipPanel.svelte
│   │       └── index.ts
│   │
│   ├── styles/                # Styling system
│   │   ├── theme.css          # CSS variables (colors, typography, spacing)
│   │   ├── crt-effects.css    # CRT visual effects (scanlines, glow, flicker)
│   │   └── golden-layout.css  # Golden Layout CRT theme
│   │
│   ├── ui/                    # Reusable UI components
│   │   ├── Icon.svelte        # SVG icon component with glow support
│   │   ├── Button.svelte
│   │   ├── Card.svelte
│   │   └── ... (Badge, Input, Modal, Progress, Table, Tooltip)
│   │
│   ├── data/                  # Mock data layer
│   │   ├── api.ts             # API service abstraction
│   │   ├── types.ts           # Domain types
│   │   └── fixtures/          # Development fixtures
│   │
│   └── stores/                # Global state (Svelte 5 runes)
│
└── routes/
    ├── game/+page.svelte      # Main game interface (Golden Layout)
    └── ui-showcase/           # Component demo page
```

## 🎨 CRT Theme System

El tema usa variables CSS definidas en `theme.css`:

| Variable | Valor | Uso |
|----------|-------|-----|
| `--crt-green` | `#00ff41` | Color primario (phosphor green) |
| `--crt-bg-base` | `#0d1117` | Fondo de paneles |
| `--font-mono` | `Share Tech Mono` | Fuente principal |
| `--font-display` | `VT323` | Títulos retro |

### Efectos CRT disponibles (clases CSS):

- `.crt-scanlines` - Líneas horizontales de monitor CRT
- `.crt-text-glow` - Resplandor fosforescente en texto
- `.crt-flicker` - Parpadeo sutil
- `.crt-border-glow` - Bordes con glow

## 🔧 Agregar un Nuevo Panel

1. Crear carpeta en `src/lib/panels/NuevoPanel/`
2. Crear `NuevoPanel.svelte` y `index.ts`
3. Registrar en `panelRegistry.ts`:

```typescript
import { NuevoPanel } from '$lib/panels/NuevoPanel';

export const panelRegistry = {
  // ...existing panels
  NuevoPanel: {
    component: NuevoPanel,
    title: 'Nuevo Panel',
    icon: 'grid', // from icons/index.ts
  },
};
```

4. Agregar al layout en `layoutConfig.ts`

## 🔧 Agregar un Nuevo Icono

Editar `src/lib/icons/index.ts`:

```typescript
export const icons = {
  // ...existing icons
  nuevoIcono: {
    viewBox: '0 0 24 24',
    paths: ['M12 2L...'], // SVG path data
  },
};
```

## 📋 Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo (port 5173) |
| `npm run build` | Build producción |
| `npm run check` | TypeScript check |

## 🛠️ Stack

- **SvelteKit** + Svelte 5
- **TypeScript**
- **Tailwind CSS** v4
- **Golden Layout** v2
- **Vite**
