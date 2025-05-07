import { ApiError } from '@way-to-bot/server/common/errors/api.error.mjs';
import {EErrorCode, EHttpStatus} from "@way-to-bot/shared/api/enums/index.js";

export class NoPermissionsError extends ApiError {
  constructor(message = "Forbidden", details?: Record<string, any>) {
    super(message, EHttpStatus.FORBIDDEN, EErrorCode.FORBIDDEN, details);
  }
}
