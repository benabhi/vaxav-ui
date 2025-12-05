<script lang="ts">
	// ShipPanel - Ship details
</script>

<div class="panel">
	<div class="panel-content">
		<div class="panel-section ship-header">
			<div class="ship-icon">▲</div>
			<div class="ship-info">
				<h3 class="ship-name crt-text-glow">PHANTOM-VII</h3>
				<p class="ship-class">CLASS: INTERCEPTOR</p>
			</div>
		</div>

		<div class="panel-section">
			<h4 class="section-title">[ SYSTEMS STATUS ]</h4>
			<div class="system-row">
				<span class="system-name">HULL INTEGRITY</span>
				<div class="system-bar">
					<div class="bar-fill health" style="width: 92%"></div>
				</div>
				<span class="system-value">92%</span>
			</div>
			<div class="system-row">
				<span class="system-name">SHIELDS</span>
				<div class="system-bar">
					<div class="bar-fill shield" style="width: 100%"></div>
				</div>
				<span class="system-value">100%</span>
			</div>
			<div class="system-row">
				<span class="system-name">FUEL</span>
				<div class="system-bar">
					<div class="bar-fill fuel" style="width: 67%"></div>
				</div>
				<span class="system-value">67%</span>
			</div>
			<div class="system-row">
				<span class="system-name">ENERGY</span>
				<div class="system-bar">
					<div class="bar-fill energy" style="width: 85%"></div>
				</div>
				<span class="system-value">85%</span>
			</div>
		</div>

		<div class="panel-section">
			<h4 class="section-title">[ SPECIFICATIONS ]</h4>
			<div class="spec-row">
				<span class="label">MAX SPEED:</span>
				<span class="value">450 M/S</span>
			</div>
			<div class="spec-row">
				<span class="label">CARGO:</span>
				<span class="value">120 / 200 T</span>
			</div>
			<div class="spec-row">
				<span class="label">WEAPONS:</span>
				<span class="value">4x LASER MK-II</span>
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
		gap: var(--spacing-md);
	}

	.panel-section {
		border: 1px solid var(--crt-border);
		padding: var(--spacing-md);
		background: rgba(0, 255, 65, 0.02);
		border-radius: 2px;
	}

	.ship-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.ship-icon {
		width: 48px;
		height: 48px;
		border: 1px solid var(--crt-green-dim);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		color: var(--crt-green);
		text-shadow: var(--glow-text);
	}

	.ship-info {
		flex: 1;
	}

	.ship-name {
		margin: 0;
		font-size: var(--font-size-lg);
		color: var(--crt-green);
		font-weight: normal;
	}

	.ship-class {
		margin: var(--spacing-xs) 0 0;
		font-size: var(--font-size-xs);
		color: var(--crt-text-dim);
	}

	.section-title {
		margin: 0 0 var(--spacing-sm) 0;
		font-size: var(--font-size-xs);
		font-weight: normal;
		color: var(--crt-text-muted);
		letter-spacing: 1px;
	}

	.system-row {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-xs);
		font-size: var(--font-size-xs);
	}

	.system-name {
		width: 100px;
		color: var(--crt-text-dim);
	}

	.system-bar {
		flex: 1;
		height: 10px;
		background: var(--crt-bg-dark);
		border: 1px solid var(--crt-border);
	}

	.bar-fill {
		height: 100%;
	}

	.bar-fill.health {
		background: linear-gradient(
			90deg,
			var(--crt-green-dark),
			var(--crt-green)
		);
		box-shadow: 0 0 5px var(--crt-green-glow);
	}

	.bar-fill.shield {
		background: linear-gradient(
			90deg,
			var(--crt-cyan-dim),
			var(--crt-cyan)
		);
		box-shadow: 0 0 5px rgba(0, 212, 255, 0.5);
	}

	.bar-fill.fuel {
		background: linear-gradient(
			90deg,
			var(--crt-amber-dim),
			var(--crt-amber)
		);
		box-shadow: 0 0 5px rgba(255, 176, 0, 0.5);
	}

	.bar-fill.energy {
		background: linear-gradient(90deg, var(--crt-purple), #d000ff);
		box-shadow: 0 0 5px rgba(189, 0, 255, 0.5);
	}

	.system-value {
		width: 36px;
		text-align: right;
		color: var(--crt-green);
	}

	.spec-row {
		display: flex;
		justify-content: space-between;
		padding: var(--spacing-xs) 0;
		font-size: var(--font-size-sm);
		border-bottom: 1px solid var(--crt-border-dim);
	}

	.spec-row:last-child {
		border-bottom: none;
	}

	.label {
		color: var(--crt-text-muted);
	}

	.value {
		color: var(--crt-text-primary);
	}
</style>
