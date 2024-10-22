import dayjs from "dayjs";
import { EEventStatus } from "@way-to-bot/shared/enums/eventStatus";

//todo get types from server
type Location = any

interface IEventFormValues {
  locationId: number;
  dateTime: ReturnType<typeof dayjs>;
  participantsLimit: number;
  price: string;
  description: string;
  status: EEventStatus;
}

interface IEventFormInitialValues {
  location?: Location | null;
  dateTime?: string | null;
  participantsLimit?: number | null;
  price?: string | null;
  description?: string | null;
  status?: EEventStatus | null;
}

interface IEventFormFinishValues extends Omit<IEventFormValues, "dateTime"> {
  dateTime: Date;
}

const EVENT_STATUSES = [
  {
    value: EEventStatus.WAITING,
    title: "Waiting",
  },
  {
    value: EEventStatus.STARTED,
    title: "Started",
  },
  {
    value: EEventStatus.FINISHED,
    title: "Finished",
  },
];

export { EVENT_STATUSES };

export type {
  IEventFormValues,
  IEventFormFinishValues,
  IEventFormInitialValues,
};
