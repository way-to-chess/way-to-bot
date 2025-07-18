import TelegramApi, { Message, CallbackQuery } from "node-telegram-bot-api";
import { inject, injectable } from "inversify";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository.mjs";
import { TG_BOT_TOKEN } from "@way-to-bot/server/utils/constants.mjs";
import { logger } from "@way-to-bot/server/services/logger.service.mjs";
import { botMessageDefault, botMessageStart } from "./messages.mjs";
import TelegramBot from "node-telegram-bot-api";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity.mjs";
import { FeedbackRepository } from "@way-to-bot/server/database/repositories/feedback.repository.mjs";
import { DbService } from "../db.service.mjs";

@injectable()
export class TgBotService {
  private readonly _bot: TelegramApi;

  constructor(
    @inject(UserRepository) private readonly _userRepository: UserRepository,
    @inject(FeedbackRepository)
    private readonly _feedbackRepository: FeedbackRepository,
    @inject(DbService) private readonly _db: DbService,
  ) {
    this._bot = new TelegramApi(TG_BOT_TOKEN, { polling: true });
    this.handleEvents();
  }

  public get getBot() {
    return this._bot;
  }

  async sendMessagesToUsers(
    users: UserEntity[],
    message: string,
    options?: TelegramBot.SendMessageOptions,
  ) {
    const successListIds: number[] = [];
    const failedListIds: number[] = [];

    try {
      let usersCount = 0;

      for (const u of users) {
        try {
          await this._bot.sendMessage(u.tgId!, message, options);
          usersCount++;
          successListIds.push(u.id);
          if (usersCount === 25) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            usersCount = 0;
          }
        } catch (e: any) {
          failedListIds.push(u.id);
          logger.error(
            `Failed to send message to user. TG ID: ${u.tgId} --  ${u.lastName} ${u.firstName}.  Failed count: ${successListIds.length}`,
            {
              message: e.message,
              stack: e.stack,
            },
          );
        }
      }
    } catch (e: any) {
      logger.error("Error while sending message", {
        message: e.message,
        stack: e.stack,
      });
    }
    return { successListIds, failedListIds };
  }

  private handleEvents = () => {
    this._bot.on(
      "message",
      this.tgBotEventErrorHandler("message", async (msg: Message) => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const user = msg.from;

        if (
          msg.reply_to_message?.text ===
          "💬 Напишите ваш отзыв ! Для отмены уберите это сообщение из контекста ответа."
        ) {
          try {
            await this._feedbackRepository.create({ message: text! });
          } catch (e: any) {
            logger.error("Error while saving feedback to db", {
              message: e.message,
              stack: e.stack,
            });
          }

          return this._bot.sendMessage(chatId, "Спасибо за ваш отзыв !");
        }

        if (text === "/start") {
          if (!user) {
            return this._bot.sendMessage(
              chatId,
              "Не получилось получить информацию о пользователе, пожалуйста свяжитесь с разработчиками @pavelazyk",
            );
          }

          setImmediate(async () => {
            try {
              if (!user.id) {
                throw new Error(`Cannot get user tg info for user ${user}`);
              }
              const userFromDb = await this._userRepository.getOne({
                where: { tgId: String(user.id) },
              });

              if (!userFromDb) {
                const userRepo = this._db.dataSource.getRepository(UserEntity);
                await userRepo.insert({ tgId: String(user.id) });
              }
            } catch (e: any) {
              logger.error("Error while saving user tg ID to db", {
                message: e.message,
                stack: e.stack,
              });
            }
          });

          const { message, options } = botMessageStart();

          return this._bot.sendMessage(chatId, message, options);
        }

        const { message, options } = botMessageDefault();
        return this._bot.sendMessage(chatId, message, options);
      }),
    );

    this._bot.on(
      "callback_query",
      this.tgBotEventErrorHandler(
        "callback_query",
        async (query: CallbackQuery) => {
          if (!query.message) return;
          const chatId = query.message.chat.id;

          if (query.data === "show_contacts") {
            const message =
              "Наши контакты:\n\n" +
              "Замечания и предложения по работе приложения: *@pavelazyk*\n" +
              "Вопросы по сотрудничеству: *@Roman_Comandorb*";

            await this._bot.sendMessage(chatId, message, {
              parse_mode: "Markdown",
            });

            await this._bot.answerCallbackQuery(query.id);
          }

          if (query.data === "leave_feedback") {
            await this._bot.sendMessage(
              chatId,
              "💬 Напишите ваш отзыв ! Для отмены уберите это сообщение из контекста ответа.",
              {
                reply_markup: {
                  selective: true,
                  force_reply: true,
                },
              },
            );

            await this._bot.answerCallbackQuery(query.id);
          }
        },
      ),
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
