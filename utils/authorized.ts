import { NextFunction, Response } from "express";
import { HTTP } from "./enums";

export const authorize = (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.session.isAuth) {
      next();
    } else {
      return res.status(HTTP.BAD).json({
        msg: "Very bad",
      });
    }
  } catch (error) {
    return error;
  }
};
