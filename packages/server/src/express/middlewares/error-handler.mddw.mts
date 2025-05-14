import { NextFunction, Request, Response } from "express";
import { ApiError } from "@way-to-bot/server/common/errors/api.error.mjs";
import { logger } from "@way-to-bot/server/services/logger.service.mjs";

export function errorHandlerMddw(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(err.message, { stack: err.stack });
  const isAppError = err instanceof ApiError;

  const status = isAppError ? err.status : 500;
  const message = isAppError ? err.message : "Internal Server Error";

  res.status(status).json({
    error: message,
    ...("code" in err && { code: err.code }),
    ...("details" in err && { details: err.details }),
  });
}
