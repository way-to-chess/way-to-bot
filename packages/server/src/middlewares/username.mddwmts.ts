import { Request, Response, NextFunction } from "express";

export const castUserNameMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.params.username) {
    const userName = req.params.username.trim();
    req.params.username =
      userName.charAt(0) === "@" ? userName : "@" + userName;
  }
  return next();
};
