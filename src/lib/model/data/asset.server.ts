import type { Asset, AssetDbRequest, AssetPopulated } from '$lib/definitions';
import { db } from '$lib/model/db';
import { formatPgArray, isPostgresError } from '$lib/model/helpers';

export const VIDEO_DOES_NOT_EXIST_ERROR_MESSAGE = 'Video does not exist';

const PG_FK_VIOLATION_ERROR_CODE = '23503';
const VIDEO_CONSTRAINT_ID = 'asset_video_id_fk';
const LIST_ASSETS_LIMIT = 100;

export async function createAsset(assetRequest: AssetDbRequest): Promise<Asset> {
  const { video_id, tags } = assetRequest;
  const formattedTags = formatPgArray(tags);
  try {
    const queryResult = await db.query<Asset>`
      INSERT INTO asset (video_id, tags)
      VALUES (${video_id}, ${formattedTags}::text[])
      RETURNING id, tags, video_id, created_at
    `;
    return queryResult.rows[0];
  } catch (error) {
    if (
      isPostgresError(error)
      && error.code === PG_FK_VIOLATION_ERROR_CODE
      && error.constraint === VIDEO_CONSTRAINT_ID
    ) {
      throw new Error(VIDEO_DOES_NOT_EXIST_ERROR_MESSAGE);
    }
    throw error;
  }
}

export async function getAssetByVideoId(videoId: number): Promise<Asset> {
  const queryResult = await db.query<Asset>`
    SELECT id, tags, video_id, created_at
    FROM asset
    WHERE video_id = ${videoId}
    LIMIT 1
  `;
  return queryResult.rows[0];
}

export async function getAllAssets(): Promise<AssetPopulated[]> {
  const queryResult = await db.query<AssetPopulated>`
    SELECT asset.id, tags, video_id, asset.created_at, url, platform
    FROM asset
    JOIN video ON video.id = asset.video_id
    ORDER BY created_at DESC
    LIMIT ${LIST_ASSETS_LIMIT}
  `;
  return queryResult.rows;
}
