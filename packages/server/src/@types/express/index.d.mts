import "express";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import { EUserRole } from "@way-to-bot/shared/api/enums/EUserRole.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: { id: number; tgId: string; username: string; roles: EUserRole[] };
    getManyOptions?: TCommonGetManyOptions;
  }
}
