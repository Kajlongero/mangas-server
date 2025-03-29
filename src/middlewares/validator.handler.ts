import { Schema } from "joi";

import type { Request, Response, NextFunction } from "express";

export const joiValidateSchema =
  (schema: Schema, param: keyof Request) =>
  (req: Request, res: Response, next: NextFunction) => {
    const fields = req[param];

    const { error } = schema.validate(fields, { abortEarly: false });
    if (error) return next(error);

    next();
  };
