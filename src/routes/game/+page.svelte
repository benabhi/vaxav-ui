<script lang="ts">
	// Game page - Golden Layout with panels (fullscreen)
	import { onMount, onDestroy } from 'svelte';
	import { mount, unmount } from 'svelte';
	import { GoldenLayout, type ComponentContainer, type LayoutConfig } from 'golden-layout';
	import { defaultLayoutConfig } from '$lib/layout/layoutConfig';
	import { panelRegistry } from '$lib/layout/panelRegistry';
	import { icons } from '$lib/icons';
	
	let layoutContainer: HTMLElement;
	let layoutReady = $state(false);
	let goldenLayout: GoldenLayout | null = null;
	
	const mountedComponents = new Map<ComponentContainer, any>();

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
	 * Update control button icons (maximize, close)
	 */
	function updateControlIcons() {
		// Update maximize buttons
		const maximiseButtons = document.querySelectorAll('.lm_maximise');
		maximiseButtons.forEach(btn => {
			if (!btn.querySelector('svg')) {
				btn.innerHTML = getIconSvg('maximize', 12);
			}
		});
		
		// Update close buttons
		const closeButtons = document.querySelectorAll('.lm_controls .lm_close');
		closeButtons.forEach(btn => {
			if (!btn.querySelector('svg')) {
				btn.innerHTML = getIconSvg('close', 12);
			}
		});
	}
	
	onDestroy(() => {
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
</div>

<style>
	.game-container {
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		background-color: var(--crt-bg-dark);
		overflow: hidden;
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
