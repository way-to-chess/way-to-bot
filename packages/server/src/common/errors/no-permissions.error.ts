import { ApiError } from "@way-to-bot/server/common/errors/api.error";
import { EHttpStatus } from "@way-to-bot/shared/api/enums/EHttpStatus";
import { EErrorCode } from "@way-to-bot/shared/api/enums/EErrorCode";

export class NoPermissionsError extends ApiError {
  constructor(message = "Forbidden", details?: Record<string, any>) {
    super(message, EHttpStatus.FORBIDDEN, EErrorCode.FORBIDDEN, details);
  }
}
