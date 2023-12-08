import { Application, NextFunction, Request, Response } from "express";
import { mainError } from "./error/mainError";
import { errHandler } from "./error/errHandler";
import { HTTP } from "./utils/enums";
import router from "./router/userRouter";

export const mainApp = (app: Application) => {
  try {
    app.use("/api/v1/", router);

    app.get("/", (req: Request, res: Response) => {
      try {
        return res.status(200).json({
          msg: "Welcome to my API",
        });
      } catch (error) {
        return res.status(404).json({
          msg: "Error",
        });
      }
    });

    app.all("*", (req: Request, res: Response, next: NextFunction) => {
      next(
        new mainError({
          name: "Route Error",
          message: `This endpoint you entered ${req.originalUrl} is not supported`,
          status: HTTP.BAD,
          success: false,
        })
      );
    });

    app.use(errHandler);
  } catch (error) {
    console.log(error);
  }
};
