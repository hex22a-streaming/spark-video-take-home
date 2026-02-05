<script lang="ts">
	import type { AssetPopulated } from '$lib/definitions';

	const { asset }: { asset: AssetPopulated } = $props();
</script>

<div class="rounded-lg border border-gray-200 p-4 text-xs">
	<div>Platform: {asset.platform}</div>
	<a
		href={asset.url}
		rel="external noopener noreferrer"
		target="_blank"
		class="text-blue-500 hover:underline cursor-pointer"
	>{asset.url}</a>
	<div class="flex gap-2">
		{#each asset.tags as tag (tag)}
			<div class="border border-gray-200 rounded-xs px-1">{tag}</div>
		{/each}
	</div>
	<div>Timestamp: {asset.created_at}</div>
</div>

