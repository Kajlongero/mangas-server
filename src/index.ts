import path from "path";
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
import { FilesStoreHandler } from "./lib/FilesStoresHandler/definition";
import { ImagesStore } from "./types/images.dto";
import { makeDir } from "./lib/FilesStoresHandler/lib/make.dir";

(async () => {
  const app = express();
  const httpServer = createServer(app);

  const BASE_DIR = path.join(process.cwd(), "uploads");

  await Promise.all([
    makeDir(BASE_DIR),
    makeDir(path.join(BASE_DIR, "icons")),
    makeDir(path.join(BASE_DIR, "images")),
    makeDir(path.join(BASE_DIR, "images", "user")),
    makeDir(path.join(BASE_DIR, "images", "translationGroups")),
    makeDir(path.join(BASE_DIR, "images", "elements")),
  ]);

  passport.use("jwt-bearer", accessJwtBearerStrategy);
  passport.use("jwt-body", refreshJwtBodyStrategy);
  passport.use("jwt-headers", refreshJwtHeaderStrategy);

  const cache = CacheHandler.getInstance();

  await writeKeys("HIGH");

  for await (const item of loaders) {
    await cache.load(item);
  }

  FilesStoreHandler.getInstance().loadCache(
    cache.getCache<ImagesStore>("IMAGES_STORES") as Map<number, ImagesStore>
  );

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());

  apiRouter(app);

  app.use(
    "/static/images/user/profile",
    express.static(path.join(BASE_DIR, "user", "profile"))
  );
  app.use(
    "/static/images/user/background",
    express.static(path.join(BASE_DIR, "user", "background"))
  );

  const io = new Server(httpServer);

  app.use(DoActionHandler);
  app.use(BoomErrorsHandler as express.ErrorRequestHandler);
  app.use(ServerErrorsHandler as unknown as express.ErrorRequestHandler);

  RSAKeysLoaders.getInstance();

  httpServer.listen(serverOptions.PORT, () => {
    console.log(`Listening at port: ${serverOptions.PORT}`);
  });
})();
