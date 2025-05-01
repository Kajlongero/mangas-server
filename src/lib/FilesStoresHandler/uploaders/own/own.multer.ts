import fs from "fs";
import path from "path";
import multer from "multer";
import crypto from "crypto";
import { promisify } from "util";
import { badRequest, unauthorized } from "@hapi/boom";

import { NextFunction, Request, Response } from "express";

import { VALID_FILE_EXT } from "../../lib/file.filters";
import { makeDir } from "../../lib/make.dir";

import { IUploadFileConfig } from "../../interfaces/upload";
import { AccessTokenPayload } from "../../../JwtFunctions/types/jwt.payloads.dto";
import { IFilesStore } from "../../types/store";
import { validateSessionEquality } from "../../../../security/validate.session.equality";
import { FileUpload } from "../../types/files";

const OwnMulterDiskStorage = (config: IUploadFileConfig) => {
  const diskStorage = multer.diskStorage({
    filename: async (req, file, callback) => {
      const saverType = config.destinations?.filename;
      const fileExtension = path.extname(file.originalname);

      if (!saverType) {
        return callback(null, `${crypto.randomUUID()}${fileExtension}`);
      }

      switch (saverType) {
        case "UUID": {
          callback(null, `${crypto.randomUUID()}${fileExtension}`);
          break;
        }
        case "RANDOM": {
          const bytes = crypto.randomBytes(12);
          const randomName = bytes.toString("hex");

          callback(null, `${randomName}${fileExtension}`);
          break;
        }
        case "SAME": {
          callback(null, `${file.originalname}`);
          break;
        }
        default: {
          callback(new Error("Invalid saverType"), "");
          break;
        }
      }
    },
    destination: async (req, file, callback) => {
      callback(null, config.destinations?.destination as string);
    },
  });

  return diskStorage;
};

export const OwnMulterUploader = (config: IUploadFileConfig) => {
  const upload = multer({
    storage: OwnMulterDiskStorage(config),
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!VALID_FILE_EXT.has(ext)) {
        return cb(null, false);
      }

      cb(null, true);
    },
  });

  return upload;
};

export const MulterUpload = async (
  req: Request,
  store: IFilesStore,
  config: IUploadFileConfig,
  next: NextFunction
) => {
  switch (config.orderModes) {
    case "user": {
      const user = req.user as AccessTokenPayload;
      const pth = path.join(
        store.absoluteUrl,
        user.uid,
        config.destinations?.destination as string
      );

      await makeDir(pth);

      const multerConfig = {
        ...config,
        destinations: {
          destination: pth,
          filename: config.destinations?.filename ?? "UUID",
        },
      };

      const uploader = OwnMulterUploader(multerConfig);

      await uploader.fields([
        { name: config.fieldName, maxCount: 1 },
        { name: "refreshToken", maxCount: 1 },
      ])(req, {} as Response, (err) => {
        if (err) {
          next(badRequest());
        }

        const elements = req.files as FileUpload;
        const files = elements[config.fieldName];

        if (!files || !files.length)
          next(badRequest("You need to upload an image"));

        const token = req.body.refreshToken;
        const verified = validateSessionEquality(user, token);

        req.refresh = verified;
        req.storeId = store.id;

        next();
      });

      break;
    }

    case "translationGroups": {
      const { groupId } = req.params;

      const user = req.user as AccessTokenPayload;
      const pth = path.join(
        store.absoluteUrl,
        groupId,
        config.destinations?.destination as string
      );

      await makeDir(pth);

      const multerConfig = {
        ...config,
        destinations: {
          destination: pth,
          filename: config.destinations?.filename ?? "UUID",
        },
      };

      const uploader = OwnMulterUploader(multerConfig);

      await uploader.fields([
        { name: config.fieldName, maxCount: 1 },
        { name: "refreshToken", maxCount: 1 },
      ])(req, {} as Response, (err) => {
        try {
          if (err) {
            next(badRequest());
          }

          if (!req.file || !Object.keys(req.file ?? {}))
            next(badRequest("You should upload an image"));

          const token = req.body.refreshToken;
          const verified = validateSessionEquality(user, token);

          req.refresh = verified;
          req.storeId = store.id;

          next();
        } catch (error) {
          next(error);
        }
      });

      break;
    }

    case "elements": {
    }

    default:
      next(badRequest("Error uploading file"));
  }
};
