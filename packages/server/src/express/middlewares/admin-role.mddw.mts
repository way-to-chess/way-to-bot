import { NextFunction, Request, Response } from "express";
import { NoPermissionsError } from "@way-to-bot/server/common/errors/no-permissions.error.mjs";
import { EUserRole } from "@way-to-bot/shared/api/enums/EUserRole.js";

export function adminRoleMddw(req: Request, res: Response, next: NextFunction) {
  if (req.user?.roles.includes(EUserRole.ADMIN)) {
    return next();
  }

  return next(new NoPermissionsError("User is not admin"));
}
