import { getClientLocale } from "./GetClientLocale.ts";

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
};

const getReadableEventDate = (dateTime: string) => {
  const date = new Date(dateTime);

  return date.toLocaleDateString(getClientLocale(), dateOptions);
};

const timeOptions: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "numeric",
};

const getReadableEventTime = (dateTime: string) => {
  const date = new Date(dateTime);

  return date.toLocaleTimeString(getClientLocale(), timeOptions);
};

export { getReadableEventDate, getReadableEventTime };
