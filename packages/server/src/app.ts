import "express-async-errors";
import "reflect-metadata";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { MainRouter } from "./routers";
import chalk from "chalk";
import cors from "cors";
import { TgBotService } from "./tg-bot/init";
import { dbInstance } from "./database/init";
import swaggerUi from "swagger-ui-express";
import { logger } from "./utils/logger";

const app = express();

app.use(cors());
app.use(express.json());

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(err.message, { stack: err.stack });
  console.error(err);

  if (err.message) {
    res.status(400).send({ error: err.message });
    return;
  }
  res.status(500).send({ error: "something went wrong" });
  return;
};

app.use("/api", MainRouter);

if (process.env.NODE_ENV === "dev") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const swaggerDocument = require("../swagger/swagger.json");
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use(errorHandler);

dbInstance.initialize().then(() => {
  TgBotService.getInstance();
  const expressAppPort = process.env.API_PORT!;
  app.listen(expressAppPort, () => {
    console.log(chalk.green(`EXPRESS STARTED: port -> ${expressAppPort}`));
  });
});
