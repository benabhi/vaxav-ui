<script lang="ts">
	// Game page - Golden Layout with panels
	import { onMount, onDestroy } from 'svelte';
	import { mount, unmount } from 'svelte';
	import { GoldenLayout, type ComponentContainer } from 'golden-layout';
	import { defaultLayoutConfig } from '$lib/layout/layoutConfig';
	import { panelRegistry } from '$lib/layout/panelRegistry';
	
	let layoutContainer: HTMLElement;
	let layoutReady = $state(false);
	let goldenLayout: GoldenLayout | null = null;
	
	// Track mounted Svelte components for cleanup
	const mountedComponents = new Map<ComponentContainer, any>();

	onMount(async () => {
		if (!layoutContainer) return;
		
		// Initialize Golden Layout
		goldenLayout = new GoldenLayout(layoutContainer);
		
		// Register all panel components
		for (const [panelType, panelInfo] of Object.entries(panelRegistry)) {
			goldenLayout.registerComponentFactoryFunction(panelType, (container: ComponentContainer) => {
				// Create a wrapper div for the Svelte component
				const element = document.createElement('div');
				element.style.width = '100%';
				element.style.height = '100%';
				element.style.overflow = 'auto';
				container.element.appendChild(element);
				
				// Mount the Svelte component using Svelte 5 API
				const component = mount(panelInfo.component, {
					target: element,
				});
				
				// Store for cleanup
				mountedComponents.set(container, component);
				
				// Handle container destruction
				container.addEventListener('beforeComponentRelease', () => {
					const comp = mountedComponents.get(container);
					if (comp) {
						unmount(comp);
						mountedComponents.delete(container);
					}
				});
			});
		}
		
		// Load the default layout
		goldenLayout.loadLayout(defaultLayoutConfig);
		
		layoutReady = true;
	});
	
	onDestroy(() => {
		// Cleanup all mounted components
		for (const [container, component] of mountedComponents) {
			unmount(component);
		}
		mountedComponents.clear();
		
		// Destroy Golden Layout
		if (goldenLayout) {
			goldenLayout.destroy();
		}
	});
</script>

<div class="h-screen w-screen bg-gray-900 flex flex-col">
	<!-- Header -->
	<header class="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4">
		<a href="/" class="text-cyan-400 hover:text-cyan-300 mr-4">← Home</a>
		<h1 class="text-white font-semibold">VaxaV - Game</h1>
	</header>
	
	<!-- Golden Layout Container -->
	<div bind:this={layoutContainer} class="flex-1 relative golden-layout-container">
		{#if !layoutReady}
			<div class="absolute inset-0 flex items-center justify-center z-10">
				<p class="text-gray-400">Loading panels...</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.golden-layout-container {
		/* Ensure Golden Layout fills the container */
		min-height: 0;
	}
	
	/* Make sure Golden Layout has proper dimensions */
	.golden-layout-container :global(.lm_goldenlayout) {
		width: 100%;
		height: 100%;
	}
</style>
