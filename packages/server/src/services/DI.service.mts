import { Container } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import { TgBotService } from "@way-to-bot/server/services/tg-bot.service.mjs";
import { AdminEventController } from "@way-to-bot/server/admin/controllers/event.controller.mjs";
import { AdminFileController } from "@way-to-bot/server/admin/controllers/file.controller.mjs";
import { AdminLeagueController } from "@way-to-bot/server/admin/controllers/league.controller.mjs";
import { AdminLocationController } from "@way-to-bot/server/admin/controllers/location.controller.mjs";
import { AdminParticipateRequestController } from "@way-to-bot/server/admin/controllers/participate-request.controller.mjs";
import { AdminUserController } from "@way-to-bot/server/admin/controllers/user.controller.mjs";
import { AdminEventService } from "@way-to-bot/server/admin/services/event.service.mjs";
import { AdminEventLeagueService } from "@way-to-bot/server/admin/services/event-league.service.mjs";
import { AdminEventLeagueUserService } from "@way-to-bot/server/admin/services/event-league-user.service.mjs";
import { AdminFileService } from "@way-to-bot/server/admin/services/file.service.mjs";
import { AdminLeagueService } from "@way-to-bot/server/admin/services/league.service.mjs";
import { AdminLocationService } from "@way-to-bot/server/admin/services/location.service.mjs";
import { AdminParticipateRequestService } from "@way-to-bot/server/admin/services/participate-request.service.mjs";
import { AdminUserService } from "@way-to-bot/server/admin/services/user.service.mjs";
import { EventRepository } from "@way-to-bot/server/database/repositories/event.repository.mjs";
import { EventLeagueRepository } from "@way-to-bot/server/database/repositories/event-league.repository.mjs";
import { EventLeagueUserRepository } from "@way-to-bot/server/database/repositories/event-league-user.repository.mjs";
import { FileRepository } from "@way-to-bot/server/database/repositories/file.repository.mjs";
import { LeagueRepository } from "@way-to-bot/server/database/repositories/league.repository.mjs";
import { LocationRepository } from "@way-to-bot/server/database/repositories/location.repository.mjs";
import { ParticipateRequestRepository } from "@way-to-bot/server/database/repositories/participate-request.repository.mjs";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository.mjs";
import { ClientEventController } from "@way-to-bot/server/client/controllers/event.controller.mjs";
import { ClientFileController } from "@way-to-bot/server/client/controllers/file.controller.mjs";
import { ClientParticipateRequestController } from "@way-to-bot/server/client/controllers/participate-request.controller.mjs";
import { ClientUserController } from "@way-to-bot/server/client/controllers/user.controller.mjs";
import { ClientEventService } from "@way-to-bot/server/client/services/event.service.mjs";
import { ClientFileService } from "@way-to-bot/server/client/services/file.service.mjs";
import { ClientParticipateRequestService } from "@way-to-bot/server/client/services/participate-request.service.mjs";
import { ClientUserService } from "@way-to-bot/server/client/services/user.service.mjs";
import { CommonAuthController } from "@way-to-bot/server/express/controllers/auth.controller.mjs";
import { AdminEventLeagueController } from "@way-to-bot/server/admin/controllers/event-league.controller.js";
import { EventLeagueResultRepository } from "@way-to-bot/server/database/repositories/event-league-result.repository.js";

// singleton
class DIService {
  private static _instance: DIService;
  private readonly _container: Container;

  private constructor() {
    this._container = new Container();
    this.bindClasses();
  }

  static get getInstance() {
    if (!this._instance) {
      this._instance = new DIService();
    }

    return this._instance;
  }

  get getContainer() {
    return this._container;
  }

  bindClasses() {
    // common
    this._container.bind(DbService).toSelf().inSingletonScope();
    this._container.bind(TgBotService).toSelf().inSingletonScope();

    this._container.bind(EventRepository).toSelf().inSingletonScope();
    this._container.bind(EventLeagueRepository).toSelf().inSingletonScope();
    this._container.bind(EventLeagueUserRepository).toSelf().inSingletonScope();
    this._container.bind(FileRepository).toSelf().inSingletonScope();
    this._container.bind(LeagueRepository).toSelf().inSingletonScope();
    this._container.bind(LocationRepository).toSelf().inSingletonScope();
    this._container
      .bind(ParticipateRequestRepository)
      .toSelf()
      .inSingletonScope();
    this._container.bind(UserRepository).toSelf().inSingletonScope();
    this._container
      .bind(EventLeagueResultRepository)
      .toSelf()
      .inSingletonScope();

    this._container.bind(CommonAuthController).toSelf().inRequestScope();

    // admin
    this._container.bind(AdminEventController).toSelf().inRequestScope();
    this._container.bind(AdminFileController).toSelf().inRequestScope();
    this._container.bind(AdminLeagueController).toSelf().inRequestScope();
    this._container.bind(AdminLocationController).toSelf().inRequestScope();
    this._container
      .bind(AdminParticipateRequestController)
      .toSelf()
      .inRequestScope();
    this._container.bind(AdminUserController).toSelf().inRequestScope();
    this._container.bind(AdminEventLeagueController).toSelf().inRequestScope();

    this._container.bind(AdminEventService).toSelf().inRequestScope();
    this._container.bind(AdminEventLeagueService).toSelf().inRequestScope();
    this._container.bind(AdminEventLeagueUserService).toSelf().inRequestScope();
    this._container.bind(AdminFileService).toSelf().inRequestScope();
    this._container.bind(AdminLeagueService).toSelf().inRequestScope();
    this._container.bind(AdminLocationService).toSelf().inRequestScope();
    this._container
      .bind(AdminParticipateRequestService)
      .toSelf()
      .inRequestScope();
    this._container.bind(AdminUserService).toSelf().inRequestScope();

    //client
    this._container.bind(ClientEventController).toSelf().inRequestScope();
    this._container.bind(ClientFileController).toSelf().inRequestScope();
    this._container
      .bind(ClientParticipateRequestController)
      .toSelf()
      .inRequestScope();
    this._container.bind(ClientUserController).toSelf().inRequestScope();

    this._container.bind(ClientEventService).toSelf().inRequestScope();
    this._container.bind(ClientFileService).toSelf().inRequestScope();
    this._container
      .bind(ClientParticipateRequestService)
      .toSelf()
      .inRequestScope();
    this._container.bind(ClientUserService).toSelf().inRequestScope();
  }
}

export const DiContainer = DIService.getInstance.getContainer;
