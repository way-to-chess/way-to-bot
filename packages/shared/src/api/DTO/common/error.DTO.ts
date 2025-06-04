import { EErrorCode } from "@way-to-bot/shared/api/enums/index.js";

export class ErrorDTO {
  constructor(
    public error: string,
    public code?: EErrorCode,
    public details?: unknown,
  ) {}
}
