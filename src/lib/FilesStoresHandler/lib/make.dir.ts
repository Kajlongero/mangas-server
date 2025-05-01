import fs from "fs";
import { promisify } from "util";

const mkdir = promisify(fs.mkdir);

export const makeDir = async (route: string) => {
  const exists = fs.existsSync(route);

  if (!exists) {
    await mkdir(route, { recursive: true });
  }

  return true;
};
