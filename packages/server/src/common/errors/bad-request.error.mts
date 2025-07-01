import { ApiError } from "@way-to-bot/server/common/errors/api.error.mjs";
import { EHttpStatus } from "@way-to-bot/shared/api/enums/EHttpStatus.js";
import { EErrorCode } from "@way-to-bot/shared/api/enums/EErrorCode.js";

export class BadRequestError extends ApiError {
  constructor(message = "Bad Request", details?: Record<string, any>) {
    super(message, EHttpStatus.BAD_REQUEST, EErrorCode.BAD_REQUEST, details);
  }
}
