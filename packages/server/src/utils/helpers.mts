import moment from "moment";
import "moment/locale/ru.js";
import * as constants from "./constants.mjs";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";

export const messageForNewEvent = (event: EventEntity) => {
  moment.locale("ru");
  const date = moment(event.dateTime).utcOffset(3, true);
  return (
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
    "Зарегестрироваться можно через нашего бота @way_to_chess_bot!\n"
  );
};

export const validateConstants = () => {
  return Object.entries(constants).reduce((pr: string[], [key, value]) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      pr.push(key);
    }
    return pr;
  }, []);
};
