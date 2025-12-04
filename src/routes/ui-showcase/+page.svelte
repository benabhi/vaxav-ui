<script lang="ts">
	// UI Showcase - Preview all UI components
	import * as UI from '$lib/ui';
</script>

<div class="min-h-screen bg-gray-900 text-white p-8">
	<header class="mb-8">
		<a href="/" class="text-cyan-400 hover:text-cyan-300">← Home</a>
		<h1 class="text-3xl font-bold mt-4">UI Components Showcase</h1>
		<p class="text-gray-400">Preview of all reusable UI components</p>
	</header>

	<div class="space-y-12">
		<!-- Buttons Section -->
		<section>
			<h2 class="text-xl font-semibold mb-4 text-cyan-400">Buttons</h2>
			<div class="flex flex-wrap gap-4">
				<UI.Button>Default</UI.Button>
				<UI.Button variant="primary">Primary</UI.Button>
				<UI.Button variant="secondary">Secondary</UI.Button>
				<UI.Button variant="danger">Danger</UI.Button>
			</div>
		</section>

		<!-- Cards Section -->
		<section>
			<h2 class="text-xl font-semibold mb-4 text-cyan-400">Cards</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<UI.Card title="Sample Card">
					<p>Card content goes here.</p>
				</UI.Card>
			</div>
		</section>

		<!-- Badges Section -->
		<section>
			<h2 class="text-xl font-semibold mb-4 text-cyan-400">Badges</h2>
			<div class="flex flex-wrap gap-2">
				<UI.Badge>Default</UI.Badge>
				<UI.Badge variant="success">Success</UI.Badge>
				<UI.Badge variant="warning">Warning</UI.Badge>
				<UI.Badge variant="danger">Danger</UI.Badge>
			</div>
		</section>

		<!-- Progress Section -->
		<section>
			<h2 class="text-xl font-semibold mb-4 text-cyan-400">Progress</h2>
			<div class="space-y-4 max-w-md">
				<UI.Progress value={25} />
				<UI.Progress value={50} />
				<UI.Progress value={75} />
			</div>
		</section>

		<!-- Inputs Section -->
		<section>
			<h2 class="text-xl font-semibold mb-4 text-cyan-400">Inputs</h2>
			<div class="space-y-4 max-w-md">
				<UI.Input placeholder="Text input..." />
				<UI.Input placeholder="Disabled" disabled />
			</div>
		</section>
	</div>
</div>
