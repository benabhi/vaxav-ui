# VaxaV 🚀

**VaxaV** es un juego web asíncrono de ciencia ficción espacial donde asumes el papel de un piloto en un universo persistente. Inspirado en títulos como **EVE Online**, **OGame** y la saga **X de Egosoft**, VaxaV combina gestión de recursos, comercio interestelar, exploración y combate táctico en una experiencia accesible desde el navegador.

## 🎮 Características del Juego

- **Mundo Persistente**: El universo continúa evolucionando incluso cuando no estás conectado
- **Progresión de Piloto**: Sistema de habilidades y experiencia para tu personaje
- **Gestión de Naves**: Personaliza, mejora y gestiona tu flota espacial
- **Exploración**: Descubre sistemas estelares, planetas y estaciones espaciales
- **Economía Dinámica**: Sistema de comercio y mercados influenciados por los jugadores
- **Interfaz Modular**: Paneles arrastrables y personalizables con Golden Layout

## 🛠️ Stack Tecnológico

- **Framework**: [SvelteKit](https://svelte.dev/) con Svelte 5
- **Lenguaje**: TypeScript
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Layout Manager**: [Golden Layout](https://golden-layout.com/) v2
- **Build Tool**: [Vite](https://vite.dev/)

## 📁 Estructura del Proyecto

```
vaxav-ui/
├── src/
│   ├── app.css                 # Estilos globales (Tailwind + Golden Layout)
│   ├── app.html                # Template HTML principal
│   ├── app.d.ts                # Tipos globales de TypeScript
│   │
│   ├── lib/                    # Biblioteca de componentes y utilidades
│   │   ├── index.ts            # Exportaciones principales
│   │   │
│   │   ├── assets/             # Assets estáticos
│   │   │   └── favicon.svg     # Icono de la aplicación
│   │   │
│   │   ├── data/               # Capa de datos y API
│   │   │   ├── api.ts          # Servicio de API abstracto
│   │   │   ├── types.ts        # Tipos e interfaces del dominio
│   │   │   └── fixtures/       # Datos mock para desarrollo
│   │   │       └── index.ts    # Fixtures de pilotos, naves, sistemas
│   │   │
│   │   ├── layout/             # Configuración de Golden Layout
│   │   │   ├── layoutConfig.ts # Configuración por defecto del layout
│   │   │   └── panelRegistry.ts# Registro de paneles disponibles
│   │   │
│   │   ├── panels/             # Paneles del juego (Golden Layout)
│   │   │   ├── MapPanel.svelte # Panel de navegación estelar
│   │   │   ├── PilotPanel.svelte# Panel de información del piloto
│   │   │   └── ShipPanel.svelte # Panel de detalles de la nave
│   │   │
│   │   ├── stores/             # Estado global (Svelte 5 runes)
│   │   │   ├── gameStore.svelte.ts  # Estado del juego
│   │   │   └── layoutStore.svelte.ts# Estado del layout
│   │   │
│   │   ├── styles/             # Estilos específicos
│   │   │   └── golden-layout.css# Tema sci-fi para Golden Layout
│   │   │
│   │   └── ui/                 # Componentes UI reutilizables
│   │       ├── index.ts        # Exportaciones de componentes
│   │       ├── Badge.svelte    # Etiquetas de estado
│   │       ├── Button.svelte   # Botones con variantes
│   │       ├── Card.svelte     # Contenedores de tarjeta
│   │       ├── Input.svelte    # Campos de entrada
│   │       ├── Modal.svelte    # Diálogos modales
│   │       ├── Progress.svelte # Barras de progreso
│   │       ├── Table.svelte    # Tablas de datos
│   │       └── Tooltip.svelte  # Tooltips informativos
│   │
│   └── routes/                 # Rutas de SvelteKit
│       ├── +layout.svelte      # Layout principal
│       ├── +page.svelte        # Página de inicio
│       ├── game/               # Módulo del juego
│       │   └── +page.svelte    # Interfaz principal con paneles
│       └── ui-showcase/        # Demostración de componentes UI
│           └── +page.svelte
│
├── static/                     # Assets públicos
├── package.json                # Dependencias y scripts
├── svelte.config.js            # Configuración de SvelteKit
├── tsconfig.json               # Configuración de TypeScript
└── vite.config.ts              # Configuración de Vite
```

## 🚀 Comenzando

### Prerrequisitos

- Node.js 18+ 
- npm, pnpm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd vaxav-ui

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run check` | Ejecuta verificación de tipos TypeScript |

## 🎨 Sistema de Diseño

VaxaV utiliza una paleta de colores sci-fi con tonos oscuros y acentos en cian:

- **Fondo Base**: `#111827` (gray-900)
- **Fondo Header**: `#1f2937` (gray-800)
- **Bordes**: `#4b5563` (gray-600)
- **Texto Principal**: `#f3f4f6` (gray-100)
- **Acento Primario**: `#06b6d4` (cyan-500)

## 📱 Interfaz Modular

La interfaz del juego utiliza **Golden Layout** para proporcionar una experiencia de escritorio profesional:

- **Paneles Arrastrables**: Reorganiza la interfaz según tus preferencias
- **Pestañas**: Agrupa múltiples paneles en un solo espacio
- **Divisores Redimensionables**: Ajusta el tamaño de cada panel
- **Persistencia**: El layout se guarda automáticamente en localStorage

## 🔮 Roadmap

- [ ] Sistema de autenticación
- [ ] Conexión con backend API
- [ ] Panel de inventario
- [ ] Sistema de misiones
- [ ] Chat en tiempo real
- [ ] Mapa estelar interactivo
- [ ] Sistema de combate
- [ ] Mercado de comercio

## 📄 Licencia

Este proyecto está en desarrollo activo. Licencia por definir.

---

*"Entre las estrellas, forja tu destino."* ✨
