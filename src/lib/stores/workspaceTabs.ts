// Workspace Tabs Store - Manages workspace tabs with individual layouts
import { writable, get } from 'svelte/store';
import type { LayoutConfig } from 'golden-layout';
import { defaultLayoutConfig } from '$lib/layout/layoutConfig';

// Empty layout config - no panels
const emptyLayoutConfig: LayoutConfig = {
    root: {
        type: 'row',
        content: []
    }
};

export interface WorkspaceTab {
    id: string;
    name: string;
    layoutConfig: LayoutConfig | object;
}

interface WorkspaceTabsState {
    tabs: WorkspaceTab[];
    activeTabId: string;
}

function createWorkspaceTabsStore() {
    // Deep clone the default layout to ensure independence
    const defaultLayoutClone = JSON.parse(JSON.stringify(defaultLayoutConfig));

    const defaultTab: WorkspaceTab = {
        id: 'default',
        name: 'default',
        layoutConfig: defaultLayoutClone,
    };

    const initialState: WorkspaceTabsState = {
        tabs: [defaultTab],
        activeTabId: 'default',
    };

    // Keep reference to the store itself
    const store = writable<WorkspaceTabsState>(initialState);

    let tabCounter = 1;

    return {
        subscribe: store.subscribe,

        /**
         * Add a new tab (starts empty, no panels)
         */
        addTab: (name?: string): string => {
            const id = `tab-${Date.now()}`;
            tabCounter++;
            const tabName = name || `Tab ${tabCounter}`;

            // New tabs start with empty layout (deep cloned)
            const newTab: WorkspaceTab = {
                id,
                name: tabName,
                layoutConfig: JSON.parse(JSON.stringify(emptyLayoutConfig)),
            };

            store.update(state => ({
                ...state,
                tabs: [...state.tabs, newTab],
                activeTabId: id,
            }));

            return id;
        },

        /**
         * Remove a tab (cannot remove last tab)
         */
        removeTab: (id: string) => {
            store.update(state => {
                if (state.tabs.length <= 1) return state;

                const newTabs = state.tabs.filter(t => t.id !== id);
                let newActiveId = state.activeTabId;

                if (id === state.activeTabId) {
                    const removedIndex = state.tabs.findIndex(t => t.id === id);
                    const newIndex = Math.max(0, removedIndex - 1);
                    newActiveId = newTabs[newIndex]?.id || newTabs[0].id;
                }

                return {
                    tabs: newTabs,
                    activeTabId: newActiveId,
                };
            });
        },

        /**
         * Rename a tab
         */
        renameTab: (id: string, newName: string) => {
            store.update(state => ({
                ...state,
                tabs: state.tabs.map(t =>
                    t.id === id ? { ...t, name: newName.trim() || t.name } : t
                ),
            }));
        },

        /**
         * Switch to a tab
         */
        switchTab: (id: string) => {
            store.update(state => {
                if (!state.tabs.find(t => t.id === id)) return state;
                return { ...state, activeTabId: id };
            });
        },

        /**
         * Save layout config for a specific tab (with deep clone)
         */
        saveLayoutForTab: (tabId: string, config: LayoutConfig | object) => {
            // Deep clone to ensure the stored config is independent
            const clonedConfig = JSON.parse(JSON.stringify(config));
            console.log('[Store] saveLayoutForTab:', tabId, clonedConfig);

            store.update(state => {
                const newTabs = state.tabs.map(t =>
                    t.id === tabId ? { ...t, layoutConfig: clonedConfig } : t
                );
                console.log('[Store] Updated tabs:', newTabs);
                return { ...state, tabs: newTabs };
            });
        },

        /**
         * Get layout config for a specific tab (returns deep clone)
         */
        getTabLayout: (id: string): LayoutConfig | object | null => {
            const state = get(store);  // Use store reference directly
            const tab = state.tabs.find(t => t.id === id);
            if (!tab) {
                console.log('[Store] getTabLayout: tab not found:', id);
                return null;
            }
            // Return deep clone to prevent mutations
            const cloned = JSON.parse(JSON.stringify(tab.layoutConfig));
            console.log('[Store] getTabLayout:', id, cloned);
            return cloned;
        },

        /**
         * Get the active tab
         */
        getActiveTab: (): WorkspaceTab | null => {
            const state = get(store);
            return state.tabs.find(t => t.id === state.activeTabId) || null;
        },

        /**
         * Get active tab ID
         */
        getActiveTabId: (): string => {
            const state = get(store);
            return state.activeTabId;
        },

        /**
         * Add a panel config to a specific tab's layout
         */
        addPanelToTab: (tabId: string, componentType: string, title: string) => {
            store.update(state => {
                const tab = state.tabs.find(t => t.id === tabId);
                if (!tab) return state;

                // Clone the layout config
                const layoutConfig = JSON.parse(JSON.stringify(tab.layoutConfig)) as any;

                // Create the new component config
                const newComponent = {
                    type: 'component',
                    componentType: componentType,
                    title: title,
                };

                // Add to the layout
                if (!layoutConfig.root) {
                    layoutConfig.root = { type: 'row', content: [] };
                }

                if (!layoutConfig.root.content) {
                    layoutConfig.root.content = [];
                }

                // If empty, add as first stack
                if (layoutConfig.root.content.length === 0) {
                    layoutConfig.root.content.push({
                        type: 'stack',
                        content: [newComponent]
                    });
                } else {
                    // Add to existing first stack or create new one
                    const firstItem = layoutConfig.root.content[0];
                    if (firstItem.type === 'stack') {
                        firstItem.content = firstItem.content || [];
                        firstItem.content.push(newComponent);
                    } else {
                        // Wrap everything in a row with the new component
                        layoutConfig.root.content.push({
                            type: 'stack',
                            content: [newComponent]
                        });
                    }
                }

                console.log('[Store] addPanelToTab:', tabId, componentType, layoutConfig);

                return {
                    ...state,
                    tabs: state.tabs.map(t =>
                        t.id === tabId ? { ...t, layoutConfig } : t
                    ),
                };
            });
        },

        /**
         * Reset to default state
         */
        reset: () => {
            tabCounter = 1;
            store.set({
                tabs: [{
                    id: 'default',
                    name: 'default',
                    layoutConfig: JSON.parse(JSON.stringify(defaultLayoutConfig)),
                }],
                activeTabId: 'default',
            });
        },
    };
}

export const workspaceTabs = createWorkspaceTabsStore();
