import { Request, Response, NextFunction } from "express";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";

export function getManyOptionsMddw(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    req.getManyOptions = new GetManyOptionsDTO<unknown>(
      req.query as unknown as TCommonGetManyOptions,
    );
    return next();
  } catch (e) {
    return next(e);
  }
}
