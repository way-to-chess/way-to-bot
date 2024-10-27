import "express-async-errors";
import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import { MainRouter } from "./routers/index.ts";
import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";
import { tgBotInit } from "./tg-bot/index.ts";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  if (err.message) {
    res.status(400).send({ error: err.message });
  }
  res.status(500).send({ error: "something went wrong" });
  next(err);
};

// if (process.env.NODE_ENV === "dev") {
//   app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// }

app.use("/api", MainRouter);
app.use(errorHandler);

// dbInstance.initialize().then(() => {
tgBotInit();
const expressAppPort = process.env.API_PORT!;
app.listen(expressAppPort, () => {
  console.log(
    chalk.bgBlue("EXPRESS STARTED"),
    chalk.blue(`port -> "${expressAppPort}"`),
  );
});
// });
