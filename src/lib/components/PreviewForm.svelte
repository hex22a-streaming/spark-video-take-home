<script lang="ts">
	import { enhance } from '$app/forms';

	let isLoading = $state(false);
	let { form } = $props();
</script>

<form
	class="flex flex-col gap-4"
	method="POST"
	action="?/createPreview"
	use:enhance={() => {
		isLoading = true;
		return async ({ update }) => {
			await update();
			isLoading = false;
		}
	}}
>
	<label for="video-url">Paste video URL here:</label>
	<input
		id="video-url"
		name="url"
		class="rounded-lg border border-gray-300 p-2"
		type="text"
		disabled={isLoading}
	>
	{#if form?.error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
			{form.error}
		</div>
	{/if}
	<button
		type="submit"
		class="w-full rounded-2xl p-2 text-white bg-blue-700 hover:bg-blue-500 cursor-pointer"
	>
		{isLoading ? 'Loading...' : 'Add video'}
	</button>
</form>
