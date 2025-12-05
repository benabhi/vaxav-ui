<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { panelRegistry } from "$lib/layout/panelRegistry";
    import { icons } from "$lib/icons";
    import Input from "./Input.svelte";

    interface Props {
        onAddPanel?: (componentType: string) => void;
    }

    let { onAddPanel }: Props = $props();

    let isOpen = $state(false);
    let searchQuery = $state("");
    let selectedIndex = $state(0);
    let inputComponent = $state<{ focus: () => void } | undefined>();
    let menuRef: HTMLDivElement;

    // Get filtered panels based on search
    const filteredPanels = $derived(() => {
        const query = searchQuery.toLowerCase().trim();
        const entries = Object.entries(panelRegistry);

        if (!query) return entries;

        return entries.filter(
            ([type, info]) =>
                info.title.toLowerCase().includes(query) ||
                type.toLowerCase().includes(query) ||
                (info.description?.toLowerCase().includes(query) ?? false),
        );
    });

    function getIconSvg(iconName: string, size: number = 16): string {
        const icon = icons[iconName];
        if (!icon) return "";
        const paths = icon.paths.map((p) => `<path d="${p}" />`).join("");
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
    }

    function toggleMenu() {
        isOpen = !isOpen;
        if (isOpen) {
            searchQuery = "";
            selectedIndex = 0;
            setTimeout(() => inputComponent?.focus(), 50);
        }
    }

    function closeMenu() {
        isOpen = false;
        searchQuery = "";
        selectedIndex = 0;
    }

    function selectPanel(componentType: string) {
        if (onAddPanel) {
            onAddPanel(componentType);
        }
        closeMenu();
    }

    function handleKeydown(e: KeyboardEvent) {
        const panels = filteredPanels();

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, panels.length - 1);
                break;
            case "ArrowUp":
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, 0);
                break;
            case "Enter":
                e.preventDefault();
                if (panels[selectedIndex]) {
                    selectPanel(panels[selectedIndex][0]);
                }
                break;
            case "Escape":
                e.preventDefault();
                closeMenu();
                break;
        }
    }

    function handleGlobalKeydown(e: KeyboardEvent) {
        // Ctrl+Space to open launcher
        if (e.ctrlKey && e.code === "Space") {
            e.preventDefault();
            if (!isOpen) {
                toggleMenu();
            } else {
                inputComponent?.focus();
            }
        }
    }

    function handleClickOutside(e: MouseEvent) {
        if (isOpen && menuRef && !menuRef.contains(e.target as Node)) {
            closeMenu();
        }
    }

    onMount(() => {
        document.addEventListener("keydown", handleGlobalKeydown);
        document.addEventListener("click", handleClickOutside, true);
    });

    onDestroy(() => {
        document.removeEventListener("keydown", handleGlobalKeydown);
        document.removeEventListener("click", handleClickOutside, true);
    });

    // Reset selected index when search changes
    $effect(() => {
        searchQuery;
        selectedIndex = 0;
    });
</script>

<div class="panel-launcher" bind:this={menuRef}>
    <button
        class="launcher-button"
        onclick={toggleMenu}
        title="Add Panel (Ctrl+Space)"
    >
        {@html getIconSvg("grid", 16)}
    </button>

    {#if isOpen}
        <div class="launcher-menu">
            <div class="search-container">
                <Input
                    bind:this={inputComponent}
                    icon="search"
                    placeholder="Search panels..."
                    bind:value={searchQuery}
                    onkeydown={handleKeydown}
                    size="sm"
                    autofocus
                />
            </div>

            <div class="panels-list">
                {#each filteredPanels() as [type, info], index (type)}
                    <button
                        class="panel-item"
                        class:selected={index === selectedIndex}
                        onclick={() => selectPanel(type)}
                        onmouseenter={() => (selectedIndex = index)}
                    >
                        {#if info.icon}
                            <span class="panel-icon"
                                >{@html getIconSvg(info.icon, 20)}</span
                            >
                        {/if}
                        <div class="panel-info">
                            <span class="panel-title">{info.title}</span>
                            {#if info.description}
                                <span class="panel-desc"
                                    >{info.description}</span
                                >
                            {/if}
                        </div>
                    </button>
                {:else}
                    <div class="no-results">No panels found</div>
                {/each}
            </div>

            <div class="launcher-footer">
                <span class="shortcut-hint">Ctrl+Space to open</span>
            </div>
        </div>
    {/if}
</div>

<style>
    .panel-launcher {
        position: relative;
        display: flex;
        align-items: stretch;
        height: 100%;
    }

    .launcher-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 100%;
        padding: 0;
        background: transparent;
        border: none;
        border-right: 1px solid rgba(0, 255, 65, 0.1);
        color: var(--crt-green);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .launcher-button:hover {
        background: rgba(0, 255, 65, 0.05);
        color: var(--crt-green-bright);
        text-shadow: 0 0 8px var(--crt-green-glow);
    }

    .launcher-menu {
        position: absolute;
        top: 100%;
        left: 0;
        width: 320px;
        background: rgba(5, 10, 7, 0.9);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(0, 255, 65, 0.2);
        border-top: 1px solid var(--crt-green);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 1000;
        animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .search-container {
        padding: 12px;
        border-bottom: 1px solid rgba(0, 255, 65, 0.1);
    }

    .panels-list {
        max-height: 320px;
        overflow-y: auto;
        padding: 4px 0;
    }

    .panel-item {
        display: flex;
        align-items: flex-start;
        width: 100%;
        padding: 12px 16px;
        gap: 12px;
        background: transparent;
        border: none;
        color: var(--crt-text-dim);
        text-align: left;
        cursor: pointer;
        transition: all 0.15s ease;
        border-left: 2px solid transparent;
    }

    .panel-item:hover,
    .panel-item.selected {
        background: rgba(0, 255, 65, 0.05);
        color: var(--crt-text-primary);
    }

    .panel-item.selected {
        border-left-color: var(--crt-green);
        background: linear-gradient(
            90deg,
            rgba(0, 255, 65, 0.1) 0%,
            transparent 100%
        );
    }

    .panel-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        color: var(--crt-green);
        opacity: 0.7;
        flex-shrink: 0;
    }

    .panel-item.selected .panel-icon,
    .panel-item:hover .panel-icon {
        opacity: 1;
        filter: drop-shadow(0 0 5px var(--crt-green-glow));
    }

    .panel-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }

    .panel-title {
        font-family: var(--font-display);
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 0.5px;
        color: var(--crt-text-primary);
    }

    .panel-item.selected .panel-title {
        color: var(--crt-green-bright);
    }

    .panel-desc {
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--crt-text-muted);
        line-height: 1.3;
    }

    .no-results {
        padding: 24px;
        text-align: center;
        color: var(--crt-text-muted);
        font-size: 12px;
        font-family: var(--font-mono);
    }

    .launcher-footer {
        padding: 8px 16px;
        border-top: 1px solid rgba(0, 255, 65, 0.1);
        background: rgba(0, 0, 0, 0.2);
    }

    .shortcut-hint {
        color: var(--crt-text-muted);
        font-family: var(--font-mono);
        font-size: 10px;
        opacity: 0.7;
    }
</style>
