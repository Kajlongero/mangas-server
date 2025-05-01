import { Request, Response, NextFunction } from "express";

import { FilesStoreHandler } from "../lib/FilesStoresHandler/definition";

import type { IStoreSavers } from "../lib/FilesStoresHandler/types/store";
import type { IUploadFileConfig } from "../lib/FilesStoresHandler/interfaces/upload";

const instance = FilesStoreHandler.getInstance();

export const upload =
  (store: IStoreSavers, configs: IUploadFileConfig) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await instance.upload(req, store, configs, next);
  };
