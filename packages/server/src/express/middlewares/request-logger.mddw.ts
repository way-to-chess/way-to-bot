import { NextFunction, Request, Response } from "express";
import { logger, accessLogger, longRequestLogger } from "@way-to-bot/server/services/logger.service";
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
  accessLogger?.info("ACCESS", {
    type: "incoming",
    method: req.method,
    path: req.path,
    headers: requestInfo.headers,
    body: requestInfo.body,
    requestId: req.requestId || "unknown",
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

    accessLogger?.info("ACCESS", {
      type: "completed",
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: duration,
      requestId: req.requestId || "unknown",
    });

    if (duration > 1000) {
      longRequestLogger?.info("LONG_REQUEST", {
        method: req.method,
        path: req.path,
        durationMs: duration,
        requestId: req.requestId || "unknown",
        request: requestInfo,
        response: responseInfo,
      });
    }
  });

  next();
} 