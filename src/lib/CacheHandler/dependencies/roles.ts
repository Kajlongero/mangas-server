import { DBPostgresInstance } from "../../../lib/DBDependenciesInjector";
import {
  Roles,
  RolesCategories,
  RolesWithCategories,
} from "../../../types/user.security.dto";

export async function rolesLoader(): Promise<Roles[]> {
  const data = await DBPostgresInstance.query(
    DBPostgresInstance.queries.auth.roles.getRoles,
    []
  );
  const roles = data as Roles[];

  return roles;
}

export async function rolesCategoriesLoader(): Promise<RolesCategories[]> {
  const data = await DBPostgresInstance.query(
    DBPostgresInstance.queries.auth.roles.getRolesCategories,
    []
  );

  const categories = data as RolesCategories[];
  return categories;
}

export async function rolesWithCategoriesLoader(): Promise<
  RolesWithCategories[]
> {
  const data = await DBPostgresInstance.query(
    DBPostgresInstance.queries.auth.roles.getRolesWithCategories,
    []
  );
  const rolesWCategories = data as RolesWithCategories[];
  return rolesWCategories;
}
