const getClientLocale = () =>
  Telegram.WebApp.initDataUnsafe.user?.language_code ??
  navigator.languages[0] ??
  navigator.language;

export { getClientLocale };
