import { Roles } from "../../../types/user.security.dto";
import { Loader } from "../interfaces/loader";
import {
  rolesCategoriesLoader,
  rolesLoader,
  rolesWithCategoriesLoader,
} from "./roles";

export const loaders: Loader<Roles[]>[] = [
  {
    name: "roles",
    keyRef: "name",
    valueRef: undefined,
    callback: rolesLoader,
  },
  {
    name: "rolesCategories",
    keyRef: "name",
    valueRef: undefined,
    callback: rolesCategoriesLoader,
  },
  {
    name: "rolesWithCategories",
    keyRef: "id",
    valueRef: undefined,
    callback: rolesWithCategoriesLoader,
  },
];
