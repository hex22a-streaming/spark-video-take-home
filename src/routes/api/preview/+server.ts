import { constants } from 'http2';
import type { RequestHandler } from './$types';
import { getPlatform } from '$lib/parser';
import type { VideoPlatform, VideoRequest } from '$lib/definitions';
import {
  createVideo,
  getVideoByUrl,
} from '$lib/model/data/video.server';
import { UNSUPPORTED_PLATFORM_ERROR_MESSAGE } from '$lib/constants';
import { PreviewRequestSchema, Z_ERROR_STATUS_CODE_MAP } from '$lib/shemas';
import { z } from 'zod';

export const POST: RequestHandler = async ({ request }: { request: Request }) => {
  const body = await request.json();

  try {
    const { url }: VideoRequest = PreviewRequestSchema.parse(body);
    const platform: VideoPlatform = getPlatform(url);

    const existing_asset = await getVideoByUrl(url);
    if (existing_asset) {
      return new Response(JSON.stringify({ url, platform, existing_asset }));
    }

    await createVideo({ url, platform });
    return new Response(JSON.stringify({ url, platform, existing_asset: null }), {
      status: constants.HTTP_STATUS_CREATED
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const staus = Z_ERROR_STATUS_CODE_MAP[error.issues[0].message];
      return new Response(JSON.stringify({ error: error.issues[0].message }), { status: staus });
    }
    if (error instanceof Error) {
      switch (error.message) {
        case UNSUPPORTED_PLATFORM_ERROR_MESSAGE:
          return new Response(JSON.stringify({ error: UNSUPPORTED_PLATFORM_ERROR_MESSAGE }), {
            status: constants.HTTP_STATUS_UNPROCESSABLE_ENTITY
          });
        default:
          return new Response(
            JSON.stringify({
              error: `Unexpected error occurred while creating video: ${error.message}`
            }),
            { status: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR }
          );
      }
    }
    return new Response(JSON.stringify({ error: 'Unexpected error occurred' }), { status: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR });
  }
};
