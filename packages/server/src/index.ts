import "reflect-metadata";
import "dotenv/config";
import { logger } from "@way-to-bot/server/services/logger.service";
import { DiContainer } from "@way-to-bot/server/services/DI.service";
import { ExpressApp } from "@way-to-bot/server/express/index";
import { DbService } from "@way-to-bot/server/services/db.service";
import { TgBotService } from "@way-to-bot/server/services/tg_bot/index";
import { validateConstants } from "@way-to-bot/server/utils/helpers";

const emptyConstants = validateConstants();
if (emptyConstants.length) {
  logger.error(
    `No values in env vars for keys:\n\n ${emptyConstants.join("\n")}`,
  );
  process.exit(1);
}

async function bootstrap() {
  try {
    const dbService = DiContainer.get(DbService);
    const tgBotService = DiContainer.get(TgBotService);

    const ds = await dbService.init();
    if (!ds.isInitialized) {
      throw new Error("Database was not initialized");
    }
    logger.info("Database was initialized successfully");

    const bot = tgBotService.getBot;
    if (!bot.isPolling()) {
      throw new Error("Tg Bot was not initialized");
    }
    logger.info("Tg Bot was initialized successfully");

    const expressApp = new ExpressApp();
    expressApp.runServer();

    handleSignals(expressApp);
  } catch (e: any) {
    logger.error("Error while starting the app.", {
      message: e.message,
      stack: e.stack,
    });
    process.exit(1);
  }
}

function handleSignals(app: ExpressApp) {
  const shutdown = async () => {
    logger.info("Gracefully shutting down...");
    await app.stopServer();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap();
