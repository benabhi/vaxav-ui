<script lang="ts">
    import {
        workspaceTabs,
        type WorkspaceTab,
    } from "$lib/stores/workspaceTabs";
    import type { LayoutConfig } from "golden-layout";
    import { onMount } from "svelte";

    interface Props {
        onTabSwitch?: (
            tabId: string,
            layoutConfig: LayoutConfig | object,
        ) => void;
        onSaveCurrentLayout?: () => LayoutConfig | object | null;
    }

    let { onTabSwitch, onSaveCurrentLayout }: Props = $props();

    let tabs = $state<WorkspaceTab[]>([]);
    let activeTabId = $state<string>("default");
    let editingTabId = $state<string | null>(null);
    let editingName = $state("");
    let unsubscribe: (() => void) | null = null;

    onMount(() => {
        // Subscribe to store on mount
        unsubscribe = workspaceTabs.subscribe((state) => {
            tabs = state.tabs;
            activeTabId = state.activeTabId;
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    });

    function handleTabClick(tabId: string) {
        if (tabId === activeTabId || editingTabId) return;

        const previousTabId = activeTabId;
        console.log("[TabBar] Switching from", previousTabId, "to", tabId);

        // Step 1: Save current layout
        if (onSaveCurrentLayout) {
            const currentLayout = onSaveCurrentLayout();
            console.log("[TabBar] Current layout to save:", currentLayout);
            if (currentLayout) {
                workspaceTabs.saveLayoutForTab(previousTabId, currentLayout);
            }
        }

        // Step 2: Get the new tab's layout BEFORE switching
        const newLayout = workspaceTabs.getTabLayout(tabId);
        console.log("[TabBar] New layout to load:", newLayout);

        // Step 3: Switch tab in store
        workspaceTabs.switchTab(tabId);

        // Step 4: Load the layout
        if (newLayout && onTabSwitch) {
            onTabSwitch(tabId, newLayout);
        }
    }

    function handleAddTab() {
        const previousTabId = activeTabId;
        console.log("[TabBar] Adding tab. Saving layout for:", previousTabId);

        // Step 1: Save current layout
        if (onSaveCurrentLayout) {
            const currentLayout = onSaveCurrentLayout();
            console.log("[TabBar] Current layout to save:", currentLayout);
            if (currentLayout) {
                workspaceTabs.saveLayoutForTab(previousTabId, currentLayout);
            }
        }

        // Step 2: Create new tab (this also switches activeTabId)
        const newTabId = workspaceTabs.addTab();
        console.log("[TabBar] Created new tab:", newTabId);

        // Step 3: Get new tab's empty layout
        const newLayout = workspaceTabs.getTabLayout(newTabId);
        console.log("[TabBar] Empty layout for new tab:", newLayout);

        // Step 4: Load the empty layout
        if (newLayout && onTabSwitch) {
            onTabSwitch(newTabId, newLayout);
        }
    }

    function handleDoubleClick(tabId: string, currentName: string) {
        editingTabId = tabId;
        editingName = currentName;
    }

    function handleNameKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            finishEditing();
        } else if (e.key === "Escape") {
            editingTabId = null;
        }
    }

    function finishEditing() {
        if (editingTabId && editingName.trim()) {
            workspaceTabs.renameTab(editingTabId, editingName);
        }
        editingTabId = null;
    }

    function handleCloseTab(e: MouseEvent, tabId: string) {
        e.stopPropagation();
        if (tabs.length <= 1) return;

        if (tabId === activeTabId) {
            const tabIndex = tabs.findIndex((t) => t.id === tabId);
            const newIndex = Math.max(0, tabIndex - 1);
            const newTab = tabs.filter((t) => t.id !== tabId)[newIndex];
            if (newTab && onTabSwitch) {
                const layout = workspaceTabs.getTabLayout(newTab.id);
                if (layout) {
                    onTabSwitch(newTab.id, layout);
                }
            }
        }

        workspaceTabs.removeTab(tabId);
    }
</script>

<div class="tab-bar">
    <div class="tabs-container" role="tablist">
        {#each tabs as tab (tab.id)}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="tab"
                class:active={tab.id === activeTabId}
                role="tab"
                tabindex="0"
                aria-selected={tab.id === activeTabId}
                onclick={() => handleTabClick(tab.id)}
                ondblclick={() => handleDoubleClick(tab.id, tab.name)}
                onkeydown={(e) => e.key === "Enter" && handleTabClick(tab.id)}
            >
                {#if editingTabId === tab.id}
                    <!-- svelte-ignore a11y_autofocus -->
                    <input
                        type="text"
                        class="tab-name-input"
                        bind:value={editingName}
                        onkeydown={handleNameKeydown}
                        onblur={finishEditing}
                        autofocus
                    />
                {:else}
                    <span class="tab-name">{tab.name}</span>
                {/if}

                {#if tabs.length > 1}
                    <button
                        class="tab-close"
                        onclick={(e) => handleCloseTab(e, tab.id)}
                        title="Close tab"
                    >
                        <svg viewBox="0 0 24 24" width="10" height="10">
                            <path
                                d="M18 6L6 18M6 6l12 12"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                            />
                        </svg>
                    </button>
                {/if}
            </div>
        {/each}

        <button class="tab-add" onclick={handleAddTab} title="New tab">
            <svg viewBox="0 0 24 24" width="12" height="12">
                <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                />
            </svg>
        </button>
    </div>
</div>

<style>
    .tab-bar {
        height: 32px;
        background: transparent;
        border-bottom: none;
        display: flex;
        align-items: stretch;
        padding: 0;
        font-family: var(--font-mono);
        flex-shrink: 0;
        position: relative;
        z-index: 10;
    }

    .tabs-container {
        display: flex;
        align-items: stretch;
        gap: 1px;
        height: 100%;
        flex: 1;
        padding-left: 1px;
    }

    .tab {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 100%;
        padding: 0 16px;
        background: transparent;
        border: none;
        border-right: 1px solid rgba(0, 255, 65, 0.1);
        color: var(--crt-text-dim);
        font-size: 10px;
        font-family: inherit;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        min-width: 100px;
        max-width: 200px;
    }

    .tab:hover {
        background: rgba(0, 255, 65, 0.05);
        color: var(--crt-text-primary);
    }

    .tab.active {
        background: rgba(0, 255, 65, 0.1);
        color: var(--crt-green);
        border-top: 1px solid var(--crt-green);
        text-shadow: 0 0 8px var(--crt-green-glow);
    }

    .tab.active::after {
        content: "";
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 1px;
        background: transparent;
    }

    .tab-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 120px;
    }

    .tab-name-input {
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid var(--crt-green);
        color: var(--crt-green);
        font-size: 11px;
        font-family: inherit;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 2px 4px;
        width: 80px;
        outline: none;
    }

    .tab-close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 14px;
        height: 14px;
        padding: 0;
        margin-left: 2px;
        background: transparent;
        border: none;
        color: var(--crt-text-muted);
        cursor: pointer;
        border-radius: 2px;
        transition: all 0.15s ease;
        opacity: 0.5;
    }

    .tab-close:hover {
        background: rgba(255, 51, 51, 0.2);
        color: var(--crt-red);
        opacity: 1;
    }

    .tab-add {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 100%;
        padding: 0;
        margin: 0;
        background: transparent;
        border: none;
        border-left: 1px solid rgba(0, 255, 65, 0.1);
        color: var(--crt-text-dim);
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .tab-add:hover {
        background: rgba(0, 255, 65, 0.1);
        color: var(--crt-green);
    }
</style>
