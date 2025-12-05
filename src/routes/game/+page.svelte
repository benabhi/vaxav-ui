<script lang="ts">
	// Game page - Golden Layout with panels + Floating panels + Workspace Tabs
	import { onMount, onDestroy } from "svelte";
	import { mount, unmount } from "svelte";
	import {
		GoldenLayout,
		type ComponentContainer,
		type LayoutConfig,
	} from "golden-layout";
	import { defaultLayoutConfig } from "$lib/layout/layoutConfig";
	import { panelRegistry } from "$lib/layout/panelRegistry";
	import { LayoutManager } from "$lib/layout/layoutManager";
	import { icons } from "$lib/icons";
	import {
		floatingPanels,
		type FloatingPanelState,
	} from "$lib/stores/floatingPanels";
	import { workspaceTabs } from "$lib/stores/workspaceTabs";
	import FloatingPanel from "$lib/ui/FloatingPanel.svelte";
	import TabBar from "$lib/ui/TabBar.svelte";

	let layoutContainer: HTMLElement;
	let layoutReady = $state(false);
	let goldenLayout: GoldenLayout | null = null;
	let layoutManager: LayoutManager | null = null;
	let floatingPanelsList = $state<FloatingPanelState[]>([]);

	const unsubscribe = floatingPanels.subscribe((panels) => {
		floatingPanelsList = panels;
	});

	const mountedComponents = new Map<ComponentContainer, any>();

	function getIconSvg(iconName: string, size: number = 12): string {
		const icon = icons[iconName];
		if (!icon) return "";
		const paths = icon.paths.map((p) => `<path d="${p}" />`).join("");
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
	}

	function createTabTitle(title: string, iconName?: string): string {
		if (!iconName) return title;
		const iconSvg = getIconSvg(iconName, 12);
		return `<span class="tab-icon">${iconSvg}</span>${title}`;
	}

	function registerPanelComponents() {
		if (!goldenLayout) return;
		for (const [panelType, panelInfo] of Object.entries(panelRegistry)) {
			goldenLayout.registerComponentFactoryFunction(
				panelType,
				(container: ComponentContainer) => {
					const element = document.createElement("div");
					element.style.width = "100%";
					element.style.height = "100%";
					element.style.overflow = "auto";
					container.element.appendChild(element);

					const component = mount(panelInfo.component, {
						target: element,
					});
					mountedComponents.set(container, component);

					container.addEventListener("beforeComponentRelease", () => {
						const comp = mountedComponents.get(container);
						if (comp) {
							unmount(comp);
							mountedComponents.delete(container);
						}
					});
				},
			);
		}
	}

	onMount(async () => {
		if (!layoutContainer) return;

		goldenLayout = new GoldenLayout(layoutContainer);
		registerPanelComponents();

		const activeTab = workspaceTabs.getActiveTab();
		const layoutConfig = activeTab?.layoutConfig || defaultLayoutConfig;

		goldenLayout.loadLayout({
			...(layoutConfig as any),
			header: {
				show: "top",
				popout: false,
				maximise: "maximise",
				close: "close",
			},
		});

		layoutManager = new LayoutManager(goldenLayout);

		setTimeout(() => {
			updateAllTabIcons();
			updateControlIcons();
		}, 150);

		goldenLayout.on("stateChanged", () => {
			setTimeout(() => {
				updateAllTabIcons();
				updateControlIcons();
			}, 50);
		});

		layoutReady = true;
	});

	/**
	 * Recursively clean a layout item by removing resolved properties
	 * that cause issues when reloading (numeric sizes, etc.)
	 */
	function cleanLayoutItem(item: any): any {
		if (!item) return item;

		const cleaned: any = { type: item.type };

		// Copy component info
		if (item.componentType) cleaned.componentType = item.componentType;
		if (item.componentState) cleaned.componentState = item.componentState;
		if (item.title) cleaned.title = item.title;

		// Only copy string sizes (like "50%"), skip numeric ones
		if (typeof item.width === "string") cleaned.width = item.width;
		if (typeof item.height === "string") cleaned.height = item.height;
		if (typeof item.size === "string") cleaned.size = item.size;

		// Keep boolean flags
		if (typeof item.isClosable === "boolean")
			cleaned.isClosable = item.isClosable;

		// Recursively clean content/children
		if (item.content && Array.isArray(item.content)) {
			cleaned.content = item.content.map(cleanLayoutItem);
		}

		return cleaned;
	}

	/**
	 * Save current layout - clean resolved properties to make it loadable
	 */
	function saveCurrentLayout(): LayoutConfig | object | null {
		if (!goldenLayout) return null;
		try {
			const resolved = goldenLayout.saveLayout();
			// Clean the root structure to remove resolved numeric dimensions
			const layoutToSave = { root: cleanLayoutItem(resolved.root) };
			console.log("[Game] Saved layout (cleaned):", layoutToSave);
			return layoutToSave;
		} catch (e) {
			console.error("Failed to save layout:", e);
			return null;
		}
	}

	function handleTabSwitch(
		tabId: string,
		layoutConfig: LayoutConfig | object,
	) {
		if (!goldenLayout) return;

		console.log(
			"[Game] Switching to tab:",
			tabId,
			"with layout:",
			layoutConfig,
		);

		// Unmount all current components
		for (const [container, component] of mountedComponents) {
			try {
				unmount(component);
			} catch (e) {}
		}
		mountedComponents.clear();

		// Destroy and recreate GoldenLayout
		try {
			goldenLayout.destroy();
		} catch (e) {
			console.error("Error destroying layout:", e);
		}

		goldenLayout = new GoldenLayout(layoutContainer);
		registerPanelComponents();

		try {
			goldenLayout.loadLayout({
				...(layoutConfig as any),
				header: {
					show: "top",
					popout: false,
					maximise: "maximise",
					close: "close",
				},
			});

			layoutManager = new LayoutManager(goldenLayout);

			setTimeout(() => {
				updateAllTabIcons();
				updateControlIcons();
			}, 150);

			goldenLayout.on("stateChanged", () => {
				setTimeout(() => {
					updateAllTabIcons();
					updateControlIcons();
				}, 50);
			});
		} catch (e) {
			console.error("Failed to load tab layout:", e);
		}
	}

	function updateAllTabIcons() {
		if (!goldenLayout) return;
		const tabs = document.querySelectorAll(".lm_tab .lm_title");
		tabs.forEach((titleEl) => {
			const currentText = titleEl.textContent?.trim() || "";
			if (titleEl.querySelector(".tab-icon")) return;
			for (const [_, panelInfo] of Object.entries(panelRegistry)) {
				if (panelInfo.title === currentText && panelInfo.icon) {
					titleEl.innerHTML = createTabTitle(
						panelInfo.title,
						panelInfo.icon,
					);
					break;
				}
			}
		});
	}

	function updateControlIcons() {
		const controlContainers = document.querySelectorAll(".lm_controls");
		controlContainers.forEach((controls) => {
			const popout = controls.querySelector(".lm_popout");
			if (popout) popout.remove();

			if (controls.querySelector(".lm_float")) return;

			const floatBtn = document.createElement("li");
			floatBtn.className = "lm_float";
			floatBtn.title = "Float panel";
			floatBtn.innerHTML = getIconSvg("float", 14);

			const maximise = controls.querySelector(".lm_maximise");
			if (maximise) controls.insertBefore(floatBtn, maximise);

			floatBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				const stack = (controls as HTMLElement).closest(".lm_stack");
				if (stack) handleFloatPanel(stack as HTMLElement);
			});
		});

		document.querySelectorAll(".lm_maximise").forEach((btn) => {
			if (!btn.querySelector("svg"))
				btn.innerHTML = getIconSvg("maximize", 14);
		});

		document.querySelectorAll(".lm_controls .lm_close").forEach((btn) => {
			if (!btn.querySelector("svg"))
				btn.innerHTML = getIconSvg("close", 14);
		});
	}

	function handleFloatPanel(stackEl: HTMLElement) {
		if (!goldenLayout) return;

		const activeTab = stackEl.querySelector(".lm_tab.lm_active .lm_title");
		if (!activeTab) return;

		const title = activeTab.textContent?.trim() || "Panel";
		let componentType = "";
		let icon = "";

		for (const [type, info] of Object.entries(panelRegistry)) {
			if (info.title === title) {
				componentType = type;
				icon = info.icon || "";
				break;
			}
		}

		if (!componentType) return;

		const rootItem = goldenLayout.rootItem;
		if (rootItem) {
			const componentItems = findComponentsByType(
				rootItem,
				componentType,
			);
			if (componentItems.length > 0) componentItems[0].close();
		}

		const floatWidth = 450;
		const floatHeight = 350;
		const centerX = Math.round((window.innerWidth - floatWidth) / 2);
		const centerY = Math.round((window.innerHeight - floatHeight) / 2);

		floatingPanels.float({
			id: `float-${componentType}-${Date.now()}`,
			componentType,
			title,
			icon,
			x: centerX,
			y: centerY,
			width: floatWidth,
			height: floatHeight,
		});
	}

	function findComponentsByType(item: any, componentType: string): any[] {
		const results: any[] = [];
		if (item.type === "component" && item.componentType === componentType)
			results.push(item);
		if (item.contentItems) {
			for (const child of item.contentItems) {
				results.push(...findComponentsByType(child, componentType));
			}
		}
		return results;
	}

	function getPanelComponent(componentType: string) {
		return panelRegistry[componentType]?.component;
	}

	function handleDockPanel(id: string, componentType: string) {
		if (!layoutManager) return;
		layoutManager.addPanelAsSplit(componentType);
		floatingPanels.dock(id);
	}

	function handleCloseFloating(id: string) {
		floatingPanels.close(id);
	}

	onDestroy(() => {
		unsubscribe();
		for (const [_, component] of mountedComponents) unmount(component);
		mountedComponents.clear();
		if (goldenLayout) goldenLayout.destroy();
	});
