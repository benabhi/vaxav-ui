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
	import { panelDragState } from "$lib/stores/panelDragState";
	import FloatingPanel from "$lib/ui/FloatingPanel.svelte";
	import TabBar from "$lib/ui/TabBar.svelte";
	import PanelLauncher from "$lib/ui/PanelLauncher.svelte";

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
		return `<svg class="gl-icon" xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
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

	let observer: MutationObserver | null = null;
	let dragObserver: MutationObserver | null = null;

	onMount(() => {
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

		// Observe DOM changes to enforce icon styles on dynamically created headers
		observer = new MutationObserver((mutations) => {
			let shouldUpdate = false;
			for (const mutation of mutations) {
				if (mutation.addedNodes.length > 0) {
					shouldUpdate = true;
					break;
				}
			}
			if (shouldUpdate) {
				requestAnimationFrame(() => {
					updateAllTabIcons();
					updateControlIcons();
				});
			}
		});

		observer.observe(layoutContainer, {
			childList: true,
			subtree: true,
		});

		return () => {
			if (observer) observer.disconnect();
		};
	});

	// Separate observer for detecting Golden Layout drags
	onMount(() => {
		dragObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				// Check for drag proxy being added
				for (const node of mutation.addedNodes) {
					if (
						node instanceof HTMLElement &&
						node.classList.contains("lm_dragProxy")
					) {
						// Extract component info from the drag proxy
						const titleEl = node.querySelector(".lm_title");
						const title = titleEl?.textContent?.trim() || "Panel";

						// Find component type from title
						let componentType = "";
						for (const [type, info] of Object.entries(
							panelRegistry,
						)) {
							if (info.title === title) {
								componentType = type;
								break;
							}
						}

						if (componentType) {
							console.log(
								"[Game] Drag started:",
								componentType,
								title,
							);
							panelDragState.startDrag(componentType, title);

							// Start tracking mouse for drop indicator visibility
							document.addEventListener(
								"mousemove",
								trackDragPosition,
							);
						}
					}
				}

				// Check for drag proxy being removed
				for (const node of mutation.removedNodes) {
					if (
						node instanceof HTMLElement &&
						node.classList.contains("lm_dragProxy")
					) {
						console.log("[Game] Drag ended");

						// Stop tracking and reset indicator visibility
						document.removeEventListener(
							"mousemove",
							trackDragPosition,
						);
						document.body.classList.remove(
							"hide-gl-drop-indicator",
						);

						// Get pending transfer before clearing state
						const pendingTransfer = panelDragState.endDrag();

						// If there was a pending transfer, process it after GL is fully done
						if (pendingTransfer) {
							console.log(
								"[Game] Processing pending transfer:",
								pendingTransfer,
							);
							// Use setTimeout to ensure GL has fully completed its operation
							setTimeout(() => {
								processPanelTransfer(
									pendingTransfer.targetTabId,
									pendingTransfer.componentType,
									pendingTransfer.title,
								);
							}, 50);
						}
					}
				}
			}
		});

		dragObserver.observe(document.body, {
			childList: true,
			subtree: true,
		});

		return () => {
			if (dragObserver) dragObserver.disconnect();
			document.removeEventListener("mousemove", trackDragPosition);
		};
	});

	function trackDragPosition(e: MouseEvent) {
		// Hide GL drop indicator if mouse is in the top-bar area (first 50px)
		const topBarHeight = 50; // Approximate height of top-bar
		if (e.clientY < topBarHeight) {
			document.body.classList.add("hide-gl-drop-indicator");
		} else {
			document.body.classList.remove("hide-gl-drop-indicator");
		}
	}

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

		// Add middle-click to close tabs
		document.querySelectorAll(".lm_tab").forEach((tab) => {
			// Only add listener if not already added
			if (!(tab as any)._middleClickAdded) {
				(tab as any)._middleClickAdded = true;
				tab.addEventListener("auxclick", (e: Event) => {
					const mouseEvent = e as MouseEvent;
					// Middle mouse button is button 1
					if (mouseEvent.button === 1) {
						e.preventDefault();
						e.stopPropagation();
						// Find and click the close tab button
						const closeBtn = tab.querySelector(
							".lm_close_tab",
						) as HTMLElement;
						if (closeBtn) {
							closeBtn.click();
						}
					}
				});
			}
		});
	}

	function updateControlIcons() {
		const controlContainers = document.querySelectorAll(".lm_controls");
		controlContainers.forEach((controls) => {
			// 1. Remove native popout if present (as per user instruction)
			const popout = controls.querySelector(".lm_popout");
			if (popout) popout.remove();

			// 2. Check if custom float button already exists
			if (controls.querySelector(".lm_float")) return;

			// 3. Create and insert custom float button
			const floatBtn = document.createElement("li");
			floatBtn.className = "lm_float";
			floatBtn.title = "Float panel";
			floatBtn.innerHTML = getIconSvg("float", 14);

			// Insert before maximize button, or at the beginning if no maximize
			const maximise = controls.querySelector(".lm_maximise");
			if (maximise) {
				controls.insertBefore(floatBtn, maximise);
			} else {
				controls.prepend(floatBtn);
			}

			floatBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				const stack = (controls as HTMLElement).closest(".lm_stack");
				if (stack) handleFloatPanel(stack as HTMLElement);
			});
		});

		// Always update maximize and close buttons with custom SVG icons
		document.querySelectorAll(".lm_maximise").forEach((btn) => {
			if (!btn.innerHTML.includes("svg")) {
				btn.innerHTML = getIconSvg("maximize", 14);
			}
		});

		document.querySelectorAll(".lm_controls .lm_close").forEach((btn) => {
			if (!btn.innerHTML.includes("svg")) {
				btn.innerHTML = getIconSvg("close", 14);
			}
		});

		// Update tab close buttons (the X on each tab)
		document.querySelectorAll(".lm_close_tab").forEach((btn) => {
			if (!btn.innerHTML.includes("svg")) {
				btn.innerHTML = getIconSvg("close", 10);
			}
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

	function handleAddPanel(componentType: string) {
		if (!layoutManager) return;
		layoutManager.addPanelAsSplit(componentType);
	}

	/**
	 * Process panel transfer to another workspace tab
	 * Called AFTER Golden Layout has finished its drag operation
	 */
	function processPanelTransfer(
		targetTabId: string,
		componentType: string,
		title: string,
	) {
		if (!goldenLayout) return;

		console.log(
			"[Game] Processing transfer to tab:",
			targetTabId,
			componentType,
		);

		// 1. Find and close the panel from current layout
		const rootItem = goldenLayout.rootItem;
		if (rootItem) {
			const componentItems = findComponentsByType(
				rootItem,
				componentType,
			);
			if (componentItems.length > 0) {
				console.log("[Game] Found component, closing it");
				componentItems[0].close();
			} else {
				console.log("[Game] Component not found in current layout!");
			}
		}

		// 2. Add panel to target tab's layout config
		workspaceTabs.addPanelToTab(targetTabId, componentType, title);
		console.log("[Game] Panel added to target tab:", targetTabId);
	}

	onDestroy(() => {
		unsubscribe();
		for (const [_, component] of mountedComponents) unmount(component);
		mountedComponents.clear();
		if (goldenLayout) goldenLayout.destroy();
	});
</script>

<div class="game-container crt-scanlines crt-flicker">
	<div class="top-bar">
		<PanelLauncher onAddPanel={handleAddPanel} />
		<TabBar
			onTabSwitch={handleTabSwitch}
			onSaveCurrentLayout={saveCurrentLayout}
		/>
	</div>

	<div bind:this={layoutContainer} class="layout-container">
		<!-- Static background hint - always present, covered by panels -->
		<div class="layout-background-hint">
			<p class="hint-text">
				Press <kbd>CTRL</kbd> + <kbd>SPACE</kbd> to open panel launcher
			</p>
		</div>

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
		background: radial-gradient(
			circle at 50% 30%,
			#0a140e 0%,
			#020402 100%
		);
		overflow: hidden;
		position: relative;
	}

	.game-container::before {
		content: "";
		position: absolute;
		inset: 0;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
		opacity: 0.03;
		pointer-events: none;
		z-index: 0;
	}

	.top-bar {
		display: flex;
		align-items: stretch;
		background: rgba(5, 10, 7, 0.6);
		backdrop-filter: blur(10px);
		flex-shrink: 0;
		border-bottom: 1px solid rgba(0, 255, 65, 0.15);
		margin-bottom: 0;
		z-index: 20;
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

	/* Static background hint - always visible behind panels */
	.layout-background-hint {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		z-index: 0;
	}

	.hint-text {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--crt-text-muted);
		opacity: 0.5;
	}

	.hint-text kbd {
		display: inline-block;
		padding: 4px 10px;
		margin: 0 3px;
		background: rgba(0, 255, 65, 0.05);
		border: 1px solid rgba(0, 255, 65, 0.2);
		border-radius: 3px;
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--crt-green-dim);
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
