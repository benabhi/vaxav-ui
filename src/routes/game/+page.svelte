<script lang="ts">
	// Game page - Golden Layout with panels + Floating panels
	import { onMount, onDestroy } from 'svelte';
	import { mount, unmount } from 'svelte';
	import { GoldenLayout, type ComponentContainer, type LayoutConfig } from 'golden-layout';
	import { defaultLayoutConfig } from '$lib/layout/layoutConfig';
	import { panelRegistry } from '$lib/layout/panelRegistry';
	import { LayoutManager } from '$lib/layout/layoutManager';
	import { icons } from '$lib/icons';
	import { floatingPanels, type FloatingPanelState } from '$lib/stores/floatingPanels';
	import FloatingPanel from '$lib/ui/FloatingPanel.svelte';
	
	let layoutContainer: HTMLElement;
	let layoutReady = $state(false);
	let goldenLayout: GoldenLayout | null = null;
	let layoutManager: LayoutManager | null = null;
	let floatingPanelsList = $state<FloatingPanelState[]>([]);
	
	// Subscribe to floating panels store
	const unsubscribe = floatingPanels.subscribe(panels => {
		floatingPanelsList = panels;
	});
	
	const mountedComponents = new Map<ComponentContainer, any>();
	// Store mounted floating panel components
	const floatingMountedComponents = new Map<string, any>();

	/**
	 * Generate SVG HTML for an icon
	 */
	function getIconSvg(iconName: string, size: number = 12): string {
		const icon = icons[iconName];
		if (!icon) return '';
		
		const paths = icon.paths.map(p => `<path d="${p}" />`).join('');
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
	}

	/**
	 * Create tab title with icon
	 */
	function createTabTitle(title: string, iconName?: string): string {
		if (!iconName) return title;
		const iconSvg = getIconSvg(iconName, 12);
		return `<span class="tab-icon">${iconSvg}</span>${title}`;
	}

	onMount(async () => {
		if (!layoutContainer) return;
		
		goldenLayout = new GoldenLayout(layoutContainer);
		
		// Register all panel components
		for (const [panelType, panelInfo] of Object.entries(panelRegistry)) {
			goldenLayout.registerComponentFactoryFunction(panelType, (container: ComponentContainer) => {
				const element = document.createElement('div');
				element.style.width = '100%';
				element.style.height = '100%';
				element.style.overflow = 'auto';
				container.element.appendChild(element);
				
				const component = mount(panelInfo.component, {
					target: element,
				});
				
				mountedComponents.set(container, component);
				
				container.addEventListener('beforeComponentRelease', () => {
					const comp = mountedComponents.get(container);
					if (comp) {
						unmount(comp);
						mountedComponents.delete(container);
					}
				});
			});
		}
		
		// Load layout
		const layoutConfig = createLayoutConfig();
		goldenLayout.loadLayout(layoutConfig);
		
		// Create layout manager for intelligent panel placement
		layoutManager = new LayoutManager(goldenLayout);
		
		// Update icons after DOM settles
		setTimeout(() => {
			updateAllTabIcons();
			updateControlIcons();
		}, 150);
		
		// Update on layout changes
		goldenLayout.on('stateChanged', () => {
			setTimeout(() => {
				updateAllTabIcons();
				updateControlIcons();
			}, 50);
		});
		
		layoutReady = true;
	});
	
	function createLayoutConfig(): LayoutConfig {
		return {
			...defaultLayoutConfig,
			header: {
				show: 'top',
				popout: false,
				maximise: 'maximise',
				close: 'close',
			},
		};
	}
	
	/**
	 * Update all tab icons
	 */
	function updateAllTabIcons() {
		if (!goldenLayout) return;
		
		const tabs = document.querySelectorAll('.lm_tab .lm_title');
		
		tabs.forEach(titleEl => {
			const currentText = titleEl.textContent?.trim() || '';
			if (titleEl.querySelector('.tab-icon')) return;
			
			for (const [_, panelInfo] of Object.entries(panelRegistry)) {
				if (panelInfo.title === currentText && panelInfo.icon) {
					titleEl.innerHTML = createTabTitle(panelInfo.title, panelInfo.icon);
					break;
				}
			}
		});
	}
	
	/**
	 * Update control button icons (float, maximize, close)
	 */
	function updateControlIcons() {
		// Add float buttons to controls
		const controlContainers = document.querySelectorAll('.lm_controls');
		controlContainers.forEach(controls => {
			if (controls.querySelector('.lm_float')) return;
			
			// Create float button
			const floatBtn = document.createElement('li');
			floatBtn.className = 'lm_float';
			floatBtn.title = 'Float panel';
			floatBtn.innerHTML = getIconSvg('float', 14);
			
			// Insert before maximize
			const maximise = controls.querySelector('.lm_maximise');
			if (maximise) {
				controls.insertBefore(floatBtn, maximise);
			}
			
			// Add click handler
			floatBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				const stack = (controls as HTMLElement).closest('.lm_stack');
				if (stack) {
					handleFloatPanel(stack as HTMLElement);
				}
			});
		});
		
		// Update maximize buttons
		const maximiseButtons = document.querySelectorAll('.lm_maximise');
		maximiseButtons.forEach(btn => {
			if (!btn.querySelector('svg')) {
				btn.innerHTML = getIconSvg('maximize', 14);
			}
		});
		
		// Update close buttons
		const closeButtons = document.querySelectorAll('.lm_controls .lm_close');
		closeButtons.forEach(btn => {
			if (!btn.querySelector('svg')) {
				btn.innerHTML = getIconSvg('close', 14);
			}
		});
	}
	
	/**
	 * Handle floating a panel from Golden Layout (detach from layout)
	 */
	function handleFloatPanel(stackEl: HTMLElement) {
		if (!goldenLayout) return;
		
		// Get active tab info
		const activeTab = stackEl.querySelector('.lm_tab.lm_active .lm_title');
		if (!activeTab) return;
		
		const title = activeTab.textContent?.trim() || 'Panel';
		
		// Find panel info
		let componentType = '';
		let icon = '';
		for (const [type, info] of Object.entries(panelRegistry)) {
			if (info.title === title) {
				componentType = type;
				icon = info.icon || '';
				break;
			}
		}
		
		if (!componentType) return;
		
		// Find and close the component in Golden Layout
		const rootItem = goldenLayout.rootItem;
		if (rootItem) {
			const componentItems = findComponentsByType(rootItem, componentType);
			if (componentItems.length > 0) {
				componentItems[0].close();
			}
		}
		
		// Fixed default size for floating panels
		const floatWidth = 450;
		const floatHeight = 350;
		
		// Center on screen
		const centerX = Math.round((window.innerWidth - floatWidth) / 2);
		const centerY = Math.round((window.innerHeight - floatHeight) / 2);
		
		// Add to floating panels (centered with fixed size)
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
	
	/**
	 * Find component items by type in the layout tree
	 */
	function findComponentsByType(item: any, componentType: string): any[] {
		const results: any[] = [];
		
		if (item.type === 'component' && item.componentType === componentType) {
			results.push(item);
		}
		
		if (item.contentItems) {
			for (const child of item.contentItems) {
				results.push(...findComponentsByType(child, componentType));
			}
		}
		
		return results;
	}
	
	/**
	 * Get panel component by type
	 */
	function getPanelComponent(componentType: string) {
		return panelRegistry[componentType]?.component;
	}
	
	/**
	 * Handle docking a floating panel back to layout
	 */
	function handleDockPanel(id: string, componentType: string) {
		if (!layoutManager) return;
		
		// Add component back to layout as a split (not as tab)
		layoutManager.addPanelAsSplit(componentType);
		
		// Remove from floating panels
		floatingPanels.dock(id);
	}
	
	/**
	 * Handle closing a floating panel
	 */
	function handleCloseFloating(id: string) {
		floatingPanels.close(id);
	}
	
	onDestroy(() => {
		unsubscribe();
		
		for (const [_, component] of mountedComponents) {
			unmount(component);
		}
		mountedComponents.clear();
		
		if (goldenLayout) {
			goldenLayout.destroy();
		}
	});
</script>

<div class="game-container crt-scanlines crt-flicker">
	<div bind:this={layoutContainer} class="layout-container">
		{#if !layoutReady}
			<div class="loading-overlay">
				<p class="loading-text crt-text-glow">INITIALIZING<span class="blink">_</span></p>
			</div>
		{/if}
	</div>
	
	<!-- Floating Panels Layer -->
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
			{#if PanelComponent}
				<PanelComponent />
			{/if}
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
		0%, 50% { opacity: 1; }
		51%, 100% { opacity: 0; }
	}
</style>
