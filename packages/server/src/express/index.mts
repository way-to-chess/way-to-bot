import express, { Express } from "express";
import { injectable } from "inversify";
import cors from "cors";
import { MainRouter } from "@way-to-bot/server/express/routers/index.mjs";
import { errorHandlerMddw } from "@way-to-bot/server/express/middlewares/error-handler.mddw.mjs";
import { logger } from "@way-to-bot/server/services/logger.service.mjs";
import { Server } from "http";

@injectable()
export class ExpressApp {
  private readonly _app: Express;
  private _server: Server | null = null;

  constructor() {
    this._app = express();
    this.configureServer();
  }

  private configureServer() {
    this._app.use(cors());
    this._app.use(express.json());

    this._app.use("/api", MainRouter);

    this._app.use(errorHandlerMddw);
  }

  runServer() {
    this._server = this._app.listen(process.env.API_PORT || 3000, () => {
      logger.info(`Server started on port ${process.env.API_PORT}`);
    });
  }

  async stopServer() {
    if (this._server) {
      await new Promise<void>((resolve, reject) => {
        this._server!.close((err) => (err ? reject(err) : resolve()));
      });
    }
  }
}
