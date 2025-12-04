<script lang="ts">
	// PilotPanel - Pilot information
</script>

<div class="panel">
	<div class="panel-content">
		<div class="panel-section pilot-header">
			<div class="pilot-avatar">
				<span class="avatar-icon">◉</span>
			</div>
			<div class="pilot-info">
				<h3 class="pilot-name crt-text-glow">COMMANDER ZERO</h3>
				<p class="pilot-rank">RANK: CAPTAIN</p>
			</div>
		</div>
		
		<div class="panel-section">
			<h4 class="section-title">[ STATISTICS ]</h4>
			<div class="stat-row">
				<span class="label">FLIGHT HOURS:</span>
				<span class="value">2,847</span>
			</div>
			<div class="stat-row">
				<span class="label">MISSIONS:</span>
				<span class="value">142</span>
			</div>
			<div class="stat-row">
				<span class="label">KILLS:</span>
				<span class="value">89</span>
			</div>
			<div class="stat-row">
				<span class="label">CREDITS:</span>
				<span class="value highlight">1,250,000 ₵</span>
			</div>
		</div>
		
		<div class="panel-section">
			<h4 class="section-title">[ SKILLS ]</h4>
			<div class="skill-bar">
				<span class="skill-name">PILOTING</span>
				<div class="bar-container">
					<div class="bar-fill" style="width: 85%"></div>
				</div>
				<span class="skill-value">85</span>
			</div>
			<div class="skill-bar">
				<span class="skill-name">COMBAT</span>
				<div class="bar-container">
					<div class="bar-fill" style="width: 72%"></div>
				</div>
				<span class="skill-value">72</span>
			</div>
			<div class="skill-bar">
				<span class="skill-name">TRADING</span>
				<div class="bar-container">
					<div class="bar-fill" style="width: 45%"></div>
				</div>
				<span class="skill-value">45</span>
			</div>
		</div>
	</div>
</div>

<style>
	.panel {
		height: 100%;
		width: 100%;
		background: var(--crt-bg-base);
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
	}
	
	.pilot-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}
	
	.pilot-avatar {
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
	
	.pilot-info {
		flex: 1;
	}
	
	.pilot-name {
		margin: 0;
		font-size: var(--font-size-lg);
		color: var(--crt-green);
		font-weight: normal;
	}
	
	.pilot-rank {
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
	
	.stat-row {
		display: flex;
		justify-content: space-between;
		padding: var(--spacing-xs) 0;
		font-size: var(--font-size-sm);
		border-bottom: 1px solid var(--crt-border-dim);
	}
	
	.stat-row:last-child {
		border-bottom: none;
	}
	
	.label {
		color: var(--crt-text-muted);
	}
	
	.value {
		color: var(--crt-text-primary);
	}
	
	.highlight {
		color: var(--crt-amber);
		text-shadow: 0 0 5px rgba(255, 176, 0, 0.5);
	}
	
	.skill-bar {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-xs);
		font-size: var(--font-size-xs);
	}
	
	.skill-name {
		width: 70px;
		color: var(--crt-text-dim);
	}
	
	.bar-container {
		flex: 1;
		height: 8px;
		background: var(--crt-bg-dark);
		border: 1px solid var(--crt-border);
	}
	
	.bar-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--crt-green-dark), var(--crt-green));
		box-shadow: 0 0 5px var(--crt-green-glow);
	}
	
	.skill-value {
		width: 24px;
		text-align: right;
		color: var(--crt-green);
	}
</style>
