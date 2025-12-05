<script lang="ts">
	// MapPanel - Star system navigation
</script>

<div class="panel">
	<div class="panel-content">
		<div class="panel-section">
			<h3 class="section-title crt-text">[ NAVIGATION ]</h3>
			<p class="section-text">
				Star system navigation will be displayed here.
			</p>
		</div>

		<div class="panel-section">
			<div class="status-row">
				<span class="label">SECTOR:</span>
				<span class="value">VAXAV-001</span>
			</div>
			<div class="status-row">
				<span class="label">COORDINATES:</span>
				<span class="value">X:127.4 Y:89.2 Z:45.8</span>
			</div>
			<div class="status-row">
				<span class="label">STATUS:</span>
				<span class="value status-ok">NOMINAL</span>
			</div>
		</div>
	</div>
</div>

<style>
	.panel {
		height: 100%;
		width: 100%;
		background: transparent;
		color: var(--crt-text-primary);
		font-family: var(--font-mono);
		padding: var(--spacing-md);
		overflow: auto;
	}

	.panel-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.panel-section {
		border: 1px solid var(--crt-border);
		padding: var(--spacing-md);
		background: rgba(0, 255, 65, 0.02);
		border-radius: 2px;
	}

	.section-title {
		margin: 0 0 var(--spacing-sm) 0;
		font-size: var(--font-size-sm);
		font-weight: normal;
		color: var(--crt-green);
		letter-spacing: 1px;
	}

	.section-text {
		margin: 0;
		color: var(--crt-text-dim);
		font-size: var(--font-size-sm);
	}

	.status-row {
		display: flex;
		justify-content: space-between;
		padding: var(--spacing-xs) 0;
		border-bottom: 1px solid var(--crt-border-dim);
		font-size: var(--font-size-sm);
	}

	.status-row:last-child {
		border-bottom: none;
	}

	.label {
		color: var(--crt-text-muted);
		text-transform: uppercase;
	}

	.value {
		color: var(--crt-text-primary);
	}

	.status-ok {
		color: var(--crt-green);
		text-shadow: var(--glow-text);
	}
</style>
