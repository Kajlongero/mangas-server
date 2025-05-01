import { LoadersNames } from "../types/names";

export interface Loader<T> {
  name: LoadersNames;
  keyRef: string | number;
  valueRef?: string;

  callback: () => Promise<unknown>;
}

export interface LoaderParams {}
