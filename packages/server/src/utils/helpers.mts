import moment from "moment";
import * as constants from "./constants.mjs";
import { PATH_TO_UPLOADS } from "./constants.mjs";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";

export const messageForNewEvent = (event: EventEntity) => {
  return (
    "Всем привет! 👋\n" +
    "\n" +
    `Открыта регистрация на "${event.name}" ${moment(event.dateTime!, "", "ru").format("dd DD MMMM YYYY, hh:mm")}\n` +
    "\n" +
    "Что играем?\n" +
    "\n" +
    "Жеребьевка по швейцарской системе. Играем 7 туров.\n" +
    "Рапид 10+2 (добавление 2 секунды на ход)\n" +
    "Стоимость 40р. 50% денег от взносов идёт на благотворительность.\n" +
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
