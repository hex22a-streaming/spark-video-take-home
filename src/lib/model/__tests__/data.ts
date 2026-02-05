import { beforeAll, describe, expect, it } from 'vitest';
import Seed from './helpers/seed';
import {
  createVideo,
  getVideoByUrl,
  VIDEO_EXISTS_ERROR_MESSAGE
} from '$lib/model/data/video.server';
import type {
  Asset,
  AssetDbRequest, AssetPopulated,
  AssetType,
  Video,
  VideoDbRequest,
  VideoPlatform
} from '$lib/definitions';
import {
  expectedExistingAsset,
  expectedExistingVideo,
  expectedExistingVideoId,
  expectedExistingVideoUrl
} from '$lib/model/__tests__/helpers/fixtures';
import {
  createAsset, getAllAssets,
  getAssetByVideoId,
  VIDEO_DOES_NOT_EXIST_ERROR_MESSAGE
} from '$lib/model/data/asset.server';

describe('data platform tests', () => {
  beforeAll(async () => {
    const seed = new Seed();
    await seed.seedAll();
  });

  describe('video', () => {
    describe('createVideo', () => {
      const expectedPlatformYoutube: VideoPlatform = 'youtube';

      it('throws an error if url is not unique', async () => {
        // Arrange
        const expectedVideoDbRequest: VideoDbRequest = {
          platform: expectedPlatformYoutube,
          url: expectedExistingVideoUrl
        };

        // Act
        try {
          await createVideo(expectedVideoDbRequest);
        } catch (actualError) {
          // Assert
          expect(actualError).toBeInstanceOf(Error);
          expect((actualError as Error).message).toEqual(VIDEO_EXISTS_ERROR_MESSAGE);
        }
      });

      it('creates a video if url is unique', async () => {
        // Arrange
        const expectedVideoUrl = 'https://www.youtube.com/watch?v=z4eA2eC28qg';

        const expectedVideoDbRequest: VideoDbRequest = {
          platform: expectedPlatformYoutube,
          url: expectedVideoUrl
        };
        const expectedCreatedVideo: Video = {
          id: 3,
          platform: expectedPlatformYoutube,
          url: expectedVideoUrl,
          created_at: expect.any(Date),
        };

        // Act
        const actualCreatedVideo: Video = await createVideo(expectedVideoDbRequest);

        // Assert
        expect(actualCreatedVideo).toEqual(expectedCreatedVideo);
      });
    });

    describe('getVideoByUrl', () => {
      it('returns video if it exists', async () => {
        // Arrange

        // Act
        const actualVideo: Video = await getVideoByUrl(expectedExistingVideoUrl) as Video;

        // Assert
        expect(actualVideo).toEqual(expectedExistingVideo);
      });

      it('returns undefined if video not found', async () => {
        // Arrange
        const expectedNewUrl = 'https://www.youtube.com/watch?v=C8wKomo4Wds';

        // Act
        const actualVideo = await getVideoByUrl(expectedNewUrl);

        // Assert
        expect(actualVideo).toBeUndefined();
      });
    });
  });

  describe('asset', () => {
    describe('createAsset', () => {
      const expectedTags: AssetType[] = ['Motion', 'Color'];

      it('creates asset if video exists', async () => {
        // Arrange
        const expectedAssetDbRequest: AssetDbRequest = {
          video_id: expectedExistingVideoId,
          tags: expectedTags,
        };
        const expectedCreatedAsset: Asset = {
          id: 2,
          tags: expectedTags,
          video_id: expectedExistingVideoId,
          created_at: expect.any(Date)
        };

        // Act
        const actualCreatedAsset: Asset = await createAsset(expectedAssetDbRequest);

        // Assert
        expect(actualCreatedAsset).toEqual(expectedCreatedAsset);
      })

      it('throws an error is video does not exist', async () => {
        // Arrange
        const expectedAssetDbRequest: AssetDbRequest = {
          video_id: 9000,
          tags: expectedTags,
        };

        // Act
        try {
          await createAsset(expectedAssetDbRequest);
        } catch (actualError) {
          // Assert
          expect(actualError).toBeInstanceOf(Error);
          expect((actualError as Error).message).toEqual(VIDEO_DOES_NOT_EXIST_ERROR_MESSAGE);
        }
      })
    });

    describe('getAssetByVideoId', () => {
      it('returns asset if video exists', async () => {
        // Arrange

        // Act
        const actualAsset: Asset = await getAssetByVideoId(expectedExistingVideoId) as Asset;

        // Assert
        expect(actualAsset).toEqual(expectedExistingAsset);
      });

      it('returns undefined if video does not exist', async () => {
        // Arrange
        const expectedVideoId = 9000;

        // Act
        const actualAsset: Asset = await getAssetByVideoId(expectedVideoId);

        // Assert
        expect(actualAsset).toBeUndefined();
      })
    });

    describe('listAssets', () => {
      it('returns list of assets', async () => {
        // Arrange
        const expectedPopulatedAsset: AssetPopulated = {
          ...expectedExistingVideo,
          ...expectedExistingAsset,
        };

        // Act
        const actualAssets: AssetPopulated[] = await getAllAssets();

        // Assert
        expect(actualAssets[1]).toEqual(expectedPopulatedAsset);
      });
    });
  });
});
