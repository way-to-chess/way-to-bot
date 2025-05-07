import { ZodSchema } from "zod";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from '@way-to-bot/server/common/errors/bad-request.error.mjs';

type PayloadSource = "body" | "query" | "params";

export function validatePayloadMddw(
  schema: ZodSchema,
  source: PayloadSource = "body",
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];
    const result = schema.safeParse(data);

    if (!result.success) {
      const { error } = result;
      return next(new BadRequestError(error.message));
    }

    req[source] = result.data;
    return next();
  };
}
