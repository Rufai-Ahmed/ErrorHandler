import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authorization = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (token) {
    const value = token?.split(" ")[1];

    if (value) {
      jwt.verify(value, "jst", (err: any, data: any) => {
        if (err) {
          return res.status(404).json({
            msg: "Error occured",
          });
        } else {
          req.data = data;
          next();
        }
      });
    } else {
      return res.status(404).json({
        msg: "Invalid token",
      });
    }
  } else {
    return res.status(404).json({
      msg: "You are not authorized",
    });
  }
};
