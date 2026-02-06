import { SUPPORTED_VIDEO_PLATFORMS } from '$lib/definitions';

export const UNSUPPORTED_PLATFORM_ERROR_MESSAGE = `Unsupported platform. Supported platforms: ${SUPPORTED_VIDEO_PLATFORMS.join(', ')}`;
export const MALFORMED_URL_ERROR_MESSAGE = 'Malformed url';
export const UNEXPECTED_END_OF_JSON_ERROR_MESSAGE = 'Unexpected end of JSON input';
export const EMPTY_TAGS_ERROR_MESSAGE = 'Tags cannot be empty';

export const Z_URL_FORMAT_ERROR_MESSAGE = 'Invalid URL format';
export const Z_UNSUPPORTED_ASSET_TYPE_ERROR_MESSAGE = 'Unsupported asset type';
export const Z_INVALID_INPUT_ERROR_MESSAGE = 'Invalid input';
