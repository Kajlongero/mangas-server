import { notAcceptable, serverUnavailable } from "@hapi/boom";
import { ImagesStore } from "../../types/images.dto";
import {
  PRIORITIES_DICTIONARY,
  PrioritiesValues,
} from "./dictionaries/priorities";
import { IFilesStore, IStoreSavers } from "./types/store";
import { IUploadFileConfig } from "./interfaces/upload";
import { NextFunction, Request } from "express";
import { MulterUpload } from "./uploaders/own/own.multer";

export class FilesStoreHandler {
  private cache: Map<number, ImagesStore>;
  private handler: Map<string, IFilesStore[]>;

  private static instance: FilesStoreHandler;

  constructor() {
    this.cache = new Map();
    this.handler = new Map();
  }

  public static getInstance() {
    if (!FilesStoreHandler.instance) {
      FilesStoreHandler.instance = new FilesStoreHandler();
    }

    return FilesStoreHandler.instance;
  }

  public loadCache(cache: Map<number, ImagesStore>) {
    this.cache = cache;

    this.processCache();
  }

  private select(store: IStoreSavers): IFilesStore | null {
    let findOptimal: IFilesStore | null = null;

    for (const [priority, elements] of this.handler.entries()) {
      if (!elements?.length) continue;

      for (const element of elements) {
        if (!element.active) continue;

        if (element.storeName !== store) continue;

        if (!findOptimal || element.priority > findOptimal.priority)
          findOptimal = element;
      }
    }

    if (!findOptimal) throw serverUnavailable("Service not working correctly");

    return findOptimal;
  }

  public async upload(
    req: Request,
    store: IStoreSavers,
    config: IUploadFileConfig,
    next: NextFunction
  ) {
    try {
      const selected = this.select(store);
      if (!selected)
        throw serverUnavailable("Service unavailable, try again later");

      switch (selected.storeServiceName) {
        case "OWN": {
          await MulterUpload(req, selected, config, next);

          break;
        }
        case "OWN_EXTERNAL": {
          break;
        }
        case "AWS": {
          break;
        }
        case "AZURE": {
          break;
        }
        case "CLOUDFLARE": {
          break;
        }
        case "GOOGLE_CLOUD": {
          break;
        }

        default:
          throw serverUnavailable("Service not working, try again later...");
      }
    } catch (error) {
      next(error);
    }
  }

  private createRecord(element: ImagesStore): IFilesStore {
    const obj: IFilesStore = {
      ...element,
      active: true,
      reattempt: null,
      handler: () =>
        setTimeout(() => {
          this.setStatus(
            PRIORITIES_DICTIONARY[element.priority].name as PrioritiesValues,
            element.id,
            true
          );
        }, 300 * 1000),
    };

    return obj;
  }

  private processCache() {
    const cache = this.cache;

    for (const [key, val] of cache.entries()) {
      const element = this.createRecord(val);

      if (this.handler.has(PRIORITIES_DICTIONARY[val.id].name)) {
        const data = this.handler.get(
          PRIORITIES_DICTIONARY[val.id].name
        ) as IFilesStore[];

        const copy = [...data, element];

        this.handler.set(PRIORITIES_DICTIONARY[val.id].name, copy);
        continue;
      }
      const data = [element];

      this.handler.set(PRIORITIES_DICTIONARY[val.id].name, data);
    }
  }

  private setStatus(priority: PrioritiesValues, id: number, status: boolean) {
    if (!this.handler.has(priority)) throw notAcceptable();

    const cache = this.handler.get(priority) as IFilesStore[];

    const index = cache.findIndex((elem) => elem.id === id);
    if (index === -1) throw notAcceptable();

    const elem = cache[index];
    const copy: IFilesStore = {
      ...elem,
      active: status,
    };
    const arrcopy = [...cache];

    arrcopy.splice(index, 1, copy);
    const arr = [...arrcopy];

    this.handler.set(priority, arr);

    return true;
  }
}
