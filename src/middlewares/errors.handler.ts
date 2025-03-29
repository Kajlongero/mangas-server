import { isBoom } from "@hapi/boom";

import type { Request, Response, NextFunction } from "express";

export const BoomErrorsHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (isBoom(err)) {
    const { payload } = err.output;

    res.status(payload.statusCode).json(payload);
  }

  next(err);
};

export const LogsErrorsHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const ServerErrorsHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
    error: "Internal Server Error",
  });
};
