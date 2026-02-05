import type { PageServerLoad } from './$types';
import { type Actions, fail } from '@sveltejs/kit';
import { getAllAssets } from '$lib/model/data/asset.server';
import type { AssetPopulated } from '$lib/definitions';

export const load: PageServerLoad = async () => {
  const assets: AssetPopulated[] = await getAllAssets();
  return { assets };
}

export const actions = {
  createPreview: async ({ request, fetch }) => {
    const formData = await request.formData();
    const url = formData.get('url')?.toString();
    if (!url) {
      return fail(400, { error: 'URL is required', url: '' });
    }
    const response = await fetch('/api/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    const result = await response.json();

    if (!response.ok) {
      return fail(response.status, { error: result.error, url });
    }

    return { success: true, preview: result, url };
  },

  createAsset: async ({ request, fetch }) => {
    const formData = await request.formData();
    const url = formData.get('url')?.toString();
    const tags = formData.getAll('tags') as string[];
    if (!url) {
      return fail(400, { error: 'URL is required', url: '' });
    }
    if (!tags.length) {
      return fail(400, { error: 'At least one tag is required', url });
    }
    const response = await fetch('/api/assets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url, tags })
    });

    const result = await response.json();

    if (!response.ok) {
      return fail(response.status, { error: result.error, url });
    }

    return { success: true, assets: result };
  }
} satisfies Actions
