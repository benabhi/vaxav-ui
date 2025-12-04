/* =============================================================================
   VaxaV Icon Definitions
   SVG path data for all icons used in the application
   ============================================================================= */

export interface IconDefinition {
    viewBox: string;
    paths: string[];
}

/**
 * Icon registry containing all SVG icon definitions.
 * Each icon has a viewBox and one or more path definitions.
 */
export const icons: Record<string, IconDefinition> = {
    // Panel Controls
    close: {
        viewBox: '0 0 24 24',
        paths: [
            'M18 6L6 18M6 6l12 12'
        ]
    },
    maximize: {
        viewBox: '0 0 24 24',
        paths: [
            'M4 4h16v16H4V4z'
        ]
    },
    minimize: {
        viewBox: '0 0 24 24',
        paths: [
            'M4 12h16'
        ]
    },
    restore: {
        viewBox: '0 0 24 24',
        paths: [
            'M4 8h12v12H4V8z',
            'M8 4h12v12'
        ]
    },
    popout: {
        viewBox: '0 0 24 24',
        paths: [
            'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
            'M15 3h6v6',
            'M10 14L21 3'
        ]
    },
    float: {
        viewBox: '0 0 24 24',
        paths: [
            'M3 3h18v18H3V3z',
            'M9 9h9v9H9V9z'
        ]
    },
    dock: {
        viewBox: '0 0 24 24',
        paths: [
            'M3 3h18v18H3V3z',
            'M9 15l6-6',
            'M9 9h6v6'
        ]
    },

    // Navigation & Menu
    menu: {
        viewBox: '0 0 24 24',
        paths: [
            'M4 6h16M4 12h16M4 18h16'
        ]
    },
    chevronDown: {
        viewBox: '0 0 24 24',
        paths: [
            'M6 9l6 6 6-6'
        ]
    },
    chevronRight: {
        viewBox: '0 0 24 24',
        paths: [
            'M9 6l6 6-6 6'
        ]
    },
    chevronLeft: {
        viewBox: '0 0 24 24',
        paths: [
            'M15 6l-6 6 6 6'
        ]
    },
    chevronUp: {
        viewBox: '0 0 24 24',
        paths: [
            'M6 15l6-6 6 6'
        ]
    },

    // Game Icons
    pilot: {
        viewBox: '0 0 24 24',
        paths: [
            'M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
            'M12 12c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z'
        ]
    },
    ship: {
        viewBox: '0 0 24 24',
        paths: [
            'M12 2L3 9l2 11h14l2-11L12 2z',
            'M12 2v20',
            'M5 9h14'
        ]
    },
    map: {
        viewBox: '0 0 24 24',
        paths: [
            'M3 7l6-3 6 3 6-3v14l-6 3-6-3-6 3V7z',
            'M9 4v14',
            'M15 7v14'
        ]
    },
    planet: {
        viewBox: '0 0 24 24',
        paths: [
            'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
            'M2 12h20',
            'M12 2c-2.5 2.5-4 6-4 10s1.5 7.5 4 10c2.5-2.5 4-6 4-10s-1.5-7.5-4-10z'
        ]
    },
    star: {
        viewBox: '0 0 24 24',
        paths: [
            'M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 16.5 5.7 21l2.3-7-6-4.6h7.6L12 2z'
        ]
    },

    // Status Icons
    warning: {
        viewBox: '0 0 24 24',
        paths: [
            'M12 2L2 22h20L12 2z',
            'M12 9v5',
            'M12 17v.01'
        ]
    },
    error: {
        viewBox: '0 0 24 24',
        paths: [
            'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
            'M15 9l-6 6',
            'M9 9l6 6'
        ]
    },
    success: {
        viewBox: '0 0 24 24',
        paths: [
            'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
            'M9 12l2 2 4-4'
        ]
    },
    info: {
        viewBox: '0 0 24 24',
        paths: [
            'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
            'M12 11v5',
            'M12 7v.01'
        ]
    },

    // Actions
    settings: {
        viewBox: '0 0 24 24',
        paths: [
            'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
            'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'
        ]
    },
    refresh: {
        viewBox: '0 0 24 24',
        paths: [
            'M23 4v6h-6',
            'M1 20v-6h6',
            'M3.51 9a9 9 0 0 1 14.85-3.36L23 10',
            'M20.49 15a9 9 0 0 1-14.85 3.36L1 14'
        ]
    },
    plus: {
        viewBox: '0 0 24 24',
        paths: [
            'M12 5v14',
            'M5 12h14'
        ]
    },
    search: {
        viewBox: '0 0 24 24',
        paths: [
            'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z',
            'M21 21l-4.35-4.35'
        ]
    },

    // Misc
    terminal: {
        viewBox: '0 0 24 24',
        paths: [
            'M4 17l6-6-6-6',
            'M12 19h8'
        ]
    },
    grid: {
        viewBox: '0 0 24 24',
        paths: [
            'M3 3h7v7H3V3z',
            'M14 3h7v7h-7V3z',
            'M3 14h7v7H3v-7z',
            'M14 14h7v7h-7v-7z'
        ]
    },
    link: {
        viewBox: '0 0 24 24',
        paths: [
            'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
            'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'
        ]
    }
};

/**
 * Get an icon definition by name
 */
export function getIcon(name: string): IconDefinition | undefined {
    return icons[name];
}

/**
 * Check if an icon exists
 */
export function hasIcon(name: string): boolean {
    return name in icons;
}

/**
 * Get all available icon names
 */
export function getIconNames(): string[] {
    return Object.keys(icons);
}
