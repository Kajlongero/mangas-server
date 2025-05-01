import {
  IStoreSavers,
  IStoreServices,
} from "../lib/FilesStoresHandler/types/store";

export type ImagesStore = {
  id: number;
  absoluteUrl: string;
  relativeUrl: string;
  isExternal: boolean;
  priority: number;
  priorityName: string;
  storeName: IStoreSavers;
  storeNameId: number;
  storeServiceId: number;
  storeServiceName: IStoreServices;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type Images = {
  id: number;
  url: string;
  imagesStoreId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  imageStore: ImagesStore;
};
