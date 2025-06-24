import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";
import { ParticipateRequestEntity } from "@way-to-bot/server/database/entities/participate-request.entity.mjs";
import { WEB_URL } from "@way-to-bot/server/utils/constants.mjs";
import { EParticipateRequestStatus } from "@way-to-bot/shared/api/enums/index.js";
import moment from "moment";
import "moment/locale/ru.js";
import TelegramBot from "node-telegram-bot-api";

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
  const message = `♟️ <b>Добро пожаловать в WAY TO CHESS BOT!</b>

У нас ты найдёшь <b>турниры для всех уровней</b> — как для уверенных профессионалов, так и для начинающих любителей. Участвуй в тех, которые подходят именно тебе!

<b>Вот что тебя ждёт:</b>

✅ <b>Записывайся на турниры</b> — выбирай формат и уровень сложности  

📈 <b>Следи за своим прогрессом и статистикой</b> — всё это доступно в твоём профиле  

🏆 <b>Смотри таблицу лидеров</b> — вдохновляйся и стремись к вершине  

<b>Готов начать?</b> Нажми <b>«WAT TO CHESS»</b> или выбери команду из меню.  
Если возникнут вопросы — мы всегда рядом и поможем!

♜ <b>Вперёд к новым шахматным вершинам!</b>`;

  return {
    message,
    options: optionsBase(),
  };
};

export const botMessageNewEvent = (event: EventEntity): TBotMessage => {
  moment.locale("ru");
  const date = moment(event.dateTime).add(3, "hours");
  const message = `📢 <b>Новое шахматное событие!</b>

Открыта регистрация на турнир: <b>${event.name}</b>

📅 <b>Дата:</b> <i>${date.format("DD MMMM YYYY, HH:mm")} (МСК)</i>

💰 <b>Стоимость участия:</b> ${event.price}

🔢 <b>Количество туров и контроль времени:\n</b> <i>${event.description}</i>

📍 <b>Адрес:</b> <a href="${event.location?.url}">${event.location?.title}: ${event.location?.address}</a>

🎯 <b>Успей зарегистрироваться — места ограничены!</b>

Нажми <b>"Перейти к событию"</b> или выбери соответствующую кнопку в меню.`;

  return {
    message,
    options: optionsGoToEvent(event.id),
  };
};

export const botMessageNotify = (event: EventEntity): TBotMessage => {
  const date = moment(event.dateTime).add(3, "hours");
  const message = `⏰ <b>Напоминание о предстоящем турнире!</b>

Ты записан(а) на турнир <b>«${event.name}»</b> — не пропусти!

📅 <b>Дата:</b> <i>${date.format("DD MMMM YYYY, HH:mm")} (МСК)</i>

📍 <b>Адрес:</b> <a href="${event.location?.url}">${event.location?.title}: ${event.location?.address}</a>

🔢 <b>Количество туров и контроль времени:\n</b> <i>${event.description}</i>

🎯 Приходи заранее, чтобы спокойно можно было настроиться на игру!`;

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
      ? `✅ <b>Заявка принята</b>

<b>Ваша заявка на участие в турнире подтверждена!</b> 🎉

🗓 <b>${pr.event.name}</b>

💬 <b>Сообщение организатора:</b>

«${pr.message}»

📍 <b>Адрес:</b> <a href="${pr.event.location?.url}">${pr.event.location?.title}: ${pr.event.location?.address}</a>

🕒 <b>Начало:</b> <i>${date.format("DD MMMM YYYY, HH:mm")} (МСК)</i>

Рекомендуем прийти <b>немного заранее</b>, чтобы спокойно зарегистрироваться и подготовиться. Удачи в турнире! ♟️ `
      : pr.status === EParticipateRequestStatus.REJECTED
        ? `❌ <b>Заявка отклонена</b>

<b>К сожалению, ваша заявка на участие в турнире отклонена.</b>

🗓 <b>${pr.event.name}</b>

💬 <b>Сообщение организатора:</b>

«${pr.message}»`
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
  const message = `<b>🤖 Нажми на кнопку "WAY TO CHESS", чтобы начать, или выбери один из пунктов ниже:</b>

📘 <b>Как пользоваться?</b> — краткая инструкция по работе с ботом

📞 <b>Контакты</b> — как с нами связаться

📅 <b>События</b> — предстоящие турниры и активности

🏆 <b>Таблица лидеров</b> — смотри, кто в топе

👤 <b>Профиль</b> — статистика и твой прогресс

Если возникнут вопросы — всегда пиши нам в поддержку, мы с радостью поможем! 💬`;
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
