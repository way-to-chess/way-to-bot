import TelegramApi, { Message } from "node-telegram-bot-api";
import { tgBotEventErrorHandler } from "../utils/event-error-handler";
import { dbInstance } from "../database/init";
import { UserEntity } from "../database/entities/user.entity";
import chalk from "chalk";

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN || "";

if (!TG_BOT_TOKEN) {
  throw new Error("No bot token provided");
}

// singleton
export class TgBotService {
  private static instance: TgBotService;
  private readonly bot: TelegramApi;

  constructor() {
    this.bot = new TelegramApi(TG_BOT_TOKEN, { polling: true });
    this.handleEvents();
    console.log(chalk.blue("Tg bot instance created"));
  }

  public static getInstance(): TgBotService {
    if (!TgBotService.instance) {
      TgBotService.instance = new TgBotService();
    }
    return TgBotService.instance;
  }

  public get getBot() {
    return this.bot;
  }

  private handleEvents = () => {
    this.bot.on(
      "message",
      tgBotEventErrorHandler("message", async (msg: Message) => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const user = msg.from;

        if (text === "/start") {
          if (!user) {
            return this.bot.sendMessage(
              chatId,
              "Не получилось получить информацию о пользователе, пожалуйста свяжитесь с разработчиком @privetenn",
            );
          }

          const dbUser = await dbInstance
            .getRepository(UserEntity)
            .findOneBy({ username: user.username });

          if (!dbUser) {
            return this.bot.sendMessage(
              chatId,
              "Пользователь не зарегестрирован, свяжитесь с администратором @Roman_Comandorb",
            );
          }

          // TODO: красивое сообщение
          return this.bot.sendMessage(
            chatId,
            "Добро пожаловать в way-to-bot, здесь вы можете ознакомиться со своей статистикой ...",
          );
        }
      }),
    );
  };
}
