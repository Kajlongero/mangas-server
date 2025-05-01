import { ImagesStore } from "../../../types/images.dto";
import { DBPostgresInstance } from "../../DBDependenciesInjector";

export const imagesStoreLoader = async (): Promise<ImagesStore[]> => {
  const stores = await DBPostgresInstance.query<ImagesStore[]>(
    DBPostgresInstance.queries.images.stores.getAll,
    []
  );

  return stores;
};
