// Floating Panels Store - Manages floating panel state
import { writable } from 'svelte/store';

export interface FloatingPanelState {
    id: string;
    componentType: string;
    title: string;
    icon?: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

function createFloatingPanelsStore() {
    const { subscribe, set, update } = writable<FloatingPanelState[]>([]);

    return {
        subscribe,

        /**
         * Add a panel to floating mode
         */
        float: (panel: Omit<FloatingPanelState, 'x' | 'y'> & { x?: number; y?: number }) => {
            update(panels => {
                // Check if already floating
                if (panels.find(p => p.id === panel.id)) return panels;

                // Calculate position (stack slightly offset)
                const offset = panels.length * 30;
                return [...panels, {
                    ...panel,
                    x: panel.x ?? 100 + offset,
                    y: panel.y ?? 100 + offset,
                }];
            });
        },

        /**
         * Remove a panel from floating mode (dock it back)
         */
        dock: (id: string) => {
            update(panels => panels.filter(p => p.id !== id));
        },

        /**
         * Update panel position
         */
        updatePosition: (id: string, x: number, y: number) => {
            update(panels => panels.map(p =>
                p.id === id ? { ...p, x, y } : p
            ));
        },

        /**
         * Update panel size
         */
        updateSize: (id: string, width: number, height: number) => {
            update(panels => panels.map(p =>
                p.id === id ? { ...p, width, height } : p
            ));
        },

        /**
         * Bring panel to front
         */
        bringToFront: (id: string) => {
            update(panels => {
                const panel = panels.find(p => p.id === id);
                if (!panel) return panels;
                return [...panels.filter(p => p.id !== id), panel];
            });
        },

        /**
         * Close a floating panel
         */
        close: (id: string) => {
            update(panels => panels.filter(p => p.id !== id));
        },

        /**
         * Clear all floating panels
         */
        clear: () => set([]),

        /**
         * Check if a panel is floating
         */
        isFloating: (id: string, panels: FloatingPanelState[]) => {
            return panels.some(p => p.id === id);
        }
    };
}

export const floatingPanels = createFloatingPanelsStore();
