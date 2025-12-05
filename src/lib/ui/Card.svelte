<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		title?: string;
		children: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<div class="crt-card">
	{#if title}
		<div class="crt-card-header">
			<h3 class="crt-card-title">{title}</h3>
		</div>
	{/if}
	<div class="crt-card-content">
		{@render children()}
	</div>
</div>

<style>
	.crt-card {
		background: var(--glass-bg);
		backdrop-filter: var(--glass-blur);
		border: 1px solid var(--glass-border);
		border-radius: 2px;
		overflow: hidden;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	}

	.crt-card-header {
		padding: 12px 16px;
		border-bottom: 1px solid var(--glass-border);
		background: rgba(0, 255, 65, 0.02);
	}

	.crt-card-title {
		margin: 0;
		font-family: var(--font-display);
		font-size: 14px;
		font-weight: 500;
		color: var(--crt-green);
		text-transform: uppercase;
		letter-spacing: 1px;
		text-shadow: 0 0 5px var(--crt-green-glow);
	}

	.crt-card-content {
		padding: 16px;
		color: var(--crt-text-primary);
		font-family: var(--font-mono);
		font-size: 12px;
	}
</style>
