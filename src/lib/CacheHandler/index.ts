import { notAcceptable } from "@hapi/boom";
import { Loader } from "./interfaces/loader";

export class CacheHandler {
  private cache: Map<string | number, unknown>;

  private static instance: CacheHandler;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): CacheHandler {
    if (!CacheHandler.instance) {
      this.instance = new CacheHandler();
    }

    return this.instance;
  }

  public getCache<T>(cacheName: string): Map<string | number, T | null> {
    if (!CacheHandler.instance) {
      CacheHandler.instance = new CacheHandler();
    }

    if (!this.cache.has(cacheName)) {
      this.cache.set(cacheName, new Map<string | number, T | null>());
    }

    return this.cache.get(cacheName) as unknown as Map<
      string | number,
      T | null
    >;
  }

  public getCacheElem(cacheName: string, key: string | number) {
    const cache = this.getCache(cacheName);
    if (!cache.has(key)) return null;

    return cache.get(key);
  }

  public addToCache<T>(cacheName: string, key: string | number, value: T) {
    const cache = this.getCache(cacheName);
    cache.set(key, value);

    return cache.get(key);
  }

  public updateCache<T>(cacheName: string, key: string | number, value: T) {
    const cache = this.getCache(cacheName);
    if (!cache.has(key)) {
      this.addToCache(cacheName, key, value);

      return cache.get(key);
    }

    cache.set(key, value);
    return cache.get(key);
  }

  public deleteFromCache(cacheName: string, key: string | number) {
    const cache = this.getCache(cacheName);
    if (!cache.has(key)) return true;

    cache.delete(key);

    return true;
  }

  public async load<T>(loader: Loader<T>): Promise<void> {
    const { name, keyRef, valueRef, callback } = loader;

    const data = await callback();

    const res = data as Record<string | number, any>;
    if (!res) return;

    switch (typeof data) {
      case "object": {
        if (Array.isArray(data)) {
          data.map((elem) => {
            this.addToCache(
              name,
              elem[keyRef],
              valueRef ? elem[valueRef] : elem
            );
          });

          break;
        }

        const keyName = res[keyRef];
        const valName = valueRef ? res[valueRef] : res;

        this.addToCache(name, keyName, valName);

        break;
      }
      default:
        throw notAcceptable("Bad formatted data");
    }
  }
}
