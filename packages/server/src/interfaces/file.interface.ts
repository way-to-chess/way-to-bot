import { EImageAssigment } from "../enums";

export interface IFileDeletePayload {
  fileId: number;
}

export interface IFileUploadPayload {
  assigment?: EImageAssigment;
}
