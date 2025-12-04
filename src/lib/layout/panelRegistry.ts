// Panel Registry - Maps panel types to component constructors
import { MapPanel } from '$lib/panels/MapPanel';
import { PilotPanel } from '$lib/panels/PilotPanel';
import { ShipPanel } from '$lib/panels/ShipPanel';
import type { Component } from 'svelte';

/**
 * Configuration options for individual panels.
 * These can override the global defaults set in layoutConfig.
 */
export interface PanelConfig {
    /** Whether the panel can be closed. Default: true */
    isClosable?: boolean;
    /** Whether the panel can be maximized. Default: true */
    isMaximizable?: boolean;
    /** Whether to show the header. Default: true */
    showHeader?: boolean;
    /** Whether the panel can be dragged to reorder. Default: true */
    reorderEnabled?: boolean;
}

/**
 * Complete information about a panel type.
 */
export interface PanelInfo {
    /** The Svelte component to render */
    component: Component<any>;
    /** Display title for the panel */
    title: string;
    /** Icon name from the icon registry */
    icon?: string;
    /** Panel-specific configuration overrides */
    config?: PanelConfig;
}

/**
 * Default panel configuration applied to all panels unless overridden.
 */
export const defaultPanelConfig: Required<PanelConfig> = {
    isClosable: true,
    isMaximizable: true,
    showHeader: true,
    reorderEnabled: true,
};

/**
 * Registry of all available panel types.
 * Each entry maps a panel type identifier to its component and metadata.
 */
export const panelRegistry: Record<string, PanelInfo> = {
    MapPanel: {
        component: MapPanel,
        title: 'Star Map',
        icon: 'map',
    },
    PilotPanel: {
        component: PilotPanel,
        title: 'Pilot',
        icon: 'pilot',
    },
    ShipPanel: {
        component: ShipPanel,
        title: 'Ship',
        icon: 'ship',
    },
};

/**
 * Get panel information by type.
 */
export function getPanelComponent(type: string): PanelInfo | undefined {
    return panelRegistry[type];
}

/**
 * Get all registered panel types.
 */
export function getAllPanelTypes(): string[] {
    return Object.keys(panelRegistry);
}

/**
 * Get the effective configuration for a panel, merging defaults with overrides.
 */
export function getPanelConfig(type: string): Required<PanelConfig> {
    const panel = panelRegistry[type];
    if (!panel) {
        return { ...defaultPanelConfig };
    }
    return {
        ...defaultPanelConfig,
        ...panel.config,
    };
}
