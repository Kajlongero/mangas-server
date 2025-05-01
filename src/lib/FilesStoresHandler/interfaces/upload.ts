import type { Multer } from "multer";

interface UploadOptions {
  filename: "UUID" | "RANDOM" | "SAME" | null;
  destination: string;
}

interface UploadOrderModes {}

export interface IUploadFileOutput {
  files:
    | Express.Multer.File[]
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | undefined;
  refreshToken?: string;
}

export interface IUploadFileConfig {
  mode: "single" | "array" | null;
  orderModes: "user" | "translationGroups" | "elements" | null;
  destinations: UploadOptions | null;
  fieldName: "user_images" | "translation_group_images";
}
