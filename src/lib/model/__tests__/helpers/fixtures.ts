import type { Asset, Video } from '$lib/definitions';
import { expect } from 'vitest';

export const expectedExistingVideoId = 1;
export const expectedExistingAssetId = 1;

export const expectedExistingVideoUrl = 'https://www.youtube.com/watch?v=6OXE65fjjsU';

export const expectedExistingVideo: Video = {
  id: expectedExistingVideoId,
  url: expectedExistingVideoUrl,
  platform: 'youtube',
  created_at: expect.any(Date)
};

export const expectedExistingAsset: Asset = {
  id: expectedExistingAssetId,
  video_id: expectedExistingVideoId,
  tags: ['Motion'],
  created_at: expect.any(Date)
};
