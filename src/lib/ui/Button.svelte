<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
		variant?: "default" | "primary" | "secondary" | "danger";
		disabled?: boolean;
		onclick?: () => void;
		class?: string;
	}

	let {
		children,
		variant = "default",
		disabled = false,
		onclick,
		class: className = "",
	}: Props = $props();
</script>

<button class="crt-btn {variant} {className}" {disabled} {onclick}>
	{@render children()}
</button>

<style>
	.crt-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 6px 16px;
		background: transparent;
		border: 1px solid var(--crt-border);
		color: var(--crt-text-dim);
		font-family: var(--font-mono);
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 1px;
		cursor: pointer;
		transition: all 0.2s ease;
		border-radius: 2px;
		outline: none;
	}

	.crt-btn:hover:not(:disabled) {
		background: rgba(0, 255, 65, 0.1);
		color: var(--crt-text-primary);
		border-color: var(--crt-green);
		box-shadow: 0 0 10px var(--crt-green-glow);
	}

	.crt-btn:active:not(:disabled) {
		transform: translateY(1px);
	}

	.crt-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		border-color: var(--crt-border-dim);
	}

	/* Variants */
	.crt-btn.primary {
		border-color: var(--crt-green);
		color: var(--crt-green);
		background: rgba(0, 255, 65, 0.05);
	}

	.crt-btn.primary:hover:not(:disabled) {
		background: var(--crt-green);
		color: var(--crt-bg-darkest);
		box-shadow: 0 0 15px var(--crt-green-glow);
	}

	.crt-btn.danger {
		border-color: var(--crt-red);
		color: var(--crt-red);
	}

	.crt-btn.danger:hover:not(:disabled) {
		background: var(--crt-red);
		color: var(--crt-bg-darkest);
		box-shadow: 0 0 15px rgba(255, 51, 51, 0.4);
	}

	.crt-btn.secondary {
		border-color: var(--crt-border-dim);
		color: var(--crt-text-muted);
	}
</style>
