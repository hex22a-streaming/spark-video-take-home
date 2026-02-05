import { expectedExistingVideo, expectedExistingAsset } from './fixtures';
import { db, type queryFunction } from '$lib/model/db';
import { formatPgArray } from '$lib/model/helpers';

export type seedDbClient = { query: queryFunction };

class Seed {
  db: seedDbClient;

  constructor() {
    this.db = db as seedDbClient;
  }

  async seedVideos() {
    return this.db.query`
      INSERT INTO public.video
          (id, url, platform)
      OVERRIDING SYSTEM VALUE
      VALUES
          (${expectedExistingVideo.id}, ${expectedExistingVideo.url}, ${expectedExistingVideo.platform})
  `;
  }

  async seedAssets() {
    const formattedTags = formatPgArray(expectedExistingAsset.tags)
    return this.db.query`
      INSERT INTO public.asset
          (id, video_id, tags)
      OVERRIDING SYSTEM VALUE
      VALUES
          (${expectedExistingAsset.id}, ${expectedExistingAsset.video_id}, ${formattedTags}::text[])
  `;
  }

  async restoreVideoCounter() {
    await this.db.query`
      SELECT setval('video_id_seq', (SELECT MAX(id) FROM public.video), true)
    `;
  }

  async restoreAssetCounter() {
    await this.db.query`
      SELECT setval('asset_id_seq', (SELECT MAX(id) FROM public.video), true)
    `;
  }

  async seedAll() {
    await this.seedVideos();
    await this.seedAssets();
    await this.restoreVideoCounter();
    await this.restoreAssetCounter();
  }
}

export default Seed;
