import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "@way-to-bot/server/common/errors/unauthorized.error.mjs";
import { JWT_SECRET } from "@way-to-bot/server/utils/constants.mjs";
import { EUserRole } from "@way-to-bot/shared/api/enums/EUserRole";

export function authMddw(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers["Authorization".toLowerCase()] as string | undefined;
  if (!auth?.startsWith("Bearer ")) {
    return next(new UnauthorizedError());
  }

  try {
    const token = auth!.split(" ")[1];
    const payload = jwt.verify(token!, JWT_SECRET);

    req.user = payload as {
      id: number;
      tgId: string;
      username: string;
      roles: EUserRole[];
    };

    return next();
  } catch (e) {
    return next(new UnauthorizedError());
  }
}
