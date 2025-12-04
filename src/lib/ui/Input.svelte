<script lang="ts">
	interface Props {
		type?: 'text' | 'number' | 'password';
		placeholder?: string;
		value?: string;
		disabled?: boolean;
		oninput?: (e: Event) => void;
	}

	let { type = 'text', placeholder = '', value = $bindable(''), disabled = false, oninput }: Props = $props();
</script>

<input
	{type}
	{placeholder}
	bind:value
	{disabled}
	{oninput}
	class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 
		focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500
		disabled:opacity-50 disabled:cursor-not-allowed"
/>
