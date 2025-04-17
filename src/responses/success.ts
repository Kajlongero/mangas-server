import { NextFunction, Request, Response } from "express";

export const SuccessResponse = <T>(
  req: Request,
  res: Response,
  data: T,
  statusCode: number = 200,
  message: string = "Success"
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
};
