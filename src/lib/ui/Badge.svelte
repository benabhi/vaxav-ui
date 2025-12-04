<script lang="ts">
	import type { Snippet } from 'svelte';
	
	interface Props {
		children: Snippet;
		variant?: 'default' | 'success' | 'warning' | 'danger';
	}

	let { children, variant = 'default' }: Props = $props();

	const variants = {
		default: 'bg-gray-700 text-gray-200',
		success: 'bg-green-600/20 text-green-400 border border-green-600/30',
		warning: 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30',
		danger: 'bg-red-600/20 text-red-400 border border-red-600/30'
	};
</script>

<span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded {variants[variant]}">
	{@render children()}
</span>
