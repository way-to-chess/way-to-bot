import { EContactType } from "../enums/EContactType";

export type TCommonContactInfo = {
  type: EContactType;
  url: string;
};

export type TCommonParticipateRequestAdditionalUser = {
  id?: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  email?: string;
  [key: string]: any;
};
