import express, { Application, json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConfig } from "./utils/dbConfig";
import { mainApp } from "./mainApp";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mdc from "connect-mongodb-session";
import passport from "passport";
dotenv.config();

const mongoConnect = mdc(session);

const app: Application = express();

app.use(cors());
app.use(json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "cookie/session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 12,
    },
    store: new mongoConnect({
      uri: process.env.DATABASE_URL!,
      collection: "session",
    }),
  })
);

passport.serializeUser(function (user, cb) {
  return cb(null, user);
});

passport.deserializeUser(function (user: any, cb) {
  return cb(null, user);
});

mainApp(app);

const port: string | undefined = process.env.PORT;

passport.initialize();
passport.session();

const server = app.listen(parseInt(port!), () => {
  dbConfig();
});

process
  .on("uncaughtException", (error: Error) => {
    console.log(error);
    process.exit(1);
  })
  .on("unhandledRejection", (reason: any) => {
    console.log(reason);

    server.close(() => {
      process.exit(1);
    });
  });
