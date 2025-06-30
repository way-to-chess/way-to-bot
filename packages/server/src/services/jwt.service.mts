import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@way-to-bot/server/utils/constants.mjs";

import { EUserRole } from "@way-to-bot/shared/api/enums/EUserRole";

export function createJwt(user: {
  id: number;
  username?: string | null;
  tgId?: string | null;
  roles: EUserRole[];
}) {
  return jwt.sign(user, JWT_SECRET!, { expiresIn: "1h" });
}
