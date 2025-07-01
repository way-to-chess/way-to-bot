import { ApiError } from "@way-to-bot/server/common/errors/api.error.mjs";
import { EHttpStatus } from "@way-to-bot/shared/api/enums/EHttpStatus.js";
import { EErrorCode } from "@way-to-bot/shared/api/enums/EErrorCode.js";

export class NotFoundError extends ApiError {
  constructor(message = "Not Found", details?: Record<string, any>) {
    super(message, EHttpStatus.NOT_FOUND, EErrorCode.NOT_FOUND, details);
  }
}
