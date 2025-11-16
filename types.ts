export enum GenerationMode {
  TEXT_TO_IMAGE = 'Text-to-Image',
  CUSTOM_TEXT_TO_IMAGE = 'Custom Text-to-Image',
  GAME_THUMBNAILS = 'Game Thumbnails',
  IMAGE_EDITOR = 'Image Editor',
}

export type ImageAspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface ImageConfig {
  aspectRatio: ImageAspectRatio;
  numberOfImages?: number;
}

// FIX: Added missing video types used by TextToVideo and ImageToVideo components.
export type VideoAspectRatio = '16:9' | '9:16';
export type VideoResolution = '720p' | '1080p';

export interface VideoConfig {
  aspectRatio: VideoAspectRatio;
  resolution: VideoResolution;
}