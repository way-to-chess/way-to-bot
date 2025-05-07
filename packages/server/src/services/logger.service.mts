import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import {PATH_TO_LOGS} from '@way-to-bot/server/utils/constants.mjs';

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
      filename: `${PATH_TO_LOGS}/error-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      level: "error",
      zippedArchive: true,
      maxFiles: "30d",
    }),
  ],
});
