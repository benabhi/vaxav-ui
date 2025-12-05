<script lang="ts">
	import { icons } from "$lib/icons";

	interface Props {
		type?: "text" | "number" | "password" | "email";
		placeholder?: string;
		value?: string;
		disabled?: boolean;
		icon?: string;
		size?: "sm" | "md" | "lg";
		autofocus?: boolean;
		oninput?: (e: Event) => void;
		onkeydown?: (e: KeyboardEvent) => void;
	}

	let {
		type = "text",
		placeholder = "",
		value = $bindable(""),
		disabled = false,
		icon,
		size = "md",
		autofocus = false,
		oninput,
		onkeydown,
	}: Props = $props();

	let inputElement: HTMLInputElement;

	function getIconSvg(iconName: string): string {
		const iconDef = icons[iconName];
		if (!iconDef) return "";
		const paths = iconDef.paths.map((p) => `<path d="${p}" />`).join("");
		const iconSize = size === "sm" ? 12 : size === "lg" ? 18 : 14;
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${iconDef.viewBox}" width="${iconSize}" height="${iconSize}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
	}

	export function focus() {
		inputElement?.focus();
	}

	export function blur() {
		inputElement?.blur();
	}
</script>

<div
	class="input-wrapper"
	class:sm={size === "sm"}
	class:lg={size === "lg"}
	class:disabled
>
	{#if icon}
		<span class="input-icon">{@html getIconSvg(icon)}</span>
	{/if}
	<!-- svelte-ignore a11y_autofocus -->
	<input
		{type}
		class="input-field"
		bind:this={inputElement}
		bind:value
		{placeholder}
		{disabled}
		{oninput}
		{onkeydown}
		{autofocus}
	/>
</div>

<style>
	.input-wrapper {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 12px;
		background: var(--crt-bg-base, #0d0d0f);
		border: 1px solid var(--crt-border, #1a3a1a);
		transition: all 0.15s ease;
	}

	.input-wrapper:focus-within {
		border-color: var(--crt-green, #00ff41);
		box-shadow: 0 0 8px rgba(0, 255, 65, 0.2);
	}

	.input-wrapper.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.input-wrapper.sm {
		padding: 6px 10px;
		gap: 8px;
	}

	.input-wrapper.lg {
		padding: 12px 14px;
		gap: 12px;
	}

	.input-icon {
		display: flex;
		align-items: center;
		color: var(--crt-text-dim, #6a8a6a);
		flex-shrink: 0;
	}

	.input-wrapper:focus-within .input-icon {
		color: var(--crt-green, #00ff41);
	}

	.input-field {
		flex: 1;
		background: transparent !important;
		border: none;
		color: var(--crt-green, #00ff41);
		font-family: var(--font-mono, "JetBrains Mono", monospace);
		font-size: 12px;
		outline: none;
		min-width: 0;
		-webkit-box-shadow: 0 0 0 1000px transparent inset !important;
		box-shadow: 0 0 0 1000px transparent inset !important;
	}

	.input-field:-webkit-autofill,
	.input-field:-webkit-autofill:hover,
	.input-field:-webkit-autofill:focus,
	.input-field:-webkit-autofill:active {
		-webkit-box-shadow: 0 0 0 1000px var(--crt-bg-base, #0d0d0f) inset !important;
		-webkit-text-fill-color: var(--crt-green, #00ff41) !important;
		background-color: transparent !important;
	}

	.input-wrapper.sm .input-field {
		font-size: 11px;
	}

	.input-wrapper.lg .input-field {
		font-size: 13px;
	}

	.input-field::placeholder {
		color: var(--crt-text-muted, #3a5a3a);
	}

	.input-field:disabled {
		cursor: not-allowed;
	}
</style>
