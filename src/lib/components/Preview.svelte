<script lang="ts">
	import PreviewForm from '$lib/components/PreviewForm.svelte';
	import AssetForm from '$lib/components/AssetForm.svelte';

	let { form } = $props();
	let showAssetForm = $state(false);
	let platform = $state(false);

	$effect(() => {
		if (form?.success && form?.preview) {
			showAssetForm = true;
			platform = form.preview.platform;
		}
	});

	function onReset() {
		showAssetForm = false;
	}
</script>

{#if showAssetForm}
	<AssetForm form={form} onReset={onReset} platform={platform} />
{:else}
	<PreviewForm form={form} />
{/if}
