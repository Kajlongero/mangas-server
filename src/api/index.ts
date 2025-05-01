import { Application, Router } from "express";

import { authRouter } from "../components/auth/route";
import { userRouter } from "../components/user/router";

const router = Router();

export function apiRouter(app: Application) {
  app.use("/api/v1", router);

  router.use("/auth", authRouter);
  router.use("/user", userRouter);
}
