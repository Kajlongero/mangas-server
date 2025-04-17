import { config } from "dotenv";

config();

const {
  // SERVER
  PORT,
  HOST,
  // DB
  DB_CONNECTION_STRING,
  // AUTH
  RSA_PRIVATE_KEY,
  JWT_AT_SECRET,
  JWT_RT_SECRET,
} = process.env;

export const serverOptions = {
  PORT: parseInt(PORT as string),
  HOST,
};

export const dbOptions = {
  DB_CONNECTION_STRING,
};

export const authOptions = {
  RSA_PRIVATE_KEY: RSA_PRIVATE_KEY as string,

  JWT_AT_SECRET: encodeURIComponent(JWT_AT_SECRET as string),
  JWT_RT_SECRET: encodeURIComponent(JWT_RT_SECRET as string),
};

const BASE_EXPIRATION_TIME = 1000 * 60;

export const tokenExpirationTimes = {
  SHORT_15M: BASE_EXPIRATION_TIME * 15,
  SHORT_RECOVERY_30M: BASE_EXPIRATION_TIME * 30,
  SHORT_MEDIUM_1H: BASE_EXPIRATION_TIME * 60,
  MEDIUM_SHORT_1D: BASE_EXPIRATION_TIME * 60 * 24,
  MEDIUM_7D: BASE_EXPIRATION_TIME * 60 * 24 * 7,
  MEDIUM_LONG_30D: BASE_EXPIRATION_TIME * 60 * 24 * 30,
  LONG_180D: BASE_EXPIRATION_TIME * 60 * 24 * 180,
};
