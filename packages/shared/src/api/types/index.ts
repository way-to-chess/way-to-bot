import { EContactType } from "@way-to-bot/shared/api/enums/index.js";

export type TCommonContactInfo = {
  type: EContactType;
  url: string;
};

export type TCommonParticipateRequestAdditionalUser = {
  firstName: string;
  lastName: string;
  birthDate: Date;
  email?: string;
  [key: string]: any;
};
