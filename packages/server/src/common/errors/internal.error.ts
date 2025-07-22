import { ApiError } from "@way-to-bot/server/common/errors/api.error";
import { EHttpStatus } from "@way-to-bot/shared/api/enums/EHttpStatus";
import { EErrorCode } from "@way-to-bot/shared/api/enums/EErrorCode";

export class InternalError extends ApiError {
  constructor(
    message = "Internal Server Error",
    details?: Record<string, any>,
  ) {
    super(
      message,
      EHttpStatus.INTERNAL_SERVER_ERROR,
      EErrorCode.INTERNAL_ERROR,
      details,
    );
  }
}
