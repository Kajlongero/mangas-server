import { tokenExpirationTimes } from "../configs";

export const getExpirationTime = (key: keyof typeof tokenExpirationTimes) => {
  const expirationTime = new Date(Date.now() + tokenExpirationTimes[key]);

  return expirationTime.toISOString();
};

export const getExpirationTimeInMilis = (
  key: keyof typeof tokenExpirationTimes
) => {
  return Date.now() + tokenExpirationTimes[key];
};
