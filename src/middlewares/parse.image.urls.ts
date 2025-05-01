import path from "path";

import { internal } from "@hapi/boom";

import type { NextFunction, Request, Response } from "express";

import { CacheHandler } from "../lib/CacheHandler";

import type { ImagesStore } from "../types/images.dto";
import type { IUploadFileConfig } from "../lib/FilesStoresHandler/interfaces/upload";
import type { FileUpload } from "../lib/FilesStoresHandler/types/files";

const instance = CacheHandler.getInstance();

export const parseImageUrls =
  ({ fieldName }: Pick<IUploadFileConfig, "fieldName">) =>
  (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.storeId;

    const store = instance.getCacheElemById<ImagesStore>(
      "IMAGES_STORES",
      storeId
    );
    if (!store) throw internal();

    const elements = req.files as FileUpload;
    const files = elements[fieldName as string];

    const urls: string[] = [];

    console.log(files);

    files.map((elem) => {
      const storePath = path.join(store.absoluteUrl);
      const imgPath = path.join(elem.path);

      const replaced = imgPath.replace(storePath, "");

      const parsed = replaced.split("\\");
      const slice = parsed.slice(1, parsed.length);

      urls.push(path.join(slice.join(path.sep)));
    });

    req.imageUrls = [...urls];

    next();
  };
