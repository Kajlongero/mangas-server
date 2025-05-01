import { ImagesStore } from "../../../types/images.dto";

export interface IFilesStore extends ImagesStore {
  active: boolean;
  reattempt: string | null;

  handler: (id: number | string) => void;
}

export type IStoreSavers =
  | "USER_BACKGROUND_IMAGES"
  | "USER_COVER_IMAGES"
  | "ELEMENT_COVER"
  | "ELEMENT_CONTENTS";

export type IStoreServices =
  | "OWN"
  | "OWN_EXTERNAL"
  | "AWS"
  | "AZURE"
  | "CLOUDFLARE"
  | "GOOGLE_CLOUD";
