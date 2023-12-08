import { NextFunction, Response, Request } from "express";
import { mainError } from "./mainError";
import { HTTP } from "../utils/enums";

const viewError = (err: mainError, res: Response) => {
  return res.status(HTTP.BAD).json({
    name: err.name,
    message: err.message,
    status: err.status,
    success: err.success,
    stack: err.stack,
    error: err,
  });
};

export const errHandler = (
  err: mainError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return viewError(err, res);
};
