import { EErrorCode } from "../../enums/EErrorCode.js";

export class ErrorDTO {
  constructor(
    public error: string,
    public code?: EErrorCode,
    public details?: unknown,
  ) {}
}
