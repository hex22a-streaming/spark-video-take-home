<script lang="ts">
	import Preview from '$lib/components/Preview.svelte';
	import AssetGrid from '$lib/components/AssetGrid.svelte';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { data: PageData; form: ActionData } = $props();
</script>

<main class="grid place-items-center gap-6 mt-10">
	<h1 class="text-2xl">Spark Video</h1>
	<div class="border border-gray-200 p-4 rounded-lg w-full md:w-7/12">
		<Preview form={form} />
	</div>
	<AssetGrid assets={data.assets}/>
</main>
