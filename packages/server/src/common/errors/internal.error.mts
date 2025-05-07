import { ApiError } from '@way-to-bot/server/common/errors/api.error.mjs';
import {EErrorCode, EHttpStatus} from "@way-to-bot/shared/api/enums/index.js";

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
