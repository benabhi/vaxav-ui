<script lang="ts">
	interface Column {
		key: string;
		label: string;
		width?: string;
	}

	interface Props {
		columns: Column[];
		data: Record<string, any>[];
	}

	let { columns, data }: Props = $props();
</script>

<div class="overflow-x-auto">
	<table class="w-full text-sm">
		<thead>
			<tr class="border-b border-gray-700">
				{#each columns as col}
					<th 
						class="px-4 py-3 text-left text-gray-400 font-medium"
						style={col.width ? `width: ${col.width}` : ''}
					>
						{col.label}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each data as row, i}
				<tr class="border-b border-gray-700/50 hover:bg-gray-800/50">
					{#each columns as col}
						<td class="px-4 py-3 text-gray-300">
							{row[col.key] ?? '-'}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
