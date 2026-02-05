<script lang="ts">
	import type { AssetPopulated } from '$lib/definitions';
	import Asset from '$lib/components/Asset.svelte';

	let { assets }: { assets: AssetPopulated[] } = $props();
</script>

{#if assets.length === 0}
	<div class="flex justify-center items-center h-full">
		<p class="text-gray-500">No assets have been saved yet...</p>
	</div>
{:else}
	<div class="grid md:grid-cols-3 gap-4 w-full md:w-5/6 border border-gray-200 p-4 rounded-lg">
		{#each assets as asset (asset.id)}
			<Asset asset={asset} />
		{/each}
	</div>
{/if}
