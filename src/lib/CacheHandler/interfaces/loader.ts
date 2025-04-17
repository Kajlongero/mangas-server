export interface Loader<T> {
  name: string;
  keyRef: string | number;
  valueRef?: string;

  callback: () => Promise<unknown>;
}

export interface LoaderParams {}
