import { Router } from "express";

import { AuthService } from "./service";
import { SuccessResponse } from "../../responses/success";
import { joiValidateSchema } from "../../middlewares/validator.handler";
import { DBPostgresInstance } from "../../lib/DBDependenciesInjector";
import { LoginSchema, RegisterSchema } from "./model";

import type { LoginCredentials, RegisterCredentials } from "./types/auth.dto";
import passport from "passport";
import { RefreshTokenPayload } from "../../lib/JwtFunctions/types/jwt.payloads.dto";

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

router.post("/logout", (req, res) => {
  res.send("logout");
});

router.post(
  "/refresh-token",
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

export { router as authRouter };
