import "express";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import { EUserRole } from "@way-to-bot/shared/api/enums/EUserRole";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; tgId: string; username: string; roles: EUserRole[] };
      getManyOptions?: TCommonGetManyOptions;
    }
  }
} 
