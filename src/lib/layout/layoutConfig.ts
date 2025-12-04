// Layout configuration for Golden Layout
import type { LayoutConfig, ComponentItemConfig } from 'golden-layout';

export const defaultLayoutConfig: LayoutConfig = {
    root: {
        type: 'row',
        content: [
            {
                type: 'column',
                width: 30,
                content: [
                    {
                        type: 'component',
                        componentType: 'PilotPanel',
                        title: 'Pilot',
                    } as ComponentItemConfig,
                    {
                        type: 'component',
                        componentType: 'ShipPanel',
                        title: 'Ship',
                    } as ComponentItemConfig,
                ],
            },
            {
                type: 'component',
                componentType: 'MapPanel',
                title: 'Star Map',
                width: 70,
            } as ComponentItemConfig,
        ],
    },
};

export const STORAGE_KEY = 'vaxav-layout';

export function saveLayout(config: LayoutConfig): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function loadLayout(): LayoutConfig | null {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch {
            return null;
        }
    }
    return null;
}
