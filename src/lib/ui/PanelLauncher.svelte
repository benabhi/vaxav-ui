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
    let inputComponent: { focus: () => void };
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
        width: 36px;
        height: 100%;
        padding: 0;
        background: #0a0a0c;
        border: none;
        border-right: 1px solid #151515;
        color: var(--crt-green, #00ff41);
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .launcher-button:hover {
        background: #111;
        color: var(--crt-green, #00ff41);
        text-shadow: 0 0 8px var(--crt-green-glow, rgba(0, 255, 65, 0.5));
    }

    .launcher-menu {
        position: absolute;
        top: 100%;
        left: 0;
        width: 320px;
        background: var(--crt-bg-dark, #0a0a0c);
        border: 1px solid var(--crt-border, #1a3a1a);
        border-top: 2px solid var(--crt-green, #00ff41);
        box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.6),
            0 0 20px rgba(0, 255, 65, 0.1);
        z-index: 1000;
        animation: slideDown 0.15s ease;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .search-container {
        padding: 10px;
        border-bottom: 1px solid var(--crt-border, #1a3a1a);
    }

    .panels-list {
        max-height: 320px;
        overflow-y: auto;
        padding: 6px 0;
    }

    .panel-item {
        display: flex;
        align-items: flex-start;
        width: 100%;
        padding: 10px 14px;
        gap: 12px;
        background: transparent;
        border: none;
        color: var(--crt-text-primary, #b0d0b0);
        text-align: left;
        cursor: pointer;
        transition: all 0.1s ease;
    }

    .panel-item:hover,
    .panel-item.selected {
        background: rgba(0, 255, 65, 0.08);
    }

    .panel-item.selected {
        background: rgba(0, 255, 65, 0.14);
    }

    .panel-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        color: var(--crt-green, #00ff41);
        opacity: 0.8;
        flex-shrink: 0;
    }

    .panel-item.selected .panel-icon,
    .panel-item:hover .panel-icon {
        opacity: 1;
    }

    .panel-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    .panel-title {
        font-family: var(--font-mono, "JetBrains Mono", monospace);
        font-size: 12px;
        font-weight: 500;
        color: var(--crt-text-primary, #b0d0b0);
    }

    .panel-item.selected .panel-title,
    .panel-item:hover .panel-title {
        color: var(--crt-green, #00ff41);
    }

    .panel-desc {
        font-family: var(--font-mono, "JetBrains Mono", monospace);
        font-size: 10px;
        color: var(--crt-text-muted, #5a7a5a);
        line-height: 1.3;
    }

    .no-results {
        padding: 20px;
        text-align: center;
        color: var(--crt-text-muted, #3a5a3a);
        font-size: 11px;
        font-family: var(--font-mono, "JetBrains Mono", monospace);
    }

    .launcher-footer {
        padding: 8px 14px;
        border-top: 1px solid var(--crt-border, #1a3a1a);
    }

    .shortcut-hint {
        color: var(--crt-text-muted, #3a5a3a);
        font-family: var(--font-mono, "JetBrains Mono", monospace);
        font-size: 10px;
    }
</style>
