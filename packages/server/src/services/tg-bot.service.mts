import TelegramApi, { Message } from "node-telegram-bot-api";
import { inject, injectable } from "inversify";
import { IsNull, Not } from "typeorm";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository.mjs";
import { TG_BOT_TOKEN } from "@way-to-bot/server/utils/constants.mjs";
import { logger } from "@way-to-bot/server/services/logger.service.mjs";

@injectable()
export class TgBotService {
  private readonly _bot: TelegramApi;

  constructor(
    @inject(UserRepository) private readonly _userRepository: UserRepository,
  ) {
    this._bot = new TelegramApi(TG_BOT_TOKEN, { polling: true });
    this.handleEvents();
  }

  public get getBot() {
    return this._bot;
  }

  async sendMessagesToUsersTg(message: string) {
    setImmediate(async () => {
      try {
        const { data: usersWithTgId } = await this._userRepository.getMany({
          where: { tgId: Not(IsNull()) },
        });

        let usersCount = 0;
        for (const u of usersWithTgId) {
          await this._bot.sendMessage(u.tgId!, message);
          usersCount++;
          if (usersCount === 25) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      } catch (e: any) {
        logger.error("Error while sending message", {
          message: e.message,
          stack: e.stack,
        });
      }
    });
  }

  private handleEvents = () => {
    this._bot.on(
      "message",
      this.tgBotEventErrorHandler("message", async (msg: Message) => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const user = msg.from;

        if (text === "/start") {
          if (!user) {
            return this._bot.sendMessage(
              chatId,
              "Не получилось получить информацию о пользователе, пожалуйста свяжитесь с разработчиком @privetenn",
            );
          }

          setImmediate(async () => {
            try {
              const userFromDb = await this._userRepository.getOne({
                where: { username: `@${user.username}` },
              });

              if (userFromDb && !userFromDb.tgId) {
                userFromDb.tgId = String(user.id);
                await this._userRepository.update(userFromDb.id, {
                  tgId: String(user.id),
                });
              }
            } catch (e: any) {
              logger.error("Error while sending message", {
                message: e.message,
                stack: e.stack,
              });
            }
          });

          return this._bot.sendMessage(
            chatId,
            "👋 Добро пожаловать в Way-to-Bot, ШАХМАТЮГА! ♟♙️\n" +
              "\n" +
              'Переходи в наше приложение с помощью кнопки "WAY TO BOT" ♛\n' +
              'или в разделе "Приложения" ♞\n' +
              "\n" +
              "Там ты найдешь всю информацию о предстоящих/текущих/прошедших событиях, сможешь оставить заявку на участие и освежить в памяти результаты турнира 🏆. Всю информацию о своих успехах смотри во вкладке профиля 🥇🥈🥉.\n" +
              "\n" +
              "Предложения и идеи по улучшению приложения принимаются у ♚ @Roman_Comandorb.\n" +
              "В случае обнаружения неполадок в работе приложения, свяжитесь с разработчиками 👨🏼‍💻@privetenn 🧑🏼‍💻@Traktirwik.",
          );
        }

        return;
      }),
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  tgBotEventErrorHandler(event: string, handler: Function) {
    const handleError = (err: Error, ...args: any[]) => {
      logger.error(`ERROR IN TG BOT EVENT: "${event}". \n`, {
        message: err.message,
        stack: err.stack,
      });

      const chatId = args?.flat()?.[0]?.chat?.id;
      if (chatId) {
        this._bot.sendMessage(
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
  }
}
