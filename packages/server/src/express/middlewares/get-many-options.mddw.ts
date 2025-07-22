import { Request, Response, NextFunction } from "express";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import { BadRequestError } from "@way-to-bot/server/common/errors/bad-request.error";
import { decodeObjectFromUrlSafeBase64 } from "@way-to-bot/shared/utils/UrlEncoder";

export function getManyOptionsMddw(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Проверяем, есть ли query параметр
  if (!req.query?.q || typeof req.query.q !== "string") {
    return next();
  }

  try {
    req.getManyOptions = decodeObjectFromUrlSafeBase64(
      req.query.q,
    ) as TCommonGetManyOptions;
    return next();
  } catch (e: any) {
    console.error("Base64 decode error:", e);
    return next(
      new BadRequestError("Failed to decode base64 string", {
        details: {
          error: e.message,
          query: req.query.q,
        },
      }),
    );
  }
}
