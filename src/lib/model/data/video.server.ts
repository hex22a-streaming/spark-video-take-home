import type { Video, VideoDbRequest } from '$lib/definitions';
import { db } from '$lib/model/db';
import { isPostgresError } from '$lib/model/helpers';

export const VIDEO_EXISTS_ERROR_MESSAGE = 'Video with provided URL already exists';

const PG_UNIQUE_VIOLATION_ERROR_CODE = '23505';
const URL_CONSTRAINT_ID = 'video_url_key';

export async function createVideo(video: VideoDbRequest): Promise<Video> {
  try {
    const queryResult = await db.query<Video>`
      INSERT INTO video (url, platform)
      VALUES (${video.url}, ${video.platform})
      RETURNING id, url, platform, created_at
    `;
    return queryResult.rows[0];
  } catch (error) {
    if (
      isPostgresError(error) &&
      error.code === PG_UNIQUE_VIOLATION_ERROR_CODE &&
      error.constraint === URL_CONSTRAINT_ID
    ) {
      throw new Error(VIDEO_EXISTS_ERROR_MESSAGE);
    }
    throw error;
  }
}

export async function getVideoByUrl(url: string): Promise<Video | undefined> {
  const queryResult = await db.query<Video>`
    SELECT id, url, platform, created_at
    FROM video
    WHERE url = ${url}
    LIMIT 1
  `;
  return queryResult.rows[0];
}
