export const ASSET_TYPES = ['Motion', 'Typography', 'Color', 'Sound design'];
export const SUPPORTED_VIDEO_PLATFORMS = ['youtube', 'instagram', 'tiktok'];

export type VideoPlatform = (typeof SUPPORTED_VIDEO_PLATFORMS)[number];
export type AssetType = (typeof ASSET_TYPES)[number];

export type VideoRequest = {
  url: string;
};

export type VideoDbRequest = VideoRequest & {
  platform: VideoPlatform;
};

export type Video = VideoDbRequest & {
  id: number;
  created_at: Date;
};

export type AssetRequest = {
  url: string;
  tags: AssetType[];
};

export type AssetDbRequest = Omit<AssetRequest, 'url'> & {
  video_id: number;
};

export type Asset = AssetDbRequest & {
  id: number;
  created_at: Date;
};

export type AssetPopulated = Omit<Asset, 'video_id'> & {
  url: string;
  platform: VideoPlatform;
}
