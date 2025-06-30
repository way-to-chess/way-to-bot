import { EErrorCode } from "../../enums/EErrorCode";

export class ErrorDTO {
  constructor(
    public error: string,
    public code?: EErrorCode,
    public details?: unknown,
  ) {}
}
