import { Request, Response, NextFunction } from "express";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";

export function getManyOptionsMddw(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (typeof req.query.q === "string") {
      const decodedQuery = Buffer.from(req.query.q, "base64").toString();
      const parsedQuery = JSON.parse(decodedQuery) as TCommonGetManyOptions;
      req.getManyOptions = new GetManyOptionsDTO<unknown>(parsedQuery);
    }

    return next();
  } catch (e) {
    return next(e);
  }
}
