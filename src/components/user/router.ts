import passport from "passport";
import { Router } from "express";

import { UserService } from "./service";
import { SuccessResponse } from "../../responses/success";
import { joiValidateSchema } from "../../middlewares/validator.handler";
import {
  ChangeBirthDateSchema,
  ChangeDescriptionSchema,
  ChangeUsernameSchema,
} from "./model";
import { refreshTokenMiddleware } from "../../security/refresh.validator";
import { DBPostgresInstance } from "../../lib/DBDependenciesInjector";

import { JwtPayloads } from "../auth/types/auth.dto";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../../lib/JwtFunctions/types/jwt.payloads.dto";
import {
  validateAccessSession,
  validateRefreshSession,
} from "../../middlewares/sessions.validator";
import { upload } from "../../middlewares/upload.files";
import { parseImageUrls } from "../../middlewares/parse.image.urls";

const userRouter = Router();
const instance = new UserService(DBPostgresInstance);

userRouter.patch(
  "/update-username",
  passport.authenticate("jwt-bearer", { session: false }),
  refreshTokenMiddleware,
  joiValidateSchema(ChangeUsernameSchema, "body"),
  async (req, res, next) => {
    try {
      const payloads: JwtPayloads = {
        accessTokenPayload: req.user as AccessTokenPayload,
        refreshTokenPayload: req.refresh as RefreshTokenPayload,
      };
      const username: string = req.body.username;
      const result = await instance.changeUsername(payloads, username);

      SuccessResponse(req, res, result);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.patch(
  "/update-description",
  passport.authenticate("jwt-bearer", { session: false }),
  refreshTokenMiddleware,
  joiValidateSchema(ChangeDescriptionSchema, "body"),
  async (req, res, next) => {
    try {
      const payloads: JwtPayloads = {
        accessTokenPayload: req.user as AccessTokenPayload,
        refreshTokenPayload: req.refresh as RefreshTokenPayload,
      };
      const description: string = req.body.description;

      const result = await instance.changeDescription(payloads, description);

      SuccessResponse(req, res, result);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.patch(
  "/update-birth-date",
  passport.authenticate("jwt-bearer", { session: false }),
  refreshTokenMiddleware,
  joiValidateSchema(ChangeBirthDateSchema, "body"),
  async (req, res, next) => {
    try {
      const payloads: JwtPayloads = {
        accessTokenPayload: req.user as AccessTokenPayload,
        refreshTokenPayload: req.refresh as RefreshTokenPayload,
      };
      const birthDate: string = req.body.birthDate;

      const result = await instance.changeBirthDate(payloads, birthDate);

      SuccessResponse(req, res, result);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post(
  "/set-cover-image",
  validateAccessSession,
  upload("USER_COVER_IMAGES", {
    mode: "single",
    destinations: {
      filename: "UUID",
      destination: "cover",
    },
    orderModes: "user",
    fieldName: "user_images",
  }),
  parseImageUrls({ fieldName: "user_images" }),
  async (req, res, next) => {
    try {
      const user = req.user;

      const payloads = {
        accessTokenPayload: user as AccessTokenPayload,
        refreshTokenPayload: req.refresh as RefreshTokenPayload,
      };

      const store = req.storeId;
      const imageUrls = req.imageUrls;

      const data = await instance.changeProfileImage(
        payloads,
        store,
        imageUrls
      );

      SuccessResponse(req, res, data);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post(
  "/set-background-image",
  validateAccessSession,
  upload("USER_BACKGROUND_IMAGES", {
    mode: "single",
    destinations: {
      filename: "UUID",
      destination: "background",
    },
    orderModes: "user",
    fieldName: "user_images",
  }),
  parseImageUrls({ fieldName: "user_images" }),
  async (req, res, next) => {
    try {
      const user = req.user;

      const payloads = {
        accessTokenPayload: user as AccessTokenPayload,
        refreshTokenPayload: req.refresh as RefreshTokenPayload,
      };

      const store = req.storeId;
      const imageUrls = req.imageUrls;

      const data = await instance.changeBackgroundImage(
        payloads,
        store,
        imageUrls
      );

      SuccessResponse(req, res, data);
    } catch (error) {
      next(error);
    }
  }
);

export { userRouter };
