import cors from "cors";
import express from "express";
import passport from "passport";
import { Server } from "socket.io";
import { createServer } from "http";

import { serverOptions } from "./configs";
import {
  BoomErrorsHandler,
  DoActionHandler,
  ServerErrorsHandler,
} from "./middlewares/errors.handler";
import { CacheHandler } from "./lib/CacheHandler";

import { writeKeys } from "./security/write.keys";
import { RSAKeysLoaders } from "./lib/RSA/loader";
import { apiRouter } from "./api";
import { loaders } from "./lib/CacheHandler/dependencies";
import {
  accessJwtBearerStrategy,
  refreshJwtBodyStrategy,
  refreshJwtHeaderStrategy,
} from "./security/strategies/jwt";

(async () => {
  const app = express();
  const httpServer = createServer(app);

  passport.use("jwt-bearer", accessJwtBearerStrategy);
  passport.use("jwt-body", refreshJwtBodyStrategy);
  passport.use("jwt-headers", refreshJwtHeaderStrategy);

  const cache = CacheHandler.getInstance();

  await writeKeys("HIGH");

  loaders.map(async (loader) => {
    await cache.load(loader);
  });

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());

  apiRouter(app);

  const io = new Server(httpServer);

  // SELECT * FROM security.createSession(1, 'hola', '2025-10-12T23:24:03.411Z');

  app.use(DoActionHandler);
  app.use(BoomErrorsHandler as express.ErrorRequestHandler);
  app.use(ServerErrorsHandler as unknown as express.ErrorRequestHandler);

  RSAKeysLoaders.getInstance();

  httpServer.listen(serverOptions.PORT, () => {
    console.log(`Listening at port: ${serverOptions.PORT}`);
  });
})();
