import { ApiError } from "@way-to-bot/server/common/errors/api.error";
import { EHttpStatus } from "@way-to-bot/shared/api/enums/EHttpStatus";
import { EErrorCode } from "@way-to-bot/shared/api/enums/EErrorCode";

export class NotFoundError extends ApiError {
  constructor(message = "Not Found", details?: Record<string, any>) {
    super(message, EHttpStatus.NOT_FOUND, EErrorCode.NOT_FOUND, details);
  }
}
