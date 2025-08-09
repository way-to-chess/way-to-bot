import { EventEntity } from "@way-to-bot/server/database/entities/event.entity";
import { ParticipateRequestEntity } from "@way-to-bot/server/database/entities/participate-request.entity";
import { WEB_URL } from "@way-to-bot/server/utils/constants";
import moment from "moment";
import "moment/locale/ru.js";
import TelegramBot from "node-telegram-bot-api";
import { EParticipateRequestStatus } from "@way-to-bot/shared/api/enums/EParticipateRequestStatus";

type TBotMessage = {
  message: string;
  options?: TelegramBot.SendMessageOptions;
};

const optionsBase = (): TelegramBot.SendMessageOptions => {
  return {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Как пользоваться ?",
            web_app: {
              url: `${WEB_URL}/tutorial`,
            },
          },
        ],
        [
          {
            text: "Контакты",
            callback_data: "show_contacts",
          },
          {
            text: "Cобытия",
            web_app: {
              url: `${WEB_URL}/events`,
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
    parse_mode: "HTML",
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
  const message = `🎯 <b>Добро пожаловать в WAY TO EVENT!</b>

✨ <b>Откройте для себя мир интересных событий</b>
От спортивных турниров до культурных фестивалей — у нас есть всё для вашего досуга!

<b>Что вас ждёт:</b>

✅ <b>Регистрация на события</b> — простой выбор и запись
📈 <b>Отслеживание прогресса</b> — ваша статистика в профиле
🏆 <b>Рейтинги участников</b> — соревнуйтесь и развивайтесь

<b>Готовы начать?</b> Нажмите <b>«WAY TO EVENT»</b> или выберите команду из меню.

🚀 <b>Вперёд к новым впечатлениям!</b>`;

  return {
    message,
    options: optionsBase(),
  };
};

export const botMessageNewEvent = (event: EventEntity): TBotMessage => {
  moment.locale("ru");
  const date = moment(event.dateTime).add(3, "hours");
  const message = `📢 <b>Новое событие!</b>

<b>${event.name}</b>

📅 <b>Когда:</b> ${date.format("DD MMMM YYYY, HH:mm")} (МСК)
💰 <b>Стоимость:</b> ${event.price}
📍 <b>Где:</b> <a href="${event.location?.url}">${event.location?.title}</a>

📝 <b>О событии:</b>
<i>${event.description}</i>

🎯 <b>Успейте записаться!</b>`;

  return {
    message,
    options: optionsGoToEvent(event.id),
  };
};

export const botMessageNotify = (event: EventEntity): TBotMessage => {
  const date = moment(event.dateTime).add(3, "hours");
  const message = `⏰ <b>Напоминание!</b>

<b>${event.name}</b>

📅 <b>Когда:</b> ${date.format("DD MMMM YYYY, HH:mm")} (МСК)
📍 <b>Где:</b> <a href="${event.location?.url}">${event.location?.title}</a>

📝 <b>О событии:</b>
<i>${event.description}</i>

🎯 <b>Ждём вас!</b>`;

  return {
    message,
    options: optionsGoToEvent(event.id),
  };
};

export const botMessageParticipateRequestStatusChanged = (
  pr: ParticipateRequestEntity,
) => {
  const date = moment(pr.event.dateTime).add(3, "hours");
  const message =
    pr.status === EParticipateRequestStatus.APPROVED
      ? `✅ <b>Заявка принята!</b>

<b>${pr.event.name}</b>

📅 <b>Когда:</b> ${date.format("DD MMMM YYYY, HH:mm")} (МСК)
📍 <b>Где:</b> <a href="${pr.event.location?.url}">${pr.event.location?.title}</a>
${pr.message?.trim() ? `\n💬 <b>Сообщение:</b>\n«${pr.message.trimEnd().trimStart()}»\n` : ""}
🎯 <b>Ждём вас!</b>`
      : pr.status === EParticipateRequestStatus.REJECTED
        ? `❌ <b>Заявка отклонена</b>

<b>${pr.event.name}</b>
${pr.message?.trim() ? `\n💬 <b>Сообщение:</b>\n«${pr.message.trimEnd().trimStart()}»` : ""}`
        : null;

  if (!message) {
    throw new Error(`No message for status ${pr.status}`);
  }

  return {
    message,
    options: optionsGoToEvent(pr.event.id),
  };
};

export const botMessageDefault = (): TBotMessage => {
  const message = `🤖 <b>WAY TO EVENT</b>

📘 <b>Инструкция</b> — как пользоваться ботом
📞 <b>Контакты</b> — свяжитесь с нами
📅 <b>События</b> — предстоящие мероприятия
👤 <b>Профиль</b> — ваша статистика

💬 <b>Есть вопросы?</b> Пишите в поддержку!`;
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
