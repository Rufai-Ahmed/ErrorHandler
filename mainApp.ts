import { Application, NextFunction, Request, Response } from "express";
import { mainError } from "./error/mainError";
import { errHandler } from "./error/errHandler";
import { HTTP } from "./utils/enums";
import router from "./router/userRouter";
import passport from "passport";
import { config } from "dotenv";
import userModel from "./model/userModel";
import google from "passport-google-oauth20";
const GoogleStrategy = google.Strategy;
config();

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "670614509975-g9564jii6lu7jp2j3huuuhlfq75e7qv8.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback",
    },

    async function (accessToken, refreshToken, profile: any, cb) {
      console.log(profile);

      const user = await userModel.create({
        email: profile?.emails[0]?.value,
        password: "",
        verify: profile?.emails[0]?.verified,
        token: "",
        status: "admin",
        schoolCode: Math.floor(Math.random() * 112233).toString(),
      });

      return cb(null, user);
    }
  )
);

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

    app.get(
      "/auth/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    app.get(
      "/auth/google/callback",
      passport.authenticate("google", { failureRedirect: "/login" }),
      function (req, res) {
        // Successful authentication, redirect home.
        res.redirect("/");
      }
    );

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
