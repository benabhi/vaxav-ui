<script lang="ts">
	import type { Snippet } from 'svelte';
	
	interface Props {
		title?: string;
		children: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<div class="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
	{#if title}
		<div class="px-4 py-3 border-b border-gray-700 bg-gray-800/50">
			<h3 class="font-semibold text-white">{title}</h3>
		</div>
	{/if}
	<div class="p-4 text-gray-300">
		{@render children()}
	</div>
</div>
