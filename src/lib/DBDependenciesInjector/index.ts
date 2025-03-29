import { DBDependenciesInjector } from "./definition";
import { DBPostgres } from "./dependencies/postgres";
import { postgresBase as pb } from "../../connections/postgres";

const pg = new DBPostgres(pb);

export const DBPostgresInstance = new DBDependenciesInjector(pg, "postgres");
