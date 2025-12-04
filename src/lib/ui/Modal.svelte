<script lang="ts">
	import type { Snippet } from 'svelte';
	
	interface Props {
		open: boolean;
		title?: string;
		children: Snippet;
		onclose?: () => void;
	}

	let { open = $bindable(false), title = '', children, onclose }: Props = $props();

	function handleClose() {
		open = false;
		onclose?.();
	}

	function handleBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div 
		class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
		onclick={handleBackdrop}
	>
		<div class="bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-w-lg w-full mx-4">
			{#if title}
				<div class="flex items-center justify-between px-4 py-3 border-b border-gray-700">
					<h3 class="font-semibold text-white">{title}</h3>
					<button 
						class="text-gray-400 hover:text-white"
						onclick={handleClose}
					>✕</button>
				</div>
			{/if}
			<div class="p-4 text-gray-300">
				{@render children()}
			</div>
		</div>
	</div>
{/if}
