import TelegramApi from "node-telegram-bot-api";
import { eventErrorHandler } from "@way-to-bot/shared/src/utils/event-error-handler";
import {dbInstance} from "../database/init";
import {User} from "../database/entities/user.entity";

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;

export const tgBotInit = () => {
  if (!TG_BOT_TOKEN) {
    throw new Error("No bot token provided");
  }

  const bot = new TelegramApi(TG_BOT_TOKEN, { polling: true });

  bot.on(
    "message",
    eventErrorHandler("message", (msg) => {
      const text = msg.text;
      const chatId = msg.chat.id;
      const user = msg.from;

      if (text === "/start") {
        if (!user) {
          return bot.sendMessage(
            chatId,
            "Не получилось получить информацию о пользователе, пожалуйста свяжитесь с разработчиком @privetenn",
          );
        }

        // const dbUser = await dbInstance
        //   .getRepository(User)
        //   .findOneBy({ username: user.username });

        if (true) {
          return bot.sendMessage(
            chatId,
            "Пользователь не зарегестрирован, свяжитесь с администратором @Roman_Comandorb",
          );
        }

        // TODO: красивое сообщение
        return bot.sendMessage(
          chatId,
          "Добро пожаловать в way-to-bot, здесь вы можете ознакомиться со своей статистикой ...",
        );
      }
    }),
  );
};
