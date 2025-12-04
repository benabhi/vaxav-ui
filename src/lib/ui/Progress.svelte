<script lang="ts">
	interface Props {
		value: number;
		max?: number;
		showLabel?: boolean;
	}

	let { value, max = 100, showLabel = false }: Props = $props();

	const percentage = Math.min(100, Math.max(0, (value / max) * 100));
</script>

<div class="w-full">
	<div class="h-2 bg-gray-700 rounded-full overflow-hidden">
		<div 
			class="h-full bg-cyan-500 transition-all duration-300"
			style="width: {percentage}%"
		></div>
	</div>
	{#if showLabel}
		<div class="text-xs text-gray-400 mt-1">{value}/{max}</div>
	{/if}
</div>
