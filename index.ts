import express, { Application, json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConfig } from "./utils/dbConfig";
import { mainApp } from "./mainApp";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(json());

mainApp(app);

const port: string | undefined = process.env.PORT;

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
