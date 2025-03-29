import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

import { serverOptions } from "./configs";
import {
  BoomErrorsHandler,
  LogsErrorsHandler,
  ServerErrorsHandler,
} from "./middlewares/errors.handler";

const app = express();
const httpServer = createServer(app);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const io = new Server(httpServer);

app.use(LogsErrorsHandler);
app.use(BoomErrorsHandler);
app.use(ServerErrorsHandler);

httpServer.listen(serverOptions.PORT, () => {
  console.log(`Listening at port: ${serverOptions.PORT}`);
});
