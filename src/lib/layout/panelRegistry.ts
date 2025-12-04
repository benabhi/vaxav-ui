// Panel Registry - Maps panel types to component constructors
import MapPanel from '$lib/panels/MapPanel.svelte';
import PilotPanel from '$lib/panels/PilotPanel.svelte';
import ShipPanel from '$lib/panels/ShipPanel.svelte';
import type { Component } from 'svelte';

export interface PanelInfo {
    component: Component<any>;
    title: string;
    icon?: string;
}

export const panelRegistry: Record<string, PanelInfo> = {
    MapPanel: {
        component: MapPanel,
        title: 'Star Map',
    },
    PilotPanel: {
        component: PilotPanel,
        title: 'Pilot',
    },
    ShipPanel: {
        component: ShipPanel,
        title: 'Ship',
    },
};

export function getPanelComponent(type: string): PanelInfo | undefined {
    return panelRegistry[type];
}

export function getAllPanelTypes(): string[] {
    return Object.keys(panelRegistry);
}
