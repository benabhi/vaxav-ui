<!-- FloatingPanel.svelte - Custom floating draggable & resizable panel -->
<script lang="ts">
	import { onMount, type Snippet } from "svelte";
	import { icons } from "$lib/icons";

	interface Props {
		id: string;
		title: string;
		icon?: string;
		x?: number;
		y?: number;
		width?: number;
		height?: number;
		onDock?: () => void;
		onClose?: () => void;
		children: Snippet;
	}

	let {
		id,
		title,
		icon,
		x = $bindable(100),
		y = $bindable(100),
		width = $bindable(400),
		height = $bindable(300),
		onDock,
		onClose,
		children,
	}: Props = $props();

	let panelEl: HTMLElement;
	let isDragging = $state(false);
	let isResizing = $state(false);
	let dragOffset = { x: 0, y: 0 };
	let resizeStart = { width: 0, height: 0, mouseX: 0, mouseY: 0 };

	const MIN_WIDTH = 200;
	const MIN_HEIGHT = 150;

	function getIconSvg(iconName: string): string {
		const iconDef = icons[iconName];
		if (!iconDef) return "";
		const paths = iconDef.paths.map((p) => `<path d="${p}" />`).join("");
		return `<svg viewBox="${iconDef.viewBox}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
	}

	// ========== DRAG LOGIC ==========
	function startDrag(e: MouseEvent) {
		if ((e.target as HTMLElement).closest(".control-btn")) return;
		isDragging = true;
		dragOffset = {
			x: e.clientX - x,
			y: e.clientY - y,
		};
		document.addEventListener("mousemove", onDrag);
		document.addEventListener("mouseup", stopDrag);
	}

	function onDrag(e: MouseEvent) {
		if (!isDragging) return;
		x = Math.max(0, e.clientX - dragOffset.x);
		y = Math.max(0, e.clientY - dragOffset.y);
	}

	function stopDrag() {
		isDragging = false;
		document.removeEventListener("mousemove", onDrag);
		document.removeEventListener("mouseup", stopDrag);
	}

	// ========== RESIZE LOGIC ==========
	function startResize(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		isResizing = true;
		resizeStart = {
			width: width,
			height: height,
			mouseX: e.clientX,
			mouseY: e.clientY,
		};
		document.addEventListener("mousemove", onResize);
		document.addEventListener("mouseup", stopResize);
	}

	function onResize(e: MouseEvent) {
		if (!isResizing) return;
		const deltaX = e.clientX - resizeStart.mouseX;
		const deltaY = e.clientY - resizeStart.mouseY;
		width = Math.max(MIN_WIDTH, resizeStart.width + deltaX);
		height = Math.max(MIN_HEIGHT, resizeStart.height + deltaY);
	}

	function stopResize() {
		isResizing = false;
		document.removeEventListener("mousemove", onResize);
		document.removeEventListener("mouseup", stopResize);
	}

	onMount(() => {
		return () => {
			document.removeEventListener("mousemove", onDrag);
			document.removeEventListener("mouseup", stopDrag);
			document.removeEventListener("mousemove", onResize);
			document.removeEventListener("mouseup", stopResize);
		};
	});
</script>

<div
	bind:this={panelEl}
	class="floating-panel"
	class:dragging={isDragging}
	class:resizing={isResizing}
	style="left: {x}px; top: {y}px; width: {width}px; height: {height}px;"
>
	<!-- Header -->
	<div
		class="floating-header"
		role="button"
		tabindex="0"
		onmousedown={startDrag}
	>
		<div class="header-title">
			{#if icon}
				<span class="header-icon">{@html getIconSvg(icon)}</span>
			{/if}
			<span class="header-text">{title}</span>
		</div>
		<div class="header-controls">
			{#if onDock}
				<button
					class="control-btn dock-btn"
					onclick={onDock}
					title="Dock panel"
				>
					{@html getIconSvg("dock")}
				</button>
			{/if}
			{#if onClose}
				<button
					class="control-btn close-btn"
					onclick={onClose}
					title="Close"
				>
					{@html getIconSvg("close")}
				</button>
			{/if}
		</div>
	</div>

	<!-- Content -->
	<div class="floating-content">
		{@render children()}
	</div>

	<!-- Resize handle -->
	<div
		class="resize-handle"
		role="button"
		tabindex="0"
		onmousedown={startResize}
	></div>
</div>

<style>
	.floating-panel {
		position: fixed;
		z-index: 1000;
		background: var(--glass-bg);
		backdrop-filter: var(--glass-blur);
		border: 1px solid var(--glass-border);
		box-shadow:
			0 10px 40px rgba(0, 0, 0, 0.5),
			0 0 20px rgba(0, 255, 65, 0.05);
		display: flex;
		flex-direction: column;
		min-width: 200px;
		min-height: 150px;
		border-radius: 2px;
	}

	.floating-panel.dragging,
	.floating-panel.resizing {
		opacity: 0.95;
		user-select: none;
		box-shadow:
			0 15px 50px rgba(0, 0, 0, 0.6),
			0 0 30px rgba(0, 255, 65, 0.1);
	}

	.floating-panel.dragging {
		cursor: grabbing;
	}

	.floating-panel.resizing {
		cursor: se-resize;
	}

	.floating-header {
		height: 32px;
		background: rgba(0, 255, 65, 0.03);
		border-bottom: 1px solid var(--glass-border);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 10px;
		cursor: grab;
		user-select: none;
		outline: none;
	}

	.floating-panel.dragging .floating-header {
		cursor: grabbing;
		background: rgba(0, 255, 65, 0.08);
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--crt-green);
		font-family: var(--font-display);
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 1px;
		text-shadow: 0 0 8px var(--crt-green-glow);
	}

	.header-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 14px;
		height: 14px;
	}

	.header-icon :global(svg) {
		width: 14px;
		height: 14px;
		stroke: currentColor;
	}

	.header-controls {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.control-btn {
		all: unset;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		opacity: 0.6;
		color: var(--crt-text-dim);
		border-radius: 2px;
		transition: all 0.15s ease;
	}

	.control-btn :global(svg) {
		width: 14px;
		height: 14px;
		stroke: currentColor;
	}

	.control-btn:hover {
		opacity: 1;
		background: rgba(0, 255, 65, 0.1);
		color: var(--crt-green);
	}

	.dock-btn:hover {
		color: var(--crt-cyan);
		background: rgba(0, 212, 255, 0.15);
	}

	.dock-btn:hover :global(svg) {
		filter: drop-shadow(0 0 3px rgba(0, 212, 255, 0.5));
	}

	.close-btn:hover {
		color: var(--crt-red);
		background: rgba(255, 51, 51, 0.15);
	}

	.close-btn:hover :global(svg) {
		filter: drop-shadow(0 0 3px rgba(255, 51, 51, 0.5));
	}

	.floating-content {
		flex: 1;
		overflow: auto;
		padding: var(--spacing-md);
		background: transparent;
	}

	.resize-handle {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 12px;
		height: 12px;
		cursor: se-resize;
		background: linear-gradient(
			135deg,
			transparent 50%,
			var(--crt-green-dim) 50%
		);
		opacity: 0.4;
		transition: opacity 0.15s ease;
		outline: none;
	}

	.resize-handle:hover {
		opacity: 1;
		background: linear-gradient(
			135deg,
			transparent 50%,
			var(--crt-green) 50%
		);
	}
</style>
