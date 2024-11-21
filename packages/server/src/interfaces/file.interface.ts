import { ECsvAssigment, EImageAssigment } from "../enums";

export interface IFileDeletePayload {
  fileId: number;
}

export interface IFileUploadPayload {
  assigment?: EImageAssigment;
}

export interface ICsvFileUploadPayload {
  assigment: ECsvAssigment;
  eventId: number;
  leagueId: number;
}
