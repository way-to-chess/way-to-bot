import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";

// Расширяем модуль express
declare module "express" {
  interface Request {
    requestId?: string;
  }
}

export function requestIdMddw(req: Request, res: Response, next: NextFunction) {
  const requestId = randomUUID();
  req.requestId = requestId;

  res.setHeader("X-Request-ID", requestId);

  next();
}
