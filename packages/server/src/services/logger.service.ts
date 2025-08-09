import { createLogger, format, transports, Logger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { PATH_TO_LOGS } from "@way-to-bot/server/utils/constants";
import path from "path";
import { NODE_ENV } from "@way-to-bot/server/utils/constants";

const { combine, timestamp, errors, printf, colorize } = format;

export const logger = createLogger({
  level: "info",
  format: combine(
    timestamp(),
    errors({ stack: true }),
    printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
    }),
  ),
  transports: [
    new transports.Console({
      level: "info",
      format: combine(
        colorize({ all: true }),
        timestamp(),
        errors({ stack: true }),
        printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
        }),
      ),
    }),

    new DailyRotateFile({
      filename: path.join(PATH_TO_LOGS, "%DATE%", "error.log"),
      datePattern: "YYYYMM/DD",
      level: "error",
      zippedArchive: true,
      maxFiles: "30d",
    }),
  ],
});

export const accessLogger: Logger | null =
  NODE_ENV === "production"
    ? null
    : createLogger({
        level: "info",
        format: combine(
          timestamp(),
          printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
          }),
        ),
        transports: [
          new DailyRotateFile({
            filename: path.join(PATH_TO_LOGS, "%DATE%", "access.log"),
            datePattern: "YYYYMM/DD",
            level: "info",
            zippedArchive: true,
            maxFiles: "14d",
          }),
        ],
      });

export const longRequestLogger: Logger | null =
  NODE_ENV === "production"
    ? null
    : createLogger({
        level: "info",
        format: combine(
          timestamp(),
          printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
          }),
        ),
        transports: [
          new DailyRotateFile({
            filename: path.join(PATH_TO_LOGS, "%DATE%", "long_requests.log"),
            datePattern: "YYYYMM/DD",
            level: "info",
            zippedArchive: true,
            maxFiles: "14d",
          }),
        ],
      });
