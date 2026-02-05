import { z } from 'zod'
import { ASSET_TYPES } from '$lib/definitions';
import {
  Z_URL_FORMAT_ERROR_MESSAGE,
  Z_UNSUPPORTED_ASSET_TYPE_ERROR_MESSAGE,
  Z_INVALID_INPUT_ERROR_MESSAGE
} from '$lib/constants';
import { constants } from 'http2';

export const PreviewRequestSchema = z.object({
  url: z
    .url({
      error: (issue) =>
        issue.input === undefined ? Z_INVALID_INPUT_ERROR_MESSAGE : Z_URL_FORMAT_ERROR_MESSAGE
    })
});

export const AssetRequestSchema = z.object({
  url: z
    .url({
      error: (issue) =>
        issue.input === undefined ? Z_INVALID_INPUT_ERROR_MESSAGE : Z_URL_FORMAT_ERROR_MESSAGE
    }),
  tags: z.array(z.enum(ASSET_TYPES, { error: Z_UNSUPPORTED_ASSET_TYPE_ERROR_MESSAGE }))
});

export const Z_ERROR_STATUS_CODE_MAP: Record<string, number> = {
  [Z_INVALID_INPUT_ERROR_MESSAGE]: constants.HTTP_STATUS_BAD_REQUEST,
  [Z_URL_FORMAT_ERROR_MESSAGE]: constants.HTTP_STATUS_UNPROCESSABLE_ENTITY,
  [Z_UNSUPPORTED_ASSET_TYPE_ERROR_MESSAGE]: constants.HTTP_STATUS_UNPROCESSABLE_ENTITY
};
