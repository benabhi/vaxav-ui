<script lang="ts">
	import { icons, type IconDefinition } from '$lib/icons';

	type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	interface Props {
		/** Name of the icon from the icon registry */
		name: string;
		/** Size preset for the icon */
		size?: IconSize;
		/** Additional CSS classes */
		class?: string;
		/** Enable CRT glow effect */
		glow?: boolean;
		/** Stroke width for line icons */
		strokeWidth?: number;
		/** ARIA label for accessibility */
		label?: string;
	}

	const {
		name,
		size = 'md',
		class: className = '',
		glow = false,
		strokeWidth = 2,
		label
	}: Props = $props();

	// Size mappings in pixels
	const sizeMap: Record<IconSize, number> = {
		xs: 12,
		sm: 16,
		md: 20,
		lg: 24,
		xl: 32
	};

	// Get icon definition
	const icon = $derived(icons[name] as IconDefinition | undefined);
	const sizeValue = $derived(sizeMap[size]);
</script>

{#if icon}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={icon.viewBox}
		width={sizeValue}
		height={sizeValue}
		fill="none"
		stroke="currentColor"
		stroke-width={strokeWidth}
		stroke-linecap="round"
		stroke-linejoin="round"
		class="icon icon-{name} {className}"
		class:icon-glow={glow}
		role={label ? 'img' : 'presentation'}
		aria-label={label}
		aria-hidden={!label}
	>
		{#each icon.paths as path}
			<path d={path} />
		{/each}
	</svg>
{:else}
	<!-- Fallback for missing icons -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={sizeValue}
		height={sizeValue}
		fill="none"
		stroke="currentColor"
		stroke-width={strokeWidth}
		class="icon icon-missing {className}"
		role="presentation"
		aria-hidden="true"
	>
		<rect x="4" y="4" width="16" height="16" rx="2" />
		<path d="M9 9l6 6M15 9l-6 6" />
	</svg>
{/if}

<style>
	.icon {
		display: inline-block;
		vertical-align: middle;
		flex-shrink: 0;
		transition: 
			color var(--transition-fast),
			filter var(--transition-fast);
	}

	.icon-glow {
		filter: drop-shadow(0 0 3px var(--crt-green-glow));
	}

	.icon-glow:hover {
		filter: drop-shadow(0 0 6px var(--crt-green-glow))
		        drop-shadow(0 0 12px var(--crt-green-glow));
	}

	.icon-missing {
		opacity: 0.5;
		color: var(--crt-red);
	}
</style>
