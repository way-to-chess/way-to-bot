import { NextFunction, Request, Response } from "express";
import { ApiError } from "@way-to-bot/server/common/errors/api.error.mjs";
import { logger } from "@way-to-bot/server/services/logger.service.mjs";
import { ZodError } from "zod";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import { ErrorDTO } from "@way-to-bot/shared/api/DTO/common/error.DTO.js";

import { EErrorCode } from "@way-to-bot/shared/api/enums/EErrorCode.js";

export function errorHandlerMddw(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(err.message, { stack: err.stack });

  if (err instanceof ZodError) {
    res.status(400).json(
      new ErrorDTO(
        "Validation Error",
        EErrorCode.BAD_REQUEST,
        err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      ),
    );
    return;
  }

  if (err instanceof QueryFailedError) {
    if (err.message.includes("duplicate key")) {
      res.status(409).json(
        new ErrorDTO("Resource already exists", EErrorCode.BAD_REQUEST, {
          message: err.message,
        }),
      );
      return;
    }

    res
      .status(500)
      .json(new ErrorDTO("Database Error", EErrorCode.INTERNAL_ERROR));
    return;
  }

  if (err instanceof EntityNotFoundError) {
    res.status(404).json(new ErrorDTO(err.message, EErrorCode.NOT_FOUND));
    return;
  }

  if (err instanceof ApiError) {
    res
      .status(err.status)
      .json(new ErrorDTO(err.message, err.code as EErrorCode, err.details));
    return;
  }

  res
    .status(500)
    .json(new ErrorDTO("Internal Server Error", EErrorCode.INTERNAL_ERROR));
}
