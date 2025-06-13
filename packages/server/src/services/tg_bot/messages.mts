import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";
import { WEB_URL } from "@way-to-bot/server/utils/constants.mjs";
import moment from "moment";
import "moment/locale/ru.js";
import TelegramBot from "node-telegram-bot-api";

type TBotMessage = {
  message: string;
  options?: TelegramBot.SendMessageOptions;
};

const optionsBase = (): TelegramBot.SendMessageOptions => {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Как пользоваться ?",
            web_app: {
              url: `${WEB_URL}/tutorial`,
            },
          },
          {
            text: "Контакты",
            callback_data: "show_contacts",
          },
        ],
        [
          {
            text: "Открыть события",
            web_app: {
              url: `${WEB_URL}/events`,
            },
          },
          {
            text: "Открыть таблицу лидеров",
            web_app: {
              url: `${WEB_URL}/leaderboard`,
            },
          },
        ],
        [
          {
            text: "Оставить отзыв (анонимно)",
            callback_data: "leave_feedback",
          },
        ],
      ],
    },
  };
};

const optionsGoToEvent = (eventId: number): TelegramBot.SendMessageOptions => {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Перейти к событию",
            web_app: { url: `${WEB_URL}/events/${eventId}` },
          },
        ],
      ],
    },
  };
};

export const botMessageStart = () => {
  const message =
    "👋 Добро пожаловать в Way-to-Bot, ШАХМАТЮГА! ♟♙️\n" +
    "\n" +
    'Переходи в наше приложение с помощью кнопки "WAY TO BOT" ♛\n' +
    'или в разделе "Приложения" ♞\n' +
    "\n" +
    "Там ты найдешь всю информацию о предстоящих/текущих/прошедших событиях, сможешь оставить заявку на участие и освежить в памяти результаты турнира 🏆. Всю информацию о своих успехах смотри во вкладке профиля 🥇🥈🥉.\n" +
    "\n" +
    "Предложения и идеи по улучшению приложения принимаются у ♚ @Roman_Comandorb.\n" +
    "В случае обнаружения неполадок в работе приложения, свяжитесь с разработчиками 👨🏼‍💻@privetenn 🧑🏼‍💻@Traktirwik.";

  return {
    message,
    options: optionsBase(),
  };
};

export const botMessageNewEvent = (event: EventEntity): TBotMessage => {
  //   moment.locale("ru");
  const date = moment(event.dateTime).utcOffset(3, true);
  const message =
    "Всем привет! 👋\n" +
    "\n" +
    `Открыта регистрация на "${event.name}" ${date.format("DD MMMM YYYY, HH:mm")} (МСК)\n` +
    "\n" +
    "Что играем?\n" +
    "\n" +
    "Жеребьевка по швейцарской системе. Играем 7 туров.\n" +
    "Рапид 10+2 (добавление 2 секунды на ход)\n" +
    `Стоимость ${event.price} BYN.\n` +
    "\n" +
    "\n" +
    "Зарегестрироваться можно через нашего бота @way_to_chess_bot!\n";

  return {
    message,
    options: optionsGoToEvent(event.id),
  };
};

export const botMessageNotify = (event: EventEntity): TBotMessage => {
  const date = moment(event.dateTime).utcOffset(3, true);
  const message = `Уведомление о новом событии ${event.name}. Дата проведения: ${date.format("DD MMMM YYYY, HH:mm")} (МСК)}`;

  return {
    message,
    options: optionsGoToEvent(event.id),
  };
};

export const botMessageDefault = (): TBotMessage => {
  const message = "Дефолтное сообщение при любой инпуте пользовтаеля";
  return {
    message,
    options: optionsBase(),
  };
};

export const botMessageCustom = (
  message: string,
  options?: TelegramBot.SendMessageOptions,
) => {
  options = options ? options : optionsBase();

  return {
    message,
    options,
  };
};
