import { TgBotService } from "@way-to-bot/server/services/tg_bot/index.mjs";
import { inject, injectable } from "inversify";
import { AdminEventService } from "../services/event.service.mjs";
import {
  botMessageCustom,
  botMessageNotify,
} from "@way-to-bot/server/services/tg_bot/messages.mjs";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository.mjs";
import { In, IsNull, Not } from "typeorm";
import { AdminDTOTgMessageResponse } from "@way-to-bot/shared/api/DTO/admin/tg-message.DTO.js";
import { AdminDTOTgMessage } from "@way-to-bot/shared/api/DTO/admin/tg-message.DTO.js";
import { TAdminTgSendCustomMessagePayload } from "@way-to-bot/shared/api/zod/admin/tg.schema.js";
import { Request, Response } from "express";

@injectable()
export class AdminTgController {
  constructor(
    @inject(TgBotService) private readonly _tgBotService: TgBotService,
    @inject(AdminEventService)
    private readonly _eventService: AdminEventService,
    @inject(UserRepository) private readonly _userRepository: UserRepository,
  ) {}

  async sendCustomMessage(req: Request, res: Response) {
    const payload: TAdminTgSendCustomMessagePayload = req.body;
    const userIds = payload.userIds;
    const userRepo = this._userRepository.getRepository();
    const users = await userRepo.find({
      where: {
        ...(userIds?.length && { id: In(userIds) }),
        tgId: Not(IsNull()),
      },
    });

    const { message, options } = botMessageCustom(
      payload.message,
      payload.options,
    );
    const result = await this._tgBotService.sendMessagesToUsers(
      users,
      message,
      options,
    );

    const data = new AdminDTOTgMessageResponse(new AdminDTOTgMessage(result));
    res.status(200).send(data);
  }

  async sendEventNotification(req: Request, res: Response) {
    const eventId = +req.params.id!;
    const event = await this._eventService.getById(eventId);
    const userRepo = this._userRepository.getRepository();
    const users = await userRepo.find({
      relations: { eventLeagues: { eventLeague: true } },
      where: {
        tgId: Not(IsNull()),
        eventLeagues: { eventLeague: { eventId } },
      },
    });

    const { message, options } = botMessageNotify(event);
    const result = await this._tgBotService.sendMessagesToUsers(
      users,
      message,
      options,
    );

    const data = new AdminDTOTgMessageResponse(new AdminDTOTgMessage(result));
    res.status(200).send(data);
  }
}
