<script lang="ts">
	import type { Snippet } from 'svelte';
	
	interface Props {
		children: Snippet;
		text: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
	}

	let { children, text, position = 'top' }: Props = $props();

	const positions = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2'
	};
</script>

<div class="relative inline-block group">
	{@render children()}
	<div class="absolute {positions[position]} px-2 py-1 bg-gray-900 text-white text-xs rounded 
		opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
		{text}
	</div>
</div>
