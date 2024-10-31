import chalk from "chalk";
import { TgBotService } from "../tg-bot/init";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const tgBotEventErrorHandler = (event: string, handler: Function) => {
  const handleError = (err: Error, ...args: any[]) => {
    console.error(chalk.red(`ERROR IN TG BOT EVENT: "${event}". \n`), err);

    const chatId = args?.flat()?.[0]?.chat?.id;
    if (chatId) {
      const tgBotService = TgBotService.getInstance();
      const bot = tgBotService.getBot;
      bot.sendMessage(
        chatId,
        "Ошибка приложения, пожалуйста сообщите @Traktirwik",
      );
    }
  };

  return (...args: any[]) => {
    try {
      const ret = handler.apply(this, args);
      if (ret && typeof ret.catch === "function") {
        // async handler
        ret.catch((e: any) => handleError(e, args));
      }
    } catch (e: any) {
      // sync handler
      handleError(e, args);
    }
  };
};
