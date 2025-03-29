export interface IDBDependenciesInjector {
  query: <T>(query: string, params: unknown[]) => Promise<T>;
  start?: () => Promise<void>;
}
