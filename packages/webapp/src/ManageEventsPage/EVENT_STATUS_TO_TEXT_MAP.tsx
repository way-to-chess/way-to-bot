import { EEventStatus } from "@way-to-bot/shared/enums";
import { TEXT } from "@way-to-bot/shared/constants/text";

const EVENT_STATUS_TO_TEXT_MAP: Record<EEventStatus, string> = {
  [EEventStatus.WAITING]: TEXT.waiting,
  [EEventStatus.STARTED]: TEXT.started,
  [EEventStatus.FINISHED]: TEXT.finished,
};

export { EVENT_STATUS_TO_TEXT_MAP };
