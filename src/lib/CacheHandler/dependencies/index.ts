import { Roles } from "../../../types/user.security.dto";
import { Loader } from "../interfaces/loader";
import { imagesStoreLoader } from "./images";
import {
  rolesCategoriesLoader,
  rolesLoader,
  rolesWithCategoriesLoader,
} from "./roles";

export const loaders: Loader<unknown>[] = [
  {
    name: "ROLES",
    keyRef: "name",
    valueRef: undefined,
    callback: rolesLoader,
  },
  {
    name: "ROLES_CATEGORIES",
    keyRef: "name",
    valueRef: undefined,
    callback: rolesCategoriesLoader,
  },
  {
    name: "ROLES_WITH_CATEGORIES",
    keyRef: "id",
    valueRef: undefined,
    callback: rolesWithCategoriesLoader,
  },
  {
    name: "IMAGES_STORES",
    keyRef: "id",
    valueRef: undefined,
    callback: imagesStoreLoader,
  },
];
