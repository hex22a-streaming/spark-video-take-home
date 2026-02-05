import type { VideoPlatform } from '$lib/definitions';
import { MALFORMED_URL_ERROR_MESSAGE, UNSUPPORTED_PLATFORM_ERROR_MESSAGE } from '$lib/constants';

const URL_LENGTH_LIMIT = 2000;

export function getPlatform(url: string): VideoPlatform {
  if (url.length > URL_LENGTH_LIMIT) throw new Error(MALFORMED_URL_ERROR_MESSAGE);

  let urlObj: URL;

  try {
    urlObj = new URL(url);
  } catch {
    throw new Error(MALFORMED_URL_ERROR_MESSAGE);
  }

  const hostname = urlObj.hostname.toLowerCase();

  const domain = hostname.replace(/^www\./, '');

  switch (domain) {
    case 'youtube.com':
      return 'youtube';
    case 'tiktok.com':
      return 'tiktok';
    case 'instagram.com':
      return 'instagram';
    default:
      throw new Error(UNSUPPORTED_PLATFORM_ERROR_MESSAGE);
  }
}
