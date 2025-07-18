import { ApiError } from "@way-to-bot/server/common/errors/api.error";
import { EHttpStatus } from "@way-to-bot/shared/api/enums/EHttpStatus";
import { EErrorCode } from "@way-to-bot/shared/api/enums/EErrorCode";

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized", details?: Record<string, any>) {
    super(message, EHttpStatus.UNAUTHORIZED, EErrorCode.UNAUTHORIZED, details);
  }
}
