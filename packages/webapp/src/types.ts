import { EEventStatus } from "@way-to-bot/shared/src/enums/eventStatus";

interface IFile {
  id: number;
  url: string;
}

interface IEventLocation {
  id: number;
  title: string;
  url: string;
  address: string;
  preview: IFile;
}

interface IUser {
  username: string;
  photo: IFile;
}

interface IEventParticipant {
  id: number;
  user: IUser;
}

interface IEventRaw {
  locationId: number;
  dateTime: string;
  description: string;
  price: string;
  participantsLimit: number;
}

interface IEventFull extends Omit<IEventRaw, "locationId"> {
  location: IEventLocation;
  participants: IEventParticipant[];
  id: number;
  status: EEventStatus;
}

export type { IEventRaw, IEventFull, IEventLocation, IUser };
