import { ApiError } from "@way-to-bot/server/common/errors/api.error.mjs";
import { EErrorCode, EHttpStatus } from "@way-to-bot/shared/api/enums/index.js";

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized", details?: Record<string, any>) {
    super(message, EHttpStatus.UNAUTHORIZED, EErrorCode.UNAUTHORIZED, details);
  }
}
