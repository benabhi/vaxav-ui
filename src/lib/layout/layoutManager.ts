// Layout Manager - Intelligent panel placement and management
import type { GoldenLayout, ComponentItem, RowOrColumn, ContentItem, ResolvedLayoutConfig, ResolvedComponentItemConfig } from 'golden-layout';
import { panelRegistry } from './panelRegistry';

/**
 * Manages panel placement with intelligent split logic.
 * Adds panels as individual splits rather than tabs.
 */
export class LayoutManager {
    private layout: GoldenLayout;
    private placementCounter = 0;

    constructor(layout: GoldenLayout) {
        this.layout = layout;
    }

    /**
     * Add a panel to the layout as an individual split (not as a tab).
     */
    addPanelAsSplit(componentType: string): boolean {
        const panelInfo = panelRegistry[componentType];
        if (!panelInfo) return false;

        const rootItem = this.layout.rootItem;

        const newComponentConfig = {
            type: 'component',
            componentType: componentType,
            title: panelInfo.title,
        };

        // Handle empty layout case
        if (!rootItem || !rootItem.contentItems || rootItem.contentItems.length === 0) {
            try {
                this.layout.loadLayout({
                    root: {
                        type: 'row',
                        content: [{
                            type: 'stack',
                            content: [newComponentConfig]
                        }]
                    }
                } as any);
                return true;
            } catch (e) {
                console.error('Failed to load initial layout:', e);
                return false;
            }
        }

        try {
            // Case 1: Root is a row or column - add a new stack to it
            if (rootItem.type === 'row' || rootItem.type === 'column') {
                (rootItem as RowOrColumn).addItem({
                    type: 'stack',
                    content: [newComponentConfig]
                } as any);
                this.placementCounter++;
                return true;
            }

            // Case 2: Root is a stack (only 1 panel visible)
            // We need to restructure: get existing components, build new layout
            if (rootItem.type === 'stack') {
                // Get info about existing components in the stack
                const existingComponents = this.getComponentConfigs(rootItem);

                if (existingComponents.length === 0) {
                    // Empty stack, just add component
                    this.layout.addComponent(componentType, undefined, panelInfo.title);
                    return true;
                }

                // Build a new layout config with row containing:
                // 1. Stack with existing components
                // 2. Stack with new component
                const newLayout = {
                    root: {
                        type: this.placementCounter % 2 === 0 ? 'row' : 'column',
                        content: [
                            {
                                type: 'stack',
                                content: existingComponents
                            },
                            {
                                type: 'stack',
                                content: [newComponentConfig]
                            }
                        ]
                    }
                };

                // Clear and reload
                this.layout.clear();
                this.layout.loadLayout(newLayout as any);
                this.placementCounter++;
                return true;
            }

            // Fallback
            this.layout.addComponent(componentType, undefined, panelInfo.title);
            this.placementCounter++;
            return true;
        } catch (e) {
            console.error('Failed to add panel as split:', e);
            try {
                this.layout.addComponent(componentType, undefined, panelInfo.title);
                return true;
            } catch (e2) {
                return false;
            }
        }
    }

    /**
     * Extract component configs from a content item tree.
     * Returns simple component config objects (not resolved).
     */
    private getComponentConfigs(item: ContentItem): any[] {
        const configs: any[] = [];

        if (item.type === 'component') {
            const comp = item as ComponentItem;
            configs.push({
                type: 'component',
                componentType: comp.componentType,
                title: comp.title,
            });
        }

        if (item.contentItems) {
            for (const child of item.contentItems) {
                configs.push(...this.getComponentConfigs(child));
            }
        }

        return configs;
    }

    /**
     * Remove a panel from the layout by component type.
     */
    removePanel(componentType: string): boolean {
        const rootItem = this.layout.rootItem;
        if (!rootItem) return false;

        const components = this.findComponentsByType(rootItem, componentType);
        if (components.length > 0) {
            (components[0] as ComponentItem).close();
            return true;
        }
        return false;
    }

    /**
     * Find all component items of a specific type.
     */
    findComponentsByType(item: ContentItem, componentType: string): ContentItem[] {
        const results: ContentItem[] = [];

        if (item.type === 'component') {
            const compItem = item as ComponentItem;
            if (compItem.componentType === componentType) {
                results.push(item);
            }
        }

        if (item.contentItems) {
            for (const child of item.contentItems) {
                results.push(...this.findComponentsByType(child, componentType));
            }
        }

        return results;
    }

    /**
     * Get all currently displayed component types.
     */
    getDisplayedComponentTypes(): string[] {
        const rootItem = this.layout.rootItem;
        if (!rootItem) return [];

        const types: string[] = [];
        const collect = (item: ContentItem) => {
            if (item.type === 'component') {
                const compItem = item as ComponentItem;
                const compType = compItem.componentType;
                if (typeof compType === 'string' && !types.includes(compType)) {
                    types.push(compType);
                }
            }
            if (item.contentItems) {
                for (const child of item.contentItems) {
                    collect(child);
                }
            }
        };

        collect(rootItem);
        return types;
    }

    /**
     * Check if a component type is currently displayed.
     */
    isComponentDisplayed(componentType: string): boolean {
        return this.getDisplayedComponentTypes().includes(componentType);
    }
}
