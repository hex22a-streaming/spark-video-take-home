import { describe, expect, it } from 'vitest';
import type { VideoPlatform } from '$lib/definitions';
import { getPlatform } from './parser';
import { MALFORMED_URL_ERROR_MESSAGE, UNSUPPORTED_PLATFORM_ERROR_MESSAGE } from '$lib/constants';

describe('parser', () => {
  describe('parseUrl', () => {
    it('returns youtube if url matches youtube', () => {
      // Arrange
      const expectedVideoPlatform: VideoPlatform = 'youtube';
      const expectedVideoUrl = 'https://www.youtube.com/watch?v=h_1qim3_A1w';

      // Act
      const actualVideoPlatform: VideoPlatform = getPlatform(expectedVideoUrl) as VideoPlatform;

      // Assert
      expect(actualVideoPlatform).toEqual(expectedVideoPlatform);
    });

    it('returns tiktok if url matches tiktok', () => {
      // Arrange
      const expectedVideoPlatform: VideoPlatform = 'tiktok';
      const expectedVideoUrl = 'https://www.tiktok.com/@julien.song/video/7598993576512523542';

      // Act
      const actualVideoPlatform: VideoPlatform = getPlatform(expectedVideoUrl) as VideoPlatform;

      // Assert
      expect(actualVideoPlatform).toEqual(expectedVideoPlatform);
    });

    it('returns instagram if url matches instagram', () => {
      // Arrange
      const expectedVideoPlatform: VideoPlatform = 'instagram';
      const expectedVideoUrl = 'https://www.instagram.com/reel/DUDG-YdiIKf/';

      // Act
      const actualVideoPlatform: VideoPlatform = getPlatform(expectedVideoUrl) as VideoPlatform;

      // Assert
      expect(actualVideoPlatform).toEqual(expectedVideoPlatform);
    });

    it('throws unsupported platform if url does not match', () => {
      // Arrange
      const expectedVideoUrl = 'https://www.yahoo.com/';

      // Act
      try {
        getPlatform(expectedVideoUrl);
      } catch (actualError) {

        // Assert
        expect(actualError).toBeInstanceOf(Error);
        expect((actualError as Error).message).toEqual(UNSUPPORTED_PLATFORM_ERROR_MESSAGE);
      }
    });

    it('throws malformed url if not url', () => {
      // Arrange
      const expectedVideoUrl = 'random string';

      // Act
      try {
        getPlatform(expectedVideoUrl);
      } catch (actualError) {

        // Assert
        expect(actualError).toBeInstanceOf(Error);
        expect((actualError as Error).message).toEqual(MALFORMED_URL_ERROR_MESSAGE);
      }
    });

    it('throws malformed url if url too long (DoS protection)', () => {
      // Arrange
      const expectedVideoUrl = 'lorem'.repeat(1000);

      // Act
      try {
        getPlatform(expectedVideoUrl);
      } catch (actualError) {
        expect(actualError).toBeInstanceOf(Error);
        expect((actualError as Error).message).toEqual(MALFORMED_URL_ERROR_MESSAGE);
      }
    });
  });
});
