import { config } from "dotenv";

config();

const {
  // SERVER
  PORT,
  HOST,
  // AUTH
} = process.env;

export const serverOptions = {
  PORT: parseInt(PORT as string),
  HOST,
};
