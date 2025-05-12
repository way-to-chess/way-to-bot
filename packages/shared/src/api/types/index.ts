import { EContactType } from "@way-to-bot/shared/api/enums/index.js";

export type TCommonContactInfo = {
  type: EContactType;
  url: string;
};
