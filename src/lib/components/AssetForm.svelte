<script lang="ts">
	import { enhance } from '$app/forms';
	import { ASSET_TYPES } from '$lib/definitions';

	let { form, onReset, platform } = $props();
	let isLoading = $state(false);
	let selectedTypes = $state<string[]>([]);

	function toggleTag(tag: string) {
		if (selectedTypes.includes(tag)) {
			selectedTypes = selectedTypes.filter(t => t !== tag);
		} else {
			selectedTypes = [...selectedTypes, tag];
		}
	}
</script>

<form
	class="flex flex-col gap-4"
	method="POST"
	action="?/createAsset"
	use:enhance={() => {
		isLoading = true;
		return async ({ update }) => {
			await update();
			isLoading = false;
			onReset();
		}
	}}
>
	<div>Platform: {platform}</div>
	<label for="asset-url">Asset url:</label>
	<input
		id="asset-url"
		name="url"
		class="rounded-lg border border-gray-300 p-2"
		type="text"
		value={form?.url}
		readonly={true}
	>
	{#if form?.error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
			{form.error}
		</div>
	{/if}
	<div class="flex justify-between">
		{#each ASSET_TYPES as type (type)}
			<button
				type="button"
				onclick={() => toggleTag(type)}
				class="px-4 py-2 rounded-lg border transition-colors {selectedTypes.includes(type)
						? 'bg-blue-600 text-white border-blue-600'
						: 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}"
			>
				{type}
			</button>
			{#if selectedTypes.includes(type)}
				<input type="hidden" name="tags" value={type} />
			{/if}
		{/each}
	</div>
	<div class="flex justify-around">
		<button
			type="button"
			class="w-1/4 border border-blue-500 rounded-2xl p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
			onclick={onReset}
		>
			Cancel
		</button>
		<button
			type="submit"
			class="w-1/4 rounded-2xl p-2 text-white bg-blue-700 hover:bg-blue-500 cursor-pointer"
		>
			{isLoading ? 'Loading...' : 'Add asset'}
		</button>
	</div>
</form>

