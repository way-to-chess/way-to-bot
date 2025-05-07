import "express";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { EUserRole } from "@way-to-bot/shared/api/enums/index.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: { id: number; tgId: string; username: string; roles: EUserRole[] };
    getManyOptions?: GetManyOptionsDTO<unknown>;
  }
}
