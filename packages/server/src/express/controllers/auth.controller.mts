import { inject, injectable } from "inversify";
import { ClientUserService } from "@way-to-bot/server/client/services/user.service.mjs";
import { TCommonAuthTg } from "@way-to-bot/shared/api/zod/common/auth.js";
import { createJwt } from "@way-to-bot/server/services/jwt.service.mjs";
import { AuthDTO } from "@way-to-bot/shared/api/DTO/common/auth.DTO.js";

@injectable()
export class CommonAuthController {
  constructor(
    @inject(ClientUserService) private _clientUserService: ClientUserService,
  ) {}

  async tg(payload: TCommonAuthTg) {
    const user = await this._clientUserService.getByTgIdOrUsername(
      payload.tgId,
      payload.username,
    );

    const token = createJwt({
      id: user.id,
      tgId: user.tgId,
      username: user.username,
      roles: user.roles,
    });

    return new AuthDTO(user.id, token);
  }
}
