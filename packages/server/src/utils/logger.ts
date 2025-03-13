import { createLogger, format, transports } from "winston";
import path from "path";

// Настройка формата логов
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  }),
);

export const logger = createLogger({
  level: "error",
  format: logFormat,
  transports: [
    new transports.File({
      filename: path.join(
        process.env.LOGS_PATH ?? `${__dirname}/logs`,
        "error.log",
      ),
      level: "error",
    }),
  ],
});
