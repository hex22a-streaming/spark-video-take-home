import type { RequestHandler } from '@sveltejs/kit';
import type { Video, VideoPlatform } from '$lib/definitions';
import { createVideo, getVideoByUrl } from '$lib/model/data/video.server';
import { getPlatform } from '$lib/parser';
import { createAsset } from '$lib/model/data/asset.server';
import { AssetRequestSchema, Z_ERROR_STATUS_CODE_MAP } from '$lib/shemas';
import { z } from 'zod';
import { constants } from 'http2';
import {
  EMPTY_TAGS_ERROR_MESSAGE,
  UNEXPECTED_END_OF_JSON_ERROR_MESSAGE,
  UNSUPPORTED_PLATFORM_ERROR_MESSAGE
} from '$lib/constants';

export const POST: RequestHandler = async ({ request }: { request: Request }) => {
  try {
    const body = await request.json();

    const { url, tags } = AssetRequestSchema.parse(body);
    if (tags.length === 0) {
      return new Response(JSON.stringify({ error: EMPTY_TAGS_ERROR_MESSAGE }), { status: constants.HTTP_STATUS_UNPROCESSABLE_ENTITY });
    }
    let video: Video | undefined = await getVideoByUrl(url);
    let created: boolean = false;

    if (!video) {
      const platform: VideoPlatform = getPlatform(url);
      video = await createVideo({ url, platform });
      created = true;
    }

    const asset = await createAsset({
      tags: tags,
      video_id: video.id
    });
    return new Response(JSON.stringify({ asset, created }), { status: constants.HTTP_STATUS_CREATED });
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
        case UNEXPECTED_END_OF_JSON_ERROR_MESSAGE:
          return new Response(JSON.stringify({ error: UNEXPECTED_END_OF_JSON_ERROR_MESSAGE }), {
            status: constants.HTTP_STATUS_BAD_REQUEST
          });
        default:
          return new Response(
            JSON.stringify({
              error: `Unexpected error occurred while creating an asset: ${error.message}`
            }),
            { status: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR }
          );
      }
    }

    return new Response(JSON.stringify({ error: 'Unexpected error occurred' }), {
      status: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
    });
  }
}
