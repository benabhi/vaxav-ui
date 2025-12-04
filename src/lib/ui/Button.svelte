<script lang="ts">
	import type { Snippet } from 'svelte';
	
	interface Props {
		children: Snippet;
		variant?: 'default' | 'primary' | 'secondary' | 'danger';
		disabled?: boolean;
		onclick?: () => void;
	}

	let { children, variant = 'default', disabled = false, onclick }: Props = $props();

	const variants = {
		default: 'bg-gray-700 hover:bg-gray-600 text-white',
		primary: 'bg-cyan-600 hover:bg-cyan-500 text-white',
		secondary: 'bg-gray-600 hover:bg-gray-500 text-gray-200',
		danger: 'bg-red-600 hover:bg-red-500 text-white'
	};
</script>

<button
	class="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed {variants[variant]}"
	{disabled}
	{onclick}
>
	{@render children()}
</button>
