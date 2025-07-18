import { NextFunction, Request, Response } from "express";
import { ApiError } from "@way-to-bot/server/common/errors/api.error";
import { logger } from "@way-to-bot/server/services/logger.service";
import { ZodError } from "zod";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import { ErrorDTO } from "@way-to-bot/shared/api/DTO/common/error.DTO";
import { EErrorCode } from "@way-to-bot/shared/api/enums/EErrorCode";
import { getSafeRequestInfo } from "@way-to-bot/server/utils/safe-logger";

export function errorHandlerMddw(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const requestInfo = getSafeRequestInfo(req);
  const isProduction = process.env.NODE_ENV === "production";
  
  // Подготавливаем данные для логирования
  const logData = {
    requestId: req.requestId || "unknown",
    error: {
      name: err.name,
      message: err.message,
      stack: isProduction ? undefined : err.stack,
    },
    request: requestInfo,
    timestamp: new Date().toISOString(),
  };

  // Логируем ошибку с контекстом
  logger.error(`Request failed: ${err.message}`, logData);

  // Обработка ZodError (валидация)
  if (err instanceof ZodError) {
    const errorResponse = new ErrorDTO(
      "Validation Error",
      EErrorCode.BAD_REQUEST,
      {
        requestId: req.requestId || "unknown",
        timestamp: new Date().toISOString(),
        details: err.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      },
    );
    
    res.status(400).json(errorResponse);
    return;
  }

  // Обработка QueryFailedError (ошибки БД)
  if (err instanceof QueryFailedError) {
    if (err.message.includes("duplicate key")) {
      const errorResponse = new ErrorDTO(
        "Resource already exists", 
        EErrorCode.BAD_REQUEST, 
        {
          requestId: req.requestId || "unknown",
          timestamp: new Date().toISOString(),
          details: isProduction ? undefined : { message: err.message },
        }
      );
      
      res.status(409).json(errorResponse);
      return;
    }

    const errorResponse = new ErrorDTO(
      "Database Error", 
      EErrorCode.INTERNAL_ERROR,
      {
        requestId: req.requestId || "unknown",
        timestamp: new Date().toISOString(),
      }
    );
    
    res.status(500).json(errorResponse);
    return;
  }

  // Обработка EntityNotFoundError (не найдено)
  if (err instanceof EntityNotFoundError) {
    const errorResponse = new ErrorDTO(
      err.message, 
      EErrorCode.NOT_FOUND,
      {
        requestId: req.requestId || "unknown",
        timestamp: new Date().toISOString(),
      }
    );
    
    res.status(404).json(errorResponse);
    return;
  }

  // Обработка кастомных ApiError
  if (err instanceof ApiError) {
    const errorResponse = new ErrorDTO(
      err.message, 
      err.code as EErrorCode, 
      {
        requestId: req.requestId || "unknown",
        timestamp: new Date().toISOString(),
        details: err.details,
      }
    );
    
    res.status(err.status).json(errorResponse);
    return;
  }

  // Обработка SyntaxError (невалидный JSON)
  if (err instanceof SyntaxError && err.message.includes("JSON")) {
    const errorResponse = new ErrorDTO(
      "Invalid JSON", 
      EErrorCode.BAD_REQUEST,
      {
        requestId: req.requestId || "unknown",
        timestamp: new Date().toISOString(),
      }
    );
    
    res.status(400).json(errorResponse);
    return;
  }

  // Обработка всех остальных ошибок
  const errorResponse = new ErrorDTO(
    isProduction ? "Internal Server Error" : err.message,
    EErrorCode.INTERNAL_ERROR,
    {
      requestId: req.requestId || "unknown",
      timestamp: new Date().toISOString(),
      ...(isProduction ? {} : { stack: err.stack }),
    }
  );
  
  res.status(500).json(errorResponse);
}
