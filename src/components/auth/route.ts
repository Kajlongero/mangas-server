import passport from "passport";
import { Router } from "express";

import { AuthService } from "./service";
import { SuccessResponse } from "../../responses/success";
import { joiValidateSchema } from "../../middlewares/validator.handler";
import { DBPostgresInstance } from "../../lib/DBDependenciesInjector";
import {
  ChangePasswordSchema,
  LoginSchema,
  RefreshTokenSchema,
  RegisterSchema,
} from "./model";

import type {
  JwtPayloads,
  LoginCredentials,
  RegisterCredentials,
} from "./types/auth.dto";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../../lib/JwtFunctions/types/jwt.payloads.dto";
import { refreshTokenMiddleware } from "../../security/refresh.validator";
import { UserPasswordChange } from "./types/params.dto";

const router = Router();

const instance = new AuthService(DBPostgresInstance);

router.post(
  "/login",
  joiValidateSchema(LoginSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body as LoginCredentials;
      const result = await instance.login(body);

      SuccessResponse(req, res, result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/register",
  joiValidateSchema(RegisterSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body as RegisterCredentials;
      const result = await instance.register(body);

      SuccessResponse(req, res, result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/refresh-token",
  joiValidateSchema(RefreshTokenSchema, "body"),
  passport.authenticate("jwt-body", { session: false }),
  async (req, res, next) => {
    try {
      const payload = req.user as RefreshTokenPayload;
      const result = await instance.refreshToken(payload);

      SuccessResponse(req, res, result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/close-session",
  passport.authenticate("jwt-bearer", { session: false }),
  refreshTokenMiddleware,
  async (req, res, next) => {
    try {
      const payloads: JwtPayloads = {
        accessTokenPayload: req.user as AccessTokenPayload,
        refreshTokenPayload: req.refresh as RefreshTokenPayload,
      };
      const sessionId: string = req.body.sessionId;

      const result = await instance.closeSession(payloads, sessionId);

      SuccessResponse(req, res, result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/close-other-sessions",
  joiValidateSchema(RefreshTokenSchema, "body"),
  passport.authenticate("jwt-bearer", { session: false }),
  refreshTokenMiddleware,
  async (req, res, next) => {
    try {
      const payloads: JwtPayloads = {
        accessTokenPayload: req.user as AccessTokenPayload,
        refreshTokenPayload: req.refresh as RefreshTokenPayload,
      };
      const result = await instance.closeAllOwnOtherSessions(payloads);

      SuccessResponse(req, res, result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/change-user-password",
  passport.authenticate("jwt-bearer", { session: false }),
  refreshTokenMiddleware,
  joiValidateSchema(ChangePasswordSchema, "body"),
  async (req, res, next) => {
    try {
      const payload: JwtPayloads = {
        accessTokenPayload: req.user as AccessTokenPayload,
        refreshTokenPayload: req.refresh as RefreshTokenPayload,
      };

      const result = await instance.passwordChange(
        payload,
        req.body as UserPasswordChange
      );

      SuccessResponse(req, res, result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/logout",
  joiValidateSchema(RefreshTokenSchema, "body"),
  passport.authenticate("jwt-bearer", { session: false }),
  refreshTokenMiddleware,
  async (req, res, next) => {
    try {
      const payloads: JwtPayloads = {
        accessTokenPayload: req.user as AccessTokenPayload,
        refreshTokenPayload: req.refresh as RefreshTokenPayload,
      };
      const result = await instance.logout(payloads);

      SuccessResponse(req, res, result);
    } catch (error) {
      next(error);
    }
  }
);

export { router as authRouter };