</script>

<div class="game-container crt-scanlines crt-flicker">
	<TabBar
		onTabSwitch={handleTabSwitch}
		onSaveCurrentLayout={saveCurrentLayout}
	/>

	<div bind:this={layoutContainer} class="layout-container">
		{#if !layoutReady}
			<div class="loading-overlay">
				<p class="loading-text crt-text-glow">
					INITIALIZING<span class="blink">_</span>
				</p>
			</div>
		{/if}
	</div>

	{#each floatingPanelsList as panel (panel.id)}
		{@const PanelComponent = getPanelComponent(panel.componentType)}
		<FloatingPanel
			id={panel.id}
			title={panel.title}
			icon={panel.icon}
			x={panel.x}
			y={panel.y}
			width={panel.width}
			height={panel.height}
			onDock={() => handleDockPanel(panel.id, panel.componentType)}
			onClose={() => handleCloseFloating(panel.id)}
		>
			{#if PanelComponent}<PanelComponent />{/if}
		</FloatingPanel>
	{/each}
</div>

<style>
	.game-container {
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		background-color: var(--crt-bg-dark);
		overflow: hidden;
		position: relative;
	}

	.layout-container {
		flex: 1;
		position: relative;
		min-height: 0;
		width: 100%;
		height: 100%;
	}

	.layout-container :global(.lm_goldenlayout) {
		width: 100%;
		height: 100%;
	}

	.loading-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--crt-bg-base);
		z-index: 100;
	}

	.loading-text {
		color: var(--crt-green);
		font-family: var(--font-mono);
		font-size: 14px;
		text-transform: uppercase;
		letter-spacing: 2px;
		margin: 0;
	}

	.blink {
		animation: blink-cursor 1s step-end infinite;
	}

	@keyframes blink-cursor {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
	}
</style>
