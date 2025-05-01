import path from "path";
import filetype from "magic-bytes.js";

export const VALID_FILE_EXT = new Set([".jpg", ".png", ".jpeg", ".gif"]);

export const fileFilter = (filename: string, buffer: Buffer): boolean => {
  const ext = path.extname(filename).toLowerCase();
  if (!VALID_FILE_EXT.has(ext)) {
    return false;
  }

  const matches = filetype(buffer);
  if (!matches || matches.length === 0) {
    return false;
  }

  const validMimeTypes = new Set(["image/jpeg", "image/png", "image/gif"]);
  const isValidMimeType = matches.some((match) =>
    validMimeTypes.has(match.mime as string)
  );

  return isValidMimeType;
};
