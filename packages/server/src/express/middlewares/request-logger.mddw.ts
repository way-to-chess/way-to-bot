import { NextFunction, Request, Response } from "express";
import { logger } from "@way-to-bot/server/services/logger.service";
import { getSafeRequestInfo } from "@way-to-bot/server/utils/safe-logger";

export function requestLoggerMddw(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const startTime = Date.now();
  const requestInfo = getSafeRequestInfo(req);

  // Логируем входящий запрос
  logger.info(`Incoming request: ${req.method} ${req.path}`, {
    requestId: req.requestId || "unknown",
    request: requestInfo,
    timestamp: new Date().toISOString(),
  });

  // Перехватываем завершение запроса
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const responseInfo = {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    };

    // Логируем завершенный запрос
    logger.info(`Request completed: ${req.method} ${req.path}`, {
      requestId: req.requestId || "unknown",
      request: requestInfo,
      response: responseInfo,
      timestamp: new Date().toISOString(),
    });
  });

  next();
} 